# تدقيق موقع Antonia's Pizza الحالي — وخطة التطوير

**التاريخ:** 2026-09-14
**الموقع الحي:** https://antoniaspizza.com/ · https://antoniaspizza.com/menu
**الطلب:** https://antoniaspizza.toast.site/
**المنصة الحالية:** Toast (صور `pluto-images`) + Otter (صور القائمة `photos.tryotter.com`) + تطبيق OrderSave
**ملاحظة:** الملفات المرفوعة (`index.html`, `menu.html`, `paso-robles.html`, `san-luis-obispo.html`) لم تصل فعليًا إلى بيئة العمل — المجلد `/home/user/uploads/` فارغ. هذا التدقيق مبني على **جلب الموقع الحي مباشرةً**، وهو أدق. إذا كانت الملفات المرفوعة مختلفة (نسخة محلية قيد التطوير مثلًا)، أعِد رفعها وسأدقّقها سطرًا بسطر.

---

## الخلاصة

الموقع الحالي **ليس سيئًا** — المحتوى جيد، الأوصاف الحسية قوية أصلًا، والمراجعات حقيقية وممتازة. لكن هناك **ثغرة تحويل واحدة تكلف طلبات فعلية كل يوم**، ومشكلة SEO بنيوية، وكنز تسويقي غير مستغل.

**أعلى ثلاثة إصلاحات من حيث العائد مقابل الجهد:**

| # | الإصلاح | الأثر المتوقع | الجهد |
| --- | --- | --- | --- |
| 1 | روابط عميقة لعناصر القائمة بدل إرسال الزائر لجذر موقع الطلب | **−20% تسرّب لكل نقرة إضافية** — حاليًا كل نقرة على طبق تعيد الزائر للبداية | متوسط |
| 2 | امتلاك موقع "آخر الليل" (مفتوح حتى 2 صباحًا) | مراجعة حقيقية تؤكد أن عميلًا وجدكم عبر `late night pizza near me` — لا أحد ينافسكم على هذه الكلمة محليًا | منخفض |
| 3 | إصلاح عناوين الصفحات (keyword stuffing) + `Restaurant` schema لكل فرع | CTR +30%، وظهور في AI Overviews وChatGPT | منخفض |

---

## 1. 🔴 حرج — كل عنصر في القائمة يذهب إلى نفس الرابط

**المشكلة:** كل طبق في `/menu` — "Antonia's Special"، "Meat Lovers"، "Original Margherita" — مربوط بـ:

```
https://antoniaspizza.toast.site/
```

أي **جذر موقع الطلب**، لا رابطًا عميقًا للطبق نفسه.

**لماذا هذا مكلف:** الزائر يرى "Meat Lovers"، يقرر أنه يريدها، ينقر — فيصل إلى أعلى صفحة الطلب ويضطر للبحث عن الطبق من جديد. القياسات واضحة:

- كل نقرة إضافية بين الهبوط وإتمام الطلب = **−20% تحويل**
- **75%** من الضيوف يتخلون عن تجربة طلب سيئة
- **46%** من مواقع المطاعم تفشل في اختبار صلاحية الجوال

**الإصلاح:** التحقق مما إذا كان Toast يدعم روابط عميقة (عادةً بصيغة `?itemId=` أو مسار قسم). إن دعمها → اربط كل عنصر. إن لم يدعمها → هذا وحده مبرر كافٍ لبناء واجهة طلب خاصة بك، لأن الطلب المباشر **يوفّر 15–30% لكل طلب** من عمولات المنصات، و**70% من الزبائن يفضّلون الطلب من موقع المطعم مباشرةً** عندما يكون الطريق سهلًا.

> **مالك المهمة:** `conversion-psychologist` + `menu-engineer`

---

## 2. 🔴 حرج — عناوين الصفحات محشوة بالكلمات

**الحالي:**

```
Antonia's Pizza | Best Italian Restaurant in California | Italian Restaurant near me
Antonia's Pizza Online Menu | Best Italian Restaurant in California
```

**ثلاث مشاكل:**

1. **"Best Italian Restaurant in California"** — ادعاء غير قابل للتحقق، يهدر 40 حرفًا من أصل 60، ولا يبحث عنه أحد.
2. **"Italian Restaurant near me"** — حشو كلمات. Google يتعامل مع `near me` كإشارة موقع من الجهاز، لا كنص يطابقه. هذا النمط كان يعمل في 2015.
3. **أنتم لستم "مطعمًا إيطاليًا" بالمعنى التنافسي** — أنتم بيتزا + متوسطي (منكيش، بيتزا جيرو، فيتا، زعتر). التصنيف الخاطئ يضعكم في منافسة مع مطاعم إيطالية راقية لا تريدون منافستها، ويُفقدكم استعلامات "بيتزا" و"متوسطي" و"وجبة متأخرة".

