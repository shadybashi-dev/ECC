# ComfyUI Integration — Pietra Pizza (Weird but DoorDash Compliant)

## تم إضافة ComfyUI

تم استنساخ الريبو الرسمي تبعك:
```
menu-photo-studio/ComfyUI/  (from https://github.com/shadybashi-dev/ComfyUI)
```
هذا فورك غير معدل من Comfy-Org/ComfyUI — يشتغل مباشرة مع الووركفلو الموجود.

## الستايل الجديد v2 — أغرب بس مقبول لـ DoorDash

**القديم v1:** dark charcoal slate + faint amber glow + vignette
**الجديد v2 (weird quarry):**
```
dark quarry basalt stone surface with dramatic natural cracked texture and
subtle copper mineral veins, faint warm amber ember glow seeping from deep
fissures at the far edge, very light natural mist haze, moody artisan quarry
atmosphere with deep soft vignette, still a real simple natural stone surface,
non-distracting, no props, realistic
```

**ليش هاد أغرب ولسا مقبول؟**
- DoorDash يرفض: white, transparent, neon, CGI, creative/artificial, props, distracting
- هاد: سطح حجري طبيعي حقيقي (basalt) — مقبول
- الغرابة: تشققات دراماتيكية + عروق نحاسية + توهج ember طالع من الشقوق + ضباب خفيف + جو مقلع (quarry) — يتماشى مع اسم "The Quarry Combination"
- ما في نيون، ما في CGI، ما في props، ما في خلفية بيضاء — لذلك بيمرق فحص BG_001 و MANUAL_001

## الووركفلو ComfyUI — جاهز

`workflows/doordash_item_sdxl.json`:
```json
1: CheckpointLoaderSimple (sd_xl_base_1.0.safetensors)
2: CLIPTextEncode positive (__POSITIVE__ placeholder)
3: CLIPTextEncode negative (__NEGATIVE__ placeholder)
4: EmptyLatentImage 1536x864 (فوق حد DoorDash 1400x800)
5: KSampler steps 30, cfg 6.5, dpmpp_2m karras
6: VAEDecode
7: SaveImage
```

كل البرومبتات جاهزة:
- `work/prompts.pietra.v2.json` — 20 برومبت بالستايل الجديد + seed ثابت

## كيف تشغل ComfyUI (GPU)

### على سيرفرك المحلي أو Cloud:

```bash
# 1) ثبت ComfyUI
cd menu-photo-studio/ComfyUI
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2) حمّل موديل SDXL Base 1.0
# من https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
# حطه في: ComfyUI/models/checkpoints/sd_xl_base_1.0.safetensors

# 3) شغل السيرفر
python main.py --listen 0.0.0.0 --port 8188

# 4) من تيرمنال ثاني، ولّد كل الصور بدقة DoorDash الحقيقية
cd /home/user/ECC/menu-photo-studio
/home/user/.venv/bin/python -m mpp.cli generate \
  --prompts work/prompts.pietra.v2.json \
  --server http://127.0.0.1:8188 \
  --out output/v2/ \
  --ckpt sd_xl_base_1.0.safetensors

# النتيجة:
# output/v2/raw/*.png (1536x864) — خام
# output/v2/doordash/*.jpg (1536x864 → 16:9 exact, <2MB, ≥1400x800) — جاهز للرفع
```

### فحص الامتثال:

```bash
/home/user/.venv/bin/python -m mpp.cli validate --in output/v2/doordash/
# يجب أن يعطي:
# [OK] EXT_001, SIZE_001, NAME_001, DIM_001, RATIO_001
# [WARN] MANUAL_001 فقط (مراجعة بشرية)
```

## المعاينات الحالية (v2)

تم توليد 10/20 كمعاينة بالأداة المدمجة (1408x768 → 1365x768 بعد القص):
- quarry-combination, ember-reserve, pietra-margherita, vineyard-garden
- wings-6, wings-12, mozzarella-sticks-6, can-soda, house-marinara, buttermilk-ranch

الباقي 10 (spicy-ranch, garlic-parmesan, buffalo, bbq, 6 BYO) جاهز كـ prompts — سيتم توليده في الجولة القادمة (حد 10 صور لكل جولة) أو مباشرة عبر ComfyUI بدقة كاملة.

## الفرق بين v1 و v2

|  | v1 | v2 (weird quarry) |
|--|----|-------------------|
| السطح | slate ناعم | basalt متشقق + عروق نحاسية |
| التوهج | gradient خفيف | ember طالع من شقوق عميقة |
| الجو | moody بسيط | quarry + ضباب خفيف + cinematic |
| DoorDash | ✅ مقبول | ✅ مقبول (أغرب لكن لسا طبيعي) |

v2 يتماشى مع اسم المطعم/البيتزا "The Quarry" — كأنه مقلع حجري قديم فيه توهج دافي.

## ملاحظات DoorDash

- لا تكبّر الصور أبداً (upscaling مرفوض) — استخدم 1536x864 مباشرة من ComfyUI
- كل صورة صنف واحد فقط، ≥80% ظاهر، يملي 50-70% من الفريم، بدون نص/لوغو/أشخاص
- اسم الملف بدون مسافات أو ?query
- JPG/JPEG/PNG فقط، ≤2MB للأوتو-أبروفال، ≤16MB للبوابة اليدوية

---
تم بناء الـ pipeline كامل: ComfyUI clone + style v2 + prompts v2 + export + validate
