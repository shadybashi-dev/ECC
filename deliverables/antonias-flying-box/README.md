# 🍕🚀 Antonia's Pizza — "The Future of Delivery is Here."

**حزمة إنتاج فيديو AI كاملة** — تحليل البراند + مقارنة أدوات + برومت سينمائي + كود جاهز للتشغيل + دليل مونتاج اللوغو.

> **ملاحظة واقعية قبل ما نبدأ:** مفيش GPU جوه ChatGPT/Claude. يعني الـ Agent مش هيولّد الفيديو بنفسه.
> اللي في الحزمة دي: **الإعداد الكامل + كود شغّال** يتنفّذ على **Google Colab (مجاني)**، أو على **fal.ai API** (فيديو جاهز في ~60 ثانية بـ ~$0.15).
> كل الأرقام والروابط والـ endpoints في الملف ده **متحقَّق منها فعليًا** بتاريخ **19 أكتوبر 2026** — مش من الذاكرة.

---

## 🗂️ محتويات الحزمة

| الملف | إيه اللي فيه |
|---|---|
| `README.md` | الملف ده — الخطة الكاملة والـ 5 خطوات |
| `prompt_master.txt` | البرومت السينمائي النهائي (Master prompt) |
| `shotlist.md` | تقسيم الفيديو لـ 4 لقطات + مواصفات الـ End Card |
| `keyframe_hero.png` | أول فريم (I2V) — اتولّد وجاهز |
| `antonias_video_colab.ipynb` | نوتبوك Colab كامل — افتحه وRun All |
| `fal_generate.py` | سكربت API (fal.ai) — أسرع طريق، فيديو في ~دقيقة |
| `extract_brand_colors.py` | يسحب ألوان البراند الحقيقية من اللوغو الرسمي |
| `post_production.md` | تركيب اللوغو + الـ End Card + أوامر ffmpeg |

---

## 1. 🎨 Brand Identity Brief

