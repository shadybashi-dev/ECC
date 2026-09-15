#!/usr/bin/env python3
"""Regenerate antonias/standalone.html from the multi-file source.

standalone.html is a single self-contained copy of index.html with the
stylesheet, script, fonts and images inlined as data URIs, so the site can be
opened straight from disk with no server. It is GENERATED -- never edit it by
hand. Run this after touching index.html, css/style.css or js/main.js.
"""
import base64, mimetypes, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "antonias")
SRC  = os.path.join(ROOT, "index.html")
OUT  = os.path.join(ROOT, "standalone.html")

# A css url() body, with the optional quote captured so it can be put back.
# Base64 payloads contain no quotes or parens, so [^"')]+ is safe here.
URL_RE = r'url\((["\']?)([^"\')]+)\1\)'

# Already-absolute or already-inlined refs, left untouched. "%23" is an escaped
# "#" -- it shows up inside the SVG noise filter that is itself a data URI.
SKIP_PREFIXES = ("data:", "http:", "https:", "#", "%23")

def data_uri(relpath):
    """Encode a file under ROOT as a data: URI. Returns None if missing."""
    path = os.path.normpath(os.path.join(ROOT, relpath.lstrip("/")))
    if not os.path.isfile(path):
        return None
    mime = mimetypes.guess_type(path)[0] or "application/octet-stream"
    if path.endswith(".woff2"):
        mime = "font/woff2"
    with open(path, "rb") as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode()

def inline_css(css, missing):
    """Replace url(...) references inside a stylesheet with data URIs."""
    def rep(m):
        quote, ref = m.group(1), m.group(2)
        if ref.startswith(SKIP_PREFIXES):
            return m.group(0)
        uri = data_uri(re.sub(r"^(\.\./)+", "", ref))
        if uri is None:
            missing.append(ref)
            return m.group(0)
        return f"url({quote}{uri}{quote})"
    return re.sub(URL_RE, rep, css)

def main():
    html = open(SRC, encoding="utf-8").read()
    missing = []

    # 1. <link rel="stylesheet" href="css/style.css">  ->  <style>...</style>
    def rep_css(m):
        href = m.group(1)
        path = os.path.join(ROOT, href)
        if not os.path.isfile(path):
            missing.append(href); return m.group(0)
        return "<style>\n" + inline_css(open(path, encoding="utf-8").read(), missing) + "\n</style>"
    html, n_css = re.subn(r'<link rel="stylesheet" href="([^"]+)"\s*/?>', rep_css, html)

    # 2. <script src="js/main.js"></script>  ->  <script>...</script>
    def rep_js(m):
        src = m.group(1)
        path = os.path.join(ROOT, src)
        if not os.path.isfile(path):
            missing.append(src); return m.group(0)
        return "<script>\n" + open(path, encoding="utf-8").read() + "\n</script>"
    html, n_js = re.subn(r'<script src="([^"]+)"[^>]*></script>', rep_js, html)

    # 3. every src="assets/..." and the svg favicon  ->  data URI
    def rep_src(m):
        attr, ref = m.group(1), m.group(2)
        if ref.startswith(("data:", "http:", "https:")):
            return m.group(0)
        uri = data_uri(ref)
        if uri is None:
            missing.append(ref); return m.group(0)
        return f'{attr}="{uri}"'
    html, n_img = re.subn(r'\b(src|href)="((?:assets/|favicon\.svg)[^"]*)"', rep_src, html)

    # 4. cross-page links stay as-is, but a standalone file has no siblings to
    #    open -- point them at the live domain so the nav still works offline.
    html, n_link = re.subn(
        r'href="((?:index|menu|san-luis-obispo|paso-robles)\.html)"',
        lambda m: f'href="https://antoniaspizza.com/{m.group(1)}"', html)

    open(OUT, "w", encoding="utf-8", newline="\n").write(html)

    print(f"  stylesheets inlined : {n_css}")
    print(f"  scripts inlined     : {n_js}")
    print(f"  assets inlined      : {n_img}")
    print(f"  page links absolute : {n_link}")
    print(f"  -> {os.path.relpath(OUT)}  {os.path.getsize(OUT)//1024} KB")
    if missing:
        print("\n  WARNING, could not resolve:")
        for r in sorted(set(missing)):
            print("   ", r)
        return 1
    # Test each url() body directly. A lookahead placed after an optional-quote
    # group is useless here, because the group happily matches empty and the
    # lookahead then sees the quote instead of the value.
    leftovers = [m.group(2) for m in re.finditer(URL_RE, html)
                 if not m.group(2).startswith(SKIP_PREFIXES)]
    if leftovers:
        print("\n  WARNING: unresolved url() in output:", sorted(set(leftovers))[:5])
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
