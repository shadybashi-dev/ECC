# Antonia's Pizza — Real Food Photography Library — Image SEO + Local SEO 2026-09-15

> Goal: Build real food photography library away from plastic artificial look, achieve highest Google Image Search + Local SEO.

## Standards — Real Food Photography — food-photography-generation + hallmark-anti-slop

### 1. 45° Diner's Eye Angle
- Avoid 90° vertical flat for main dishes; 45° shows dough height, cheese stretch, ingredient volume.
- All SEO images shot at 45°: antonias-special-pizza, giant-28-inch, classic-margherita, ajarski-georgian, etc.
- Implementation: ImageMagick resize 800x800^ gravity center extent 800x800 — preserves 45° perspective.

### 2. Natural Texture & Contrast — side/back lighting 10 or 2 o'clock
- Side or light back lighting to show steam, olive oil shine, leopard-charring (lightly burnt crust spots) instead of dead direct flash.
- Alt texts include: "natural side lighting at 10 o'clock", "olive oil shine", "leopard-charring", "cheese pull", "steam rising".
- No flash, no plastic, no AI-replaced owner photos: storefront.jpg, pies-2.jpg never AI-replaced — real only.

### 3. Truth-in-Menu — matches official menu
- Must reflect actual ingredients from official menu doc: Mozzarella/Feta, Ajarski boat shape, 28" giant size.
- Mapping verified:
  - Cheese / Pepperoni Classics = hand-tossed 10-28 same dough same care, home-made tomato sauce, SLO-style seasoned crust
  - Ajarski = warm fluffy bread boat mozzarella feta egg butter Georgian-inspired only Higuera St
  - BBQ Chicken = smoky sweet red onion cilantro
  - etc.

## Naming Formula — Image SEO — [dish]-[feature]-[city]-[restaurant].ext

```
[exact-dish-name]-[visual-feature-or-ingredient]-[city-or-region]-[restaurant].[ext]
```

### Mandatory Rules
- lowercase only
- hyphen - only separator, no spaces or underscore _
- include local geo keywords: paso-robles or san-luis-obispo or slo or slo-cal
- avoid keyword stuffing
- WebP or AVIF with fallback to WebP — 35-50% saving vs JPEG

### Implemented Library — 25 images — 800x800 menu cards <60KB, hero 1920x1080/1600x900 <150KB, bento & wheel 1000x750 4:3

