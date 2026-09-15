#!/usr/bin/env python3
"""Four surgical fixes from HANDOFF §7: 5, 6, 9, 12.

5  PERMANENT will-change
   `will-change` promotes an element to its own compositor layer. It is meant
   to be set just before an animation and dropped after. Left on `.hero-bg` and
   on every `.reveal` element it pins ~30 layers for the life of the page,
   which is exactly the memory pressure HANDOFF flagged. Removed from both;
   kept on the marquee/gallery tracks and the wheel rotor, where motion is
   continuous or interaction-driven and the layer earns its keep.

6  backdrop-filter ON THE FIXED HEADER (and the sticky menu rail)
   A backdrop-filter re-samples and re-blurs everything under the element on
   every frame it changes. On a position:fixed header that means every scroll
   frame, for the whole session. The backgrounds are already 92-95% opaque, so
   the blur is buying almost nothing visually. It is removed and the alphas
   nudged up so the result reads identical without the per-frame cost. Same
   treatment for the sticky category rail.

9  MOBILE NAV FOCUSABLE WHILE CLOSED (WCAG 2.4.3 / 2.4.7 in spirit)
   The closed menu is a clip-path:circle(0) overlay. clip-path hides pixels but
   leaves the links in the tab order, so a keyboard user tabs through an
   invisible menu. visibility:hidden removes them from the tab order; the
   transition-delay on visibility lets the clip animation finish first.

12 SPINNING ORDER BADGE INTERCEPTS TAPS ON THE HERO EYEBROW
   .order-badge is a square link (aspect-ratio:1) whose visible shape is a
   circle. Its hit area was the whole square, so taps on hero copy near its
   corners hit the badge instead. border-radius:50% makes the hit area match
   the drawn shape.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "antonias"
p = ROOT / "css/style.css"
s = p.read_text()
failures = []

def once(old, new, label):
    global s
    if s.count(old) != 1:
        failures.append(f"{label}: found {s.count(old)} occurrences, expected 1")
        return
    s = s.replace(old, new, 1)

# ---- 5. permanent will-change
once("  opacity:.34;transform:scale(1.12);will-change:transform;\n",
     "  opacity:.34;transform:scale(1.12);\n",
     "5a .hero-bg will-change")
once("transition:opacity .9s var(--ease-out), transform .9s var(--ease-out);will-change:opacity,transform}",
     "transition:opacity .9s var(--ease-out), transform .9s var(--ease-out)}",
     "5b .reveal will-change")

# ---- 6. per-frame backdrop blur
once("  background:rgba(23,18,16,.92);color:var(--cream);\n  backdrop-filter:blur(14px);box-shadow:0 10px 30px rgba(0,0,0,.18);\n",
     "  background:rgba(23,18,16,.97);color:var(--cream);\n  box-shadow:0 10px 30px rgba(0,0,0,.18);\n",
     "6a dark scrolled header blur")
once("background:rgba(255,253,247,.95);color:var(--navy);backdrop-filter:blur(12px);box-shadow:0 8px 30px rgba(14,58,82,.12)}",
     "background:rgba(255,253,247,.98);color:var(--navy);box-shadow:0 8px 30px rgba(14,58,82,.12)}",
     "6b light scrolled header blur")
once("  background:color-mix(in srgb, var(--paper) 88%, transparent);\n  backdrop-filter:blur(10px);\n",
     "  background:var(--paper);\n",
     "6c menu rail blur")

# ---- 9. closed mobile nav stays in the tab order
once("    clip-path:circle(0 at calc(100% - 46px) 46px);transition:clip-path .7s var(--ease-out);\n  }\n  body.nav-open .nav-links{clip-path:circle(150% at calc(100% - 46px) 46px)}\n",
     "    clip-path:circle(0 at calc(100% - 46px) 46px);\n    /* clip-path hides pixels but not the tab order. visibility removes the\n       closed menu from it; the delay lets the clip animation finish. */\n    visibility:hidden;\n    transition:clip-path .7s var(--ease-out), visibility 0s .7s;\n  }\n  body.nav-open .nav-links{\n    clip-path:circle(150% at calc(100% - 46px) 46px);\n    visibility:visible;\n    transition:clip-path .7s var(--ease-out), visibility 0s 0s;\n  }\n",
     "9 closed nav visibility")

# ---- 12. circular hit area for the circular badge
once("  width:clamp(120px,13vw,168px);aspect-ratio:1;display:grid;place-items:center;text-decoration:none;\n",
     "  width:clamp(120px,13vw,168px);aspect-ratio:1;display:grid;place-items:center;text-decoration:none;\n  /* The drawn shape is a circle; the hit area was the bounding square, so\n     taps on hero copy near its corners went to the badge (HANDOFF 7.12). */\n  border-radius:50%;\n",
     "12 order-badge hit area")

if failures:
    print("FAILURES:")
    for f in failures:
        print("  -", f)
    sys.exit(1)

p.write_text(s)
print("css/style.css: fixes 5, 6, 9, 12 applied (6 edits)")