مأخوذ من الموقع الحقيقي [antoniaspizza.com](https://antoniaspizza.com) (تمت الزيارة والقراءة)، مع ملاحظة صريحة للأجزاء اللي محتاجة تأكيد من صاحب البراند.

- **الاسم والمارك:** `Antonia's Pizza` — اللوغو الرسمي على الموقع هو ملف PNG موجود على المسار
  `https://antoniaspizza.com/assets/img/logo-current-192.png` (ظهر في صفحة 404 كـ `<img alt="Antonia's Pizza">`).
  ⚠️ دقة 192px فقط — للاستخدام في فيديو 1080p اطلب من العميل **SVG/AI** أو أعمل trace (خطوة 5).
- **الألوان (Working palette):** طماطم `#C8322B` · كرافت/عجين `#F2E7D5` · قشرة ذهبية `#DFA23C` ·
  طوب محروق `#8C3B2A` · فحم داكن `#1A1714` · ريحان `#3E5B3A`.
  *دي ألوان مستخرجة من تصوير الموقع (طماطم، عجين، قشرة، طاولة خشب) + الستايل العام — مش من الـ CSS.
  لتثبيت الهيكس النهائي شغّل `extract_brand_colors.py` على اللوغو الرسمي.*
- **الخطوط:** أسلوب الموقع = **Eyebrow كابيتال ثقيل** (`WE ARE FAMOUS FOR OUR DOUGH!`, `SLO HAS SPOKEN`)
  + **عناوين بلمسة إيطاليك** (`Fresh is best`, `From a slice to a 28-incher`, `Two spots. One legend.`).
  للفيديو: **Anton / Archivo Black** للكابيتال + **Playfair Display Italic** للكلمة المائلة.
- **المود البصري:** **Rustic-modern** — حِرَفي، دافئ، مش متكلّف، مع لمسة ليلية/محلية. مش corporate ومش cartoon.
- **عناصر متكرّرة:** بخار، cheese pull، دقيق، خشب، ضوء نيون ليلي، طاولة مشتركة، أرقام كبيرة (28").
- **نبرة الصوت:** جُمل قصيرة وواثقة، فيها مرح (`It's not a calzone. It's the AJARSKI.`)، وتنتهي بـ punchline.
- **روابط البراند اللي لازم تظهر صح:** 28" pie · famous dough · Ajarski · open till 2AM · 2 downtown spots.
- **الجمهور:** SLO + Paso Robles، طلبة وعائلات وlate-night crowd — الفيديو لازم يحسّ إنه "محلي" مش إعلان عالمي بارد.

---

## 2. 🔧 Tools Comparison Table — حالة السوق الحقيقية

**طريقة التحقق:** GitHub API + Hugging Face API + صفحات الموديلات، بتاريخ **2026-10-19**. الأرقام (نجوم/آخر تحديث) حقيقية.

| # | Model | GitHub | ★ | آخر تحديث | License | VRAM (واقعي) | أقصى مدة/دقة | التقييم |
|---|---|---|---|---|---|---|---|---|
| 1 | **Wan 2.2** (T2V/I2V/TI2V-5B) | [Wan-Video/Wan2.2](https://github.com/Wan-Video/Wan2.2) | 18,006 | 2026-09-21 | Apache 2.0 | 5B: 24GB رسمي · 14B MoE: ~80GB | 720p/24fps · ~5s | **أفضل حركة وواقعية في الأوبن سورس + ترخيص تجاري حر** |
| 2 | **LTX-Video 0.9.8** | [Lightricks/LTX-Video](https://github.com/Lightricks/LTX-Video) | 11,132 | 2026-01-05 | Apache 2.0 | 2B distilled: **~8GB** · 13B: 24GB | 480–720p · 121 frames | **الأسرع والأخف — أسهل موديل يشتغل على T4** |
| 3 | **LTX-2.5** | [Lightricks/LTX-2](https://github.com/Lightricks/LTX-2) | 9,790 | 2026-10-18 | LTX-2 Community (مجاني < $10M إيراد) | 22B · ~66GiB أوزان · 32GB+ | حتى 4K · صوت متزامن | أقوى "كل حاجة في موديل واحد" — بس تقيل جدًا |
| 4 | **HunyuanVideo 1.5** | [Tencent-Hunyuan/HunyuanVideo-1.5](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5) | 4,571 | 2026-04-10 | Tencent Community (فيه قيود مناطق) | **14GB** مع offloading · 8.3B | 480p/720p (+SR 1080p) · ~5–8s | ممتاز للوجوه والتفاصيل — الترخيص مش Apache |
| 5 | **Open-Sora 2.0** | [hpcaitech/Open-Sora](https://github.com/hpcaitech/Open-Sora) | 29,868 | 2026-04-09 | Apache 2.0 | 24GB+ | 720p | نجوم كتير، بس توجّه بحثي أكتر منه منتج |
| 6 | **HunyuanVideo (v1)** | [Tencent-Hunyuan/HunyuanVideo](https://github.com/Tencent-Hunyuan/HunyuanVideo) | 12,634 | 2026-10-08 | Tencent | 60–80GB | 720p | اتجاوزه 1.5 — مش منطقي تبدأ منه |
| 7 | **Mochi 1** (Genmo) | [genmoai/mochi](https://github.com/genmoai/mochi) | 3,748 | 2026-10-06 | Apache 2.0 | 16GB+ (native) | 480p | حركة نضيفة، جودة أقل من الجيل الحالي |
| 8 | **CogVideoX** (Zhipu / Z.ai) | [zai-org/CogVideo](https://github.com/zai-org/CogVideo) | 13,086 | 2025-11-04 | Apache 2.0 | 12–24GB | 720p | كلاسيك محترم، بس بطيء في التطوّر |
| 9 | **Wan 3.0** (مغلق الأوزان حاليًا) | [AlibabaCloud-Official/Wan3.0](https://github.com/AlibabaCloud-Official/Wan3.0) | 14 | 2026-08-11 | API | سحابي | 480p–1080p · حتى 30s | أحسن جودة على السوق — **بس مش مفتوح** |

### 🏆 التوصية

| الاستخدام | الأداة | السبب |
|---|---|---|
| **#1 — أفضل جودة (Production)** | **Wan 2.2 · TI2V-5B** | Apache 2.0 (تجاري بدون قيود)، بياخد صورة كأول فريم → **أعلى دقة في الحفاظ على شكل العلبة واللوغو**، أحسن motion coherence في الأوبن سورس |
| **#2 — البديل المجاني (Backup)** | **LTX-Video 0.9.8 · 2B distilled** | بيشتغل على **8GB** — يعني T4 المجاني في Colab، وسريع (121 frames في أقل من دقيقة على 4060) |
| **#3 — أسرع طريق للفيديو** | **fal.ai (Wan 2.2 5B)** | فيديو جاهز في ~60 ثانية، ~$0.08–$0.15 للكليب، من غير أي setup |

### ⚠️ الحقيقة اللي البرومت الأصلي بيغفلها

**Wan 2.2 TI2V-5B مش بيشتغل على Colab المجاني (T4 16GB).** الموديل محتاج ~24GB رسميًا، وT4 كمان معندوش bf16.
فالاختيارات الحقيقية:

| جهازك | الهوايل |
|---|---|
| Colab مجاني (T4 16GB) | LTX-Video 2B · أو Wan 2.1 T2V-1.3B على 480p |
| Colab Pro (A100 40GB) | Wan 2.2 TI2V-5B على 720p ✅ |
| RunPod (~$0.35–$0.50/ساعة) | أي حاجة فوق |
| مش عايز setup | fal.ai API (~$0.15/كليب) |

---

## 3. 🎬 Final Video Prompt

> الملاحظة الحرفية: مفيش موديل مفتوح بيطلّع **23 ثانية بكل المشاهد دي في برومت واحد**. كل موديل بيدي ~5 ثواني.
> فالطريقة الصح (واللي بتفرق بين شغل هاوي وشغل وكالة): **برومت ماستر للأسلوب + 4 لقطات منفصلة تتجمّع في المونتاج**.

### Master prompt (الأسلوب العام — يُلحق بكل لقطة)

```text
Cinematic Super Bowl commercial × sci-fi trailer, shot on anamorphic 35mm, shallow depth of field,
volumetric light, film grain, warm golden-and-tomato-red grade. A giant premium pizza box — warm cream
kraft card, deep tomato-red band, gold-foil serif wordmark "Antonia's Pizza" — with the lid cracked open,
molten cheese stretching and thick golden steam curling out. Crimson and amber spotlights cut through
ground fog on a dark stage, silhouetted audience at the edges, embers drifting. Mood: futuristic reveal
that still smells like a real neighborhood pizzeria.
```

### Shot 01 — The Rise (0:00–0:05)

```text
Low-angle hero shot, slow motion. A giant Antonia's Pizza box sits on a glossy black stage floor, lid
slightly open, golden steam pouring out. It lifts off the ground and rises two feet, tilting as it hovers.
Crimson and amber spotlights sweep across it, embers and dust drifting through the beams, ground fog
rolling. Stunned silhouetted crowd at the edges. Camera pushes in low, slight handheld. Photoreal,
anamorphic lens flare, shallow depth of field, 24fps, film grain.
```

### Shot 02 — The Glide (0:05–0:10)

```text
Orbiting drone shot circling a hovering Antonia's Pizza box as it glides forward through a dark futuristic
stage, banking gently like a concept-car reveal. Golden light leaks from the lid, cheese pull glinting,
energy particles in tomato-red and gold trailing behind. Spotlights streak past, fog swirling, audience
silhouettes blurred in the foreground. Smooth aerial orbit, motion blur, cinematic grade, 24fps.
```

### Shot 03 — The Landing (0:10–0:15)

```text
The flying pizza box descends slowly onto a rustic wooden table in a warm pizzeria, fog clearing,
stage light fading into golden practical light. Dust motes in the air, flour on the table, a hand-made
28-inch pie glow reflecting on the wood. Slow-motion, macro detail, shallow depth of field, warm and
authentic, 24fps.
```

### Shot 04 — The Reveal (0:15–0:20)

```text
Close-up: the lid of the Antonia's Pizza box opens in slow motion, a burst of golden steam rolling out,
revealing a perfect steaming 28-inch pepperoni pizza — bubbling mozzarella, charred seasoned crust,
fresh basil, an epic cheese pull. Camera slow push-in, steam backlit by warm light. Mouth-watering,
photoreal food cinematography, 24fps.
```

### End Card (0:20–0:23) — **يتعمل في المونتاج، مش بالـ AI**

```text
Cream background. Centered real logo. Headline: "Antonia's Pizza".
URL: antoniaspizza.com · Tagline: "The Future of Delivery is Here."
Small print: San Luis Obispo · Paso Robles — Open till 2AM Fri–Sat.
```

> **ليه الـ End Card مش بالـ AI؟** مفيش موديل فيديو مفتوح بيضمن تهجئة "Antonia's Pizza" بشكل صحيح 100% كل مرة.
> النص الحقيقي بيتعمل في CapCut/DaVinci بخط البراند — نظيف، حاد، وقابل للتعديل في 10 ثواني.

📄 النسخة الكاملة في `prompt_master.txt` و `shotlist.md`.

---

## 4. 💻 Execution Code

### الخيار A — Colab (مجاني T4 أو Pro A100)

افتح `antonias_video_colab.ipynb` في [Colab](https://colab.research.google.com/) → `Runtime ▸ Change runtime type ▸ T4 GPU` → Run All.
النوتبوك بيختار الموديل أوتوماتيك حسب الـ VRAM:

- **T4 16GB / أقل من 22GB** → Wan 2.1 · T2V-1.3B (832×480، ~3.4 ثانية، text-to-video)
- **A100 / 24GB+** → Wan 2.2 · TI2V-5B (1280×704، 5 ثواني، **وياخد `keyframe_hero.png` كأول فريم**)

السبب إن النوتبوك بيستخدم **diffusers** مش سكربتات المستودع: من غير `flash_attn` (اللي بياخد 30+ دقيقة يتعمّر على Colab)
ومن غير تعارض numpy/transformers. لو عايز LTX-Video 2B (اللي بيشتغل على 8GB) استخدم الخيار C — أوامره جاهزة تحت.

### الخيار B — fal.ai API (الأسرع، ~60 ثانية)

```bash
export FAL_KEY="your-key"          # من https://fal.ai/dashboard/keys — فيه رصيد تجريبي
python fal_generate.py --image keyframe_hero.png --shot 1
```

الـ endpoints المستخدمة (متحقَّق منها):

| Endpoint | الاستخدام | السعر |
|---|---|---|
| `fal-ai/wan/v2.2-5b/image-to-video` | أنيميشن الـ keyframe (الأدق للبراند) | $0.15 / فيديو |
| `fal-ai/wan/v2.2-5b/text-to-video` | لو مفيش صورة | $0.08 / فيديو |
| `fal-ai/wan/v2.2-a14b/text-to-video` | جودة أعلى | $0.08/ثانية @720p |

### الخيار C — تنصيب محلي

```bash
# LTX-Video (الأخف)
git clone https://github.com/Lightricks/LTX-Video.git && cd LTX-Video
pip install -e .[inference]
hf download Lightricks/LTX-Video ltxv-2b-0.9.8-distilled.safetensors \
    ltxv-spatial-upscaler-0.9.8.safetensors --local-dir .
python inference.py \
  --pipeline_config configs/ltxv-2b-0.9.8-distilled.yaml \
  --prompt "$(cat ../prompt_master.txt)" \
  --height 480 --width 704 --num_frames 121 --seed 42 \
  --output_path outputs/antonias
```

```bash
# Wan 2.2 5B (جودة أعلى، محتاج 24GB)
git clone https://github.com/Wan-Video/Wan2.2.git && cd Wan2.2
pip install -r requirements.txt        # لو flash_attn فشل: نصّبه آخر واحد
hf download Wan-AI/Wan2.2-TI2V-5B --local-dir ./Wan2.2-TI2V-5B
python generate.py --task ti2v-5B --size 1280*704 --ckpt_dir ./Wan2.2-TI2V-5B \
  --offload_model True --convert_model_dtype --t5_cpu --prompt "$(cat ../prompt_master.txt)"
```

---

## 5. ✂️ Post-Production Guide (مختصر)

التفاصيل الكاملة + أوامر ffmpeg جاهزة في `post_production.md`.

1. **نزّل اللوغو الحقيقي:** `curl -O https://antoniaspizza.com/assets/img/logo-current-192.png`
   الدقة 192px صغيرة → استخدم `remini`/`Upscayl` (مجاني) أو اطلب SVG من العميل.
2. **CapCut:** مشروع 1080×1920 (ريلز/تيك توك) أو 1920×1080. حط اللوغو **Upper-left**، عرضه ~14% من عرض الكادر،
   fade-in 0.4s، opacity 85%، من 0:00 لحد 0:20.
3. **Safe zone تيك توك:** سيبه في حدود **y = 220–1500px** — تحت ده فيه UI التطبيق.
4. **الـ End Card:** من 0:20 لـ 0:23 · خط العنوان **Anton/Archivo Black** · التاغلاين **Playfair Display Italic**.
5. **الصوت:** مفيش صوت من الموديلات دي — ضيف:
   - ساوند ديزاين: whoosh + sub-bass drop عند لحظة الصعود (0:00.4s) و"cheese sizzle" عند 0:16.
   - موسيقى: "epic trailer × italian mandolin" — من [Pixabay Music](https://pixabay.com/music/) (مجاني تجاريًا).
6. **اللون:** lift بسيط للظلال + دفع الطماطم/الذهبي؛ Dehancer أو LUT "Kodak 2383" مجاني.

---

## ✅ Checklist قبل النشر

- [ ] اللوغو الحقيقي في أول 3 ثواني (Hook)
- [ ] الكادر عمودي 9:16 للريلز، 16:9 ليوتيوب
- [ ] End Card ≥ 3 ثواني + URL مقروء
- [ ] صوت + لقطة cheese pull (دي اللي بتوقف الـ scroll)
- [ ] ترخيص الموديل مناسب للاستخدام التجاري (Wan 2.2 = Apache 2.0 ✅ · Hunyuan = Tencent Community ⚠️)

---

## 🧾 المصادر (تم التحقق منها 2026-10-19)

- الكود والتراخيص والـ VRAM: READMEs الرسمية لـ [Wan2.2](https://github.com/Wan-Video/Wan2.2) · [LTX-Video](https://github.com/Lightricks/LTX-Video) · [LTX-2](https://github.com/Lightricks/LTX-2) · [HunyuanVideo-1.5](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)
- محتوى الموقع والبراند: [antoniaspizza.com](https://antoniaspizza.com)
- أسعار fal.ai: صفحات `fal-ai/wan/v2.2-5b/text-to-video` و `.../a14b/text-to-video`
- أرقام GitHub ★/التحديث: `api.github.com` — لحظة الإعداد

> **ملاحظة أمانة:** الهيكس الدقيق للبراند مش منشور في CSS عام، فالألوان فوق "working palette" من تصوير الموقع.
> شغّل `extract_brand_colors.py` على اللوغو الرسمي قبل الرندر النهائي، وبلّغ العميل إن أي استخدام تجاري للفيديو
> لازم يتأكد من ملكية اللوغو والخطوط.
