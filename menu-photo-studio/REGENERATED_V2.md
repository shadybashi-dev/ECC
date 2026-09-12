# إعادة توليد كامل من الصفر — v2 Weird Quarry (DoorDash Compliant)

تم حذف كل الصور القديمة وإعادة التوليد من الصفر بالستايل الجديد:

**الخلفية الجديدة (أغرب بس مقبولة):**
```
dark quarry basalt stone surface with dramatic natural cracked texture and
subtle copper mineral veins, faint warm amber ember glow seeping from deep
fissures at the far edge, very light natural mist haze, moody artisan quarry
atmosphere with deep soft vignette, still a real simple natural stone surface,
non-distracting, no props, realistic
```

**الفرق عن v1:**
- v1: slate ناعم + glow خفيف
- v2: basalt متشقق + عروق نحاسية + ember طالع من الشقوق + ضباب + جو مقلع — يتماشى مع اسم The Quarry Combination

**DoorDash compliance:**
- سطح حجري طبيعي حقيقي (مقبول) — ليس أبيض/شفاف/نيون/CGI/props
- 16:9، <2MB، JPG، اسم URL-safe، بدون نص/لوغو/أشخاص
- DIM_001 FAIL للمعاينات فقط (1408x768) — ComfyUI بدقة 1536x864 يحلها

**التقدم الحالي (بسبب حد 10 صور لكل جولة):**
- تم توليد 10/20 من الصفر:
  - quarry-combination, ember-reserve-meat-lovers, pietra-margherita, vineyard-garden
  - wings-6-piece, wings-12-piece, mozzarella-sticks-6, can-soda, house-marinara-side, buttermilk-ranch-side
- الباقي 10 جاهز كـ prompts في work/prompts.pietra.v2.json وسيتم توليده في الجولة القادمة أو عبر ComfyUI بدقة كاملة

**ComfyUI مضاف:**
- menu-photo-studio/ComfyUI/ cloned from https://github.com/shadybashi-dev/ComfyUI
- workflow: workflows/doordash_item_sdxl.json (1536x864)
- تشغيل: python main.py --listen 0.0.0.0 --port 8188 ثم mpp.cli generate

