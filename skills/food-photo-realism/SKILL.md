---
name: food-photo-realism
description: Hyper-realistic food photography generation for restaurant menus. Prompt recipes, lens/lighting setups, realism QA checklist and batch workflows that make AI-generated dishes indistinguishable from real editorial food photos. Use when generating or reviewing menu dish images, hero shots, or any food imagery that must look 100% real.
metadata:
  origin: ECC
---

# Food Photo Realism

Turn dish names into photographs that read as real editorial food photography — not renders, not illustrations.

## When to Activate

- Generating dish images for a menu, delivery app, or marketing asset.
- Reviewing generated food images for "AI tells" before shipping.
- Building a repeatable photo pipeline for many dishes at once.

## Core Recipe (always include all six blocks)

1. **Subject truth** — name the exact dish, its components, cook state and imperfections
   ("cup-and-char pepperoni holding pools of rendered grease", "leopard-spotted charred cornicione").
2. **Surface & vessel** — slate board, worn metal pan, cast iron, dark ceramic; crumbs, flour dust, sauce smears.
3. **Optics** — `full-frame DSLR, 90mm macro, f/2.8, ISO 100` (macro for close-ups, 85mm f/2.0 for hero shots).
4. **Light** — one natural side window light with soft diffusion; dark moody background with warm bokeh; optional faint steam.
5. **Color truth** — "true-to-life colors", realistic oil/grease sheen, no oversaturation.
6. **Negatives** — `No text, no watermark, no logos, no people, no illustration, no CGI look, no plastic shine.`

Angle default: 45° for plates/pizzas, 0–15° (table level) for stacked burgers and cheese pulls.

## Prompt Template

```
Hyper-realistic professional food photography for a {venue} menu: {dish} with {components + cook state},
on {vessel} over {surface}. Shot on a full-frame DSLR with a {lens} at {aperture}, ISO 100,
natural side window light with soft diffusion, dark moody background with warm bokeh, subtle steam,
{texture truths}, true-to-life colors, shallow depth of field, {angle}, editorial quality, {aspect}.
No text, no watermark, no logos, no people, no illustration, no CGI look.
```

## Realism QA Checklist (inspect every image)

- [ ] No invented text/letters on plates, walls, packaging.
- [ ] Anatomy of food correct: count of slices/wings/sticks matches the menu copy.
- [ ] Melt/char/steam physically plausible (cheese pull attaches to both halves).
- [ ] Shadows consistent with a single light source; no floating objects.
- [ ] Surface texture visible (crumb, blistering, condensation) — smooth = fake.
- [ ] Colors plausible under warm restaurant light (no neon greens/reds).
- [ ] Aspect ratio matches the UI slot (4:3 cards, 3:2 hero, 1:1 thumbnails).

Fail any item → regenerate with a corrected prompt that names the defect ("exactly 6 sticks", "no lettering anywhere").

## Batch Workflow

1. Freeze one lighting/venue sentence for the whole menu (visual consistency).
2. Generate in parallel batches (respect per-turn image caps; queue the remainder).
3. Name files by item id: `img/{item-id}.jpg` so menu data and assets bind 1:1.
4. Run the QA checklist; regenerate failures only.
5. Wire images into menu data (`item.img`) and verify with an image-existence probe in the dashboard.

## Anti-Patterns

- "Delicious beautiful tasty" adjectives → cartoonish output. Describe physics, not feelings.
- Top-down flat lay for every dish → monotonous menu; vary 45° and table-level.
- Studio white background for a moody brand → breaks the menu's visual identity.
- One prompt for a combo platter → component soup; split into dishes.
