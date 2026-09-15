---
name: food-photography-generation
description: Produce photorealistic, appetite-driving food imagery for restaurant websites across any generation backend — ComfyUI (Flux/SDXL + LoRA + ControlNet + inpaint + upscale), fal.ai, or a hosted image tool. Contains the actual food-photography craft (lighting, styling, lens, plating, steam, cheese pull) translated into prompt formulas, per-dish recipes for pizza and Mediterranean food, aspect-ratio and export specs for web delivery, and the disclosure and honesty rules for AI food imagery. Use when a menu item, hero, or gallery needs imagery that does not exist yet.
metadata:
  origin: project-synthesis
  layer: 4
  backends: ComfyUI, fal.ai, hosted image generation
---

# Food Photography Generation

The generator is the easy part. **Knowing what an appetising photo actually is**
is the hard part, and it is what this skill encodes. A technically perfect image
of badly-lit, badly-styled food converts worse than no image — poorly executed
food photography measurably **decreases orders by ~15%**, while good photography
raises them **25–35%**.

---

## 0. Backend selection

| Backend | When | Notes |
| --- | --- | --- |
| **ComfyUI** (`comfyui-image-generation`) | You have a local GPU and need repeatability, LoRA fine-tuning on the *actual* restaurant's dishes, ControlNet composition lock, or batch generation of a whole menu | Highest control, highest setup cost. Needs ComfyUI running on `127.0.0.1:8188` |
| **fal.ai** (`fal-ai-media`) | No local GPU; need fast turnaround; video/animation too | Hosted, API-key based, model choice incl. Flux + Nano Banana |
| **Hosted image tool** in the workspace | Quick single assets, hero exploration, mockups | Lowest friction; use for drafts and concepts |

**Honest guidance:** for a real restaurant, **real photography of real dishes
beats generated imagery** for menu items, because the photo is a promise the
kitchen must keep. Use generation for:

- Hero and atmospheric brand imagery
- Dishes that are hard to shoot (steam, cheese pull, action moments)
- Concept exploration before a real shoot
- Filling gaps for items that cannot be styled in time
- Marketing/social assets

**Never** generate an image of a dish the restaurant does not serve, and never
make a portion look materially larger than what is plated. That is a refund and
a one-star review generator.

---

## 1. The craft, translated into prompt language

Real food photography is a discipline with named components. Put them in the
prompt explicitly — generic prompts produce generic, unappetising food.

### Lighting (the single biggest variable)

| Setup | Prompt language | Effect |
| --- | --- | --- |
| **Back/side light** | "large softbox at 10 o'clock, gentle rim light, deep natural shadow falloff" | Reveals texture; makes cheese and crust glow. **Default choice for pizza** |
| **Dark & moody** | "low-key lighting, single window light from the left, dark charcoal background, dramatic falloff" | Premium, evening, late-night |
| **Bright & airy** | "soft diffused overhead daylight, white bounce fill, high-key, clean shadows" | Fresh, daytime, family, salads |
| **Golden hour** | "warm late-afternoon sun through a window, amber highlights, long soft shadows" | Comfort, rustic, hospitality |
| **Practical/oven glow** | "warm ember glow from a wood-fired oven, orange cast on the crust, dark kitchen background" | Fire, authenticity, wood-fired pizza |