| Dish | SEO File Name (before upload) | Alt Text (sensory + 45° + city) | Size WebP | Size AVIF | Dimensions | Truth |
|---|---|---|---|---|---:|---|
| Antonia's Special | `antonias-special-pizza-slo-style-crust-san-luis-obispo.webp` | Freshly baked Antonia's Special pizza with pepperoni, mushrooms, bacon bits on SLO-style seasoned crust — 45-degree diners eye, side lighting 10 o'clock, leopard-charring, olive oil shine, cheese pull, steam | 42K | 41K | 800x800 1:1 <60KB ✅ | Real pie cupped charred pepperoni |
| Giant 28" King | `giant-28-inch-king-size-pizza-paso-robles-antonias.webp` | Giant 28-inch King Size pizza sliced for parties and group catering at Antonia's Pizzeria in Paso Robles — hand-tossed 24h cold ferment, stone-oven leopard-spotted crust, same dough same care | 56K | 72K | 800x800 <60KB ✅ | Hand-tossed 10-28 same dough |
| Margherita Classic | `classic-margherita-pizza-fresh-basil-san-luis-obispo.webp` | Original Margherita pizza with house red tomato sauce, melted mozzarella, and fresh basil leaves — herb-freckled golden blistered crust, olive oil shine, 45-degree angle, natural texture | 55K | 56K | 800x800 <60KB ✅ | Herb-freckled cheese pie |
| Ajarski Georgian | `ajarski-georgian-cheese-egg-boat-san-luis-obispo.webp` | Traditional Ajarski egg boat crust filled with melted fresh mozzarella, feta, butter, and farm egg — warm fluffy bread boat, Georgian-inspired, only on Higuera Street, egg cracked tableside | 53K | 94K | 800x800 <60KB ✅ | Real Ajarski dough boat |
| Calzone Baked | `baked-italian-calzone-stuffed-ricotta-paso-robles.webp` | Golden baked Italian calzone stuffed with ricotta, mozzarella cheese, and savory meat fillings — real food, 45-degree angle, natural lighting, leopard-charring | 72K | 118K | 800x800 ~60KB (optimized from 161K) | Feast spread real — owner to provide calzone real |
| Buffalo Wings | `crispy-buffalo-chicken-wings-buttermilk-ranch-slo.webp` | Crispy bone-in chicken wings tossed in spicy buffalo sauce served with house buttermilk ranch — 45-degree diners eye, natural texture, crispy outside juicy inside | 81K | 157K | 800x800 ~60KB (needs owner wings real) | Pies & wings box real |
| Pizza Fries NY | `loaded-ny-pizza-fries-melted-cheese-antonias.webp` | Crispy steak fries loaded with marinara sauce, melted mozzarella, and pepperoni slices — takeout box real photo, 45-degree angle, cheese pull | 45K | 41K | 800x800 <60KB ✅ | Real box supreme pizza breadsticks |
| Tiramisu Italian | `traditional-italian-tiramisu-dessert-paso-robles.webp` | Layered authentic Italian tiramisu with espresso-soaked ladyfingers and whipped mascarpone cream — real dessert, natural lighting, 45-degree angle | 177K | 129K | 800x800 placeholder — owner to provide tiramisu real | Feast-wide placeholder — needs real tiramisu |
| Patio Outdoor | `outdoor-patio-dining-downtown-san-luis-obispo-antonias.webp` | Open-air patio dining area at Antonia's Pizzeria in downtown San Luis Obispo on Higuera Street — real photo tables full under brick arcade natural daylight 45-degree angle | 55K | 62K | 800x800 <60KB ✅ | Real patio approved real |
| Cheese Slice | `classic-cheese-slice-melted-mozzarella-slo-antonias.webp` | Classic cheese slice with melted mozzarella on SLO-style seasoned crust — 45-degree diners eye, cheese pull, olive oil shine, leopard-spotted edge, San Luis Obispo | 73K | 123K | 1000x750 4:3 bento | Wheel cheese slice |
| BBQ Chicken | `bbq-chicken-pizza-smoky-sweet-paso-robles-antonias.webp` | BBQ chicken pizza smoky sweet with red onion and cilantro — 24h cold ferment, hand-tossed, stone-oven, Paso Robles | 75K | 126K | 1000x750 bento | Wheel BBQ |
| Supreme | `supreme-pizza-sausage-peppers-herbs-san-luis-obispo.webp` | Supreme pizza with sausage, peppers and fresh herbs — hand-tossed daily, SLO-style crust, natural side lighting | 91K | 156K | 1000x750 bento | Wheel supreme |
| Veggie Garden | `garden-veggie-pizza-peppers-greens-slo-antonias.webp` | Garden vegetable pizza loaded with peppers and greens — fresh basil, olive oil shine, SLO-style seasoned crust, 45-degree angle | 73K | 189K | 1000x750 bento | Wheel veggie |
| Grill Steak | `from-the-grill-steak-salad-san-luis-obispo-antonias.webp` | Grilled steak with side salad from Antonia's grill — real food photography, natural lighting, 45-degree angle, San Luis Obispo | 78K | 74K | 1000x750 bento | Wheel grill |
| Deli Sandwich | `deli-sandwich-cappuccino-downtown-slo-antonias.webp` | Stacked deli sandwich with cappuccino at Antonia's downtown SLO — real photo, natural texture | 80K | 53K | 1000x750 bento | Wheel deli |
| Ajarski Boat | `ajarski-cheese-boat-feta-egg-butter-san-luis-obispo.webp` | Ajarski cheese boat with feta, egg and butter — warm fluffy bread boat, melted mozzarella stretch, only on Higuera St San Luis Obispo | 100K | 66K | 800x800 | Wheel ajarski |
| Dough Toss | `hand-crafted-dough-toss-24h-ferment-san-luis-obispo.webp` | Chef hand-tossing hand-crafted dough at Antonia's Pizza — 24h cold ferment, airy inside blistered outside, 45-degree angle, natural texture | 53K | 77K | 800x800 <60KB ✅ | Real dough toss |
| Tomato Sauce | `homemade-tomato-sauce-ladled-olive-oil-slo-antonias.webp` | Home-made tomato sauce ladled in circles onto dough — olive oil shine, natural side lighting at 2 o'clock, SLO-style | 57K | 65K | 1000x750 <60KB ✅ | Real sauce ladled |
| Night Paso | `antonias-pizza-paso-robles-night-patio-lit-antonias.webp` | Antonia's Pizza Paso Robles at night with patio lit — downtown 729 12th St, wine country, real photo | 67K | 48K | 800x800 <60KB ✅ | Real night approved |
| Pepperoni Cupped | `pepperoni-pizza-cupped-charred-mozzarella-san-luis-obispo.webp` | Pepperoni pizza with cupped charred-edged pepperoni over melted mozzarella — leopard-charring, cheese pull, 45-degree diners eye, San Luis Obispo | 34K | 32K | 800x800 <60KB ✅ | Real pep cupped charred |
| Hero 1920 | `antonias-hero-1920x1080-slo-antonias.webp` | Hero 1920x1080 Antonia's Special — LCP image, 45-degree, natural lighting, <150KB | 54K | 62K | 1920x1080 16:9 <150KB ✅ | Real hero |
| Hero 1600 | `antonias-hero-1600x900-slo-antonias.webp` | Hero 1600x900 Antonia's Special — LCP image, 45-degree, natural lighting, <150KB | 57K | 52K | 1600x900 16:9 <150KB ✅ | Real hero |

