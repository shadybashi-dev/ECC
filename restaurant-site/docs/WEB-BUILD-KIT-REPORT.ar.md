# تقرير البحث: نماذج بناء الويب المتطورة (جرافيك + SEO)

**التاريخ:** 2026-09-14
**الغرض:** اختيار وتنصيب النماذج (skills / templates) اللازمة لبناء موقع مطعم متطور، لاستخدامها في الخطوة القادمة.
**الحالة:** ✅ مكتمل — 40 نموذجًا منصّبًا وجاهزًا في `restaurant-site/.claude/skills/`

---

## 1. الخلاصة التنفيذية

بحثت في مصدرين:

1. **محليًا** — مستودع ECC يحتوي 288 مهارة، انتخبت منها **34** مهارة تخدم بناء الويب تحديدًا.
2. **خارجيًا** — المستودع الرسمي `anthropics/skills` ومستودع عربي متخصص `alMubarmij/Arabic-Coding-Skills`، انتخبت منها **5** نماذج بعد فحص أمني.
3. **تأليفًا** — نموذج مرجعي واحد جديد `restaurant-web-blueprint` يلخّص كل نتائج بحث 2026 الخاصة بالمطاعم.

**المجموع: 40 نموذجًا** + 4 حزم قواعد (web / typescript / react / common)، بحجم 848 كيلوبايت فقط.

---

## 2. القرار التقني: أي إطار عمل؟

موقع المطعم هو **موقع محتوى تسويقي** مع جزر تفاعلية قليلة (فلترة القائمة، نموذج الحجز، سلة الطلب). هذا البروفايل له إجابة واحدة صحيحة في 2026.

### نتائج القياسات الميدانية (Core Web Vitals)

| المقياس | Astro 5+ | Next.js 16 | Remix v7 | الحد الجيد عند Google |
| --- | --- | --- | --- | --- |
| LCP | **0.5–1.5 ث** | 1.2–2.5 ث | 1.0–2.2 ث | < 2.5 ث |
| INP | **48–150 م.ث** | 92–250 م.ث | 120–200 م.ث | < 200 م.ث |
| CLS | **0.01–0.05** | 0.05–0.12 | 0.03–0.08 | < 0.10 |
| حجم JavaScript | **0–45 ك.ب** | 85–120 ك.ب | 65–95 ك.ب | — |
| Lighthouse | **92–100** | 75–90 | 82–94 | > 90 |

**القرار: Astro 5+ مع Tailwind CSS v4 وجزر React.**

السبب: Astro يشحن **صفر JavaScript افتراضيًا**، والـ HTML الذي يراه Googlebot مطابق لما يراه الزائر — لا تأخير في الفهرسة. مواقع المحتوى المبنية بـ Astro تحقق LCP أفضل بنسبة 40–70% من Next.js دون أي ضبط إضافي، وسرعة الصفحة عامل ترتيب مؤكد من Google.

**متى ننتقل إلى Next.js؟** فقط إذا تضمن المشروع: حسابات مستخدمين، لوحة طلبات لحظية، أو 20+ فرعًا بصفحات برمجية لكل مدينة (حيث يتفوق ISR).

> ملاحظة: استحواذ Cloudflare على Astro في يناير 2026 يؤكد نضجه للإنتاج.

