# Antonia's Pizza — ComfyUI Owner-Side Package (FLUX + Food LoRA)

هذا المجلد يحتوي كل ما تحتاجه لتشغيل ComfyUI عندك على جهازك مع GPU وتوليد 13 صورة احترافية مطابقة لـ SEO.

## لماذا لا يعمل في الساندبوكس؟
موثّق بالقياس في comfyui/README.md:
- لا GPU, RAM 3.8GB فقط (SDXL يحتاج 10GB)
- huggingface.co / civitai.com محجوبان 000
- torch لا يمكن تثبيته (SSLZeroReturnError)

## المتطلبات عندك
- GPU 6GB+ لـ SDXL (Juggernaut XL v9) أو 12GB+ لـ FLUX.1-dev
- Python 3.10+
- ComfyUI من https://github.com/Comfy-Org/ComfyUI

## التثبيت السريع
```bash
git clone https://github.com/Comfy-Org/ComfyUI.git && cd ComfyUI
python -m venv venv && source venv/bin/activate  # أو venv\Scripts\activate على Windows
pip install -r requirements.txt

# حمّل checkpoint واحد على الأقل إلى ComfyUI/models/checkpoints/:
# - FLUX: flux1-dev.safetensors (23GB) من Hugging Face
# - أو SDXL: juggernautXL_v9.safetensors (6.9GB) من Civitai
# - LoRA: commercial-food-styling-v2.safetensors إلى ComfyUI/models/loras/
# - Upscaler: 4x-UltraSharp.pth إلى ComfyUI/models/upscale_models/

python main.py  # يفتح http://127.0.0.1:8188
```

## التشغيل من هذا المجلد (shell ثاني)
```bash
# من مجلد المشروع restaurant-site:
python3 ../scripts/comfy_food_gen.py --workflow flux --all --dry-run  # يطبع الخطة بدون توليد
python3 ../scripts/comfy_food_gen.py --workflow flux --all --api http://127.0.0.1:8188 --site antonias/assets/img

# أو slot واحد:
python3 ../scripts/comfy_food_gen.py --workflow flux --slot baked-calzone --api http://127.0.0.1:8188
```

## الـ 13 Slot في slots_v2.json
- ajarski-original — georgian-ajarski-cheese-boat-egg-butter-slo 800x800 (Star - Only Higuera)
- antonias-special — antonias-special-pizza-slo-style-crust-san-luis-obispo 800x800 (Signature)
- giant-28-king — giant-28-inch-king-size-pizza-paso-robles-antonias 800x800 (Party)
- margherita — classic-margherita-pizza-fresh-basil-san-luis-obispo 800x800
- baked-calzone — baked-italian-calzone-stuffed-ricotta-paso-robles 800x800
- crispy-wings — crispy-buffalo-chicken-wings-buttermilk-ranch-slo 800x800
- pesto-pasta — creamy-pesto-pasta-vegan-rigatoni-slo 800x800
- tiramisu — traditional-italian-tiramisu-dessert-paso-robles 800x800
- bbq-chicken — bbq-chicken-pizza-smoky-sweet-paso-robles-antonias 800x800
- supreme — supreme-pizza-sausage-peppers-herbs-san-luis-obispo 800x800
- dough-toss — hand-crafted-dough-toss-24h-ferment-san-luis-obispo 1200x900
- tomato-sauce — homemade-tomato-sauce-ladled-olive-oil-slo-antonias 1200x900
- hero-1920 — antonias-hero-1920x1080-slo-antonias 1920x1080

كل prompt: grounded in owner real crops, no text/logos/brands/faces/branded bottles/marble kitchens, 45-degree diner angle, 10 o'clock light, olive oil shine, leopard-charring, 8k 85mm f/2.8

## بعد التوليد
```bash
python3 tools/build.py  # يعيد standalone.html 3700KB
python3 tools/ensemble_review.py  # يجب 0 FAIL 0 WARN
python3 tools/_img_attr_audit.py  # 0 mismatch
```

## الملفات في هذه الحزمة
- comfyui/workflow_flux_food.json — FLUX.1-dev + Food LoRA 0.70 euler/simple 32 steps CFG 4.0 + 4x-UltraSharp
- comfyui/workflow_food_sdxl_v2.json — SDXL Juggernaut v9 alternative
- comfyui/slots_v2.json — 13 slot مع prompts احترافية
- comfyui/comfy_food_gen.py — سكربت كامل queue + WebP/AVIF <60K optimization
- comfyui-image-generation/ — skill مع comfyui_api.py CLI
