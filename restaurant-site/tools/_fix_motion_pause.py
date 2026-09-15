#!/usr/bin/env python3
"""Fix HANDOFF §7.8 — WCAG 2.2.2 (Pause, Stop, Hide), Level A.

The site has 21 CSS `infinite` animations plus a JS wheel autoplay at 4.2s.
Nothing offered a pause: the marquees pause only on `:hover`, which is not a
mechanism a touch user can invoke and is not one WCAG accepts. This adds a
single global, always-available control.

Design decisions:
  - One toggle in the header, labelled in words, with aria-pressed. It pauses
    every self-running animation site-wide, not just the loudest one.
  - The pause list is EXPLICIT and does not use a universal selector, because
    the scroll-driven choreography (animation-timeline: view()) is driven by
    the user's scroll, not by time. Pausing those would freeze elements at
    whatever opacity the scroll progress left them at — potentially hidden.
    WCAG 2.2.2 does not apply to user-driven motion, so excluding it is both
    safer and correct.
  - The wheel's play()/stop() live inside its per-section closure, so they are
    published into a small registry the toggle can call. Null-safe, in keeping
    with HANDOFF §9 rule 3.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "antonias"
PAGES = ["index.html", "menu.html", "san-luis-obispo.html", "paso-robles.html"]
failures = []

def once(text, old, new, label):
    if text.count(old) != 1:
        failures.append(f"{label}: expected exactly 1 occurrence, found {text.count(old)}")
        return text
    return text.replace(old, new, 1)

# ---------------------------------------------------------------- 1. HTML button
BUTTON = '''        <button class="motion-toggle" id="motion-toggle" type="button" aria-pressed="false" aria-label="Pause all site motion">
          <svg class="ic ic-pause" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>
          <svg class="ic ic-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>
          <span class="mt-text">Pause</span>
        </button>
'''
for name in PAGES:
    p = ROOT / name
    s = p.read_text()
    anchor = '        <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span></button>'
    if anchor not in s:
        failures.append(f"{name}: nav-toggle anchor not found")
        continue
    if 'id="motion-toggle"' not in s:
        s = s.replace(anchor, BUTTON + anchor, 1)
        p.write_text(s)
        print(f"  {name}: motion toggle added to header")

# ---------------------------------------------------------------- 2. CSS
p = ROOT / "css/style.css"
css = p.read_text()
if ".motion-toggle" not in css:
    css += '''
/* ============================================================
   MOTION PAUSE — WCAG 2.2.2 (Level A): Pause, Stop, Hide
   Everything on this site that moves on its own for more than
   five seconds can be stopped here, with one control.
   ============================================================ */
.motion-toggle{
  display:inline-flex;align-items:center;gap:.45rem;
  min-height:44px;padding:.4rem .95rem;border-radius:999px;
  border:2px solid currentColor;background:transparent;color:inherit;
  font-family:var(--font-display);font-weight:700;font-size:.78rem;
  letter-spacing:.05em;text-transform:uppercase;cursor:pointer;
  transition:background-color var(--dur-1) var(--ease-soft),
             color var(--dur-1) var(--ease-soft);
}
.motion-toggle:hover{background:color-mix(in srgb, currentColor 12%, transparent)}
.motion-toggle:active{transform:scale(.97)}
.motion-toggle .ic{width:13px;height:13px;flex-shrink:0}
.motion-toggle .ic-play{display:none}
.motion-toggle[aria-pressed="true"] .ic-play{display:block}
.motion-toggle[aria-pressed="true"] .ic-pause{display:none}
@media (max-width:40rem){
  /* Keep a 44px target; hide the word but keep it for screen readers. */
  .motion-toggle .mt-text{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .motion-toggle{padding:.55rem}
}

/* The pause itself. Enumerated, NOT a universal selector: the scroll-driven
   choreography under `animation-timeline: view()` must keep following the
   user's scroll or its elements would freeze mid-reveal, possibly invisible.
   !important so it beats per-element animation shorthands, matching the
   override discipline in HANDOFF §4 rule 2. */
html.motion-paused .open-pill .dot,
html.motion-paused .hero-badge,
html.motion-paused .hero-badge .badge-center,
html.motion-paused .scroll-hint::after,
html.motion-paused .marquee-track,
html.motion-paused .float-chip,
html.motion-paused .gallery-track,
html.motion-paused .map-fallback .pin svg,
html.motion-paused .hero-photo .sticker,
html.motion-paused .order-badge svg,
html.motion-paused .btn::before,
html.motion-paused .bb::after,
html.motion-paused .meteor,
html.motion-paused .order-badge .orbit,
html.motion-paused .order-badge .orbit--rev,
html.motion-paused .wr-track,
html.motion-paused .craving-word{
  animation-play-state:paused !important;
}
'''
    p.write_text(css)
    print("  css/style.css: toggle styles + pause list appended")
else:
    failures.append("css/style.css: .motion-toggle already present")

# ---------------------------------------------------------------- 3. JS
p = ROOT / "js/main.js"
js = p.read_text()

js = once(js,
  '  const $$ = (s, c = document) => [...c.querySelectorAll(s)];',
  '''  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Registry of self-running components, so the global motion toggle (WCAG
     2.2.2) can stop and restart them without reaching into their closures. */
  const autoplay = { stop: [], start: [] };''',
  "main.js: autoplay registry")

js = once(js,
  '    function stop() { if (timer) clearInterval(timer); timer = null; }',
  '''    function stop() { if (timer) clearInterval(timer); timer = null; }
    autoplay.stop.push(stop);
    autoplay.start.push(play);''',
  "main.js: wheel publishes play/stop")

TOGGLE_JS = '''
  /* ---------- Global motion pause (WCAG 2.2.2 Level A) ---------- */
  const motionToggle = $("#motion-toggle");
  if (motionToggle) {
    const setPaused = (paused) => {
      document.documentElement.classList.toggle("motion-paused", paused);
      motionToggle.setAttribute("aria-pressed", String(paused));
      motionToggle.setAttribute("aria-label", paused ? "Resume all site motion" : "Pause all site motion");
      const label = $(".mt-text", motionToggle);
      if (label) label.textContent = paused ? "Play" : "Pause";
      const fns = paused ? autoplay.stop : autoplay.start;
      fns.forEach((fn) => { try { fn(); } catch (_) {} });
    };
    motionToggle.addEventListener("click", () => {
      setPaused(motionToggle.getAttribute("aria-pressed") !== "true");
    });
  }
'''
js = once(js, '\n})();\n', TOGGLE_JS + '\n})();\n', "main.js: toggle handler")

if not failures:
    p.write_text(js)
    print("  js/main.js: registry, wheel hookup and toggle handler added")

if failures:
    print("\nFAILURES:")
    for f in failures:
        print("  -", f)
    sys.exit(1)
print("\nMotion pause mechanism installed on all four pages.")