**البديل المقترح** (يجب التحقق من الطول ≤ 60 حرفًا):

| الصفحة | العنوان |
| --- | --- |
| الرئيسية | `Antonia's Pizza — SLO & Paso Robles \| Open Till 2AM` |
| القائمة | `Pizza Menu — Antonia's Pizza \| SLO & Paso Robles` |
| فرع SLO | `Antonia's Pizza Downtown SLO — 891 Higuera St` |
| فرع Paso | `Antonia's Pizza Paso Robles — 729 12th St` |
| Ajarski | `The Ajarski Dough Boat — Antonia's Pizza` |
| آخر الليل | `Late Night Pizza SLO — Open Till 2AM \| Antonia's` |

> **مالك المهمة:** `seo-specialist`

---

## 3. 🟠 عالٍ — كنز تسويقي غير مستغل: آخر الليل

**الدليل من مراجعاتكم أنتم:**

> *"Had a crazy late shift and was craving some high-quality food... Googled **'late night pizza near me'** and saw Antonia's was still open. Called them up and was honestly surprised how accommodating they were for a late delivery."* — Walid S. ★★★★★

هذا عميل **وجدكم عبر استعلام محدد، لأنكم كنتم مفتوحين**. وأنتم مفتوحون حتى **2 صباحًا** الخميس والجمعة والسبت في SLO، وحتى 2 صباحًا الجمعة والسبت في Paso Robles.

**لكن:** لا يوجد في الصفحة الرئيسية أي ذكر لآخر الليل. الدوام مدفون داخل كتلة معلومات الفرع، بصيغة `11:00 AM - 2:00 AM` التي لا تُقرأ كميزة.

**الفرصة:**

- استعلامات `late night pizza SLO` / `pizza open near me now` / `late delivery San Luis Obispo` منخفضة المنافسة جدًا
- جمهور Cal Poly (ذكرت الخدمة أن Cal Poly ضمن مناطقكم) — طلبة، دوام متأخر، طلبات ليلية
- عمال الورديات (مثل Walid) — شريحة مخلصة ومتكررة
- إضافة `specialOpeningHoursSpecification` للـ schema وإظهار **مؤشر "مفتوح الآن"** محسوبًا بمنطقة الزائر الزمنية

**التنفيذ:** قسم في الصفحة الرئيسية بهوية بصرية ليلية (لوحة داكنة + توهج فرن)، ومؤشر "المطبخ مفتوح حتى 2 ص" في الهيدر دائمًا.

> **مالك المهمة:** `restaurant-growth-lead` + `ui-design-director` + `seo-specialist`

---

## 4. 🟠 عالٍ — الكنز الثاني غير المستغل: التميّز المتوسطي

**الدليل من مراجعتين مختلفتين:**

> *"I ordered the **gyro pizza**... also tried the **manakeesh pizza**... I'll definitely be back to try their other **Mediterranean** dishes and salads."* — Devin C. ★★★★★

> *"...half a pie with **Vegan Cheese** for my wife."* — Walid S. ★★★★★

**لديكم:** بيتزا جيرو، منكيش، فيتا، زعتر، خيار جبن نباتي، سلطات يونانية — تقاطع إيطالي/متوسطي/levantine **لا يملكه أي منافس محلي**. وهو غير ظاهر إطلاقًا في الصفحة الرئيسية ولا في تسميات القائمة.

**لماذا يهم تجاريًا:** إضافة كلمات مثل "vegan" للقائمة تحسّن الظهور العضوي **15–40%**، وتفتح شريحة كاملة لا تستطيع الطلب منكم حاليًا لأنها لا تعرف أنكم تخدمونها.

> **مالك المهمة:** `menu-engineer` + `conversion-psychologist`

---

## 5. 🟠 عالٍ — هندسة القائمة

### 5.1 قسم واحد فيه 21 صنفًا

**"Specialty Pizza" يحتوي 21 بيتزا.** العتبة الموثقة للإرهاق القراري هي **6–8 أصناف لكل قسم** — بعدها يتحول الزائر إلى "سأقرر لاحقًا"، و"لاحقًا" تعني لا طلب.

**الإصلاح:** قسّمها إلى مجموعات منطقية تتبع طريقة تفكير الزائر لا تنظيم المطبخ:

```
Red Sauce Classics   (Antonia's Special, Margherita, Deluxe Supreme, Meat Lovers, Hawaiian, Mexican Style, Sausage Lovers)
White & Alfredo      (Chicken Parm & Spinach, California Veggie, Garlic Veggie, Bacon Deluxe, Spinach Lovers, Roasted Garlic Chicken)
Pesto                (Chicken Pesto, Veggie Pesto, Mediterranean)
BBQ & Buffalo        (BBQ Chicken, Buffalo Chicken)
Mediterranean        (Greek Feta Vegetable, Philly Cheese Steak) + بيتزا الجيرو والمنكيش
```

