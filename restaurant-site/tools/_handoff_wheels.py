import sys
H="antonias/HANDOFF.md"; s=open(H,encoding="utf-8").read()
anchor="---\n\n## 9. If you continue this on another platform"
if s.count(anchor)!=1: sys.exit("ABORT anchor")
block = """---

## 8b. The two spin-to-decide wheels (`#spin` on index.html)

Separate from the pie carousel in §6. Both are built from one CSS disc
(`conic-gradient`) plus a `transform` spin — no canvas, no library.

**Wheel 1 — "Pick my pizza."** Picks one of eight pies at random.
**Wheel 2 — "Spin for a treat."** One prize per visitor.

### How a landing angle is computed
Eight segments, pointer fixed at 12 o'clock. Segment `i` covers
`[i*45, (i+1)*45)` clockwise from the top, so landing on `i` means rotating the
disc to `-(i*45 + 22.5)` degrees, minus 5–7 whole turns for the spin. The result
shown is always the segment under the pointer — verified across repeated spins.
If you change the number of segments, change the `conic-gradient` stops, the
`--seg` value in CSS, and nothing else: the JS derives everything from the item
count.

### Editing the prizes — read this before launch
The prize copy in `index.html` (`data-spin-items` on the prize wheel) is a
**starting suggestion, not the owner's confirmed offer list.** Free drink, 10%
off, garlic knots, free topping, $5 off, cannoli, and two "try again" segments.
Replace them with the real offers before the site goes live. Each entry is
`{"name":"...","note":"...","win":true|false}` — `win:false` renders the muted
"no prize" card.

### What the once-per-visitor lock actually is
`localStorage` under the key in `data-spin-once`. It stops casual re-spinning
and survives a refresh, and that is all it does. **It is not enforcement.**
Anyone can clear site data, open a private window, or read the prize list
straight out of the page source. Do not put an offer on this wheel that you
would not be willing to honour for anyone who asks. Real, controlled promo
codes need a backend or the Toast promotions system.

### Accessibility
The result card is a `role="status" aria-live="polite"` region, so the outcome is
announced. Under `prefers-reduced-motion` the disc does not spin at all — it
jumps straight to the landing angle and renders the result. Prize-wheel labels
on the red segments use paper ink: navy on that red measures 2.99:1 and fails AA
for large text, paper measures 3.95:1 and passes.

"""
s = s.replace(anchor, block + anchor, 1)
open(H,"w",encoding="utf-8",newline="\n").write(s)
print("  HANDOFF.md: wheels section added")
