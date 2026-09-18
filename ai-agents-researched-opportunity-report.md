# بحث وتطوير فكرة قابلة للتوسع إلى مليون دولار
## GCC Property Lead-to-Viewing OS

**الفكرة التي تم تطويرها:** نظام عربي/إنجليزي للشركات العقارية في السعودية والإمارات، يحوّل inquiry الوارد من WhatsApp أو الموقع إلى lead مؤهل، ثم يطابقه مع العقارات المناسبة، ويحجز viewing، ويسلّمه للوسيط البشري مع تسجيل المصدر والنتيجة.

**تاريخ البحث:** 18 سبتمبر 2026  
**الهدف التخطيطي:** الوصول إلى **$1M ARR**، لا الادعاء بأن ذلك مضمون.  
**افتراضات البداية:** مؤسس عربي/إنجليزي، لا يملك بعد distribution enterprise، ويريد البدء كـ productized service قبل بناء SaaS كامل.

> **الخلاصة في سطر واحد:** لا تبنِ chatbot للعقارات. بِع للوكالة نظاماً يقيس ويقلل ضياع leads ويزيد سرعة الوصول إلى viewing، مع AI محدود وhuman handoff.

---

## 1) الحكم التنفيذي

### القرار

**GO مشروط لمدة 30 يوماً** لاختبار هذا العرض في **مدينة واحدة فقط**: دبي أو الرياض، وليس كل الخليج.

### لماذا هذه الفكرة؟

