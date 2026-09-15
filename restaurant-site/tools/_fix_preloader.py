#!/usr/bin/env python3
"""Fix HANDOFF §7.3 — delete the preloader, make the hero entrance the opening
moment. Touches all four pages, main.js and style.css.

Why: the preloader gated first paint on a fake Math.random() counter for ~2.2s
while the hero headline's riseIn animation played invisibly behind it. It also
put a logo PNG in front of the hero LCP image (§7.4). Deleting it fixes both.

Constraints honoured (HANDOFF §9):
  - vanilla only, no build step, no CDN
  - `html.js` gating: with JS off, content must stay visible
  - reduced-motion overrides must match the raised specificity and use !important
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "site"
PAGES = ["index.html", "menu.html", "san-luis-obispo.html", "paso-robles.html"]
failures = []

def sub_once(text, old, new, label):
    if old not in text:
        failures.append(f"MISSING: {label}")
        return text, False
    if text.count(old) != 1:
        failures.append(f"AMBIGUOUS ({text.count(old)}x): {label}")
        return text, False
    return text.replace(old, new, 1), True

# ---------------------------------------------------------------- 1. HTML
PRE_RE = re.compile(r'[ \t]*<div class="preloader" aria-hidden="true">\n(?:[^\n]*\n)*?[ \t]*</div>\n')
for name in PAGES:
    p = ROOT / name
    s = p.read_text()
    new, n = PRE_RE.subn("", s)
    if n != 1:
        failures.append(f"{name}: expected 1 preloader block, removed {n}")
    else:
        p.write_text(new)
        print(f"  {name}: preloader markup removed")

# ---------------------------------------------------------------- 2. main.js
p = ROOT / "js/main.js"
s = p.read_text()
old_js = '''  /* ---------- Preloader ---------- */
  const preloader = $(".preloader");
  if (preloader) {
    const count = $(".pl-count", preloader);
    const bar = $(".pl-bar i", preloader);
    let progress = 0;
    const tick = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 14 + 4);
      if (count) count.textContent = String(Math.floor(progress)).padStart(3, "0") + "%";
      if (bar) bar.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          preloader.classList.add("done");
          document.body.classList.add("loaded");
          setTimeout(() => preloader.remove(), 1000);
        }, 250);
      }
    }, prefersReduced ? 10 : 90);
  }
'''
new_js = '''  /* ---------- Loaded marker ----------
     There used to be a preloader here: a fake Math.random() counter that gated
     first paint for ~2.2s while the hero headline's entrance animation played
     invisibly behind it (HANDOFF 7.3). Deleted, along with the markup and the
     CSS. The hero entrance is now the opening moment instead of something that
     happens behind a curtain.

     `body.loaded` is what the hero title animation waits on. It was already
     being added by the old preloader but nothing in the stylesheet listened for
     it, so the class was inert. Set it on DOMContentLoaded -- main.js is
     `defer`, so readyState is normally already "interactive" and this runs at
     once, with no dependence on network timing or image decode. */
  const markLoaded = () => document.body.classList.add("loaded");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markLoaded, { once: true });
  } else {
    markLoaded();
  }
'''
s, ok = sub_once(s, old_js, new_js, "main.js preloader block")
if ok:
    p.write_text(s)
    print("  js/main.js: preloader timer replaced with loaded marker")

# ---------------------------------------------------------------- 3. style.css
p = ROOT / "css/style.css"
s = p.read_text()

# 3a. Delete the preloader block, but KEEP @keyframes riseIn — the hero title
#     depends on it and it was declared inside that block. @keyframes pulse and
#     plAutoDismiss were preloader-only and become dead, so they go too (§7.15).
old_css = '''/* ---------- Preloader ---------- */
html:not(.js) .preloader{display:none}
.preloader{
  position:fixed;inset:0;z-index:200;
  background:var(--char);color:var(--cream);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.4rem;
  transition:transform .9s var(--ease-out);
  /* CSS-only fallback: never trap the user if JS fails */
  animation:plAutoDismiss .8s var(--ease-out) 4s forwards;
}
@keyframes plAutoDismiss{to{transform:translateY(-101%);visibility:hidden}}
.preloader.done{transform:translateY(-101%)}
.preloader img{width:96px;height:96px;object-fit:contain;animation:pulse 1.2s ease-in-out infinite}
.preloader .pl-word{font-family:var(--font-display);font-size:clamp(2rem,6vw,3.4rem);letter-spacing:.06em;text-transform:uppercase;overflow:hidden}
.preloader .pl-word span{display:inline-block;animation:riseIn .8s var(--ease-out) both .15s}
.preloader .pl-count{font-size:.85rem;letter-spacing:.4em;opacity:.6}
.preloader .pl-bar{width:min(280px,60vw);height:2px;background:rgba(246,238,221,.15)}
.preloader .pl-bar i{display:block;height:100%;width:0;background:var(--red);transition:width .2s linear}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes riseIn{from{transform:translateY(110%)}to{transform:translateY(0)}}
'''
new_css = '''/* ---------- Preloader: removed ----------
   The curtain, its fake progress counter and its 4s CSS-only auto-dismiss are
   gone (HANDOFF 7.3). It delayed first meaningful paint by roughly 2.2s and the
   hero headline animated behind it, unseen.

   `riseIn` survives on purpose: it was declared inside the preloader block but
   the hero title depends on it. `pulse` and `plAutoDismiss` were preloader-only
   and are deleted as dead keyframes (7.15). */
@keyframes riseIn{from{transform:translateY(110%)}to{transform:translateY(0)}}
'''
s, ok = sub_once(s, old_css, new_css, "style.css preloader block")

# 3b. Gate the hero entrance on html.js + body.loaded.
#     html.js so a no-JS visitor still sees the headline (HANDOFF §4 rule 1);
#     body.loaded so the animation plays after first paint, not during it.
old_hero = '''.hero-title .line > span{display:inline-block;transform:translateY(115%);animation:riseIn 1s var(--ease-out) forwards}
.hero-title .line:nth-child(2) > span{animation-delay:.12s}
.hero-title .line:nth-child(3) > span{animation-delay:.24s}'''
new_hero = '''.hero-title .line > span{display:inline-block}
/* Two gates, both deliberate:
   - `html.js` so that with JavaScript off the span never gets the 115% offset
     and the headline is simply visible (HANDOFF §4 rule 1).
   - `body.loaded` so the rise plays after first paint and is actually seen.
     main.js sets it on DOMContentLoaded. */
html.js .hero-title .line > span{transform:translateY(115%)}
html.js body.loaded .hero-title .line > span{animation:riseIn 1s var(--ease-out) forwards}
html.js body.loaded .hero-title .line:nth-child(2) > span{animation-delay:.12s}
html.js body.loaded .hero-title .line:nth-child(3) > span{animation-delay:.24s}'''
s, ok2 = sub_once(s, old_hero, new_hero, "style.css hero title gating")

# 3c. Drop the now-orphaned preloader colour overrides and size override.
s, ok3 = sub_once(s, '''/* preloader: navy + sun */
.preloader{background:var(--navy-2);color:var(--paper)}
.preloader .pl-bar i{background:var(--sun)}
''', "", "style.css preloader palette overrides")
s, ok4 = sub_once(s, '.preloader .logo-badge{width:110px;height:110px;animation:pulse 1.2s ease-in-out infinite}\n',
                  "", "style.css .preloader .logo-badge")

# 3d. Reduced motion: the hero title must be at rest and visible whether or not
#     body.loaded ever lands. Matches the raised specificity and uses !important
#     per HANDOFF §4 rule 2.
old_rm = '''  html.js .reveal,html.js .reveal.in,
  html.js .stagger > *,html.js .stagger.in > *{
    opacity:1 !important;transform:none !important;filter:none !important;
  }'''
new_rm = '''  html.js .reveal,html.js .reveal.in,
  html.js .stagger > *,html.js .stagger.in > *{
    opacity:1 !important;transform:none !important;filter:none !important;
  }
  /* Hero title at rest. Must out-weigh the new
     `html.js body.loaded .hero-title .line > span` gate (0,4,3), and must hold
     even if body.loaded never arrives, or reduced-motion users get a blank
     headline instead of a still one. */
  html.js .hero-title .line > span,
  html.js body.loaded .hero-title .line > span{
    opacity:1 !important;transform:none !important;animation:none !important;
  }'''
s, ok5 = sub_once(s, old_rm, new_rm, "style.css reduced-motion hero title")

if all([ok, ok2, ok3, ok4, ok5]):
    p.write_text(s)
    print("  css/style.css: 5 edits applied")

# ---------------------------------------------------------------- report
if failures:
    print("\nFAILURES:")
    for f in failures:
        print("  -", f)
    sys.exit(1)
print("\nAll edits applied cleanly.")
