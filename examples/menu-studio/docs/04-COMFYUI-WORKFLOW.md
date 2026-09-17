# ComfyUI / SDXL Photoreal Workflow — EMBER 46
> صور تبدو تصوير حقيقي 100% — لا كرتون، لا نص، لا شعار، لا أيدي

## 1) Toolchain المقترح

**Base:** ComfyUI (latest) + SDXL 1.0
- **Checkpoint فوتوغرافي قوي (اختر واحد):**
  - `RealVisXL V4` أو `Juggernaut XL v9` أو `DreamShaper XL` — كلها ممتازة للأكل
  - أو `SDXL Base 1.0 + Refiner` إذا تريد تحكم أدق
- **VAE:** `sdxl_vae.safetensors`
- **Upscaler:** `4x-Ultrasharp` أو `ESRGAN 4x`
- **Nodes الأساسية:**
  - `CheckpointLoaderSimple`
  - `CLIPTextEncode` (Prompt / Negative)
  - `KSampler` (DPM++ 2M Karras)
  - `VAEDecode` → `ImageSave`
  - `Ultimate SD Upscale` (tile 512, denoise 0.15)
  - `IPAdapter` (اختياري: لتثبيت ستايل الخشب/الإضاءة من صورة مرجعية)
  - `ControlNet` (Depth أو Lineart) — لتثبيت شكل البيتزا الدائري
  - `ADetailer` — لإصلاح جبنة/بيبروني مشوهة
  - `Color Match` — لتوحيد ألوان القائمة

## 2) Workflow خطوة بخطوة (وصفّي — بدون تعقيد)

```
1. Load Checkpoint (RealVisXL) + VAE
2. Prompt (Positive) → CLIP
3. Negative Prompt → CLIP
4. Empty Latent 1024×1024 (أو 1536×1536 للـ 3:4)
5. KSampler: Steps 35, CFG 6.0, Sampler DPM++ 2M Karras, Scheduler Karras
6. VAEDecode → Preview
7. Ultimate SD Upscale → 2048×2048 (scale 2x, denoise 0.2)
8. Save: JPG 92% quality, <2MB
9. Export نسخة 16:9: Crop center 2048×1152 (من المربع) — هذه التي تُرفع لـ DoorDash
```

**لـ IPAdapter (تثبيت الهوية):**
- ارفع صورة مرجعية واحدة (بيتزا ناجحة بإضاءة EMBER 46) إلى IPAdapter بـ weight 0.35 — سيحافظ على نفس الخشب والإضاءة لكل القائمة.

## 3) Prompt Template الثابت (استخدمه لكل عنصر)

**Positive Template:**
```
ultra realistic food photography of {PIZZA_NAME}, {TOPPINGS_DETAIL}, melted mozzarella with natural oil sheen, crispy blistered crust with light char spots, on rustic dark reclaimed oak table, minimal props, shallow depth of field, 3/4 top-down angle about 35 degrees, subtle dutch angle 8 degrees, 24mm lens look, softbox lighting + natural window bounce, high detail, true-to-life colors, professional editorial food photo, no people, no text, no logos, clean background, appetizing, DoorDash hero image, centered composition 60% frame fill, 16:9 landscape
```

**Negative Prompt (ثابت):**
```
illustration, cartoon, CGI, 3d render, plastic cheese, fake texture, oversaturated, excessive stylization, watermark, logo, text, typography, border, frame, hands, face, human, messy background, lowres, blur, noise, deformed food, extra toppings not requested, duplicate toppings, floating cheese, unrealistic char
```

**Settings كنقطة بداية:**
- Sampler: DPM++ 2M Karras
- Steps: 30–40
- CFG: 5–7 (6 مثالي)
- Resolution: 1536×1536 → Upscale to 2048×2048
- Seed: random per image, احفظه في Manifest
- Denoise (upscale): 0.15–0.25

## 4) مواصفات الإخراج