1. **Workflow واضح وقابل للقياس:** lead يدخل، يرد عليه النظام، يجمع budget/location/type/timeline، يرسل عقارات من مصدر معتمد، ويحجز viewing.
2. **قيمة الـ lead عالية:** الشركة العقارية تستطيع ربط appointment أو viewing بفرصة بيع/إيجار؛ لذلك يمكن أن يكون سعر الحل أعلى من chatbot عام.
3. **هناك طلب فعلي على مكونات الحل:** يوجد طلب منشور على WhatsApp AI bot مع CRM وbooking، وخدمات جاهزة منخفضة السعر؛ هذا يثبت أن السوق يشتري التنفيذ، لكنه يثبت أيضاً أن التنفيذ العام commoditized.
4. **المنصات العامة موجودة:** Respond.io وSleekFlow وWATI وغيرها تجعل بناء inbox أو flow أسهل. لذلك لا تنافسها كـ software platform؛ نافسها في vertical workflow، البيانات، التشغيل، والنتيجة.
5. **سوق السعودية كبير بما يكفي للاختبار:** أبلغت Monsha'at عن 1.3 مليون منشأة SME في المملكة بنهاية 2023، مع تركّز 43.7% في منطقة الرياض. هذا ليس TAM خاصاً بالعقار، لكنه يثبت وجود قاعدة أعمال واسعة؛ لا تستخدمه كدليل أن كل هذه الشركات عملاء محتملون. [A-official، Monsha'at، 2024](https://www.monshaat.gov.sa/en/node/53859)

### الحكم الصريح

- **كـ SaaS عام:** لا أوصي به الآن؛ المنافسة والأسعار المنخفضة كبيرة.
- **كـ managed vertical service:** أراه قابلاً للاختبار؛ خصوصاً مع وكالات 5–50 وسيطاً لديها leads كثيرة من الإعلانات أو المواقع.
- **كطريق إلى $1M ARR:** ممكن حسابياً، لكنه يتطلب تقريباً 25–30 حساباً محتفظاً به، productized delivery، وفريق تنفيذ/دعم. ليس مشروعاً فردياً إلى الأبد.

---

## 2) ماذا بحثت؟ وكيف أقيّم الدليل؟

### درجات الدليل

- **[A1] مصدر رسمي/أولي:** Meta، جهة حكومية، صفحة تسعير رسمية، وثيقة API.
- **[A2] مصدر أولي غير مستقل:** صفحة vendor أو case study منشورة من الشركة نفسها؛ تثبت ما تعرضه الشركة، ولا تثبت وحدها ROI مستقلاً.
- **[B] إشارة طلب:** job post، marketplace، service listing، مراجعات أو انتشار منتج.
- **[C] استنتاج/افتراض تخطيطي:** نموذجنا المالي، سعر نقترحه، أو فرضية تحتاج اختباراً.

### ملاحظة مهمة على البحث

أسعار المنافسين تتغير، وبعضها يختلف حسب البلد والفوترة السنوية وعدد contacts. حفظت الروابط وتاريخ الوصول، لكن يجب أخذ screenshot أو export لصفحة السعر قبل التفاوض مع عميل. لا أتعامل مع ادعاءات vendor عن «زيادة التحويل» أو «آلاف العملاء» كحقيقة مستقلة إلا إذا صنّفتها [A2].

---

## 3) إشارات السوق والطلب

### 3.1 انتقال السوق من التجربة إلى التنفيذ

وجدت McKinsey في استطلاع **State of AI 2025** أن 23% من المشاركين قالوا إن مؤسساتهم توسّع نظاماً agentic في وظيفة واحدة على الأقل، بينما قال 39% إنهم بدأوا التجربة. الدلالة العملية: هناك اهتمام وتنفيذ مبكر، لكن معظم الشركات لم تصل إلى scale؛ بيع implementation وقياس workflow أقرب للفرصة من بيع «منصة AI» مجردة. [B، McKinsey، 5 نوفمبر 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)

### 3.2 الطلب على مهارات التنفيذ موجود، لكنه يضغط على السعر

- نشرت Upwork في يناير 2025 أن بعض مهارات AI المتخصصة نمت حتى 220% سنة بسنة، وذكرت أن **scripting & automation** من أسرع مهارات البرمجة نمواً. [B، Upwork، 15 يناير 2025](https://investors.upwork.com/news-releases/news-release-details/upwork-unveils-2025s-most-demand-skills)
- ظهر job post في أغسطس 2026 يطلب بناء WhatsApp AI bot داخل GoHighLevel مع product lookup، CRM، calendar booking وhuman fallback بميزانية **$400 fixed price**. هذا دليل [B] على وجود demand، لكنه أيضاً دليل أن «أوصل لك chatbot» وحدها خدمة منخفضة السعر. [B، Upwork job post، 2 أغسطس 2026](https://www.upwork.com/freelance-jobs/apply/GoHighLevel-Expert-Needed-WhatsApp-Bot-with-Conversation-Button-Flows-Custom-Product-Looku_~022084022547777914938/)
- خدمات Upwork المنشورة تعرض tiers مثل **$750–$2,000** لروبوت WhatsApp لدعم العملاء والحجز، مع extra fees للتكامل. هذه أسعار marketplace لخدمات فردية وليست متوسطاً لجميع السوق. [B، Upwork service listing](https://www.upwork.com/services/product/whatsapp-bot-for-customer-support-appointment-booking-1407565885359296512)

**الاستنتاج:** لا تدخل كمطور chatbot عام. ادخل كصاحب نتيجة: «نربط مصادر leads، نؤهلها، نحجز viewing، ونوثق أين تسربت الفرص».

### 3.3 دليل أن use case العقار حقيقي

نشرت Landbot case study لشركة Choices العقارية: تقول الشركة إن chatbot على WhatsApp شارك في **230+ محادثة خلال شهرين** ووصلت conversion من lead إلى appointment إلى **9%**. هذا vendor-reported case study [A2] وليس audit مستقلاً، ولا يثبت أن نفس الرقم سيحدث في دبي أو الرياض؛ لكنه يثبت أن appointment scheduling وdocument checking على WhatsApp workflow قابل للبيع والاستخدام. [A2، Landbot case study](https://landbot.io/case-studies/choices)

### 3.4 حجم قاعدة الأعمال

أعلنت Monsha'at أن عدد SMEs في السعودية بلغ **1.3 مليون** بنهاية 2023، وأن الرياض تضم 43.7% منها. الرقم يشمل كل القطاعات، ولا يعني أن 1.3 مليون prospect عقاري. فائدته هنا أنه يبرر اختبار قناة KSA، لا أنه يبرر forecast الإيراد. [A1، Monsha'at](https://www.monshaat.gov.sa/en/node/53859)

### 3.5 قيود WhatsApp ليست تفصيلاً تقنياً

تقول Meta إن business يجب أن يحصل على opt-in قبل إرسال الرسائل، وأن business-initiated messages خارج customer-service window تستخدم approved templates. كما تذكر Meta أن utility templates داخل customer-service window أصبحت مجانية من 1 يوليو 2025، وأن pricing أصبح per-message وفق الفئة والسوق. [A1، Meta policy](https://business.whatsapp.com/policy) و[A1، Meta pricing updates](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/)

هذا يؤثر مباشرة على العرض:

- لا نبيع cold broadcast لقائمة غير مصرح بها.
- نسجل مصدر opt-in ووقتَه وفئته.
- نمرر Meta fees إلى العميل بشفافية.
- نستخدم inbound وClick-to-WhatsApp ads وwebsite QR كقنوات آمنة للاختبار.

---

## 4) تشريح المنافسة

### 4.1 أدوات عامة يمكن للعميل شراؤها مباشرة

| المنافس/البديل | الدليل المنشور | ماذا يملك؟ | ثغرة محتملة لنا |
|---|---|---|---|
| **Respond.io** | $79 Starter، $159 Growth، $279 Advanced؛ Growth يشمل Workflows وAI Agents وAPI، مع contact/AI credit limits. [A1، pricing page](https://respond.io/pricing) | omni-channel inbox، automation، AI، integrations | ليس product عقاري بحد ذاته؛ العميل ما زال يحتاج design، property data، QA، attribution وoperator |
| **SleekFlow** | Pro $109/mo وPremium $279/mo في الصفحة الحالية؛ AI agents، omnichannel، Shopify/API، HubSpot/Zoho في Premium، وEnterprise custom. [A1، pricing page](https://sleekflow.io/pricing) | منصة محادثات وAI workflows | قوي كمنصة؛ لا ننافسه على feature count. نركب فوقه أو نستخدم بديلاً، ونبيع تشغيل العقار والنتيجة |
| **WATI** | صفحة المنتج تركز على marketing/support/sales، AI وWhatsApp automation وpartners؛ الأسعار المنشورة عبر aggregators تبدأ تقريباً من $59/mo، لكن السعر يتغير حسب الخطة والفوترة. [A1 للميزات](https://www.wati.io/pricing/) و[B للسعر المجمع](https://www.capterra.com/p/204314/WATI/pricing/) | WhatsApp-first inbox وflows | مناسب للبداية؛ لا يحل وحده matching، dedupe، property truth، viewing attribution |
| **Prop-Pilot / AnyOS** | إعلان one-time $1,800 لمنصة عقارية مع Arabic/English وWhatsApp وCRM. [A2، vendor page](https://anyos.in/proposal.html) | عرض منخفض السعر، one-time | يثبت ضغط السعر في الطبقة العامة؛ لا نستطيع بيع «بوت فقط» بسعر مرتفع بلا managed outcome |
| **WIYO** | يعلن عن CRM إماراتي للعقار مع Bayut/Property Finder/Dubizzle وWhatsApp، وخطط AED 1,000–9,900/mo. هذه claims وأسعار من vendor نفسه. [A2، vendor page](https://www.wiyo.ae/blog/best-real-estate-crm-dubai-2026) | vertical CRM أقرب لفكرتنا | منافس مباشر محتمل؛ نحتاج niche أضيق، تنفيذ أسرع، أو channel partnership لا clone |

### 4.2 منفذو الحلول والخدمات

- يعلن مزود في السعودية عن AI receptionist عربي/إنجليزي بسعر يبدأ من **SAR 750/mo**، مع implementation بين SAR 16,000 و45,000 حسب التكامل. هذه [A2] صفحة عرض vendor وليست متوسط سوق. [A2، Creatrixe](https://creatrixe.com/sa/services/ai-receptionist/)
- يذكر تحليل مزود في دبي أن chatbot WhatsApp البسيط يكلّف AED 12,000–40,000 مرة واحدة، مع retainer AED 1,500–5,000؛ هذه [A2] أسعار vendor لخدماته وليست benchmark محايداً. [A2، Innovatrix](https://www.innovatrixinfotech.com/blog/ai-automation-cost-dubai-2026-aed)
- تعرض بعض صفحات العقارات نطاقات أعلى بكثير، مثل AED 45,000–150,000 لـ custom real-estate chatbot؛ يجب التعامل معها كـ custom quote signal وليس كسعر قياسي. [A2، Korvax](https://korvax.ai/blog/whatsapp-ai-chatbot-for-real-estate/)

### 4.3 نتيجة المنافسة

السوق مقسم إلى ثلاث طبقات:

1. **Commodity:** $100–$2,000، chatbot أو flow بسيط؛ منافسة سعرية قوية.
2. **Platform:** $100–$1,000+ شهرياً، inbox/CRM/AI؛ العميل يشتري software ويظل مسؤولاً عن التنفيذ.
3. **Managed outcome:** تكامل + property data + attribution + optimization + SLA؛ هنا يمكن طلب setup وMRR أعلى، لكن يجب إثبات النتيجة.

**موقعنا المقترح:** الطبقة الثالثة، مع استخدام منصة جاهزة في أول العملاء بدلاً من بناء كل شيء من الصفر.

---

## 5) المنتج الفعلي: ما الذي سنبنيه؟

### الاسم العملي

**Property Lead-to-Viewing OS**  
بالعربية في البيع: **نظام تحويل استفسارات العقارات إلى زيارات مؤهلة**.

### العميل المثالي ICP

ابدأ بواحد فقط:

> وكالة عقارية في دبي أو الرياض، لديها 5–30 وسيطاً، تستقبل leads من Meta/website/portal، وتدفع على الأقل لبعض الإعلانات أو لديها inventory متجدد، لكن لا تملك owner واضحاً لسرعة الرد والمتابعة.

### إشارات تأهيل العميل

**نعم:**

- أكثر من مصدر leads.
- رقم WhatsApp واضح في الإعلانات/الموقع.
- مدير مبيعات أو operations يستطيع القرار.
- CRM أو spreadsheet قابل للربط.
- عقارات بمعلومات منظمة: price, location, type, availability, payment plan.
- مستعد لمشاركة baseline مجهّل لمدة 30 يوماً.

**لا:**

- يريد bulk messaging لقائمة scraped.
- لا يملك حق استخدام property images/details.
- يريد أن يعطي agent وعوداً عن ROI أو visa أو financing دون مراجعة بشرية.
- لا يملك شخصاً يتولى hot leads.
- يطلب custom marketplace قبل دفع pilot.

### الـ workflow المقترح

```text
Ad / Website / QR / approved inbound source
                ↓
WhatsApp Cloud API or approved BSP
                ↓
Intent + language detection (Arabic/English)
                ↓
Consent + minimal lead fields
                ↓
Deduplication + CRM record
                ↓
Qualification: buy/rent, budget, location, type, timeline
                ↓
Retrieve only from approved property catalogue
                ↓
Human-approved answer for sensitive claims
                ↓
Calendar slot + viewing booking
                ↓
Route to agent by location/project/availability
                ↓
Reminder + post-viewing outcome
                ↓
Dashboard: response, qualified, booked, attended, source, cost
```

### ما يفعله AI وما لا يفعله

**يسمح له:**

- تصنيف الرسالة واللغة.
- جمع الحقول المعلنة.
- البحث في catalogue محدث.
- اقتراح 2–3 listings وفق قواعد مكتوبة.
- اقتراح موعد من calendar.
- تلخيص المحادثة للوسيط.
- اكتشاف intent وطلب human handoff.

**لا يسمح له دون موافقة بشرية:**

- تغيير السعر أو payment plan.
- تأكيد availability غير المزامنة.
- إعطاء financial return أو mortgage advice.
- تفسير قوانين الإقامة/التأشيرة.
- رفض عميل أو ترتيب قانوني يسبب ضرراً.
- إرسال marketing templates بلا consent.

---

## 6) العرض والتسعير المقترح

هذه **أسعار اختبارية [C]** وليست أسعار سوق مؤكدة. الهدف هو اكتشاف willingness-to-pay مع نطاق واضح، لا نسخ أسعار المنصات.

| الباقة | العميل المناسب | ما يستلمه | Setup مقترح | MRR مقترح |
|---|---|---|---:|---:|
| **Pilot** | وكالة واحدة، رقم واحد، workflow واحد | discovery، baseline، WhatsApp، CRM أو sheet، calendar، 20–30 test scenarios، human handoff، report 30 يوماً | $4,000–$7,500 | $1,000–$1,800 |
| **Growth** | 5–20 وسيطاً، أكثر من مصدر lead | multi-source intake، property catalogue، lead dedupe، routing، bilingual QA، dashboards، weekly optimization | $8,000–$15,000 | $2,500–$4,500 |
| **Developer/Group** | مشاريع أو فروع متعددة | multi-project catalogue، CRM/ERP integration، SLA، roles، audit، custom approval، partner support | $20,000–$50,000 | $6,000–$12,000 |

### قاعدة التسعير

- Meta/BSP/voice/SMS usage يكون **pass-through** أو له حد واضح.
- لا تَعِد بـ «عدد leads» إذا العميل هو من يشتري الإعلانات.
- سعّر integration وdata cleanup وQA منفصلة أو ضمن setup.
- أول عميلين يمكن أن يحصلوا على **pilot discount مقابل access إلى baseline وشهادة**، لا مجانية مفتوحة.

### الرسالة البيعية

> «لا نبيع chatbot. نركب نظاماً يرد على استفسارات العقارات بالعربي والإنجليزي، يجمع budget/location/type، يرسل معلومات من catalogue معتمد، ويحجز viewing أو يسلّم lead ساخناً للوسيط. خلال 30 يوماً نقيس response time، qualified leads، viewings، attendance، ومصدر كل lead. إذا لم نستطع قياس baseline، لن نعدك بزيادة في المبيعات.»

---

## 7) طريق المليون دولار — الحساب وليس الحماس

### سيناريو base [C]

بعد productization:

- 10 حسابات **Pilot/Growth صغيرة** بمتوسط $1,500 MRR = $15,000 MRR.
- 10 حسابات **Growth** بمتوسط $3,000 MRR = $30,000 MRR.
- 5 حسابات **Developer/Group** بمتوسط $8,000 MRR = $40,000 MRR.
- المجموع = **$85,000 MRR**.
- $85,000 × 12 = **$1,020,000 ARR**.

رسوم setup في هذا السيناريو ليست داخلة في ARR، وقد تضيف cash لتمويل الفريق، لكنها ليست recurring revenue.

### ما الذي يجب أن يكون صحيحاً؟

1. 25 حساباً يظلون active ولا يغادرون بعد أول شهرين.
2. متوسط MRR لا ينخفض بسبب discounting المستمر.
3. onboarding يتكرر دون أن ينفذه المؤسس كله.
4. property catalogue وCRM data نظيفان بما يكفي.
5. لكل عميل owner بشري يتعامل مع hot leads.
6. acquisition channel لا يعتمد على رسائل مخالفة للـ opt-in.
7. الشركة تستطيع تبرير السعر من خلال تكلفة lead الضائعة أو وقت الفريق.

### نموذج مختلف أكثر تحفظاً [C]

- 15 عميل enterprise بمتوسط $5,000 MRR = $75,000 MRR.
- 5 عملاء نمو بمتوسط $2,000 MRR = $10,000 MRR.
- الإجمالي = $85,000 MRR، لكن دورة البيع أطول وcustomer concentration أعلى.

### الفرق بين ARR والربح

إذا كان gross margin المستقر 75% **[C]**، فـ $1.02M ARR يعطي تقريباً $765k gross profit قبل salaries، sales، contractors، legal، insurance، support، taxes وoverhead. لذلك لا تقول «مليون دولار لي»؛ هذه شركة بإيراد مليون، وقد يكون صافي الربح أقل بكثير.

### أهداف شهرية تخطيطية [C]

| الفترة | عدد العملاء النشطين | MRR مستهدف | الدليل المطلوب |
|---|---:|---:|---|
| يوم 30 | 1 paid pilot | $1k–$2k | baseline واتفاق نطاق |
| يوم 90 | 3–5 | $5k–$12k | result report + testimonial |
| شهر 6 | 6–10 | $15k–$30k | deployment playbook |
| شهر 12 | 10–15 | $30k–$50k | retention + أول partner |
| شهر 18–30 | 20–30 | $60k–$85k+ | MRR متكرر وفريق delivery |

هذه targets داخلية [C] وليست forecast سوق.

---

## 8) اقتصاد العميل الواحد

### نموذج حساب [C]

لعميل Growth بسعر $3,000 MRR:

| البند | مثال تخطيطي |
|---|---:|
| MRR | $3,000 |
| platform/BSP/LLM/hosting/usage | $250–$700 |
| support وQA المباشر الموزع | $300–$600 |
| gross profit التقريبي | $1,700–$2,450 |
| gross margin التقريبي | 57%–82% |

لا تعتبر هذا هامشاً مضموناً. راقب actual usage لكل tenant، خصوصاً marketing messages وvoice.

### قواعد مالية

- CAC payback المستهدف: أقل من 4 أشهر **[C]**.
- لا تسمح بـ unlimited usage في الباقة.
- احتفظ بحد API/WhatsApp شهري وalert عند 50% و80% و100%.
- لا تضف integration custom قبل change order.
- لا توظف full-time حتى يغطي MRR المتكرر تكلفة الوظيفة لثلاثة أشهر متتالية.
- إذا كان support يتجاوز 5 ساعات شهرياً للعميل Growth دون paid scope، إما أن ترفع السعر أو تصلح المنتج. **[C] threshold داخلي، اختبره.**

---

## 9) خطة إثبات 30 يوماً

### الأيام 1–3: تحديد السوق

اختر مدينة واحدة وsub-vertical واحداً:

- Dubai off-plan agencies، أو
- Riyadh residential agencies، أو
- وكالة property management لديها viewing/maintenance workflow.

لا تختَر الثلاثة معاً.

### الأيام 4–7: قائمة 100 حساب

المصادر:

- مواقع الشركات وصفحات LinkedIn العامة.
- Google Business Profiles.
- صفحات الشركات التي تعرض WhatsApp/lead forms.
- Meta Ad Library لمعرفة من يشغّل إعلانات عامة، مع الالتزام بالشروط وعدم scraping غير مسموح.
- شركاء CRM/marketing المحليون.

لكل حساب سجّل: city، niche، عدد الوكلاء التقريبي، lead channel، WhatsApp number، CRM clue، decision-maker، signal للمشكلة، وسبب outreach.

### الأيام 8–14: 20 مقابلة

أسئلة لا تبدأ بـ AI:

1. من أين جاءت آخر 100 inquiry؟
2. كم يستغرق الرد خارج ساعات العمل؟
3. ماذا يحدث إذا سأل العميل عن عقار غير متاح؟
4. كيف تعرف أن lead حجز viewing؟
5. أين تضيع البيانات بين WhatsApp وCRM؟
6. ما نسبة من يرد بعد أول رسالة؟
7. من يملك مسؤولية follow-up؟
8. كم ساعة أسبوعياً يقضي الفريق في الأسئلة المتكررة؟
9. ما آخر workflow حاولتم أتمتته ولم ينجح؟
10. إذا أثبتنا baseline خلال 30 يوماً، من يوقّع pilot وما الميزانية؟

لا تقبل «فكرة ممتازة» كدليل. الدليل هو: data access، intro إلى صاحب القرار، أو دفع.

### الأيام 15–21: 5 audits و3 عروض

لكل prospect:

- ارسم lead flow الحالي.
- اطلب 20 محادثة مجهّمة أو metrics، لا بيانات شخصية خام.
- أظهر missed handoffs وحقولاً غير موحدة.
- قدّم 30-day paid pilot مع acceptance criteria.

### الأيام 22–30: إغلاق pilot الأول

الحد الأدنى:

- عميل دفع.
- نقطة بداية محفوظة.
- مصدر leads معرّف.
- شخص من العميل يراجع property facts.
- calendar/CRM access محدود.
- موافقة privacy/data processing.

### معايير القتل أو التغيير

- بعد 20 مقابلة: أقل من 8 لديهم نفس الألم المتكرر → غيّر الـ vertical.
- بعد 100 outreach مؤهل: أقل من 8 ردود إيجابية → غيّر الرسالة/ICP قبل البناء.
- بعد 5 discovery calls: لا أحد يقبل paid diagnostic أو pilot → غيّر offer أو pricing.
- بعد 3 pilots: لا يمكن قياس response/qualification/viewing أو لا يتحسن workflow → أوقف النسخة الحالية.
- بعد شهرين: gross margin أقل من 60% مع support مرتفع → re-price أو kill.

كل هذه الحدود **[C]**؛ فائدتها منعك من تبرير فكرة لا يدفع لها السوق.

---

## 10) الرسائل الجاهزة

### رسالة عربية قصيرة

> مرحباً [الاسم]، لاحظت أن [اسم الشركة] يستقبل استفسارات عقارية عبر WhatsApp/الموقع. أعمل على نظام صغير يرد فورياً بالعربي والإنجليزي، يجمع الميزانية والمنطقة ونوع العقار، ثم يحجز viewing أو يسلّم الـ lead للوسيط مع تسجيل المصدر. لا أريد أن أرسل لك عرضاً عاماً؛ هل يمكن أن أسألك 3 أسئلة عن أين تضيع الاستفسارات عندكم؟ إذا لم توجد مشكلة قابلة للقياس، لن أقترح pilot.

### English message

> Hi [Name], I noticed [Company] handles property inquiries through WhatsApp/website. I’m testing a focused system that replies in Arabic/English, captures budget/location/property type, books a viewing, or hands a qualified lead to the right agent with source tracking. I’m not pitching a generic chatbot. Could I ask you three questions about where inquiries currently get lost? If there is no measurable workflow problem, I won’t recommend a pilot.

### عرض الـ pilot

> نقترح 30 يوماً لنظام واحد ورقم واحد: intake → qualification → catalogue lookup → booking/handoff. نثبت baseline قبل التشغيل ونراجع أسبوعياً. لا يشمل bulk marketing، ولا وعوداً بسعر العقار أو التمويل، ولا يشمل إدخال بيانات غير موثوقة. السعر [X] setup + [Y] للشهر، مع pass-through لتكاليف Meta/BSP.

---

## 11) التقنية المقترحة لأول عميل

### لا تبنِ منصة من اليوم الأول

لأول 3–5 عملاء:

- **WhatsApp:** Meta Cloud API مباشرة أو BSP موثوق يوافق عليه العميل.
- **Inbox/flow:** Respond.io أو SleekFlow أو WATI حسب channels وbudget؛ استخدم الأدوات المعلنة ولا تخترع unofficial WhatsApp API.
- **Orchestration:** n8n أو Make للحالات المحدودة.
- **Database:** Postgres/Supabase مع tenant isolation.
- **CRM:** اربط CRM العميل أو ابدأ بـ controlled spreadsheet كـ pilot فقط.
- **Calendar:** Google/Microsoft calendar مع availability rules.
- **Model:** structured outputs وtool calling؛ لا تجعل الـ LLM يكتب إلى CRM دون schema validation.
- **Observability:** traces، tool errors، latency، cost per conversation، escalation reason.
- **Dashboard:** source → inbound → qualified → booked → attended → sold، مع تعريفات يوافق عليها العميل.

### Evals قبل الإطلاق

أنشئ test set من:

- أسئلة أسعار ومعلومات العقار.
- عقار غير متاح.
- code-switching عربي/إنجليزي.
- لهجة محلية وtypos.
- budget ناقص.
- طلب mortgage/visa/ROI.
- prompt injection أو طلب تجاهل القواعد.
- طلب agent بشري.

يجب وجود: confidence boundary، fallback، kill switch، approval قبل external side effects، وسجل audit. توصي OpenAI باستخدام traces وgraders وevaluation runs، وتذكر human review قبل الأفعال الحساسة. [A1، OpenAI](https://developers.openai.com/api/docs/guides/agent-evals) و[A1، OpenAI guardrails](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)

---

## 12) الامتثال والخصوصية

### WhatsApp

Meta تشترط opt-in قبل التواصل، احترام opt-out، وعدم التضليل أو spam. خارج customer-service window يجب استخدام approved templates. هذا يعني أن المنتج يحتاج consent log وopt-out command وtemplate owner. [A1، WhatsApp Business Messaging Policy](https://business.whatsapp.com/policy)

### السعودية

- PDPL ينظم معالجة personal data داخل المملكة، وتوضح SDAIA أن consent يجب أن يكون واضحاً ومحدداً وقابلاً للإثبات، وأن consent منفصل قد يلزم لكل purpose.
- تذكر اللوائح السعودية أن consent الصريح مطلوب في حالات منها sensitive data والقرارات القائمة حصراً على automated processing.
- لا ترسل full conversation logs إلى أي model/provider بلا data-processing terms، minimization، retention policy، ومراجعة transfer requirements.

المصدر الرسمي: [A1، SDAIA Implementing Regulations](https://sdaia.gov.sa/en/SDAIA/about/Documents/ExecutiveRegulationsEn.pdf) و[دليل SDAIA للـ controllers/processors](https://dgp.sdaia.gov.sa/wps/wcm/connect/f579bc32-fda8-47bd-bc6f-66b8cb77985c/ENG-Guide+to+the+saudi+PDP+law+for+controllersprocessors.pdf?MOD=AJPERES)

### الإمارات

ينص البوابة الحكومية الإماراتية على أن Federal Decree Law No. 45 of 2021 يوفر إطار حماية البيانات، ويغطي المعالجة داخل الدولة وخارجها، ويضع ضوابط للمعالجة والنقل عبر الحدود. [A1، UAE Government](https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws)

### Contract language المقترح

- العميل Controller، ونحن Processor حسب الأدوار الفعلية؛ لا تفترض الوضع القانوني دون محامٍ.
- تحديد data categories وpurpose وretention وsub-processors.
- لا نستخدم بيانات العميل لتدريب عام.
- incident notification وaccess control وdeletion/return.
- disclaimer أن agent ليس وسيطاً مرخصاً ولا يقدم legal/financial advice.
- مراجعة محامٍ محلي قبل التعامل مع sensitive data أو automated profiling.

هذه ليست استشارة قانونية.

---

## 13) أول ثلاثة عملاء محتملين

### العميل 1 — وكالة عقارية صغيرة في دبي

**خصائصه:** 5–15 وسيطاً، رقم WhatsApp عام، إعلانات أو landing pages، لا يوجد رد ثابت بعد ساعات العمل.  
**العرض:** Pilot رقم واحد + calendar + qualification + dashboard.  
**دليل النجاح:** نسبة الرد خلال 5 دقائق، qualified leads، viewings booked، attendance.

### العميل 2 — وكالة off-plan في الرياض

**خصائصه:** مشروع أو أكثر، أسئلة متكررة عن location/price/payment plan، فريق مبيعات يتابع على WhatsApp.  
**العرض:** property catalogue مع approval workflow، lead routing، Arabic/English، reminders.  
**المخاطرة:** لا تسمح للـ AI بتفسير financing/eligibility دون مراجعة.

### العميل 3 — شركة property management

**خصائصه:** recurring tenant/owner inquiries وحجوزات صيانة أو viewing، volume مستمر أكثر من event campaign.  
**العرض:** support/intake أولاً، ثم viewing/maintenance scheduling.  
**الفائدة:** recurring workflow قد يكون أكثر ثباتاً من speculative sales leads.

### أين تجدهم؟

- LinkedIn: founder، sales director، operations manager.
- مواقع الشركات مع CTA WhatsApp.
- Google Business Profiles.
- شركاء CRM وmarketing في دبي/الرياض.
- Meta Ad Library للشركات التي تشغّل إعلانات عامة؛ لا تجمع بيانات شخصية ولا ترسل spam.

---

## 14) استراتيجية التوسع

### المرحلة 1: service-led

أنت تبيع وتنفذ. الهدف 3 pilots، ليس 100 عميل.

### المرحلة 2: productized delivery

حوّل التكرار إلى:

- property schema موحد.
- onboarding form.
- catalogue import.
- 100 golden test cases.
- routing templates.
- reporting template.
- incident runbook.

### المرحلة 3: channel partner

استهدف:

- CRM implementer.
- marketing agency تشغّل lead ads.
- real estate consultant.
- call center يقدم L1 support.

نموذج الشريك لا يبدأ قبل وجود retention وcase study. حدّد ownership للعميل، الدعم، renewal، data access والعمولة.

### المرحلة 4: SaaS/multi-tenant

ابنِ custom multi-tenant backend فقط عندما:

- لديك 5+ عملاء متشابهين.
- 70% من workflow مشترك **[C]**.
- تعرف أكثر 20 exceptions تكراراً.
- دفع العملاء ثمن integration وليس مجرد طلب demo.
- تعرف أن المنصة الحالية تمنع التوسع فعلاً.

---

## 15) ما الذي قد يجعلني أرفض الفكرة؟

سأغيّرها إذا ظهر واحد من الآتي:

1. كل عميل يريد CRM مختلفاً، ولا يوجد workflow مشترك.
2. agencies تحب demo لكنها لا تملك budget owner.
3. العميل لا يستطيع إعطاء baseline أو يرفض human owner.
4. leads قليلة، وبالتالي لا توجد نتيجة قابلة للقياس.
5. property data غير موثوقة أو تتغير دون owner.
6. السعر المقبول ينخفض إلى مستوى platform commodity.
7. Meta/PDPL/contract risk أعلى من قدرة الفريق.

### البدائل إذا فشلت العقارات

- **Home-services lead recovery:** HVAC، صيانة، تنظيف، solar؛ نفس engine لكن attribution أبسط.
- **Logistics document intake:** قيمة عقد أعلى، دورة بيع أطول، امتثال أشد.
- **Arabic customer support/order-status:** volume أعلى، لكن pricing pressure أقوى.

لا تنتقل إلى alternative لأنك مللت؛ انتقل بسبب بيانات الاختبار.

---

## 16) النتيجة النهائية

### التوصية

ابدأ بـ **Dubai أو Riyadh**، وبيع **30-day paid pilot** لوكالة عقارية واحدة، لا chatbot عاماً. استخدم منصة جاهزة في أول نسخة، وابنِ differentiation في:

- Arabic/English workflow.
- property truth and catalogue governance.
- lead dedupe and source attribution.
- viewing scheduling.
- agent handoff.
- weekly ROI reporting.
- compliance and evals.

### أول 72 ساعة

1. اختر Dubai أو Riyadh، واختر agency أو off-plan أو property management.
2. ابنِ قائمة 50 شركة بها signal واضح.
3. أرسل 15 رسالة شخصية واحجز 5 مقابلات.
4. جهّز demo ببيانات عقارات وهمية، لا بيانات حقيقية.
5. لا تدفع لبناء SaaS قبل أن تحصل على أول paid pilot.

**GO بعد بحث مكتبي، وليس GO نهائي للسوق.** القرار النهائي لا يصدر إلا بعد interviews وpaid pilot. الهدف ليس أن يقتنع الناس بأن AI رائع؛ الهدف أن يدفع عميل، يسمح بقياس baseline، ويجدد بعد شهر.

---

## المصادر

1. **Monsha'at — SME statistics:** https://www.monshaat.gov.sa/en/node/53859
2. **McKinsey — State of AI 2025:** https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
3. **Upwork — 2025 in-demand skills:** https://investors.upwork.com/news-releases/news-release-details/upwork-unveils-2025s-most-demand-skills
4. **Upwork — WhatsApp AI bot job, Aug 2026:** https://www.upwork.com/freelance-jobs/apply/GoHighLevel-Expert-Needed-WhatsApp-Bot-with-Conversation-Button-Flows-Custom-Product-Looku_~022084022547777914938/
5. **Upwork — WhatsApp chatbot service tiers:** https://www.upwork.com/services/product/whatsapp-bot-for-customer-support-appointment-booking-1407565885359296512
6. **Landbot — Choices real-estate case study:** https://landbot.io/case-studies/choices
7. **Respond.io — official pricing:** https://respond.io/pricing
8. **SleekFlow — official pricing:** https://sleekflow.io/pricing
9. **WATI — official pricing/features:** https://www.wati.io/pricing/
10. **WATI price aggregator signal:** https://www.capterra.com/p/204314/WATI/pricing/
11. **Prop-Pilot / AnyOS — vendor offer:** https://anyos.in/proposal.html
12. **WIYO — UAE real-estate CRM vendor offer:** https://www.wiyo.ae/blog/best-real-estate-crm-dubai-2026
13. **Creatrixe — Saudi AI receptionist vendor offer:** https://creatrixe.com/sa/services/ai-receptionist/
14. **Innovatrix — Dubai automation pricing vendor guide:** https://www.innovatrixinfotech.com/blog/ai-automation-cost-dubai-2026-aed
15. **Meta — WhatsApp Business Messaging Policy:** https://business.whatsapp.com/policy
16. **Meta — WhatsApp pricing updates:** https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/
17. **SDAIA — Executive Regulations:** https://sdaia.gov.sa/en/SDAIA/about/Documents/ExecutiveRegulationsEn.pdf
18. **SDAIA — Guide for controllers/processors:** https://dgp.sdaia.gov.sa/wps/wcm/connect/f579bc32-fda8-47bd-bc6f-66b8cb77985c/ENG-Guide+to+the+saudi+PDP+law+for+controllersprocessors.pdf?MOD=AJPERES
19. **UAE Government — data protection laws:** https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws
20. **OpenAI — Agent Evals:** https://developers.openai.com/api/docs/guides/agent-evals
21. **OpenAI — Guardrails and human review:** https://developers.openai.com/api/docs/guides/agents/guardrails-approvals

**تنبيه المصادر:** أرقام pricing من صفحات vendors هي أسعار معلنة من أصحابها [A2] وليست دراسة مستقلة. أرقام الإيراد والـ MRR وعدد العملاء في خطة المليون هي حسابات تخطيطية [C].