**المصادر:** [مقارنة Next.js و Astro 2026](https://www.verlua.com/blog/nextjs-vs-astro) · [قياسات Core Web Vitals 2026](https://www.agilesoftlabs.com/blog/2026/03/nextjs-vs-remix-vs-astro-best) · [أفضل إطار للـ SEO مرتبًا حسب CWV](https://beyondcodekarma.in/best-frontend-framework-for-seo/) · [دليل Astro SEO التقني 2026](https://nodeascind.com/blog/astro-js-seo-guide-2026/)

---

## 3. النماذج المنصّبة

### الطبقة 1 — حزمة ECC المنتقاة (34 نموذجًا)

**الجرافيك والتصميم (9):**
| النموذج | الوظيفة |
| --- | --- |
| `frontend-design-direction` | تحديد الاتجاه التصميمي قبل كتابة أي كود |
| `design-system` | توليد/تدقيق نظام تصميم متكامل (ألوان، خطوط، مسافات) |
| `make-interfaces-feel-better` | تفاصيل البوليش: المسافات، الظلال، الحالات، مناطق اللمس |
| `motion-foundations` | رموز الحركة وإعدادات الـ spring وقواعد الأداء |
| `motion-patterns` | أنماط حركة جاهزة للإنتاج (أزرار، مودالات، انتقالات صفحات) |
| `motion-advanced` | إيماءات، سحب وإفلات، تحريك نصوص، رسم SVG |
| `motion-ui` | نظام حركة كامل لـ React/Next.js |
| `fal-ai-media` | توليد صور وفيديو بالذكاء الاصطناعي |
| `frontend-slides` | عروض HTML متحركة (للعروض التقديمية) |

**SEO والمحتوى والعلامة التجارية (6):**
| النموذج | الوظيفة |
| --- | --- |
| `seo` | تدقيق SEO تقني + on-page + بيانات منظمة + Core Web Vitals |
| `brand-discovery` | 8 وحدات لاكتشاف هوية العلامة التجارية |
| `brand-voice` | بناء ملف أسلوب كتابة من مصادر حقيقية |
| `content-engine` | محتوى أصلي لكل منصة |
| `marketing-campaign` | تخطيط حملة تسويقية كاملة + صفحات هبوط |
| `market-research` | بحث سوقي وتحليل منافسين |

**هندسة الواجهة والأداء (5):**
`frontend-patterns` · `react-patterns` · `react-performance` · `nextjs-turbopack` · `vite-patterns`

**إتاحة الوصول (2):** `accessibility` (WCAG 2.2 AA) · `frontend-a11y`

**الجودة والاختبار (7):**
`browser-qa` (اختبار بصري آلي) · `click-path-audit` (تتبع كل زر عبر حالاته) · `production-audit` (تدقيق جاهزية الإنتاج) · `ui-demo` (تسجيل فيديو للواجهة) · `e2e-testing` · `react-testing` · `verification-loop`

**البنية والنشر (5):** `api-design` · `backend-patterns` · `deployment-patterns` · `git-workflow` · `plan-canvas` · `skill-scout`

### الطبقة 2 — النماذج الرسمية من Anthropic (2)

| النموذج | لماذا مهم |
| --- | --- |
| **`frontend-design`** | النموذج الرسمي للتصميم المتميّز. يحتوي قائمة دقيقة بـ"بصمات الصفحات المولّدة آليًا" التي يجب تجنّبها — ومنها بالضبط **الخلفية الكريمية `#F4F1EA` مع خط serif ولون terracotta `#D97757`** وهو الشكل الأكثر شيوعًا لمواقع المطاعم المولّدة بالذكاء الاصطناعي في 2026. مستودع ECC نفسه يوجّه لتنصيبه من `anthropics/skills`. |
| **`theme-factory`** | **10 ثيمات جاهزة** بلوحات ألوان hex وأزواج خطوط. ثيم `golden-hour` مكتوب عليه صراحةً *"Best Used For: Restaurant presentations, hospitality brands"* وثيم `botanical-garden` لـ *"food presentations, farm-to-table"*. مرفق ملف PDF لعرض الثيمات بصريًا. |

### الطبقة 3 — النماذج العربية / RTL (3)

حاسمة لأن موقعك بالعربية. كل واحد يفحصه `skill-scout` قبل الاعتماد.

| النموذج | المحتوى |
| --- | --- |
| `arabic-rtl-best-practices` | الخصائص المنطقية في CSS، `rtl:` في Tailwind، إعداد RTL في React/Next، النصوص ثنائية الاتجاه (bidi)، اختيار الخطوط العربية + ملف مرجعي للخصائص |
| `arabic-rtl-mobile` | أنماط RTL للجوال: منطقة الإبهام، التنقل السفلي، النماذج |
| `ux-writing-arabic` | كتابة واجهة المستخدم بالعربية + قائمة تحقق + أمثلة + مسرد مصطلحات + مرجع |

### الطبقة 4 — النموذج المرجعي الجديد (1)

**`restaurant-web-blueprint`** — ألّفته كخلاصة لكل نتائج البحث، ويحتوي:

- مصفوفة قرار إطار العمل بالأرقام
- **جدول الـ 15 نوعًا من البيانات المنظمة** المطلوبة لمطعم
- قائمة Local SEO + **GEO** (الظهور في إجابات ChatGPT/Perplexity/AI Overviews)
- ميزانية Core Web Vitals كبوابات صلبة تفشل البناء عند تجاوزها
- قواعد التايبوغرافي العربية بالأرقام (line-height 1.7–1.85، letter-spacing = 0 دائمًا)
- **6 اتجاهات تصميمية للمطاعم** (Charcoal & Ember، Souk/Heritage، Coastal Fresh، Farm to Table، Late Night، Fine Dining Editorial)
- خريطة الصفحات (sitemap)
- خط أنابيب تصوير الطعام (AVIF/WebP، أحجام قصوى لكل نوع صورة)
- 8 ميزات تحويل مرتبة حسب الأثر الفعلي
- **جدول توجيه** — أي نموذج تستخدم لأي مهمة
- تسلسل بناء من 10 خطوات + **تعريف "منتهى"** من 13 بندًا

ومعه ملف `references/jsonld-stack.md` فيه كود JSON-LD جاهز للنسخ: الصفحة الرئيسية بـ `@graph` كامل، صفحة القائمة `Menu → MenuSection → MenuItem`، الأحداث، الفروع المتعددة، hreflang الثنائي اللغة، وسير عمل التحقق وجدول الأخطاء الشائعة.

---

## 4. أهم findings للـ SEO الخاص بالمطاعم

### البيانات المنظمة — 8 أنواع لا غنى عنها

المطعم يحتاج: `Restaurant` (أساس NAP) + `AggregateRating` + `Menu/MenuItem` + `Review` + `Event` + `FAQPage` + `amenityFeature` + `BreadcrumbList`.

القواعد الحرجة:

1. **استخدم `Restaurant` وليس `LocalBusiness`** — هو النوع الأكثر تخصيصًا في التسلسل الهرمي `Organization → LocalBusiness → FoodEstablishment → Restaurant` ويفتح نتائج غنية خاصة بالمطاعم لا يؤهلها النوعان الآخران.
2. **JSON-LD حصريًا** — Google يوصي به صراحةً على Microdata وRDFa.
3. **اتساق NAP** — الاسم والعنوان والهاتف يجب أن تتطابق **حرفًا بحرف** بين الـ schema وملف Google Business Profile وكل الدليلات. عدم التطابق يكبح الترتيب المحلي أكثر من أي خطأ آخر.
4. **القائمة HTML حقيقية** — ليست PDF ولا صورة. قوائم PDF/الصور غير مرئية لـ Googlebot ولقارئات الشاشة.
5. **لا تختلق التقييمات** — `aggregateRating` مزوّر = مخالفة سياسة وإجراء يدوي.
6. **المخطط يصف محتوى ظاهرًا في نفس الصفحة** — لا تضع schema القائمة في الصفحة الرئيسية إذا كانت القائمة غير ظاهرة فيها.
7. المواقع ذات البيانات المنظمة الصحيحة تحصل على **CTR أعلى بنسبة 30%** في نتائج البحث.
8. خطأ صياغة واحد يقتل كتلة JSON-LD بأكملها بصمت.

### GEO — الظهور في محركات الذكاء الاصطناعي

في 2026 جزء كبير من استعلامات "أفضل مطعم في {المدينة}" يُجاب داخل ChatGPT وPerplexity وAI Overviews، لا في الروابط الزرقاء. هذه المحركات تسحب بكثافة من البيانات المنظمة، وتحديدًا من `amenityFeature` و`servesCuisine` و`openingHoursSpecification`. المطلوب:

- حقائق مكتوبة **بجمل تقريرية واضحة**، لا في جداول ولا داخل صور فقط
- كتل إجابة صريحة: الدوام، نطاق الأسعار، الخيارات الغذائية (حلال/نباتي/بدون غلوتين)، المواقف، مناسب للعائلات، نطاق التوصيل
- `FAQPage` بالأسئلة التي يسألها الناس فعلًا لمساعد ذكي
- ملف `llms.txt` في جذر الموقع
- لا محتوى محبوس خلف JS hydration — كثير من زواحف الذكاء الاصطناعي لا تنفّذ JavaScript

### الرسوم المتحركة في 2026

تغيّران بنيويان هذا العام: **GSAP أصبح مجانيًا 100%**، و**الرسوم المتحركة القائمة على التمرير في CSS وصلت لدعم أساسي في كل المتصفحات الكبرى**.

- **CSS `animation-timeline: view()`** يغطي ~80% من التأثيرات البسيطة بصفر JavaScript، ويعمل على الـ compositor خارج الـ main thread → لا يضر INP
- **GSAP ScrollTrigger** للـ 20% المعقدة: التثبيت (pinning)، التسلسلات المُتحكَّم بها بالتمرير، SplitText
- **Lenis** أصبح معيار التمرير الناعم (حلّ محل Locomotive Scroll)
- الاتجاه الأكبر في 2026 هو **الحركة الواعية بـ INP**: 43% من المواقع تفشل في عتبة 200 م.ث، والحركة الثقيلة بـ JavaScript مُسمّاة كقاتل لـ INP
- `prefers-reduced-motion` من اليوم الأول، لا كإضافة لاحقة

### اتجاهات التصميم

يستحق الاستخدام: Bento grid + CSS scroll-driven animations + dark mode كاتجاه تصميمي + noise/texture + أزرار مغناطيسية + bottom nav على الجوال + kinetic typography + variable fonts.

قاعدة ذهبية من نماذج Anthropic: **اصرف الجرأة في مكان واحد** — عنصر واحد لا يُنسى، وكل ما حوله هادئ ومنضبط.

**المصادر:** [دليل Schema للمطاعم 2026](https://hustlemarketers.com/restaurant-schema-markup/) · [Restaurant schema markup — OnTheMap](https://onthemap.agency/blog/restaurant-schema-markup/) · [Structured Data for Restaurants 2026](https://chiwai.eu/en/knowledge/ai-ready-gastronomy/structured-data-restaurants/) · [تقرير اتجاهات الرسوم المتحركة 2026](https://motionkit.io/blog/web-animation-trends-2026) · [اتجاهات تصميم الويب 2026](https://spoko.space/blog/modern-website-design-trends/) · [أفضل مكتبات تمرير 2026](https://cssauthor.com/best-javascript-scroll-animation-scrollytelling-libraries/)

---

## 5. الفحص الأمني (حسب سياسة `skill-scout`)

قبل اعتماد أي نموذج خارجي:

- ✅ قرأت `SKILL.md` والـ frontmatter لكل النماذج الخمسة
- ✅ بحثت عن أوامر shell غير متوقعة، كتابات ملفات، نداءات شبكية، تعامل مع صلاحيات، أو تثبيت حزم → **لا شيء**
- ✅ `frontend-design` و`theme-factory`: محتوى إرشادي بحت (markdown + PDF)
- ✅ النماذج العربية: markdown بحت، الـ frontmatter يعلن `license: MIT` و`compatibility: No network required`
- ✅ تحققت أن كل ملف مُشار إليه داخل كل نموذج موجود فعلًا
- ❌ **استبعدت** `brand-guidelines` (خاص بهوية Anthropic، لا يناسب مطعمًا)
- ❌ **استبعدت** `web-artifacts-builder` (يحتوي سكربتات shell تثبّت حزم npm، ومصمم لملفات claude.ai الأحادية لا لموقع إنتاج)
- ✅ تحققت أن `scripts/ci/validate-skills.js` يفحص `skills/` فقط وليس `.claude/skills/` → التنصيب لا يكسر CI

**قرار إضافي:** تجنّبت تلويث مستودع ECC نفسه. المنصِّب الرسمي كان يوسّع الطلب تلقائيًا إلى 623 عملية و131 مهارة (يشمل Django وFlutter وC++ وRust وKotlin — لا علاقة لها بموقع مطعم)، ويعدّل `yarn.lock`. استعدت `yarn.lock` ونظّفت جذر المستودع، ونصّبت الحزمة **مركّزة داخل `restaurant-site/.claude/`** بدلًا من ذلك: 40 نموذجًا بدل 131، و848 ك.ب بدل 5.1 م.ب.

---

## 6. ما هو جاهز الآن للخطوة القادمة

```
restaurant-site/
└── .claude/
    ├── INSTALL-MANIFEST.json      ← توثيق أصل كل نموذج (provenance)
    ├── skills/                    ← 40 نموذجًا
    │   ├── restaurant-web-blueprint/     ← ابدأ من هنا
    │   │   ├── SKILL.md
    │   │   └── references/jsonld-stack.md
    │   ├── frontend-design/              ← Anthropic رسمي
    │   ├── theme-factory/                ← 10 ثيمات + PDF
    │   │   └── themes/*.md
    │   ├── arabic-rtl-best-practices/
    │   ├── arabic-rtl-mobile/
    │   ├── ux-writing-arabic/
    │   └── ... (34 نموذج ECC)
    └── rules/                     ← قواعد web + typescript + react + common
        └── web/design-quality.md  ← سياسة Anti-Template
```

**نقطة البداية في الخطوة القادمة:** افتح `restaurant-web-blueprint/SKILL.md`، القسم 11 (تسلسل البناء). الخطوة الأولى فيه هي **البريف** — وأنا بحاجة لمعلومات مطعمك الحقيقية لأبدأ.

---

## 7. ملاحظة مهمة

النماذج مُنصّبة وجاهزة، لكنها **لا تعرف شيئًا عن مطعمك بعد**. لا يمكن بناء موقع متطور فعليًا بمحتوى مُختلَق — اسم المطعم ونوع المطبخ والمدينة والقائمة الحقيقية والصور والدوام ورقم الهاتف كلها تؤثر مباشرةً في:

- اتجاه التصميم (مطعم مشاوي ≠ مقهى تخصصي ≠ مطعم بحري ≠ مطعم راقي)
- الـ schema (بدون NAP حقيقي لا يوجد SEO محلي أصلًا)
- لغة الموقع وRTL
- ميزات التحويل (توصيل؟ حجز؟ طلب واتساب؟)

لذلك الخطوة التالية تبدأ بأسئلة محددة، ثم بناء فعلي.
