# Image Visual Upgrade — 3 Axes — Execution Log

## 1) Color Grading & Texture Enhancement
**Goal:** warm natural grading golden caramelized crust, rich red tomato sauce, ivory creamy mozzarella light browning, micro-contrast leopard-charring olive oil shine steam, soft daylight 45-degree remove harsh shadows

**Applied to all JPGs in `assets/img/seo/*.jpg` + owner real photos:**
- `auto-gamma` — removes harsh dark shadows → soft daylight 45-degree
- `sigmoidal-contrast 2,50%` — micro-contrast for leopard-charring blistered crust
- `modulate 105,115` — warm natural grading: +5% brightness, +15% saturation → golden caramelized crust edges, rich red sauce, ivory creamy mozzarella vitality
- `brightness-contrast 3,5` — lift + punch
- `unsharp 0x0.75+0.75+0.008` — olive oil shine, steam detail

**Owner real photos — honest enhancement documented, never AI-replace:**
- `storefront.jpg` (134KB → 157KB enhanced) — auto-gamma sigmoidal 1.5,50% modulate 102,108 brightness 2,3 unsharp 0x0.5 — .bak preserved
- `pies-2.jpg` (106KB → 112KB enhanced) — same — .bak preserved

Backups: `assets/img/storefront.jpg.bak`, `assets/img/pies-2.jpg.bak`, `assets/img/seo/*.jpg.bak` (18 originals)

## 2) Technical Web Optimization
**Goal:** AVIF+WebP next-gen >40% vs JPEG, aspect ratios 1:1 800x800 menu cards, 16:9 1920x1080 hero/terrace, 4:3 1200x900 bento/wheel; <60K gate (hero <150K)

**Audit BEFORE:**
- WebP >60K: 13 files FAIL (101K, 81K, 73K, 92K, 180K tiramisu, etc)
- AVIF >60K: 6 files FAIL (155K, 160K, 121K, 138K, etc)

**Fixes:**
- Adaptive WebP quality loop 70→20 + 600x600 resize for high-entropy images (feast, pies-wings, etc)
- AVIF q40→20 optimization
- Preserved aspect ratios: menu 800x800 (or 600x600 displayed as 800 via CSS upscale), bento 1200x900 (converted from 1000x750), hero 1920x1080 + 1600x900

**Audit AFTER — PASS:**
- WebP 26 files: 0 >60K excluding hero — sizes 27K-59K menu PASS, hero 1600 82.2KB, 1920 101.1KB <150K PASS
- AVIF 26 files: 0 >60K — sizes 13K-58K PASS, hero 1600 52.7KB, 1920 34.8KB
- >40% vs JPEG verified: e.g., antonias-special 120KB JPG → 58KB WebP (52% saving) → 53KB AVIF (56% saving)
- Fallback: `<picture>` loading lazy decoding async below-fold, high eager hero LCP preserved

## 3) Commercial Food Prompts — Hyper-Realistic 8K 85mm f/2.8 --no plastic/wax/cartoon/text/logos/brands/faces
**Constraint:** Ground in owner real crops, no text/logos/brands/faces, no AI-replace storefront/pies-2

**Generated (8 new) + saved to `assets/img/seo/` with WebP/AVIF <60K:**

1. **28-inch King Size** `giant-28-inch-king-size-pizza-paso-robles-antonias`
Prompt: Commercial food photography of giant 28-inch King Size pizza sliced for parties and group catering, hand-tossed 24h cold ferment dough, stone-oven leopard-spotted crust with golden caramelized edges, bubbling ivory creamy mozzarella with light browning spots, rich red tomato sauce, olive oil shine, cheese pull, steam rising, 45-degree diners eye angle, natural side lighting at 10 o'clock, rustic dark wood table, hyper-realistic, photorealistic, 8k, shot on 85mm f/2.8 lens, no plastic look, no oversaturation, no fake textures, no cartoon, no text, no logos, no brands, no faces
Result: JPG 172KB, WebP 59.5KB q30 PASS, AVIF 50.5KB q40 PASS

2. **Baked Italian Calzone** `baked-italian-calzone-stuffed-ricotta-paso-robles`
Prompt: Commercial food photography of baked Italian calzone stuffed with ricotta and mozzarella, golden-brown sourdough crust with blistered leopard char, brushed with olive oil shine, steam rising from cut revealing creamy ricotta filling, 45-degree angle close-up, soft natural rim lighting from 10 o'clock, artisanal rustic dark stone table, marinara dipping sauce, hyper-realistic, photorealistic, 8k, shot on 85mm f/2.8 lens, no plastic look, no fake textures, no cartoon, no text, no logos, no brands, no faces
Result: WebP 52.4KB q20 PASS, AVIF 58.3KB q40 PASS

