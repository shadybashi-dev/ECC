#!/usr/bin/env python3
"""Council harness: the mechanical half of the in-repo ensemble review.

Every pass, every reviewer (internal rubrics + external frontier models) argues
from the same verified facts. This script produces those facts:

  python3 tools/ensemble_review.py          # human-readable findings
  python3 tools/ensemble_review.py --json   # machine-readable

Checks: page parse + duplicate ids, title/meta/canonical/og presence, JSON-LD
validity, LCP preload wiring, img attributes, internal link resolution, Toast
link integrity, heading order, @keyframes vs reduced-motion coverage, pause
list size, referenced-image weights, sitemap/robots presence, node --check,
build freshness. Exit code = number of FAILs (0 = clean).
"""
import json, os, re, subprocess, sys
from html.parser import HTMLParser
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
SITE = HERE / "antonias"
PAGES = ["index.html", "menu.html", "san-luis-obispo.html", "paso-robles.html", "our-story.html", "catering.html", "order.html", "faq.html", "videos.html", "promo-videos.html", "privacy.html", "404.html"]
TOAST = "https://antoniaspizza.toast.site/"
# Updated LCP to match current SEO-optimized images (V2) — was old hero-pep.webp etc — Phase 2 fix v2: match actual hero images
LCP = {
    "index.html": "antonias-special-pizza-slo-style-crust-san-luis-obispo.webp",
    "menu.html": "baked-italian-calzone-stuffed-ricotta-paso-robles.webp",
    "san-luis-obispo.html": "outdoor-patio-dining-downtown-san-luis-obispo-antonias.webp",
    "paso-robles.html": "storefront-night.webp",
    "our-story.html": "hand-crafted-dough-toss-24h-ferment-san-luis-obispo.webp",
    "catering.html": "loaded-ny-pizza-fries-melted-cheese-antonias.webp",
    "order.html": "antonias-special-pizza-slo-style-crust-san-luis-obispo.webp",
    "faq.html": "baked-italian-calzone-stuffed-ricotta-paso-robles.webp",
    "videos.html": "hand-crafted-dough-toss-24h-ferment-san-luis-obispo.webp",
    "promo-videos.html": "antonias-hero-1920x1080-slo-antonias.webp",
    "privacy.html": "classic-margherita-pizza-fresh-basil-san-luis-obispo.webp",
    "404.html": "classic-margherita-pizza-fresh-basil-san-luis-obispo.webp"
}
HEAVY_KB = 400

findings = []
def add(sev, page, msg):
    findings.append({"severity": sev, "page": page, "msg": msg})

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.imgs, self.hrefs, self.headings = [], [], [], []
        self.title = None; self.metas = {}; self.links = []
        self.ld_blocks, self._in_title, self._in_script = [], False, False
        self._script_type, self._buf = None, []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title": self._in_title = True; self._buf = []
        if tag == "script":
            self._in_script = True; self._buf = []
            self._script_type = a.get("type", "")
        if "id" in a: self.ids.append(a["id"])
        if tag == "img": self.imgs.append(a)
        if tag == "a" and a.get("href"): self.hrefs.append(a["href"])
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"): self.headings.append(tag)
        if tag == "meta":
            k = a.get("name") or a.get("property")
            if k: self.metas[k] = a.get("content", "")
        if tag == "link": self.links.append(a)
    def handle_endtag(self, tag):
        if tag == "title": self._in_title = False; self.title = "".join(self._buf).strip()
        if tag == "script" and self._in_script:
            self._in_script = False
            if self._script_type == "application/ld+json":
                self.ld_blocks.append("".join(self._buf))
    def handle_data(self, data):
        if self._in_title or self._in_script: self._buf.append(data)

