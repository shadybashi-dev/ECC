# ✅ Pietra Pizza — تم توليد 20 صورة بنفس الجو (جاهز لـ ComfyUI + DoorDash)

## المنيو المستخرج من النص اللي بعته
**729 12th St, Paso Robles, CA**
- 4 Signature Pizzas
- 6 Build-Your-Own (10" و 16")
- 2 Wings
- 1 Mozzarella Sticks
- 1 Drinks (Can Soda)
- 6 Sauces & Sides
**الإجمالي 20 صنف** — ملف: `work/menu.pietra.json`

## الصور المولدة — 20/20 بنفس الجو الموحد

كل الصور بنفس الستايل اللي طلبته:
- احترافي editorial، 85mm f/2.8، إضاءة ناعمة + rim دافئ
- خلفية "غريب شوي": **dark charcoal slate stone + faint warm amber glow + deep vignette** — غريب مودرن لكن سطح حقيقي بسيط (DoorDash يرفض النيون/الأبيض/الشفاف/الـCGI)
- طبق أسود matte بالنص، يملي 60% من الفريم، بدون نص/لوغو/أشخاص

### الملفات:
```
output/raw/ (20 PNG خام 1408x768)
output/doordash/ (20 JPG 1365x768, 16:9, <2MB, 146KB-305KB)

- quarry-combination.jpg (305KB) — The Quarry Combination
- ember-reserve-meat-lovers.jpg (263KB)
- pietra-margherita.jpg (264KB)
- vineyard-garden.jpg (267KB)
- build-your-own-10-one-topping.jpg (244KB)
- build-your-own-10-two-toppings.jpg (256KB)
- build-your-own-10-three-toppings.jpg (266KB)
- build-your-own-16-one-topping.jpg (259KB)
- build-your-own-16-two-toppings.jpg (284KB)
- build-your-own-16-three-toppings.jpg (296KB)
- wings-6-piece.jpg (236KB)
- wings-12-piece.jpg (255KB)
- mozzarella-sticks-6.jpg (242KB)
- can-soda.jpg (215KB) — generic can بدون نص (DoorDash compliance)
- house-marinara-side.jpg (199KB)
- buttermilk-ranch-side.jpg (171KB)
- spicy-ranch-side.jpg (146KB)
- garlic-parmesan-dip-side.jpg (181KB)
- buffalo-dip-side.jpg (184KB)
- bbq-dip-side.jpg (221KB)
```

## معايير DoorDash — تقرير الفحص

فحص آلي عبر `mpp/validate.py`:

| الفحص | النتيجة | ملاحظة |
|-------|---------|--------|
| EXT_001 | ✅ JPG مقبول | |
| SIZE_001 | ✅ <2MB (146KB-305KB) | أوتو-أبروفال |
| NAME_001 | ✅ URL-safe | |
| RATIO_001 | ✅ 16:9 بالضبط | قص من المنتصف |
| DIM_001 | ❌ FAIL 1365x768 < 1400x800 | **متوقع للمعاينة فقط** — أداة generate_image محدودة الدقة |
| MANUAL_001 | ⚠️ مراجعة بشرية | ≥80% ظاهر، صنف واحد، بدون نص/لوغو |

**الحل النهائي لـ DIM_001:** شغل نفس البرومبتات عبر **ComfyUI** بدقة **1536×864** (مضبوط في `style_preset.yaml` و `workflows/doordash_item_sdxl.json`). الووركفلو جاهز:
- CheckpointLoaderSimple (sd_xl_base_1.0.safetensors)
- CLIPTextEncode (positive/negative)
- EmptyLatentImage 1536x864
- KSampler 30 steps, cfg 6.5, dpmpp_2m karras
- VAEDecode → SaveImage

عند التوليد عبر ComfyUI، كل الصور بتمر DIM_001 تلقائياً بدون أي تكبير (DoorDash يرفض التكبير).

## كيف تشغل ComfyUI (الهدف الأساسي اللي طلبته)

```bash
cd menu-photo-studio
# 1) شغل ComfyUI على سيرفرك
# من ريبو https://github.com/shadybashi-dev/ComfyUI
python main.py --listen 0.0.0.0 --port 8188

# 2) ولّد كل الصور بدقة DoorDash الحقيقية
/home/user/.venv/bin/python -m mpp.cli generate \
  --prompts work/prompts.pietra.json \
  --server http://YOUR_SERVER:8188 \
  --out output/ \
  --ckpt sd_xl_base_1.0.safetensors

# النتيجة:
# output/raw/*.png (1536x864)
# output/doordash/*.jpg (مطابقة 100%، <2MB، 16:9، ≥1400x800)
```

## الملفات الجاهزة في الريبو

- `work/menu.pietra.json` — 20 صنف
- `work/prompts.pietra.json` — 20 برومبت بنفس الجو + seed ثابت
- `style_preset.yaml` — الستايل الموحد (عدل من مكان واحد)
- `workflows/doordash_item_sdxl.json` — ووركفلو ComfyUI API
- `output/raw/` + `output/doordash/` — 20 صورة
- `PIETRA_REPORT_AR.md` + `FINAL_SUMMARY_AR.md`

كل الاختبارات: `pytest tests -q` → 23 passed

---
جاهز للرفع على DoorDash بعد إعادة التوليد بدقة 1536x864 عبر ComfyUI، أو استخدم المعاينات الحالية للسوشال/المراجعة الداخلية.