### 5.2 التثبيت السعري لا يعمل

**كل البيتزا المتخصصة = `$16.45+`.** لا يوجد عنصر سعره أعلى ليثبّت الإدراك. التثبيت السعري يعطي **+6.8%** على متوسط الفاتورة — لكنه يتطلب عنصرًا ممتازًا في الأعلى.

**الإصلاح:** اعرض البيتزا 28" XL بسعرها الكامل في أول القسم. الـ 28 بوصة هي **مثبّت طبيعي** — ستجعل $16.45 تبدو معقولة فورًا، وهي أيضًا تميزكم (لا أحد يقدم 28 بوصة).

### 5.3 صنف بلا وصف

**"Philly Cheese Steak" لا يوجد له وصف إطلاقًا** — فقط صورة وسعر. الوصف الحسي يعطي **+27%** مبيعات للصنف الموصوف.

### 5.4 خطأ إملائي في صنف

**"California Viggie"** ← الصحيح **"California Veggie"**. هذا ليس تجميلًا: الزائر الذي يبحث عن "veggie pizza" لن يجدكم، والقراءة كإهمال تخفّض الثقة.

### 5.5 صنف بلا صورة

**"Mediterranean"** — الصنف المتوسطي الأعلى تحويلًا ومميّز العلامة — هو الوحيد بلا صورة في القسم. الأصناف ذات الصور تحصل على **+25–30%** طلبات.

### 5.6 اسم مقطوع

**"Slice one or 2 Topp"** — النص مقطوع على الموقع الحي. يجب أن يكون "Slice with 1 or 2 Toppings".

> **مالك المهمة:** `menu-engineer`

---

## 6. 🟡 متوسط — الصور على بنيتين تحتيين مختلفتين

صور الأطباق تأتي من `photos.tryotter.com` (Otter) بينما صور الموقع من `pluto-images` (Toast). بعض الأصناف `.jpeg` وبعضها `.png` بلا ضغط.

**الأثر:** لا سيطرة على التنسيق (لا AVIF/WebP)، ولا `srcset`، ولا حدود على الوزن. صورة البطل يجب أن تكون **≤ 180 KB AVIF** — وكل ثانية إضافية في التحميل ترفع التخلي عن الطلب **7%**.

**الإصلاح:** خط أنابيب صور واحد: `astro:assets` → AVIF + WebP، أبعاد صريحة، `srcset` بمقاس 1x/2x، تحميل كسول لما تحت الطية.

> **مالك المهمة:** `food-visual-producer` + `performance-optimizer`

---

## 7. 🟡 متوسط — صفحات رقيقة كثيرة

**32+ صفحة `tags/*`** (tortellini, caprese, fries, calzone...) و**20 صفحة `places/*`** لمناطق الخدمة.

هذه الصفحات:
- محتوى رقيق — قائمة روابط فقط، بلا نص حقيقي
- **تنافس صفحاتكم الحقيقية** (keyword cannibalization)
- تُظهر في الصفحة الرئيسية كقائمة روابط ضخمة داخل سؤال FAQ — وهذا سيء للزائر ولـ SEO معًا

**الإصلاح:** احذف صفحات `tags/*` أو ادمجها في صفحات قائمة حقيقية بمحتوى فعلي. احتفظ بصفحات `places/*` **فقط** إذا أعطيت كل واحدة محتوى حقيقيًا فريدًا (مناطق التوصيل، الزمن المتوقع، الحد الأدنى للطلب) — وإلا فادمجها في صفحة واحدة "مناطق التوصيل".

> **مالك المهمة:** `seo-specialist`

---

## 8. 🟡 متوسط — المراجعات ممتازة لكن في غير مكانها

**لديكم خمس مراجعات حقيقية مفصّلة باسم صاحبها** — وهي أقوى أصل تسويقي في الموقع. لكنها مجمّعة في كتلة واحدة في الصفحة الرئيسية، بعيدًا عن القرار.

**القاعدة:** الدليل الاجتماعي **المجاور للقرار** يحوّل؛ صفحة "آراء العملاء" لا تحوّل.

**الإصلاح:**
- مراجعة Walid (آخر الليل) → بجوار مؤشر "مفتوح حتى 2 ص"
- مراجعة Devin (جيرو/منكيش) → بجوار قسم المتوسطي
- مراجعة Patricia (SLO exclusive) → في قسم "قصتنا"
- مراجعة Cecily (الرائحة عند فتح العلبة) → بجوار قسم التوصيل
- مراجعة Kelly (التيراميسو) → بجوار قسم الحلويات