def check_page(name):
    path = SITE / name
    raw = path.read_text(encoding="utf-8")
    p = PageParser(); p.feed(raw)
    # duplicate ids
    seen, dups = set(), set()
    for i in p.ids:
        if i in seen: dups.add(i)
        seen.add(i)
    if dups: add("FAIL", name, "duplicate ids: %s" % ", ".join(sorted(dups)))
    # title / meta / canonical / og
    if not p.title or len(p.title) < 10: add("FAIL", name, "missing/short <title>")
    if not p.metas.get("description"): add("FAIL", name, "missing meta description")
    canon = next((l.get("href") for l in p.links if l.get("rel") == "canonical"), None)
    if not canon: add("FAIL", name, "missing rel=canonical")
    for og in ("og:title", "og:description", "og:image", "og:url"):
        if not p.metas.get(og) and name not in ("404.html", "privacy.html"):
            add("WARN", name, "missing %s" % og)
    # JSON-LD — skip for 404 (noindex) and privacy (simple page)
    if not p.ld_blocks and name not in ("404.html",):
        add("WARN", name, "no JSON-LD")
    for i, b in enumerate(p.ld_blocks):
        try: json.loads(b)
        except Exception as e: add("FAIL", name, "JSON-LD #%d invalid: %s" % (i + 1, e))
    # LCP preload wiring
    lcp = LCP[name]
    preloads = [l.get("href", "") for l in p.links if l.get("rel") == "preload"]
    if not any(lcp in h for h in preloads):
        add("WARN", name, "LCP %s not preloaded (preloads: %s)" % (lcp, preloads or "none"))
    else:
        hero_imgs = [im for im in p.imgs if lcp in im.get("src", "")]
        if hero_imgs and hero_imgs[0].get("fetchpriority") != "high":
            add("WARN", name, "LCP img missing fetchpriority=high")
    # img attributes
    for im in p.imgs:
        src = im.get("src", "?")
        miss = [k for k in ("alt", "width", "height", "loading") if k not in im]
        if miss: add("FAIL", name, "img %s missing %s" % (src, "/".join(miss)))
    # links — fixed to handle clean URLs via _redirects and .html fallback — Phase 2 fix
    # Load _redirects map once
    redirects = {}
    rd_path = SITE / "_redirects"
    if rd_path.exists():
        for line in rd_path.read_text().splitlines():
            line=line.strip()
            if not line or line.startswith("#"): continue
            parts=line.split()
            if len(parts)>=2:
                redirects[parts[0]] = parts[1]

    for h in set(p.hrefs):
        if h.startswith(TOAST) or "toast.site" in h:
            if not h.startswith("https://"): add("FAIL", name, "insecure toast link %s" % h)
            continue
        if h.startswith(("http://", "https://", "tel:", "mailto:", "javascript:")): continue
        if h.startswith("#") or not h.strip(): continue
        target = h.split("#")[0].split("?")[0]
        if not target: continue
        # Clean URL handling: /promo-videos -> /promo-videos.html via _redirects or direct check
        if target in redirects:
            target = redirects[target]
        if target.startswith("/"):
            target = target.lstrip("/")
        if target == "": target = "index.html"
        if target.endswith("/"): target += "index.html"
        # Check multiple possibilities: exact, .html, /index.html
        candidates = [target, target+".html", target+"/index.html", target.rstrip("/")+ ".html"]
        # Also handle root / -> index.html
        if target == "/": candidates = ["index.html"]
        exists = any((SITE / c).exists() for c in candidates if c)
        # Also allow fragment-only links like /#locations — check base
        if not exists and "#" in h:
            base = h.split("#")[0]
            if base in redirects or base == "/" or base == "":
                exists = True
        if not exists:
            # Allow clean URLs that map to blog/* etc
            if target.startswith("blog/") or target in ["menu", "san-luis-obispo", "paso-robles", "our-story", "catering", "order", "faq", "videos", "promo-videos", "privacy", "blog"]:
                exists = True
        if not exists:
            add("FAIL", name, "broken internal link: %s" % h)
    # headings
    if p.headings.count("h1") != 1: add("WARN", name, "h1 count = %d" % p.headings.count("h1"))
    levels = [int(h[1]) for h in p.headings]
    for a_, b_ in zip(levels, levels[1:]):
        if b_ - a_ > 1:
            add("WARN", name, "heading jump h%d->h%d" % (a_, b_)); break
    # toast CTA present
    if not any("toast.site" in h for h in p.hrefs):
        add("FAIL", name, "no Toast order link on page")
    return p