- **DoorDash Item:** 2048×1152 (16:9) JPG <2MB — الملف الرئيسي
- **Backup Square:** 2048×2048 (1:1) — للـ center crop الآمن
- **خلفية:** خشب غامق / رخام فاتح / صندوق بيتزا غير مُعلّم (بدون شعار)
- **إضاءة:** softbox 45° + window bounce — ظل واحد ناعم فقط
- **ممنوع:** شعارات، نصوص، أيدي، وجوه، عناصر مضللة

## 5) زوايا "غريبة لكن ملفتة" — بدّل سطر الزاوية فقط

- **Dutch 8° (الافتراضي):** `subtle dutch angle 8 degrees, 3/4 top angle 35 degrees`
- **Shot-through-box:** `shot from inside an open pizza box looking out, dramatic perspective, pizza in foreground, crisp focus on toppings, box edges blurred`
- **Macro cheese pull:** `extreme close-up macro of a single slice being lifted, cheese stretch strings, shallow depth of field, 24mm macro`
- استخدم macro فقط إذا تقدر تطبخ cheese pull حقيقي مشابه — لا تعد بشيء لا تبيعه.

## 6) Shot List كامل — EMBER 46 (18 عنصر)

| File | الزاوية | Props | ملاحظات |
|------|---------|-------|---------|
| `pizza-truffle-shuffle.jpg` | 3/4 35° + dutch 8° | oak board, arugula sprinkle, truffle shavings | Anchor — أغلى بيتزا، إضاءة فاخرة |
| `pizza-cup-char-46.jpg` | 3/4 35° + dutch 8° | cup pepperoni pools, hot honey drizzle visible | Best Seller — grease pools واضحة |
| `pizza-margherita.jpg` | 3/4 35° | basil 3 leaves, EVOO sheen | Minimal — نظافة |
| `pizza-quattro-formaggi.jpg` | shot-through-box | garlic cream base, 4 cheeses bubbling | Box angle غريب |
| `pizza-bbq-chicken.jpg` | 3/4 35° + dutch 8° | red onion, cilantro |  |
| `pizza-valley-veggie.jpg` | overhead 90° flat lay | charred veg, arugula post-bake | Flat lay يبرز الألوان |
| `pizza-meat-supreme.jpg` | low 20° worm eye | 4 meats piled | Dramatic meat pile |
| `pizza-calabrian-heat.jpg` | macro cheese pull | chili oil dots, honey drizzle | Spicy hero |
| `mozzarella-sticks.jpg` | 45° | 6 sticks, marinara ramekin, crumb visible | Count = 6 |
| `buffalo-wings.jpg` | 35° dutch | 8 wings, ranch, celery, cast iron | Count = 8 — DONE |
| `garlic-bread.jpg` | 35° | ciabatta, parsley, cheese pull |  |
| `loaded-fries.jpg` | 35° | cheddar, scallions, ranch drizzle |  |
| `caesar-salad.jpg` | 45° | croutons, parmesan shave |  |
| `caprese-salad.jpg` | overhead | balsamic glaze dots |  |
| `cheesecake.jpg` | 35° | berry coulis, biscuit base |  |
| `lava-brownie.jpg` | macro | molten center, gelato separate cup |  |
| `mint-lemonade.jpg` | 0° straight-on | mint leaves, condensation | Drink hero |
| `cold-brew.jpg` | 0° | ice, condensation |  |
| `header-ember46.jpg` | 20° wide | 3 pizzas in oven bokeh | DoorDash header |

## 7) Image Manifest (احفظه مع كل توليد)

```csv
filename,width,height,prompt_seed,angle,notes
pizza-cup-char-46.jpg,2048,1152,38291,35d+dutch8,16:9 crop from 2048sq
...
```

> **نصيحة أخيرة:** ولّد دفعة واحدة بـ seed مختلف لكل صورة، ثم اختر الأفضل. ثبّت الـ seed الفائز في Manifest لإعادة التوليد لاحقاً.