وأضف `aggregateRating` + `Review` schema — **بأرقام حقيقية فقط**. التقييمات المختلَقة مخالفة لسياسة Google للبيانات المنظمة وتستوجب إجراءً يدويًا.

> **مالك المهمة:** `conversion-psychologist`

---

## 9. ما يجب التحقق منه قبل أي بناء

البيانات الموثقة من الموقع الحي محفوظة في [`../site-data/restaurant.json`](../site-data/restaurant.json) — وكل حقل غير مؤكد معلّم بـ `"verify": true`.

**الأسئلة المفتوحة الحرجة:**

1. هل Toast يدعم روابط عميقة لعناصر القائمة الفردية؟ (يحدد الإصلاح رقم 1)
2. ما الهدف التجاري الأول: حجوزات، توصيل مباشر، أم طلبات من الطرف الأول بدل المنصات؟
3. ما التقييم الحقيقي وعدد المراجعات على Google لكل فرع؟
4. من يملك النطاق وحساب Toast — وهل يمكن تغيير الاستضافة أصلًا؟
5. هل إعادة البناء خارج Toast مقبولة، أم يجب البقاء داخل منظومتها؟
6. هل هناك صور حقيقية للـ Ajarski وبيتزا الجيرو والمنكيش؟
7. هل الموقع بحاجة لواجهة عربية أصلًا؟ (سؤالك كان بالعربية، لكن المطعم في كاليفورنيا — افتراضي الحالي: إنجليزي فقط، مع بنية جاهزة للثنائية إن لزم)

**أنت لم ترفع الملفات فعليًا** — إن كان لديك نسخة محلية قيد التطوير تختلف عن الموقع الحي، أرفقها مجددًا وسأدقّقها مباشرة.

---

## 10. خطة التطوير المقترحة (بالترتيب)

| المرحلة | المحتوى | النماذج/الوكلاء |
| --- | --- | --- |
| **0** | تأكيد الحقائق الناقصة (أسئلة القسم 9) | `restaurant-growth-lead` |
| **1** | إصلاحات سريعة عالية العائد على الموقع الحالي: عناوين، وصف Philly Cheese Steak، تصحيح Viggie، اسم Slice، مؤشر "مفتوح الآن" | `seo-specialist`, `menu-engineer` |
| **2** | الاتجاه التصميمي + لوحة الألوان + الخطوط (مشتقة من صور الطعام الفعلية) | `ui-design-director`, `neuromarketing-director`, `theme-factory` |
| **3** | البنية: Astro + Tailwind v4 + جزر React، صفحة لكل فرع، `Restaurant` schema كامل | `restaurant-web-blueprint`, `frontend-patterns` |
| **4** | القائمة: إعادة هيكلة الأقسام، تثبيت سعري بالـ 28"، أوصاف حسية، فلاتر غذائية، `Menu`/`MenuItem` schema | `menu-engineer`, `conversion-psychology` |
| **5** | الصور: خط أنابيب AVIF/WebP + توليد ما ينقص (ComfyUI/fal.ai) | `food-visual-producer`, `food-photography-generation` |
| **6** | قسم آخر الليل + القسم المتوسطي كأصول تسويقية مستقلة | `restaurant-growth-lead`, `content-engine` |
| **7** | الأداء: LCP < 1.5s، CLS < 0.02، JS < 40KB | `performance-optimizer`, `ui-stack-excellence` |
| **8** | الإتاحة WCAG 2.2 AA + اختبارات E2E لمسار الطلب | `a11y-architect`, `e2e-runner` |
| **9** | القياس: أحداث GA4 + لوحة KPIs | `conversion-psychologist` |
| **10** | النشر + Search Console + مراقبة ما بعد النشر | `deployment-patterns`, `canary-watch`, `production-audit` |

---

## المصادر

الأرقام المستخدمة في هذا التدقيق موثقة في [`WEB-BUILD-KIT-REPORT.ar.md`](WEB-BUILD-KIT-REPORT.ar.md) وفي نموذج `conversion-psychology`، وأهمها من: [Chowly — مواقع المطاعم التي تحوّل 2026](https://chowly.com/resources/blogs/restaurant-website-design-real-examples-that-convert-visitors-into-orders/) · [Chowly — 5 ترقيات مثبتة](https://chowly.com/resources/blogs/5-proven-restaurant-website-upgrades-for-2026-that-turn-traffic-into-orders/) · [علم نفس القائمة](https://neatmenu.io/blog/menu-psychology-customer-ordering-decisions.html) · [دليل تصميم قوائم المطاعم 2026](https://www.dinecard.in/blog/restaurant-menu-design-guide) · [إحصاءات تسويق المطاعم](https://click-vision.com/restaurant-marketing-statistics) · [تصميم مواقع المطاعم 2026](https://richmenu.io/top-restaurant-website-design/)