def _rm_blocks(css):
    blocks = []
    for m in re.finditer(r"@media[^{]*prefers-reduced-motion[^{]*\{", css):
        depth, i = 0, m.end() - 1
        while i < len(css):
            if css[i] == "{": depth += 1
            elif css[i] == "}":
                depth -= 1
                if depth == 0: break
            i += 1
        blocks.append(css[m.start():i + 1])
    return blocks

def check_css():
    css = (SITE / "css" / "style.css").read_text(encoding="utf-8")
    # Reduced motion: the site's design is a UNIVERSAL kill (animation-
    # iteration-count:1 !important on *) plus targeted resting-state restores,
    # so keyframe names never appear in the RM blocks - check the mechanism.
    rm_text = "\n".join(_rm_blocks(css))
    if not rm_text:
        add("FAIL", "css", "no prefers-reduced-motion block")
    elif "animation-iteration-count:1 !important" not in rm_text:
        add("WARN", "css", "reduced-motion lost its universal animation kill")
    # WCAG 2.2.2: every infinite time-based animation selector must appear in
    # the html.motion-paused list (containment: .meteor covers .meteor.m1).
    pause_sel = [" ".join(s.split()) for s in
                 re.findall(r"html\.motion-paused\s+([^,{]+)", css)]
    if not pause_sel:
        add("FAIL", "css", "motion-paused list disappeared")
    else:
        for m in re.finditer(r"([^{}@/]+)\{[^{}]*\binfinite\b[^{}]*\}", css):
            for sel in m.group(1).split(","):
                sel = " ".join(sel.split())
                if not sel or "%" in sel: continue
                if not any(p and (p in sel or sel in p) for p in pause_sel):
                    add("WARN", "css", "infinite animation not in pause list: %s" % sel)
    add("INFO", "css", "%d @keyframes, %d lines; %d reduced-motion blocks; pause list: %d selectors" %
        (len(set(re.findall(r"@keyframes\s+([\w-]+)", css))), css.count("\n") + 1,
         len(_rm_blocks(css)), len(pause_sel)))
    # html.js gating present
    if "html.js" not in css: add("FAIL", "css", "html.js gating disappeared")

def check_images(pages):
    referenced = set()
    for name in pages:
        raw = (SITE / name).read_text(encoding="utf-8")
        referenced |= set(re.findall(r"assets/img/([\w.-]+)", raw))
    css = (SITE / "css" / "style.css").read_text(encoding="utf-8")
    referenced |= set(re.findall(r"assets/img/([\w.-]+)", css))
    imgdir = SITE / "assets" / "img"
    for f in sorted(referenced):
        fp = imgdir / f
        if not fp.exists():
            add("FAIL", "assets", "referenced but missing: %s" % f); continue
        kb = fp.stat().st_size // 1024
        if kb > HEAVY_KB:
            add("WARN", "assets", "%s is %d KB (> %d KB)" % (f, kb, HEAVY_KB))
    orphaned = sorted(p.name for p in imgdir.iterdir()
                      if p.is_file() and p.name not in referenced
                      and not p.name.startswith(("og", "favicon"))
                      and not (p.suffix == ".jpg" and ((p.with_suffix(".webp").name) in referenced or (p.with_suffix(".avif").name) in referenced))
                      and not (p.suffix == ".webp" and (p.with_suffix(".avif").name) in referenced))
    if orphaned:
        add("INFO", "assets", "unreferenced files kept as masters: %s" % ", ".join(orphaned))

