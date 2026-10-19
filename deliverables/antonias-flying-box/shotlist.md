# Shotlist — 23 seconds, 4 AI clips + 1 graphic end card

Open video models give you ~5 seconds per generation. A 23-second spot is therefore
**4 generations + an edit**, not one prompt. This is the shot plan that actually cuts
together.

| # | Time | Shot | Camera | Model input | Cost on fal |
|---|------|------|--------|-------------|-------------|
| 01 | 0:00–0:05 | The Rise — box lifts off the stage | Low angle, slow push-in | `keyframe_hero.png` (I2V) | ~$0.15 |
| 02 | 0:05–0:10 | The Glide — box banks through spotlights | Orbiting drone | last frame of 01 (I2V) | ~$0.15 |
| 03 | 0:10–0:15 | The Landing — box settles on rustic table | Macro, slow tilt | start frame from 01 (I2V) | ~$0.15 |
| 04 | 0:15–0:20 | The Reveal — lid opens, cheese pull | Slow push-in | last frame of 03 (I2V) | ~$0.15 |
| EC | 0:20–0:23 | End card | Graphic | **CapCut / DaVinci — not AI** | $0 |

**Chaining trick:** take the last frame of clip 01 (`ffmpeg -sseof -0.1 -i 01.mp4 -frames:v 1 f01.png`)
and use it as the conditioning image for clip 02. That is how you get visual continuity
across cuts for free.

---

## Shot 01 — THE RISE (0:00–0:05)

```
Low-angle hero shot, slow motion. A giant Antonia's Pizza box sits on a glossy black
stage floor, lid slightly open, golden steam pouring out. It lifts off the ground and
rises two feet, tilting as it hovers. Crimson and amber spotlights sweep across it,
embers and dust drifting through the beams, ground fog rolling. Stunned silhouetted
crowd at the edges. Camera pushes in low, slight handheld. Photoreal, anamorphic lens
flare, shallow depth of field, 24fps, film grain.
```

## Shot 02 — THE GLIDE (0:05–0:10)

```
Orbiting drone shot circling a hovering Antonia's Pizza box as it glides forward through
a dark futuristic stage, banking gently like a concept-car reveal. Golden light leaks
from the lid, cheese pull glinting, energy particles in tomato-red and gold trailing
behind. Spotlights streak past, fog swirling, audience silhouettes blurred in the
foreground. Smooth aerial orbit, motion blur, cinematic grade, 24fps.
```

## Shot 03 — THE LANDING (0:10–0:15)

```
The flying pizza box descends slowly onto a rustic wooden table in a warm pizzeria, fog
clearing, stage light fading into golden practical light. Dust motes in the air, flour on
the table, a hand-made 28-inch pie glow reflecting on the wood. Slow-motion, macro
detail, shallow depth of field, warm and authentic, 24fps.
```

## Shot 04 — THE REVEAL (0:15–0:20)

```
Close-up: the lid of the Antonia's Pizza box opens in slow motion, a burst of golden
steam rolling out, revealing a perfect steaming 28-inch pepperoni pizza — bubbling
mozzarella, charred seasoned crust, fresh basil, an epic cheese pull. Camera slow
push-in, steam backlit by warm light. Mouth-watering, photoreal food cinematography,
24fps.
```

---

## End card spec (build this in the editor, 0:20–0:23)

**Frame:** 1920×1080 (and a 1080×1920 vertical variant).

| Element | Spec |
|---|---|
| Background | Cream `#F2E7D5`, subtle flour/grain texture at 8% opacity |
| Logo | Official PNG/SVG, centered, width 22% of frame, top margin 22% |
| Wordmark | "Antonia's Pizza" — Anton / Archivo Black, tracking +2%, charcoal `#1A1714` |
| URL | `antoniaspizza.com` — Anton, 62% of headline size |
| Tagline | *The Future of Delivery is Here.* — Playfair Display Italic |
| Small print | "San Luis Obispo · Paso Robles — Open till 2AM Fri–Sat." 40px, 70% opacity |
| Animation | Logo scale 0.96→1.0 + fade 0.4s; text rises 24px, stagger 0.12s |

**Why not AI:** no open video model reliably spells a brand name correctly on every seed.
A real text layer is sharper, editable, and on-brand every time.

---

## Sound design (pick in this order)

1. **0:00.2** — low sub-bass swell + distant crowd murmur.
2. **0:00.6** (box lifts) — whoosh, filtered high-pass rising.
3. **0:04.8** (cut to glide) — metallic shimmer tail, keep music driving.
4. **0:10.0** (landing) — wood thud + boxy card tap, music drops to half.
5. **0:15.5** (lid opens) — steam hiss + cheese sizzle + choir hit (the "hero" moment).
6. **0:20.0** (end card) — music resolves on a mandolin pluck; silence on the tagline.

Free, commercially safe: [Pixabay Music](https://pixabay.com/music/) +
[Freesound](https://freesound.org/).
