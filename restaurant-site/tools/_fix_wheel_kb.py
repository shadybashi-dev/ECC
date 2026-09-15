#!/usr/bin/env python3
"""Fix HANDOFF §7.7 (keyboard wheel) and §7.11 (oval centre disc).

7.7  The wheel rotor already carried role="listbox" and the slices
     role="option" tabindex="-1", and prev/next buttons exist — but the
     listbox itself was not focusable and had no key handling, so the ARIA
     pattern was declared and not implemented. Now:
       - the rotor is the single tab stop (tabindex=0);
       - Arrow keys / Home / End move the active option, following the
         WAI-ARIA listbox pattern, publishing aria-activedescendant and
         aria-selected from render();
       - focusing the wheel pauses autoplay (focus means intent to operate
         it) and blurring resumes it — but only if the user has not globally
         paused motion, which is why play() now consults a module-level flag
         the header toggle sets. Without that flag, tabbing away from the
         wheel would silently undo an explicit "Pause" choice.

7.11 The centre disc is width:44% + aspect-ratio:1 inside a square container,
     so it should already be a circle; the owner's audit reports an oval at
     phone widths, i.e. the preferred ratio is being defeated. An explicit
     height equal to the width (44% of a square container) makes the circle
     unconditional and cannot regress the desktop case. The dish name also
     gets a smaller mobile size so long names cannot press on the disc.
     NOTE: there is no browser in this sandbox, so this one is reasoned, not
     eyeballed — it is called out in the commit for confirmation on a device.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "antonias"
failures = []

def once(text, old, new, label):
    if text.count(old) != 1:
        failures.append(f"{label}: found {text.count(old)}, expected 1")
        return text
    return text.replace(old, new, 1)

# ---------------------------------------------------------------- main.js
p = ROOT / "js/main.js"
js = p.read_text()

js = once(js,
  '  const autoplay = { stop: [], start: [] };',
  '''  const autoplay = { stop: [], start: [] };

  /* Set by the header motion toggle. play() consults it so that resuming for
     any reason (leaving focus, scrolling back on screen) can never undo an
     explicit pause. */
  let motionPausedByUser = false;''',
  "motionPausedByUser flag")

js = once(js,
  '''    function play() {
      if (prefersReduced || !onScreen) return;''',
  '''    function play() {
      if (prefersReduced || !onScreen || motionPausedByUser) return;''',
  "play() respects global pause")

js = once(js,
  '''        slices.forEach((s, i) => s.classList.toggle("active", i === idx));
        const s = slices[idx];''',
  '''        slices.forEach((s, i) => s.classList.toggle("active", i === idx));
        const s = slices[idx];
        /* Publish the ARIA listbox state so the active option is announced. */
        slices.forEach((el, i) => el.setAttribute("aria-selected", String(i === idx)));
        if (s.id) rotor.setAttribute("aria-activedescendant", s.id);''',
  "render() publishes aria state")

js = once(js,
  '''    slices.forEach((s, i) => {
      s.addEventListener("click", () => {
        if (moved) return;
        goTo(i); play();
      });
    });''',
  '''    slices.forEach((s, i) => {
      s.addEventListener("click", () => {
        if (moved) return;
        goTo(i); play();
      });
    });

    /* Keyboard operation (HANDOFF 7.7): the WAI-ARIA listbox pattern.
       The rotor is the single tab stop; arrows move the active option and
       aria-activedescendant follows it via render(). Autoplay is paused on
       focus because focus means the visitor intends to operate the wheel. */
    slices.forEach((s, i) => { if (!s.id) s.id = "pie-slice-" + (i + 1); });
    rotor.tabIndex = 0;
    rotor.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown": e.preventDefault(); next(); break;
        case "ArrowLeft":
        case "ArrowUp":   e.preventDefault(); prev(); break;
        case "Home":      e.preventDefault(); goTo(0); break;
        case "End":       e.preventDefault(); goTo(N - 1); break;
        default: return;
      }
    });
    rotor.addEventListener("focus", stop);
    rotor.addEventListener("blur", () => { if (started && onScreen) play(); });''',
  "keyboard listbox handling")

js = once(js,
  '      document.documentElement.classList.toggle("motion-paused", paused);',
  '''      motionPausedByUser = paused;
      document.documentElement.classList.toggle("motion-paused", paused);''',
  "toggle sets the flag")

if not failures:
    p.write_text(js)
    print("  js/main.js: keyboard listbox + pause-flag wiring")

# ---------------------------------------------------------------- style.css
p = ROOT / "css/style.css"
css = p.read_text()

css = once(css,
  '  width:44%;aspect-ratio:1;border-radius:50%;',
  '''  /* width AND height at 44% of a square container: the circle no longer
     depends on aspect-ratio winning against content (HANDOFF 7.11). */
  width:44%;height:44%;aspect-ratio:1;border-radius:50%;''',
  "centre disc explicit height")

css = once(css,
  '@media (max-width:640px){\n  .pie-center .kicker{display:none}',
  '''@media (max-width:640px){
  .pie-center .kicker{display:none}
  /* Long dish names must not press on a 44% disc at phone widths. */
  .pie-center .dish-name{font-size:1.02rem;line-height:1.12;margin:.25rem 0 .35rem}''',
  "mobile dish-name size")

if not failures:
    p.write_text(css)
    print("  css/style.css: disc hardening + mobile type size")

if failures:
    print("\nFAILURES:")
    for f in failures:
        print("  -", f)
    sys.exit(1)
print("\n7.7 and 7.11 applied.")
