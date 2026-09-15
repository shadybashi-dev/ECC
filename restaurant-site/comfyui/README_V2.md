# ComfyUI Integration for Antonia's Pizzeria — Agent-to-ComfyUI Architecture

> **الهدف:** تشغيل وتوجيه أداة ComfyUI عبر الوكيل الذكي لتوليد وتطوير صور أطعمة سينمائية واقعية لمطعم Antonia's Pizzeria & Italian Kitchen

---

## أولاً: معمارية ربط الوكيل بـ ComfyUI

يقوم الوكيل بالتواصل مع خادم ComfyUI المحلي عبر بروتوكول الـ API (المنفذ الافتراضي `http://127.0.0.1:8188`)، بالاعتماد على أدوات مفتوحة مثل [comfyui-agent-skill](https://github.com/MieMieeeee/comfyui-agent-skill) و [comfyui-mcp](https://github.com/artokun/comfyui-mcp):

```
┌──────────────────────────────┐
│  الوكيل الذكي (The Agent)   │
│  (يقرأ بيانات القائمة والـ SEO)│
│  - slots_v2.json             │
│  - llms.txt / menu data      │
│  - SEO naming formula        │
└──────────────┬───────────────┘
               │ 1. حقن البرومبت + الأبعاد + الـ Seed في workflow.json
               │    - Positive: authentic Georgian Ajarski...
               │    - Negative: cartoon, plastic, wax...
               │    - Width/Height: 800x800 menu, 1920x1080 hero
               │    - Seed: random or fixed for reproducibility
               ▼
┌──────────────────────────────┐
│       ComfyUI REST API       │  <-- http://127.0.0.1:8188
│   (FLUX.1-dev / SDXL Nodes)  │
│   POST /prompt {prompt, client_id}
│   GET /history/{prompt_id}
│   GET /view?filename=...
└──────────────┬───────────────┘
               │ 2. معالجة العقد:
               │    Checkpoint -> LoRA -> KSampler -> Upscale
               ▼
┌──────────────────────────────┐
│      مجلد الصور المعتمدة     │
│    (assets/img/seo/...)      │
│    - SEO naming: [dish]-[feature]-[city]-[restaurant].ext
│    - WebP <60K hero <150K
│    - AVIF primary, WebP secondary, JPG fallback
│    - Color grading: warm natural golden caramelized
└──────────────────────────────┘
```

### سكريبت التشغيل المباشر للوكيل

```python
# scripts/comfy_food_gen.py — Python Automation Script
import json, urllib.request, uuid, time

COMFY_HOST = "http://127.0.0.1:8188"

def queue_prompt(workflow_api_json):
    p = {"prompt": workflow_api_json}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request(f"{COMFY_HOST}/prompt", data=data,
                                 headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            print(f"✅ Job Queued! Prompt ID: {res.get('prompt_id')}")
            return res
    except Exception as e:
        print(f"❌ Could not connect to ComfyUI at {COMFY_HOST}: {e}")
        return None
```

---

## ثانياً: عقد ومكونات تدفق العمل لتصوير الطعام (ComfyUI Nodes Architecture)

للحصول على صور واقعية تماماً وتجنب المظهر البلاستيكي المصطنع:

### 1. النموذج الأساسي (Checkpoint Loader)
- **FLUX.1-dev** (`flux1-dev.safetensors`) — مفضل، فهم دقيق لفيزياء الضوء وانعكاسات السوائل والزيوت والمخبوزات
- **بديل:** Juggernaut XL v9 (`juggernautXL_v9Rdphoto2Lightning.safetensors`) — ممتاز للأجهزة ذات الذاكرة الأقل (6-8GB VRAM)

### 2. عقدة موازنة التفاصيل (Food LoRA Loader)
- **Commercial Food Styling LoRA** (`commercial-food-styling-v2.safetensors`)
- وزن خفيف `0.65 - 0.75` لإبراز قرمشة أطراف العجين وتمدد الجبن
- Node: `LoraLoader` → strength_model 0.70, strength_clip 0.70

### 3. عقدة الكاميرا والإضاءة (KSampler & Conditioning)
- **الخطوات (Steps):** 28 إلى 35 خطوة (32 مثالي)
- **مقياس التوجيه (CFG Scale):** 3.5 إلى 4.5 (4.0 مثالي — تماسك دون حرق ألوان)
- **المولد (Sampler):** `euler` + `simple` أو `dpmpp_2m_sde_gpu` + `karras`
- **Denoise:** 1.0 للجيل الأولي، 0.35 للـ upscale

### 4. عقدة رفع الدقة الفائقة (Ultimate SD Upscale)
- **نموذج التكبير:** `4x-UltraSharp.pth`
- **من 1024px إلى 4K** مع إبراز فقاعات العجين المتقمرة (Leopard-charring) وبخار الجبن الذائب
- **Tile:** 512x512, padding 32, blur 8, seam_fix_mode None
- **Node:** `UltimateSDUpscale` → upscale_by 2, steps 18, cfg 3.5, denoise 0.35

### Workflow JSON Structure (FLUX)

```json
{
  "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "flux1-dev.safetensors"}},
  "2": {"class_type": "LoraLoader", "inputs": {"model": ["1",0], "clip": ["1",1], "lora_name": "commercial-food-styling-v2.safetensors", "strength_model": 0.70}},
  "3": {"class_type": "CLIPTextEncode", "inputs": {"text": "<POSITIVE>", "clip": ["2",1]}},
  "4": {"class_type": "CLIPTextEncode", "inputs": {"text": "<NEGATIVE>", "clip": ["2",1]}},
  "5": {"class_type": "EmptyLatentImage", "inputs": {"width": 1024, "height": 1024}},
  "6": {"class_type": "KSampler", "inputs": {"seed": 42, "steps": 32, "cfg": 4.0, "sampler_name": "euler", "scheduler": "simple", "model": ["2",0], "positive": ["3",0], "negative": ["4",0], "latent_image": ["5",0]}},
  "7": {"class_type": "VAEDecode", "inputs": {"samples": ["6",0], "vae": ["1",2]}},
  "8": {"class_type": "UpscaleModelLoader", "inputs": {"model_name": "4x-UltraSharp.pth"}},
  "9": {"class_type": "UltimateSDUpscale", "inputs": {"image": ["7",0], "model": ["1",0], "positive": ["3",0], "negative": ["4",0], "vae": ["1",2], "upscale_by": 2, "upscale_model": ["8",0]}},
  "10": {"class_type": "SaveImage", "inputs": {"filename_prefix": "antonias-flux", "images": ["9",0]}}
}
```

---

## ثالثاً: برومبتات ComfyUI المخصصة لأصناف Antonia's الرسمية

### 1. قارب الأجارسكي (Ajarski Cheese Boat) — Star/Puzzle Only Higuera

**Positive Prompt (CLIPTextEncode):**
```
professional commercial food photography, authentic Georgian Ajarski cheese boat, thick warm golden-brown sourdough bread boat, filled with bubbling melted fresh mozzarella and authentic salty feta cheese, perfectly intact shiny raw farm egg yolk placed in center with melting slice of real butter, coarse sea salt, freshly cracked black peppercorns and oregano flakes, steam softly rising from hot cheese, 45-degree diner angle, soft directional morning window light from 10 o'clock, dark slate rustic table, shot on Sony A7R V 85mm f/2.8 lens, hyper-detailed texture, depth of field, appetizing, restaurant menu quality, 8k resolution, golden caramelized crust edges, ivory creamy mozzarella with light browning, leopard-charring blistered crust, olive oil shine
```

**Negative Prompt:**
```
cartoon, 3d render, plastic, fake cheese, wax food, oversaturated, artificial bread, deformed egg, watermark, blurry, low resolution, flat lighting, harsh flash, extra crusts, text, logo, branded bottles, marble studio kitchen
```

**SEO:** `georgian-ajarski-cheese-boat-egg-butter-slo` — 800x800 <60K

### 2. بيتزا أنتونيا الخاصة العملاقة (Antonia's Special Pizza) — Star Signature

**Positive Prompt:**
```
award-winning commercial pizza photography, fresh baked California-Neapolitan pizza, hand-tossed artisan sourdough crust with distinct leopard-char blisters golden caramelized edges, topped with hot melted Grande mozzarella cheese with slight golden-brown spots ivory creamy, crispy cup-and-char pepperoni curled with natural oil grease pool, sautéed sliced cremini mushrooms, sweet red onions, crispy bacon bits, sliced pepperoncini, wooden artisan pizza peel, scattered flour dusting on stone surface, warm cinematic backlight 45-degree diner angle, soft directional light from 10 o'clock, appetizing cheese stretch cheese pull, Michelin guide editorial style, 8k, rich red tomato sauce, olive oil shine, steam rising
```

**Negative Prompt:**
```
doll food, plastic pepperoni, uniform circle, flat texture, burnt crust, dull cheese, messy composition, drawing, sketch, oversaturated red, text, logo, branded packaging, people facing camera
```

**SEO:** `antonias-special-pizza-slo-style-crust-san-luis-obispo` — 800x800 <60K

### 3. 28-inch King Size — Star Party Price Anchor

```
commercial food photography of giant 28-inch King Size pizza sliced for parties and group catering, hand-tossed 24h cold ferment dough, stone-oven leopard-spotted crust with golden caramelized edges, bubbling ivory creamy mozzarella with light browning spots, rich red tomato sauce, olive oil shine, cheese pull, steam rising, 45-degree diners eye angle, natural side lighting at 10 o'clock, rustic dark wood table, hyper-realistic, photorealistic, 8k, shot on 85mm f/2.8 lens, 16 slices 615 sq in feeds 6-8 people party challenge
```

**SEO:** `giant-28-inch-king-size-pizza-paso-robles-antonias` — 800x800 <60K — feeds 6-8, +6.8% AOV anchor

### 4. باقي الأصناف (Calzone, Wings, Pasta, Tiramisu, BBQ, Supreme, Dough Toss, Sauce, Hero)

See `slots_v2.json` for full 13 slots with prompts, dimensions, CFG/steps, sampler.

---

## رابعاً: سكريبت التشغيل المباشر للوكيل — Python Automation

**الملف الرئيسي:** `scripts/comfy_food_gen.py` + `restaurant-site/comfyui/comfy_food_gen.py`

### طريقة التنفيذ المباشرة:

#### 1. تأكد من تشغيل خادم ComfyUI على جهازك

```bash
# Clone ComfyUI
git clone https://github.com/Comfy-Org/ComfyUI.git && cd ComfyUI
python -m venv venv && source venv/bin/activate  # أو venv\Scripts\activate على Windows
pip install -r requirements.txt

# Download checkpoints (6GB+ VRAM for SDXL, 12GB+ for FLUX)
# Place into ComfyUI/models/checkpoints/:
# - flux1-dev.safetensors (preferred) or juggernautXL_v9Rdphoto2Lightning.safetensors
# Place LoRA into ComfyUI/models/loras/:
# - commercial-food-styling-v2.safetensors
# Place upscaler into ComfyUI/models/upscale_models/:
# - 4x-UltraSharp.pth

# Run server
python main.py --listen  # server on 127.0.0.1:8188
```

#### 2. تفعيل أمر الوكيل لتمرير الأصناف وتوليد صورها

```bash
# From repo root:
python scripts/comfy_food_gen.py --workflow flux --slot ajarski-original --api http://127.0.0.1:8188

# Generate all 13 official slots with FLUX
python scripts/comfy_food_gen.py --workflow flux --all --api http://127.0.0.1:8188 --site restaurant-site/antonias/assets/img

# Dry-run to see plan without queuing
python scripts/comfy_food_gen.py --workflow flux --all --dry-run

# Use SDXL v2 for low VRAM machines
python scripts/comfy_food_gen.py --workflow sdxl_v2 --all --api http://127.0.0.1:8188

# From comfyui folder:
cd restaurant-site/comfyui
python3 comfy_food_gen.py --workflow flux --slot antonias-special --api http://127.0.0.1:8188
python3 agent_integration.py --analyze-menu
python3 agent_integration.py --generate-prompts --category Star
```

#### 3. حفظ بصيغة WebP داخل مجلد `assets/img/seo/` بتسميات الـ SEO الجغرافية

السكريبت يقوم تلقائياً بـ:

1. **حقن البرومبت** + الأبعاد + Seed في workflow.json
2. **Queue على ComfyUI API** `POST /prompt`
3. **انتظار الاكتمال** `GET /history/{prompt_id}`
4. **تحميل الصورة** `GET /view?filename=...`
5. **تطبيق Color Grading الدافئ:**
   - `auto-gamma` — soft daylight 45-degree
   - `sigmoidal-contrast 2,50%` — leopard-charring
   - `modulate 105,115` — golden caramelized, rich red, ivory mozzarella
   - `brightness-contrast 3,5` + `unsharp 0x0.75`
6. **Resize + Centre-Crop** إلى الهدف: 800x800 menu <60K, 1920x1080 hero <150K, 1200x900 bento
7. **WebP adaptive q60→15** + **AVIF q40→20** للوصول لـ <60K
8. **حفظ** `seo/[dish]-[feature]-[city]-[restaurant].jpg/.webp/.avif`

#### 4. إعادة بناء الموقع

```bash
cd restaurant-site
python build.py  # -> antonias/standalone.html 3692KB <5500K PASS
```

---

## ملفات المشروع

```
restaurant-site/comfyui/
├── README.md                     # Original kit explanation
├── README_V2.md                  # This file — full FLUX architecture
├── workflow_food_sdxl.json       # Original SDXL workflow (RealVisXL)
├── workflow_food_sdxl_v2.json    # NEW: Juggernaut XL v9 + Food LoRA 0.68 + 4x-UltraSharp
├── workflow_flux_food.json       # NEW: FLUX.1-dev + Food LoRA 0.70 + Ultimate SD Upscale
├── slots.json                    # Original 17 slots
├── slots_v2.json                 # NEW: 13 official Antonia's slots with SEO naming, Star/Puzzle/Plowhorse categories, detailed prompts for Ajarski, Special, 28-inch King, etc.
├── run_food_set.py               # Original runner
├── comfy_food_gen.py             # NEW: Full agent-to-ComfyUI automation (wrapper)
└── agent_integration.py          # NEW: Intelligent agent that reads menu + SEO + generates prompts

scripts/
└── comfy_food_gen.py             # NEW: Main automation script — queue_prompt, wait_for_completion, download_image, optimize_to_seo, inject_prompt_into_workflow

assets/img/seo/
├── georgian-ajarski-cheese-boat-egg-butter-slo.jpg/.webp/.avif  800x800 <60K
├── antonias-special-pizza-slo-style-crust-san-luis-obispo...  800x800 <60K
├── giant-28-inch-king-size-pizza-paso-robles-antonias...      800x800 <60K
├── ... 26 files total WebP 0 >60K PASS, AVIF 0 >60K PASS, hero <150K PASS
```

---

## قواعد المشروع (HANDOFF §6/§10)

- **Storefronts, patio, logo NEVER generated** — photographs of real places and real brand mark. This kit only covers food.
- **Prices appear in no prompt and no output** — owner choice, at Toast POS.
- **Every slot's pixel size is the aspect its CSS box actually uses** — never stretch, 800x800 menu prevents distortion.
- **Wheel slices:** 8 prompts, 8 distinct dishes, label == photo content.
- **No text, logos, brands, faces, branded bottles, marble studio kitchens** — truth-in-menu.
- **Truth-in-menu matches official menu doc** — mozzarella/feta Ajarski 28-inch.
- **Conversion integrity:** all Order CTAs → https://antoniaspizza.toast.site/ target=_blank rel=noopener noreferrer

---

## لماذا لا يعمل ComfyUI في الـ sandbox؟ — Measured, not assumed

| Check | Result in sandbox |
|-------|-------------------|
| GPU device (/dev/nvidia*) | none |
| torch | installable 2.14.0+cu130 5.3GB but cuda: False |
| RAM / cores | 3.8 GiB / 2 threads — SDXL needs ~10 GiB even on CPU |
| huggingface.co, civitai.com | unreachable (000) in sandbox |
| Conclusion | No weights can be downloaded and no sampler can run here. Images on site were produced with platform's generator; this kit is owner-side path to stronger, reproducible set. |

**الحل:** شغّل ComfyUI على جهازك المحلي بكرت شاشة 6GB+ (SDXL) أو 12GB+ (FLUX)، ثم استخدم سكريبتات هذا المجلد لتوليد الصور وحفظها مباشرة في `assets/img/seo/` بتسميات SEO الجغرافية.

---

## Agent Skills Integration

هذا النظام يتكامل مع مهارات الوكيل:

- **comfyui-agent-skill** (https://github.com/MieMieeeee/comfyui-agent-skill) — يدير ComfyUI workflows عبر الوكيل
- **comfyui-mcp** (https://github.com/artokun/comfyui-mcp) — MCP server لـ ComfyUI
- **Agent reads:** `slots_v2.json`, `llms.txt`, `menu/index.html`, `site-data/*.json`
- **Agent injects:** prompt + dimensions + seed into workflow.json
- **Agent processes:** Checkpoint → LoRA → KSampler → Upscale → SEO optimization

**مثال استخدام الوكيل:**

```
User: ولّد صور Ajarski و Antonia's Special بجودة سينمائية
Agent: يقرأ slots_v2.json -> يحقن البرومبت في workflow_flux_food.json -> يرسل إلى ComfyUI API -> ينتظر -> يحمّل -> يطبّق color grading -> يحفظ WebP <60K -> يشغّل build.py
```

---

## Build Verification

- `python restaurant-site/build.py` → `antonias/standalone.html` 3692KB <5500K PASS
- WebP 26 files 0 >60K excluding hero, hero 1600 82.2KB 1920 101.1KB <150K PASS
- AVIF 26 files 0 >60K PASS
- NAP 100% verified, Conversion integrity preserved

---

**Co-authored:** Antonia's Pizzeria & Italian Kitchen — Two downtown kitchens open till 2AM — 891 Higuera St SLO & 729 12th St Paso Robles