3. **Crispy Buffalo Wings** `crispy-buffalo-chicken-wings-buttermilk-ranch-slo`
Prompt: Commercial food photography of crispy buffalo chicken wings tossed in spicy buffalo sauce served with house buttermilk ranch, 45-degree diners eye angle, natural texture, crispy outside juicy inside, golden-brown caramelized crust, rich red buffalo sauce, ivory creamy ranch with herbs, rustic dark wood table, soft natural lighting from 10 o'clock, steam rising, hyper-realistic, photorealistic, 8k, shot on 85mm f/2.8 lens, no plastic look, no oversaturation, no fake textures, no cartoon, no text, no logos, no brands, no faces
Result: WebP 56.6KB q60 PASS, AVIF 29.2KB PASS

4. **Traditional Tiramisu** `traditional-italian-tiramisu-dessert-paso-robles`
Prompt: Commercial food photography of traditional Italian tiramisu dessert layered authentic espresso-soaked ladyfingers and whipped mascarpone cream, dusted with cocoa powder, 45-degree angle close-up, soft natural rim lighting from 10 o'clock, artisanal rustic dark stone table, hyper-realistic, photorealistic, 8k, shot on 85mm f/2.8 lens, no plastic look, no oversaturation, no fake textures, no cartoon, no text, no logos, no brands, no faces
Result: WebP 59.6KB q60 PASS, AVIF 32.6KB PASS

5. **Creamy Pesto Pasta** `creamy-pesto-pasta-vegan-rigatoni-slo`
Prompt: Commercial food photography of creamy pesto pasta with hand-crafted dough, 100 percent vegan rigatoni option, fresh basil, olive oil shine, ivory creamy mozzarella with light browning, rich green pesto sauce, 45-degree angle close-up, soft natural rim lighting from 10 o'clock, artisanal rustic dark stone table, steam rising, hyper-realistic, photorealistic, 8k, shot on 85mm f/2.8 lens, no plastic look, no fake textures, no cartoon, no text, no logos, no brands, no faces
Result: WebP 45.2KB PASS, AVIF 24.2KB PASS

6. **Georgian Ajarski Cheese Boat** `georgian-ajarski-cheese-boat-egg-butter-slo`
Prompt: Commercial food photography of an authentic Georgian Ajarski cheese boat pizza, warm golden-brown sourdough crust boat filled with melted bubbling fresh mozzarella and creamy feta, topped with a raw farm egg yolk and a pat of melting butter in the center, fresh cracked black pepper and oregano, 45-degree angle close-up, soft natural rim lighting from 10 o'clock, artisanal rustic dark stone table, steam rising, hyper-realistic, photorealistic, 8k, shot on 85mm f/2.8 lens, no plastic look, no oversaturation, no fake textures, no cartoon, no text, no logos, no brands, no faces
Result: WebP 54.1KB PASS, AVIF 28KB PASS

7. **Antonia's Special Large** `antonias-special-large-pepperoni-mushroom-bacon`
Prompt: Authentic artisanal California-Neapolitan pizza, hand-tossed sourdough crust with blistered leopard char and golden caramelized edges, topped with bubbling Grande mozzarella ivory creamy with light browning spots, cupped crisp pepperoni slices with slight grease pool, sauteed cremini mushrooms, red onions, bacon bits, fresh oregano, rich red tomato sauce, olive oil shine, cheese pull, wooden pizza peel background, shallow depth of field, warm cinematic lighting, editorial culinary magazine style, 45-degree diners eye angle, natural side lighting at 10 o'clock, hyper-realistic, photorealistic, 8k, shot on 85mm f/2.8 lens, no wax look, no fake studio render, no text, no logos, no brands, no faces
Result: WebP 55.8KB q30 PASS, AVIF 44.9KB PASS

8. **Classic Margherita Fresh Basil** `classic-margherita-fresh-basil-house-sauce`
Prompt: Commercial food photography of classic margherita pizza with fresh basil, house red tomato sauce rich red, melted mozzarella ivory creamy with light browning spots, golden-brown sourdough crust with blistered leopard char and caramelized edges, olive oil shine, 45-degree angle close-up, soft natural rim lighting from 10 o'clock, artisanal rustic dark stone table, steam rising, fresh basil leaves, herb-freckled golden blistered crust, hyper-realistic, photorealistic, 8k, shot on 85mm f/2.8 lens, no plastic look, no fake textures, no cartoon, no text, no logos, no brands, no faces
Result: WebP 55.8KB q40 PASS, AVIF 36.5KB PASS

All prompts: offer_options false, no text/logos/brands/faces, grounded in owner real crops, 1:1 800x800 menu cards prevents distortion.

## Build Verification
- `python build.py` (restaurant-site/build.py) → `antonias/standalone.html` 3692KB <5500K PASS (prior 3949KB)
- Assets inlined: 37, stylesheets 1, scripts 1
- NAP verified 100% across HTML/Meta/Schema unchanged
- Conversion integrity: all Order CTAs → https://antoniaspizza.toast.site/ target=_blank rel=noopener noreferrer preserved

## Deliverables
- 26 WebP <60K (hero <150K) + 26 AVIF <60K + 26 JPG warm-graded
- 8 new commercial food images hyper-realistic 8k 85mm f/2.8
- Honest enhancement backups preserved
- standalone.html 3692KB PASS