**Never** use flat frontal flash language ("even lighting", "studio flash
straight on") — it flattens texture and reads as catalogue or frozen food.

### Lens and camera

- `85mm f/2.8` — the workhorse. Natural compression, creamy background, no distortion.
- `50mm f/1.8` — slightly wider context, table feel.
- `100mm macro` — texture detail: crust blistering, cheese bubbles, herb flecks.
- `35mm` — full table spread, environmental, "you are here".
- Add: `shallow depth of field`, `focus on the near crust edge`, `background
  falls off softly`.

### Angle

| Angle | Prompt | Best for |
| --- | --- | --- |
| **45°** (diner's eye) | "shot at 45 degrees, as seen by a diner at the table" | **Pizza, plated dishes — the default.** Most appetising because it matches how you actually see food |
| **Overhead / flat lay** | "directly overhead 90-degree flat lay" | Whole pies, spreads, tables, ingredients |
| **Straight-on** | "eye-level straight-on" | Burgers, stacked items, drinks, cheese pull |
| **Dynamic macro** | "extreme close-up macro, crust edge filling the frame" | Texture hero moments, section dividers |

### The appetite triggers (include at least two)

These are what actually make food look edible rather than plastic:

1. **Steam** — `visible thin steam rising, backlit` → reads as *just cooked*.
   The strongest single appetite cue.
2. **Melt and stretch** — `molten mozzarella, glossy cheese pull stretching from
   a lifted slice` → the signature pizza moment.
3. **Glisten** — `glistening olive oil sheen, buttery highlights on the crust`
4. **Char and blister** — `leopard-spotted char on the crust edge, slight
   blistering, flour dusting` → signals real oven, real craft.
5. **Fresh garnish** — `fresh torn basil leaves added after baking, bright green
   against red sauce`
6. **Imperfection** — `slightly irregular hand-stretched shape, uneven topping
   distribution` → handmade beats machine-perfect. Symmetry reads as frozen.
7. **Human trace** — `a hand lifting a slice`, `a pizza cutter resting on the
   board`, `flour-dusted surface` → scale + craft.
8. **Context surface** — `on a worn dark wooden board`, `marble with flour
   dust`, `rustic iron pan`, `checked red-and-white napkin`

### Negative prompt (always include)

```
plastic-looking food, wax fruit, oversaturated, HDR halo, flat frontal flash,
perfect symmetry, cgi render look, 3d render, illustration, cartoon, painting,
watercolor, blurred, low resolution, jpeg artifacts, watermark, text, logo,
extra limbs, deformed hands, floating food, empty plate, dirty plate,
blue color cast on food, grey unappetising tones, stock photo look,
over-processed, sharpening halos
```

The `blue color cast` and `grey tones` entries matter: they are the two failure
modes that make generated food look inedible.

---

## 2. Prompt formula

```
[SUBJECT: exact dish + portion state]
[HERO DETAIL: the one appetite trigger that defines this dish]
[STYLING: plating, garnish, surface, props]
[LIGHTING: named setup]
[CAMERA: lens + aperture + angle + focus]
[MOOD: atmosphere, background, colour temperature]
[QUALITY: photorealistic, editorial food photography, high detail]
```

### Worked examples

**Signature dough boat (Adjarian-style)**

```
A warm Adjarian-style bread boat, hand-shaped golden dough with a crisp edge,
filled with molten mozzarella and crumbled feta, a soft egg yolk broken and
running into the cheese, cubes of butter melting at the surface, thin steam
rising and backlit. Served on a dark iron baking sheet on a worn wooden table,
light flour dusting, a linen napkin beside it. Low-key warm side lighting from
the left at 10 o'clock, deep shadow falloff, ember-warm colour temperature.
Shot on 85mm f/2.8 at 45 degrees, focus on the running yolk, background
falling off softly. Moody evening restaurant atmosphere, dark charcoal
background. Photorealistic editorial food photography, high detail, 8k.
```

**28" XL pepperoni hero**

```
An enormous 28-inch pepperoni pizza on a dark wooden board, hand-stretched
crust with leopard-spotted char and flour dusting, pepperoni cups filled with
glistening rendered oil, whole-milk mozzarella blistered and browned in
patches, visible thin steam rising and backlit. A hand lifting one slice with a
long glossy cheese pull. Checked red-and-white napkin, pizza cutter resting on
the board, scale emphasised by a hand in frame. Large softbox at 10 o'clock with
gentle rim light, warm highlights, deep natural shadow falloff. Shot on 50mm
f/1.8, 45-degree diner's-eye angle, focus on the cheese pull. Rustic Italian
neighbourhood pizzeria, warm amber colour temperature, dark background.
Photorealistic editorial food photography, high detail.
```

**Late-night kitchen atmosphere (no dish focus)**

```
A wood-fired pizza oven glowing orange in a dark restaurant kitchen at 1am,
a pizzaiolo in a flour-dusted apron stretching dough by hand, motion in the
flour dust catching the light, warm ember glow on brick, deep shadows, empty
dining room softly out of focus behind. Cinematic low-key lighting, single
practical light source from the oven. Shot on 35mm f/1.4, eye level, shallow
depth of field, focus on the hands and dough. Documentary photojournalism
style, warm tungsten colour temperature. Photorealistic, high detail.
```

**Mediterranean / manakeesh**

```
A freshly baked manakeesh flatbread with za'atar and olive oil, blistered
edges, scattered fresh thyme, beside a small plate of crumbled feta, sliced
cucumber and tomato, a bowl of labneh with a pool of green olive oil. Bright
soft diffused overhead daylight with white bounce fill, clean gentle shadows,
high-key. Shot on 85mm f/2.8, directly overhead flat lay, focus across the
whole spread. Light marble surface with flour dusting, small linen napkin.
Fresh Mediterranean lunchtime atmosphere. Photorealistic editorial food
photography, high detail.
```

---

## 3. ComfyUI implementation notes

When using `comfyui-image-generation`:

1. **Checkpoint:** a photorealism-tuned model (Flux.1 dev or a
   photographic SDXL checkpoint). Avoid illustration/anime-tuned models.
2. **Steps:** 28–40 for Flux, 25–35 for SDXL. **CFG:** 3.5–5 for Flux,
   5–7 for SDXL. Higher CFG oversaturates food — exactly the failure mode.
3. **Sampler:** `dpmpp_2m` / `euler_a` with `karras` or `sgm_uniform` scheduler.
4. **Resolution:** generate at or above final delivery size, then upscale.
   Do not generate at 512 and upscale 4× — texture turns to plastic.
5. **Upscale pass:** 4× Ultrasharp or RealESRGAN, then a low-denoise
   (0.25–0.35) img2img refine at target size to restore food texture.
6. **ControlNet:** use depth or canny from a real photo of the actual dish to
   lock composition while improving the styling. This is the best way to keep
   generated imagery honest to what the kitchen serves.
7. **LoRA:** a food-photography LoRA at 0.6–0.8 strength is usually better than
   more prompt text. If you have 20+ real photos of the restaurant's own dishes,
   training a small LoRA on them gives brand-consistent results across the whole
   menu — the single highest-value ComfyUI investment for this project.
8. **Seed discipline:** once a prompt works, **record the seed**. Reuse it for
   variations so the set looks like one shoot, not fifty random generations.
9. **Batch, then curate.** Generate 8–16 per dish, pick one. The hit rate on
   appetising food is low; volume is the workflow.

```bash
SCRIPT=".claude/skills/comfyui-image-generation/scripts/comfyui_api.py"
python $SCRIPT status
python $SCRIPT models
python $SCRIPT generate \
  --prompt "<formula above>" \
  --negative "<negative prompt above>" \
  --width 1536 --height 1024 \
  --steps 32 --cfg 4.5 \
  --wait --save-to ./assets/raw/
```

---

## 4. Export specs for web delivery

Every generated image must be processed before it reaches the site. Raw
generations are 1–4 MB PNGs — unusable.

| Slot | Aspect | Max weight | Format | Notes |
| --- | --- | --- | --- | --- |
| Hero | 16:9 | 180 KB | AVIF (WebP fallback) | preload, `fetchpriority="high"` |
| Hero mobile | 4:5 or 3:4 | 120 KB | AVIF | separate art-directed crop, not a squeeze |
| Menu item | 4:3 or 1:1 | 60 KB | AVIF | lazy, `decoding="async"` |
| Gallery | 1:1 / 4:5 | 25 KB thumb, 200 KB full | AVIF | thumb grid, lightbox loads full |
| OG / social | 1200×630 | 200 KB | JPG | must survive compression on Facebook/WhatsApp |
| Schema `ImageObject` | 1:1, 4:3, 16:9 | — | AVIF/JPG | all three required for image rich results |

Pipeline: generate → colour-check → crop per slot → encode AVIF q≈50–60 +
WebP q≈72 → set explicit `width`/`height` → `srcset` at 1×/2×.

Always deliver **all three aspect ratios** of the hero for `ImageObject` schema
(1x1, 4x3, 16x9) — Google requires them for image rich results.

---

## 5. Quality bar — reject the image if any of these are true

- [ ] The food looks plastic, waxy, or CGI-rendered
- [ ] There is a blue or grey cast on the food itself
- [ ] Steam looks like smoke or fog rather than thin heat
- [ ] Cheese looks rubbery rather than molten
- [ ] The crust has no char, blister, or flour — looks machine-made
- [ ] Perfect symmetry (reads as frozen/industrial)
- [ ] Hands or cutlery are deformed
- [ ] Portion looks materially larger than the real dish
- [ ] Text, watermark, or gibberish lettering anywhere in frame
- [ ] Garnishes that are not actually on the dish
- [ ] It could be any restaurant's food with no local signal

Also verify: does this photo make **you** hungry? If not, regenerate. That
reaction is the metric, and it correlates with order rate.

---

## 6. Honesty and disclosure

- Generated imagery used as **atmosphere or brand art** needs no special
  marking, but must not depict a specific dish inaccurately.
- Generated imagery used to represent **an actual menu item** must be visually
  faithful to what is served. If it cannot be, use a real photo of the real
  dish instead — even a mediocre honest photo converts better long-term than a
  beautiful lie, because the lie produces refunds and one-star reviews.
- Keep the source prompts, seeds, and model names in an
  `assets/generated/MANIFEST.json` so any image can be reproduced or audited.
- Mark AI-generated assets in the internal manifest even when not required
  publicly. It protects the business if a customer disputes a portion size.
- Never generate images containing recognisable real people, competitor
  branding, or trademarked packaging.

> Related: `comfyui-image-generation` (local GPU backend + CLI),
> `fal-ai-media` (hosted backend),
> `neuromarketing-priming` (§1 color/steam/scale — why these triggers work),
> `conversion-psychology` (§4 photos → +25–30% orders),
> `ui-stack-excellence` (§6 image performance gates).
