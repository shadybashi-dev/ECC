import sys
H="antonias/HANDOFF.md"; s=open(H,encoding="utf-8").read()
def rep(old,new,label):
    global s
    c=s.count(old); print(f"  {label}: {c}")
    if c!=1: sys.exit(f"ABORT {label}")
    s=s.replace(old,new,1)

rep("""**Content**
1. **`menu.html` shows no prices at all.** `.mi-price` is styled but never used.
   This is the page that drives orders — it needs real prices.
2. Most food photography""",
"""**Content**
1. Most food photography""",
    "drop fixed price item")

rep("""**Responsive**
11. `.menu-item--feature` has a fixed 220 px column that crushes text to ~80 px
    at a 360 px viewport.
12. The pie-wheel centre disc renders as an oval on phone widths.
13. The spinning "ORDER NOW" badge overlaps and intercepts taps on the hero eyebrow.""",
"""**Responsive**
11. The pie-wheel centre disc renders as an oval on phone widths.
12. The spinning "ORDER NOW" badge overlaps and intercepts taps on the hero eyebrow.""",
    "drop fixed feature-column item")

rep("""- `build.py`, so `standalone.html` stops drifting from source.""",
"""- `build.py`, so `standalone.html` stops drifting from source.

### Menu page (second pass)
- **Prices are deliberately absent.** The owner does not want them on the site,
  so the dead `.mi-price` rules were removed rather than left as a trap. Do not
  invent prices for a real restaurant.
- Sticky category rail: 8 chips, each a 44px touch target, horizontally
  scrollable, with `aria-current="true"` following the section you are reading.
  The rail auto-scrolls the active chip into view — scroll the inner
  `.menu-rail-inner`, not the `<nav>`, which does not scroll.
- `--header-h` is now published from JS (the header is fixed and shrinks on
  scroll, so the rail's `top` and the sections' `scroll-margin-top` need the
  live value, not a guess).
- Item stagger is `0.03s` per item over `300ms`. Card grids use `0.06s`.
  Both come from the ui-ux-pro-max motion data: `0.02-0.04s` per item for long
  lists, never past `0.1s`. The old ladder was `0.1s` — right at that limit.
- Card entrances use a slight overshoot (`--ease-snap`) with `scale(.92)` and a
  16px rise, matching the Standard stagger tier for a playful consumer brand.
- `.menu-item--feature` no longer pins a 220px column; it collapses to one
  column under 560px. It previously crushed its text to ~80px on a 360px phone.""",
    "append menu-page notes")

open(H,"w",encoding="utf-8",newline="\n").write(s)
print("  HANDOFF.md updated")