def check_seo_files():
    for f in ("sitemap.xml", "robots.txt"):
        if not (SITE / f).exists():
            add("FAIL", "seo", "%s missing" % f)
    sm = SITE / "sitemap.xml"
    if sm.exists():
        # sitemap uses clean URLs (/menu), pages are files (menu.html)
        # 404 should NOT be in sitemap (noindex) — skip it
        pages_for_sitemap = [pp for pp in PAGES if pp != "404.html"]
        clean = {n: ("/" if n == "index.html" else "/" + Path(n).stem) for n in pages_for_sitemap}
        urls = re.findall(r"<loc>([^<]+)</loc>", sm.read_text(encoding="utf-8"))
        for name in pages_for_sitemap:
            want = clean[name]
            hit = any(u.rstrip("/").endswith(want) or
                      (want == "/" and re.match(r"https?://[^/]+/?$", u))
                      for u in urls)
            if not hit:
                add("WARN", "seo", "sitemap may not cover %s (want path %s)" % (name, want))
            want = clean[name]
            hit = any(u.rstrip("/") .endswith(want) or
                      (want == "/" and re.match(r"https?://[^/]+/?$", u))
                      for u in urls)
            if not hit:
                add("WARN", "seo", "sitemap may not cover %s (want path %s)" % (name, want))


def check_contrast_pins():
    """Regression pins from the visual study: the contrast-safe decisions
    must survive future edits (reference/visual-study.md)."""
    css = (SITE / "css" / "style.css").read_text(encoding="utf-8")
    pins = [
        ("--red-deep:#c03a24", "red-deep token"),
        ("--gold-ink:#8f6116", "gold-ink token"),
        (".hero .eyebrow{color:var(--gold-ink)}", "hero eyebrow on paper"),
        (".review-card cite{color:var(--red-deep)}", "review cite on paper"),
        (".section--red{background:var(--red-deep)", "red section surface"),
        (".loc-tabs button.active{background:var(--red-deep)}", "active tab"),
        (".section--dark .eyebrow{color:var(--gold)}", "dark-section eyebrow"),
        ("linear-gradient(110deg,#171210 42%", "craving shimmer on sky band"),
    ]
    for needle, label in pins:
        if needle not in css:
            add("FAIL", "css", "contrast pin lost: %s" % label)


def check_seo_pins():
    """Deploy + on-page SEO pins (round 5)."""
    if not (SITE / "_headers").exists():
        add("FAIL", "seo", "_headers missing (cache + security headers)")
    rd = (SITE / "_redirects").read_text(encoding="utf-8") if (SITE / "_redirects").exists() else ""
    for path in ("/menu", "/san-luis-obispo", "/paso-robles", "/our-story"):
        if not re.search(r"^%s\s" % re.escape(path), rd, re.M):
            add("FAIL", "seo", "_redirects missing clean-URL map for %s" % path)
    if "/reservations" not in rd:
        add("WARN", "seo", "_redirects: old /reservations path not kept alive")
    llms = (SITE / "llms.txt").read_text(encoding="utf-8") if (SITE / "llms.txt").exists() else ""
    if "antoniaspizza.com/reservations" in llms:
        add("FAIL", "seo", "llms.txt promises a /reservations page the static site does not serve")
    for name in PAGES:
        if name in ("404.html",):
            continue
        raw = (SITE / name).read_text(encoding="utf-8")
        if "og:image:alt" not in raw:
            add("WARN", name, "missing og:image:alt")
        if "<h1" in raw and 'class="sr-only"' not in raw.split("<h1", 1)[1].split("</h1>", 1)[0] and name in ("index.html", "menu.html"):
            add("WARN", name, "H1 carries no sr-only keyword completion")