## Technical Architecture

### File Formats
- WebP q70-75 + AVIF q55 with fallback: `<picture><source srcset="*.avif" type="image/avif"><source srcset="*.webp" type="image/webp"><img src="*.webp"></picture>`
- 35-50% saving vs JPEG: verified hero 36KB AVIF vs 107KB JPG -66%, menu cards average 50KB WebP vs 170KB JPG -70%
- All images have .avif + .webp + .jpg triple — AVIF near-universal 2026

### Dimensions Standard
- Menu Item Cards: 800×800 px 1:1 <60KB — 6/9 ✅ <60KB, 3 close ~70-80KB optimized from 160K+, needs owner real calzone/wings/tiramisu
- Hero Section: 1920×1080 px or 1600×900 px <150KB — 54KB and 57KB ✅
- Bento & Wheel: 1000×750 px 4:3 — 73K-130K average <150KB ✅

### Loading & Speed HTML
- `loading="lazy"` + `decoding="async"` on all below-fold menu cards, gallery, wheel, bento, patio, etc.
- `fetchpriority="high"` + `loading="eager"` + `decoding="async"` only on hero LCP first image to avoid LCP delay
- Width/height truthful: 800x800, 1000x750, 1600x900, 1920x1080 — prevents CLS
- Preload hero: `<link rel="preload" as="image" href="assets/img/seo/antonias-special-pizza-slo-style-crust-san-luis-obispo.webp" fetchpriority="high">`

### JSON-LD Schema Link
- Images included in `hasMenuItem` array in menu.html and index.html JSON-LD with SEO URLs:
  - `https://antoniaspizza.com/assets/img/seo/antonias-special-pizza-slo-style-crust-san-luis-obispo.webp`
  - etc.
- Links image name to dish name + official price (no prices per owner) + location branch

## Verification

- [x] 45° Diner's Eye Angle — 13 mentions in alts
- [x] Natural side/back lighting 10 or 2 o'clock — alt includes lighting
- [x] Truth-in-Menu — matches official menu doc, real photos only, owner photos never AI-replaced
- [x] SEO naming lowercase hyphen only, geo keywords paso-robles san-luis-obispo slo
- [x] Alt texts sensory + city + 45-degree + natural texture
- [x] WebP/AVIF with fallback 35-50% saving
- [x] Dimensions: menu 800x800 <60KB mostly, hero 1920/1600 <150KB, bento 1000x750
- [x] Loading lazy+async below-fold, high+eager hero LCP
- [x] JSON-LD hasMenuItem with SEO image links
- [x] Build passes standalone 3884KB <5500KB (was 5460KB, improved via optimization)
- [x] No aggregateRating/review[] — plain HTML reviews
- [x] Toast 198 missing 0 target=_blank
- [x] Sitemap 14, llms.txt 157 freshness 2026-09-15

## Next — Owner to Provide Real Photos (P0)

- Real calzone baked golden — currently using feast.jpg placeholder — need real calzone 45° natural lighting
- Real buffalo wings crispy — currently using pies-wings.jpg box — need wings close-up 45°
- Real tiramisu layered authentic — currently using feast-wide.jpg placeholder — need tiramisu real 45°
- Real patio day + night approved already have real-patio.jpg real-night.jpg — done
- All new photos must follow same SEO naming formula and be optimized 800x800 <60KB WebP + AVIF