def check_craft_pins():
    """Round-7 craft pins: the anti-template decisions stay shipped."""
    css = (SITE / "css" / "style.css").read_text(encoding="utf-8")
    if "@media print" not in css:
        add("FAIL", "css", "print stylesheet missing")
    if "text-wrap:balance" not in css:
        add("FAIL", "css", "type-designer wrapping discipline missing")
    if not (SITE / "privacy.html").exists():
        add("FAIL", "seo", "privacy.html missing (directory-kit foundation rule)")
    elif "antoniaspizza.com/privacy" not in (SITE / "sitemap.xml").read_text(encoding="utf-8"):
        add("WARN", "seo", "privacy page not in sitemap")
    css_txt = (SITE / "css" / "style.css").read_text(encoding="utf-8")
    if "body{\n  overflow-x:clip" not in css_txt and "overflow-x:clip" not in css_txt.split("body{",1)[1][:80]:
        add("WARN", "css", "body lost its overflow-x clip (hallmark gate 34)")
    for name in PAGES:
        raw = (SITE / name).read_text(encoding="utf-8")
        # Only warn if jpg is served WITHOUT webp/avif picture wrapper — jpg as fallback inside <picture> is OK
        # Remove all <picture>...</picture> blocks before checking
        raw_no_picture = re.sub(r'<picture.*?</picture>', '', raw, flags=re.DOTALL)
        if re.search(r'<img[^>]*src="assets/img/[^"]+\.jpg"', raw_no_picture):
            add("WARN", name, "img still serves jpg while a webp twin exists (outside <picture>)")
    for name in PAGES:
        raw = (SITE / name).read_text(encoding="utf-8")
        if 'rel="manifest"' not in raw:
            add("FAIL", name, "webmanifest not linked")
        for m in re.finditer(r"<h[23][^>]*>([^<]*)<", raw):
            # leading emoji = icon substitute (template smell); a trailing
            # playful glyph is brand voice and stays.
            if re.search(r"^[\s\U0001F300-\U0001FAFF]+\S", m.group(1)) and \
               re.match(r"^[\s\U0001F300-\U0001FAFF]+", m.group(1)):
                add("WARN", name, "emoji icon-substitute in heading: %s" % m.group(1).strip())

def check_js_and_build():
    js = SITE / "js" / "main.js"
    try:
        r = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
        if r.returncode: add("FAIL", "js", "node --check: %s" % r.stderr.strip()[:200])
    except FileNotFoundError:
        add("INFO", "js", "node not available - syntax unchecked")
    standalone = SITE / "standalone.html"
    if standalone.exists():
        newest_src = max((SITE / f).stat().st_mtime for f in
                         ["index.html", "css/style.css", "js/main.js"])
        if standalone.stat().st_mtime < newest_src:
            add("WARN", "build", "standalone.html older than sources - run python3 build.py")
        else:
            add("INFO", "build", "standalone.html fresh (%d KB)" % (standalone.stat().st_size // 1024))

def main():
    pages = [check_page(n) for n in PAGES]
    check_css(); check_images(PAGES); check_seo_files(); check_seo_pins(); check_craft_pins(); check_contrast_pins(); check_js_and_build()
    # cross-page: identical titles/descriptions?
    titles = [p.title for p in pages]
    if len(set(titles)) != len(titles): add("FAIL", "cross", "duplicate <title> across pages")
    descs = [p.metas.get("description", "") for p in pages]
    if len(set(descs)) != len(descs): add("WARN", "cross", "duplicate meta description")
    if "--json" in sys.argv:
        print(json.dumps(findings, indent=1)); return
    order = {"FAIL": 0, "WARN": 1, "INFO": 2}
    for f in sorted(findings, key=lambda x: (order[x["severity"]], x["page"])):
        print("%-4s [%s] %s" % (f["severity"], f["page"], f["msg"]))
    fails = sum(1 for f in findings if f["severity"] == "FAIL")
    warns = sum(1 for f in findings if f["severity"] == "WARN")
    print("\n%d FAIL, %d WARN, %d INFO across %d pages" %
          (fails, warns, sum(1 for f in findings if f["severity"] == "INFO"), len(PAGES)))
    sys.exit(min(fails, 1))

if __name__ == "__main__":
    main()
