# المنصات والأسواق والتشغيل

## 1. اختيار متجر أساسي

| المنصة | التكلفة الأساسية في الولايات المتحدة (مرجع 2026) | API | متى تناسبك؟ | المقابل/المخاطر |
|---|---:|---|---|---|
| Shopify | Basic $29 شهرياً سنوياً أو $39 شهرياً؛ Grow $79/$105؛ Advanced $299/$399؛ Plus يبدأ من $2,300/شهر حسب العقد. معالجة بطاقات إضافية ورسوم تطبيقات/ثيم. [التسعير](https://www.shopify.com/pricing) | Admin GraphQL أساسي؛ webhooks؛ REST Admin API قديم/legacy | أفضل بداية مُدارة لمعظم DTC: استضافة، checkout، ecosystem، دعم تطبيقات وقنوات | SaaS، مصروف شهري، تطبيقات تضيف كلفة، قيود API/قواعد وسياسات؛ لا تفترض أن Shopify Payments متاح ببلدك |
| WooCommerce | برنامج المتجر الأساسي مجاني/مفتوح المصدر؛ الاستضافة/النطاق/الإضافات/التحسين والدفع منفصلة. Woo تقدّر الاستضافة لمعظم المتاجر بنحو $25–$350/شهر حسب الحجم. [Woo pricing](https://woocommerce.com/pricing/) | REST API `/wp-json/wc/v3`; webhooks؛ مفاتيح read/write | تملك التحكم والكود والبيانات، تخصيص واسع، فريق WordPress أو متطلبات خاصة | أنت مسؤول عن التحديثات، النسخ الاحتياطي، الأمن، الأداء والإضافات المتضاربة |
| BigCommerce | Core/Standard: $39 شهرياً أو $29 سنوياً؛ Growth/Plus: $105/$79؛ Scale/Pro: $399/$299؛ Performance/Enterprise حسب العقد. حدود GMV/رسوم مزود دفع مفتوح تختلف حسب الخطة/السوق؛ راجع التحديث الرسمي [2](https://www.bigcommerce.com/dm/plan-pricing-updates-2026/) | REST وGraphQL حسب المجال، webhooks | كتالوجات كبيرة وB2B ومتعدد القنوات دون الحاجة لإضافة لكل شيء | التغييرات في حدود الإيراد/التسعير ومزود الدفع تتطلب قراءة العقد |
| Wix | لا تخلط الخطة المجانية (موقع Wix ذي نطاق/إعلانات Wix) بخطة التجارة. أسعار سنوية إرشادية 2026: Core نحو $29، Business $39، Business Elite $159 شهرياً؛ الشهرية أعلى. [مرجع خطط Wix](https://www.wix.com/blog/wix-premium-plans) | Wix Stores/HTTP APIs، Velo، webhooks بحسب الخدمة | متجر صغير يريد محرراً مرئياً وموقعاً ضمن حزمة واحدة | مرونة بيانات/تشغيل أقل من Woo؛ الاعتماد على بنية Wix |
| Squarespace | خطط US تغيرت 2025–26؛ الأسعار المنشورة قد تختلف حسب تاريخ/منطقة: تحقق من صفحة [الأسعار](https://www.squarespace.com/pricing). صفحة الأسعار الرسمية مرجع الشراء، لا مقال قديم. خطط التجارة قد تتراوح تقريباً من عشرات الدولارات إلى $100+ شهرياً؛ الرسوم المدمجة تختلف بالخطة | Commerce API/Developer Platform بحسب الخطة والمنتج | كتالوج صغير، علامة تعتمد على الصور والتصميم، محتوى وموقع بسيط | ليس الخيار الأول لكاتالوج/سير عمل متعدد الأسواق عالي التعقيد؛ تكامل API محدود بالخطة |

**رسوم دفع Shopify (لقطة الولايات المتحدة، لا تشمل الضرائب):** صفحة الأسعار تعرض معدلات Shopify Payments تبدأ تقريباً من 2.9% + $0.30 على Basic، 2.7% + $0.30 على Grow، 2.5% + $0.30 على Advanced؛ إذا استخدمت بوابة طرف ثالث قد تنطبق رسوم معاملات إضافية على الخطة (مثال ظاهر: 2%/1%/0.6% على Basic/Grow/Advanced). قارن المجموع الفعلي مع بوابتك والبلد قبل الاختيار [Shopify pricing](https://www.shopify.com/pricing).

### Shopify: من الصفر حتى أول طلب

1. **الكيان والبلد:** تحقق من أهلية Shopify Payments في بلد النشاط؛ عيّن بلد المتجر وعملة الدفع والعملة المعروضة بشكل صحيح. لا تستخدم عنواناً أو شركة وهمية لتجاوز الأهلية.
2. **الدومين والبريد:** نطاق يملكه النشاط، بريد باسم النطاق، DNS، SPF/DKIM/DMARC. لا ترسل حملات من Gmail شخصي.
3. **الخطة والثيم:** ابدأ بثيم مجاني سريع، ولا تشتري ثيماً بـ$400 قبل إثبات أن تصميم الثيم أو ميزة موجودة فيه تحل مشكلة فعلية. اختبر الهاتف، سرعة الصور، نقاط التباين، الوصولية، وcheckout.
4. **المنتجات:** أسماء واضحة، صور حقيقية أو مرخصة، SKU ثابت، variants، سعر/تكلفة/وزن/مخزون، منشأ بلد الشحن، زمن التحضير، سياسة الضمان والمرتجع. لا تكتب «طبي» أو «آمن 100%» من دون سند.
5. **المدفوعات والضرائب:** فعّل مزوداً مسموحاً ببلدك، اختبر transaction وrefund، واضبط الضرائب حسب العلاقة القانونية ومكان العميل. ضريبة المبيعات الأمريكية قد تختلف حسب nexus والولايات؛ استشر CPA.
6. **الشحن:** مناطق الشحن والأسعار، مواعيد واقعية، عناوين الإرجاع، عينة فعلية، سياسة التعويض عند الضياع. لا تَعِد بـ3 أيام إذا المورد يسلم خلال 18 يوماً.
7. **الثقة والسياسات:** بيانات تواصل حقيقية، سياسة شحن/استرجاع/خصوصية/شروط واضحة، صفحة من نحن صادقة، FAQ، معلومات الشركة المطلوبة، موافقات البريد/الرسائل، banner cookies عند انطباقه.
8. **القياس:** Shopify Analytics + GA4/Consent Mode عند الحاجة + Pixels عبر قناة رسمية. استخدم UTM موحداً. افصل صافي المبيعات عن الضرائب والشحن والخصومات والمرتجعات.
9. **الاختبار قبل فتح الإعلانات:** طلب تجريبي (بوابة sandbox إن توفر)، إلغاء/استرجاع، رسالة الشحن، كوبون، هاتف، سرعة، وقراءة receipt من مزود الدفع. راجع favicon، رابط DNS، SSL، 404، checkout وخصائص المنتج.
10. **الإطلاق:** تفعيل متجر بعد التحقق؛ أطلق 1–3 عروض، لا 100 منتج منخفض الجودة. راقب حالات الرفض، المخزون، chargeback، توقيت الاستجابة. استورد المنتجات من مصدر موثوق مع حقوق الصور/المحتوى.

#### الثيمات

**مجانية مقترحة** (الأسعار المعتادة $0؛ التوفر/الأسماء قد تتغير في متجر الثيمات): [Horizon](https://themes.shopify.com/themes/horizon/styles/horizon) (كتل مرنة)، [Dawn](https://themes.shopify.com/themes/dawn/styles/default) (أساس سريع ومتعدد الاستخدام)، [Sense](https://themes.shopify.com/themes/sense/styles/default) (الجمال والعناية)، [Craft](https://themes.shopify.com/themes/craft/styles/default) (الحرفة)، [Refresh](https://themes.shopify.com/themes/refresh/styles/default) (ميزات المنتج)، [Origin](https://themes.shopify.com/themes/origin/styles/default) (منتجات إبداعية)، [Studio](https://themes.shopify.com/themes/studio/styles/default) (الفنانين)، [Taste](https://themes.shopify.com/themes/taste/styles/default) (الأطعمة/المنتجات ذات القصة)، [Ride](https://themes.shopify.com/themes/ride/styles/default) (الرياضة)، [Publisher](https://themes.shopify.com/themes/publisher/styles/default) (الكتب/المحتوى). استخدم رابط Theme Store للتأكد من السعر والتوافق الحالي.

**مدفوعة** (لقطة أسعار Shopify Theme Store بالدولار في 2 نوفمبر 2026؛ غالباً شراء مرة واحدة لرخصة متجر واحدة، وليست اشتراكاً شهرياً. يمكن عادة تخصيصها مجاناً على متجر غير منشور قبل الدفع؛ السعر قد يتغير عند الشراء): [Impulse — $500](https://themes.shopify.com/themes/impulse/styles/impulse) (ترويج/أزياء)، [Prestige — $400](https://themes.shopify.com/themes/prestige/styles/prestige) (فاخر/تحريري)، [Broadcast — $420](https://themes.shopify.com/themes/broadcast/styles/broadcast) (علامات مرئية/قصة)، [Motion — $420](https://themes.shopify.com/themes/motion/styles/motion) (حركة/فيديو)، [Impact — $400](https://themes.shopify.com/themes/impact/styles/sound) (صور وهوية)، [Enterprise — $420](https://themes.shopify.com/themes/enterprise/presets/enterprise) (كتالوج/تصفح)، [Symmetry — $420](https://themes.shopify.com/themes/symmetry/presets/symmetry) (أزياء/كتالوج)، [Expanse — $420](https://themes.shopify.com/themes/expanse/presets/expanse) (كتالوج كبير)، [Warehouse — $320](https://themes.shopify.com/themes/warehouse/styles/fabric) (آلاف SKU)، [Be Yours — $350](https://themes.shopify.com/themes/be-yours/presets/be-yours) (جمال/متعدد الاستخدام). الأسعار مأخوذة من صفحات Theme Store وقت المراجعة، وتُعرض بعملة الولايات المتحدة؛ تحقق في بلد متجرك قبل الشراء [Theme Store](https://themes.shopify.com/).

#### GraphQL أم REST؟

للعمل الجديد استخدم **Shopify Admin GraphQL API**. Shopify يصف REST Admin بأنه legacy منذ 1 أكتوبر 2024 ويوجه التكاملات الجديدة إلى GraphQL؛ خصص GraphQL للاستعلامات المتداخلة، المنتجات والمخزون والـmetafields والعمليات الدُفعية، واستخدم REST القديم فقط للصيانة المرحلية لتكامل قائم عند عدم وجود بديل، مع خطة ترحيل [1](https://shopify.dev/docs/apps/build/graphql/migrate). حدود GraphQL مبنية على تكلفة الاستعلام، لا عدد الطلبات؛ راقب `extensions.cost.throttleStatus` وتابع pagination باستخدام cursor [2](https://shopify.dev/docs/apps/build/apis/graphql-admin/rate-limits) [3](https://help.shopify.com/en/api/getting-started/shopify-and-graphql/pagination).

**مثال آمن للقراءة من n8n:** `HTTP Request` → POST `https://{shop}.myshopify.com/admin/api/2026-10/graphql.json`، ترويسة `X-Shopify-Access-Token` من Credential، `Content-Type: application/json`، body يحتوي `query` و`variables`. ثبّت نسخة API ربع سنوية مذكورة في docs، ولا تجعلها `latest`. لا تطلب `customer` PII إن لم تكن تحتاجه.

**Webhooks:** اشترك في `orders/paid`, `orders/cancelled`, `products/update`, `inventory_levels/update` حسب الحالة. تحقق من توقيع HMAC على raw body، أعد HTTP سريعاً ثم عالج الحدث asynchronously، احفظ معرف webhook قبل التنفيذ، تعامل مع delivery المتكرر/الترتيب غير المضمون، وأعد جلب المصدر الرسمي إذا احتجت بيانات كاملة. Shopify يشرح Webhooks وAPI version [4](https://shopify.dev/docs/api/admin-rest/latest/resources/webhook).

### WooCommerce: متى أختاره؟

اختره حين تكون ملكية الكود والبيانات والتخصيص أهم من الإشراف المُدار، لديك خبرة WordPress/DevOps، أو عندك تكاملات غير متاحة على Shopify. لا تختَره لتوفير المال فقط ثم تترك الإضافات بلا تحديث. WooCommerce نفسه مجاني بلا اشتراك منصة/اقتطاع إيراد، لكن تكاليف الاستضافة والدومين والتطوير والبوابات والإضافات تُدفع منفصلة [1](https://woocommerce.com/pricing/).

**استضافة مرجعية:** SiteGround قد يعلن أسعار دخول ترويجية منخفضة ثم يرتفع التجديد (مثلاً $2.99 مقدمًا ثم ~$17.99 تجديداً في بعض العروض)، Cloudways يبدأ غالباً نحو $11–$14+ حسب مزود/موارد السيرفر، Kinsta WooCommerce نحو $35/شهر فأعلى. أسعار الخوادم/الزيارات ومناطق البيانات تتغير؛ الميزانية التي تحتسبها ينبغي أن تشمل النسخ الاحتياطي، staging، CDN، رسائل المعاملات، الدعم، الحماية والتجديد. راجع [SiteGround](https://www.siteground.com/woocommerce-hosting.htm)، [Cloudways](https://www.cloudways.com/en/woocommerce-hosting.php)، [Kinsta](https://kinsta.com/woocommerce-hosting/).

**REST API:** WooCommerce REST v3 يستخدم `https://store.example/wp-json/wc/v3/`. أنشئ مفتاحاً منفصلاً read/write تحت WooCommerce → Settings → Advanced → REST API، بأقل صلاحية لازمة، خزّنه في Credential وليس query string، واختبر HTTPS. يدعم إدارة المنتجات والطلبات والعملاء والمرتجعات والمخزون حسب endpoint [1](https://developer.woocommerce.com/docs/apis/rest-api/) [2](https://developer.woocommerce.com/docs/apis/rest-api/authentication/). أضف webhooks موقعة واختبر الترويسات من وراء CDN/WAF.

**الإضافات الضرورية حسب الحاجة لا «كلها»:** بوابة دفع رسمية؛ شحن/تتبع؛ نسخ احتياطي خارج السيرفر؛ حماية وتحديثات؛ SEO/schema؛ موافقة cookies/privacy؛ مراجعات موثقة؛ رسائل بريد معاملات؛ فواتير/ضرائب؛ مخزون/ERP إذا أثبتت الحاجة. اختبر توافق كل إضافة في staging، وحذف الإضافات المتداخلة أفضل من تثبيت عشرات إضافات «all-in-one».

## 2. قنوات البيع وربطها

| القناة | الربط | طبيعة الوصول/الملاحظات |
|---|---|---|
| Amazon | Selling Partner API (SP-API)، أدوات بائع، تكاملات Channel manager | يحتاج حساب/تطبيق مصرحاً به، OAuth، بيانات الدور والصلاحيات. بيانات الطلبات/العملاء حساسة ومقيدة؛ SP-API له متطلبات أمان وسياسة، وقد يتطلب تسجيل مطور. لا تفترض أن Seller Central API مفتوح بلا موافقة [1](https://developer-docs.amazon.com/sp-api/docs/amazon-seller-data-access) [2](https://developer-docs.amazon.com/sp-api/docs/register-as-a-private-developer). |
| eBay | Sell APIs: Inventory, Fulfillment, Account, Marketing | OAuth scopes؛ بعض Buy APIs محدودة الإصدار. استخدم Listing/order feeds الرسمية، لا scraping. مثال إدارة المخزون والطلب على [eBay Developers](https://developer.ebay.com/api-docs/sell/static/overview.html) [OAuth](https://developer.ebay.com/develop/guides/sell/authorization). |
| Etsy | Etsy Open API v3 + OAuth 2.0 و`x-api-key` | كتابة Listing تحتاج scopes؛ API الوصول التجاري/العام يتطلب مستوى وصلاحيات تطبيق. API يدعم draft listing وإدارة الطلبات/الشحن ضمن النطاق [1](https://developers.etsy.com/documentation/tutorials/listings/) [2](https://developers.etsy.com/documentation/essentials/authentication/). |
| TikTok Shop | TikTok Shop Open API عبر Partner Center | صلاحيات تطبيق + OAuth/توقيع/موافقة؛ مجالات المنتجات والطلبات والوفاء والمرتجعات والمالية/الأفلييت. الشروط تختلف حسب السوق/الدور [1](https://partner.tiktokshop.com/docv2/page/tts-developer-guide) [2](https://partner.tiktokshop.com/docv2/page/tts-api-concepts-overview). |
| Facebook/Instagram | Meta Commerce Manager + Catalog/Graph API، Instagram Shopping | الأهلية/الدولة والفئة والحساب التجاري، مراجعة التجارة. ربط المبيعات يكون عبر catalog/feed/commerce integration، لا يتاح كل checkout لكل بلد. النشر البرمجي لـ Instagram له صلاحيات ومعدل وحدود نشر [1](https://developers.facebook.com/docs/instagram-platform/content-publishing/). |
| Google Shopping | Merchant Center + product feed / Content API / Merchant API حسب الاعتماد | صحة GTIN/العلامة/السعر/المخزون والشحن والمرتجعات وسياسات الإعلانات؛ التطابق بين feed وصفحة المتجر ضروري. ابدأ بقناة Shopify/Woo الرسمية ثم API عند الحاجة. |
| Pinterest | Catalog + Pinterest Business/API | حدّث catalog، اعمل Pins أصلية وUTM؛ API يحتاج تطبيق/OAuth وحدود. لا تعِد رفع الصور التي لا تملك حقوقها. |
| Walmart | Walmart Marketplace APIs | يجب أن تكون بائعاً مقبولاً، ثم Developer Portal، `clientID/clientSecret` وOAuth token؛ API تدير عناصر/طلبات/أسعار/مخزون/تقارير [1](https://developer.walmart.com/us-marketplace/docs/get-started-as-a-seller). |

### قناة واحدة لمركز عمليات متعدد القنوات

1. **احسم أين يعيش المخزون الحقيقي:** Shopify، ERP أو 3PL. لا تجعل كل قناة ترسل تحديثاً لبعضها بشكل دائري.
2. طبّع السجلات إلى نموذج داخلي: `channel`, `external_order_id`, `sku`, `qty`, `gross`, `tax`, `discount`, `shipping`, `fees`, `currency`, `status`, `tracking`, `event_at`.
3. استخدم لكل قناة flow مستقل (webhook/API) ثم تحويل mapping إلى النموذج الداخلي. خزّن IDs الأصلية مع unique constraint؛ لا تعتمد على اسم المنتج.
4. قبل إرسال listing إلى القناة، راجع قيود الفئة، الصور/GTIN، اللغة، الضريبة، منشأ/وقت الشحن، المخزون وحالة الربط. انشر Draft → مراجعة بشرية → Publish.
5. اختبر سيناريو تأخر/تكرر webhook وإلغاء بعد الدفع، نفاد متزامن، تغير عملة، فرق التوقيت، refund جزئي، tracking غير صالح.
6. اعمل reconciliation يومي: رقم طلب كل قناة مقابل تسوية البنك/مزود الدفع، رسوم Marketplace، رسوم إعلانات، المرتجعات/chargebacks.
7. استخدم channel manager مع API موثق إذا تعقدت الخرائط. n8n طبقة تكامل ممتازة لكنه ليس نظام مزامنة عالي التوافر ولا مخزون transaction-safe وحده.

## 3. العثور على منتج جدير بالاختبار

لا توجد أداة تحدد «رابحاً» على وجه اليقين. أعطِ كل مرشح درجة **احتمال اختبار** لا «تنبؤ مبيعات»: وضوح ألم/طلب، هامش بعد كل الرسوم، قابلية عرض المنتج بفيديو، اختلاف ملموس، حجم/وزن/كسر، حقوق الملكية، مرتجعات، وفجوة عرض المنافس. اسحب بيانات من واجهة رسمية أو أداة بحث مرخصة، ثم اشترِ عينة واختبرها بنفسك. راجع دليل الأدوات للروابط والأسعار وAPI.

### Scorecard أولي من 100

- حل مشكلة واضحة وشريحة قابلة للوصول: 0–20.
- هامش مساهمة **قبل الإعلانات** مع تكلفة شحن واقعية: 0–20.
- يمكن شرح القيمة وإثباتها بفيديو أصلي خلال 3 ثوانٍ: 0–15.
- تميز قابل للدفاع (جودة/تجميع/خدمة/محتوى)، لا مجرد «ترند»: 0–10.
- سرعة/اعتمادية الشحن وجودة المورد مع عينة ناجحة: 0–15.
- انخفاض المرتجعات والضرر/المخاطر التنظيمية: 0–10.
- طلب يتكرر/ترند طويل/كلمات بحث ثابتة: 0–5.
- حقوق الصور والعلامات/سلامة المنصة: 0–5.

**قواعد إقصاء تلقائي:** منتج مخالف/خطر، ادعاء طبي غير مصدق، شعار/شخصية مرخصة بدون ترخيص، ربح سلبي بعد رسوم واقعية، مورد لا يقدم عينة/تتبعاً أو لا يقبل سياسة returns، شحن أطول من قدرة الوعد، تكلفة إعلان افتراضية «$5/يوم» لا تصلح لقياس التحويل، أو listing لا يطابق صورة ما سيصل للعميل.

## 4. التوريد ونماذج المنتجات

### طرق التوريد

| النموذج | من يملك/يصنع؟ | التدفق النقدي | متى يناسب | مخاطر تحكمها |
|---|---|---|---|---|
| Dropshipping | المورد يحتفظ بالمخزون ويشحن بالنيابة | شراء كل وحدة بعد البيع، لكن قد تدفع للمورد قبل التسوية | تحقق أولي من الطلب عند التزام الشحن/التتبع | جودة/تأخير/عبوة المورد/مرتجعات/تجميد رصيد |
| Wholesale | شراء كمية من موزع/مصنع قائم | رأس مال مخزون؛ سعر وحدوي أقل غالباً | طلب متكرر مع هوامش/فواتير سليمة | حد أدنى/أصالة/تخزين/تدفق نقدي |
| Private label | منتج تصنيع قائم بعلامتك/تغليفك | عينة، قالب/علامة، MOQ، شحن وجمارك | منتج مثبت وتريد احتكار عرض/تغليف/محتوى | MOQ وحقوق العلامة وامتثال المنتج/اختبار/مسؤولية |
| White label | منتج عام يضع المورد عليه علامة خاصة | أقل تطويراً من Private label غالباً | تخصيص بسيط بعد إثبات | المنافسون يبيعون نفس السلعة، ادعاءات المورد |
| Print on Demand | منصة تطبع وتشحن بعد الطلب | لا تخزين؛ تكلفة تصنيع/شحن أعلى للوحدة | فن/تصميم/أسماء مخصصة وجمهور niche | هامش، جودة الطباعة، عنوان الشحن، حقوق التصميم/AI |
| Digital | ملف/اشتراك/تعليم/برنامج | تكلفة هامشية منخفضة لكن دعم/تحديث/ثقة | معرفة أصلية أو أداة تحل مهمة | حقوق، جودة، Refund، دعم، منافسة/قواعد السوق |

**الموردون**: [AliExpress](https://www.aliexpress.com/)، [Alibaba](https://www.alibaba.com/)، [1688](https://www.1688.com/) (لغة/دفع/وكيل/تصدير غالباً)، [CJdropshipping](https://cjdropshipping.com/)، [Spocket](https://www.spocket.co/)، [Zendrop](https://zendrop.com/)، [DSers](https://www.dsers.com/)، [AutoDS](https://www.autods.com/)، [Doba](https://www.doba.com/)، [SaleHoo](https://www.salehoo.com/)، [Worldwide Brands](https://www.worldwidebrands.com/)، [Inventory Source](https://www.inventorysource.com/). يختلف API حسب الخطة/الشريك؛ Temu متجر بيع بالتجزئة وليس افتراضياً مورداً/wholesale API مناسباً لشحن عميلك. لا تعرض Temu كتكامل مستقر قبل عقد وتصريح واضحين.

### طلب العينة والتفاوض

1. أرسل RFQ موحداً لـ5–10 مصانع: صور/رسم، مادة، مقاس/تسامح، عينة، تغليف، بلد منشأ، MOQ 100/300/500/1000، سعر EXW/FOB/DDP، زمن الإنتاج، شحن، ضمان/عيب، فحص طرف ثالث، ملكية القالب/التصميم.
2. اشترِ 2–3 عينات من موردين مختلفين إلى عنوانك. اختبر استعمالاً طبيعياً/سقوطاً/تغليفاً/اللون/تعليمات/مكونات/ملصق/زمن التوصيل. لا تضع ادعاءات على Listing اعتماداً على عينة وحيدة.
3. تفاوض على **التكلفة الواصلة** وليس سعر الوحدة: sample credit، 30/70 دفعة، حماية Escrow/Trade Assurance عند المتاح، بدل العيب، مدة إعادة إنتاج، صور pre-shipment، شروط QC. لا تدفع full wire لمورد مجهول.
4. لا تستخدم Logo أو package أو قوالب تخص طرفاً آخر. اطلب invoice تجاري صحيح، إثبات امتلاك/ترخيص علامة، HS code ومنشأ، تحقّق من شهادات إلزامية (FCC/UL/CPSC/FDA وغيرها حسب فئة المنتج) لدى مختبر/مستشار مستقل.
5. انقل إلى Private Label فقط بعد 30–100 طلب مُرضٍ (العدد يتغير حسب تكلفة الوحدة) وهامش بعد الإعلانات والمرتجعات موجب، ووجود بيانات إعادة شراء/طلب. احسب MOQ، مخزون أمان، دورة نقد، شحن بحري/جوي، رسوم إدخال ورسوم تخزين قبل التوقيع.

**كيف تختار Sourcing Agent في الصين:** اطلب تسجيل الشركة، عناوين عملاء مرجعية، نطاق العمولة/markup، عقد يمنع kickback/تبديل مصنع دون موافقتك، ملكية ملفات التصميم والقالب، تقارير فحص صور/فيديو، متطلبات الدفع والفواتير، وخطة نزاع. اطلب عرضين مستقلين وقارن factory price وagent fee منفصلين؛ لا تعتمد على فيديو مصنع واحد أو حساب WhatsApp فقط.

## 5. أمازون: الحساب والنماذج والضبط

### Seller Central من بلد عربي/غير أمريكي

لوحة Seller Central الرئيسية تنقسم عملياً إلى **Account Health/Performance**، Catalog/Listings، Inventory/Fulfillment (FBA/FBM)، Orders/Returns, Pricing, Advertising, Brands/Brand Registry، Reports/Payments وTax/Settings. اجعل Account Health/Policy Notifications ومواعيد الرد على طلب الوثائق ضمن فحص يومي؛ واجعل payments/settlement ضمن reconciliation، لا تعتمد على إجمالي sales.

- التسجيل لا يساوي اعتماداً تلقائياً. أهلية البلد/الكيان والماركت بليس، إثبات الهوية والعنوان، بطاقة قابلة للخصم، حساب دفع يقبل التحويل، مقابلة الضرائب، التحقق البنكي/الفيديو، وقد يطلب Amazon فاتورة مورد أو مستند شركة. أرسل بيانات قانونية مطابقة تماماً للوثائق، واحتفظ بترجمة موثقة عند طلبها.
- لا تشترِ حساب بائع ولا تفتح حسابات متعددة للتحايل على إيقاف. البلد المقبول قد يختلف حسب خدمة/marketplace. راجع Seller Central التسجيل الرسمي ومركز المساعدة للبلد في يوم التقديم؛ لا توجد «طريقة سحرية» تضمن حساباً من أي بلد.
- الخطة الأمريكية: Individual $0.99 لكل وحدة مباعة + رسوم البيع؛ Professional $39.99 شهرياً + رسوم البيع. نقطة تعادل اشتراك الخطة الحسابية نحو 40 وحدة/شهر، لكن Professional يحتاجه كثير من أدوات الإعلان/التقارير/الإدارة والتكامل؛ الرسوم تتغير حسب الفئة [1](https://sell.amazon.com/sell) [2](https://sell.amazon.com/blog/ask/how-to-sell-on-amazon-in-2026).

### نماذج العمل

| النموذج | كيف يعمل | لمن يناسب | ما تحسبه قبل البدء |
|---|---|---|---|
| FBA | ترسل المخزون لمراكز Amazon، Amazon يخزن/يجهز/يشحن ويتعامل مع أجزاء من الخدمة/الإرجاع | وحدات متوقعة، حاجة Prime، هامش يسمح بالتخزين والرسوم | referral + FBA fulfillment + تخزين موسمي/قديم + inbound placement + نقل للمستودع + prep/label + إرجاع/إزالة + ضريبة + PPC؛ ابدأ بـRevenue Calculator في Seller Central |
| FBM | أنت/3PL يشحن للعميل | سلعة كبيرة/بطيئة أو لديك fulfilment قوي | شحن، عمالة، SLA، late shipment/cancellation/valid tracking، مرتجعات |
| Dropshipping | مورد يشحن بعد طلب العميل | فقط إن امتثلت الشروط ولديك مورد موثوق | يجب أن تكون أنت seller of record، وإزالة معلومات المورد من الفاتورة/packing slip/التغليف، أنت مسؤول عن الإرجاع والخدمة. لا تشترِ من Retailer آخر بعد البيع ليرسل للعميل؛ اطلع على سياسة Amazon الرسمية قبل التشغيل [1](https://sellercentral.amazon.com/seller-forums/discussions/t/673fc46fa652feabf550e10375452fbc). |
| Wholesale | إعادة بيع بضاعة أصيلة من موزع معتمد | من لديه رأس مال وفواتير سلسلة توريد سليمة | إذن العلامة/فواتير قابلة للتحقق، Buy Box، صلاحية/تواريخ، gating، رأس مال/دوران |
| Arbitrage | شراء مخفّض وبيعه على Amazon (online/retail) | خبرة فحص قيود وأصالة وسعر | إيصالات retail قد لا تكفي لدعم طلب فاتورة أصالة؛ لا dropship إلى سوق من بائع تجزئة آخر |
| Handmade | منتجات يدوية/تخصيص | حرفة قابلة للتكرار | موافقة البرنامج، تكاليف العمل الحقيقي، حدود الإنتاج، trademark/copyright |
| KDP | Ebook/طباعة عند الطلب | مؤلف/ناشر يملك معرفة/تحرير/تمييزاً | تحرير بشري، تدقيق الحقائق والحقوق، غلاف/تنسيق، keywords، royalty وفق السعر/البلد/التوزيع. AI لا يعفي من الجودة والحقوق؛ أجب بصدق على سؤال الإفصاح عن محتوى AI المولد في لوحة KDP وفق policy وقت النشر [1](https://kdp.amazon.com/en_US/help/topic/G200672390). |
| Merch on Demand | رفع تصميم وتقوم Amazon بطباعة/الشحن مع قبول البرنامج | مصمم لديه حقوق تصميم ومحتوى وجمهور | القبول/الانتظار غير مضمون، سياسة IP، royalties المتغيرة، لا نشر رسوم مكررة آلياً |

### الفئات المقيدة/المفتوحة، الإعلان والـListing

- «Gated/Ungated» وصف تشغيلي: الفئة/البراند/ASIN قد تتطلب موافقة أو invoice أو شهادات، والموافقة تختلف حسب الحساب. افحص **Add a Product → Show limitations/Apply to sell** داخل Seller Central قبل شراء المخزون.
- بحث المنتج: Jungle Scout/Helium 10/AMZScout وغيرها تقدّر المبيعات ولا ترى الحسابات الداخلية للمنافسين؛ عايرها ببياناتك واستخدم أكثر من إشارة. راجع رسوم FBA الخاصة بـSKU عبر Revenue Calculator وحساب Amazon؛ نسبة الإحالة تختلف حسب الفئة.
- Listing: كلمات ذات نية، عنوان مقروء، صور أصلية/مرخصة، 5 bullets للفوائد القابلة للإثبات، حقائق ومقاس/تحذيرات. A+ Content عبر Brand Registry عند الأهلية؛ لا تكرر keyword stuffing ولا ادعاء competitor comparison غير مسند.
- PPC: ابدأ بحملة Auto لاكتشاف terms، Manual Broad/Phrase للاكتشاف المنضبط، Exact للكلمات المثبتة؛ افصل brand/competitor/ASIN. حدّ يومي وخسارة متوقعة محددان. راجع Search Term Report، ACOS = ad spend ÷ ad sales، TACOS = ad spend ÷ إجمالي sales. لا تعتبر ACOS وحيداً مقياساً للربح.
- Buy Box: لا «تضمن الفوز». السعر الكلي، المخزون، الشحن، حساب/أداء البائع، أهلية Prime والمنافسة عوامل؛ استخدم repricer بحد أدنى للربح وحد أقصى للتغيير واحترم سياسة التسعير العادل.
- المراجعات: اطلب review عبر الأداة الرسمية/Request a Review، تعلّم Vine ومتطلبات الأهلية من Seller Central، لا تدفع مقابل الإيجابي، لا تصفي السلبية، لا تستخدم رسائل/خصومات مشروطة بخمس نجوم. ادعاءات «مراجعات مضمونة» علامة خطر.
- حماية البراند: تسجيل Trademark مناسب ثم Brand Registry، توثيق سلسلة التوريد/صور العبوة، مراقبة alerts وإثبات التعدي الرسمي، Brand Analytics/Attribution حسب توفرها في marketplace. لا تبلغ على منافس لمجرد أنه أرخص.
- **PPC من الصفر:** بعد التحقق من Listing/stock/fees، ابدأ Auto campaign بميزانية خسارة محددة لجمع search terms؛ أنشئ Manual Broad/Phrase للاكتشاف وExact للكلمات التي أثبتت conversion؛ حملة منفصلة لاسم البراند/ASIN competitor عند قانونية/جدوى ذلك. استخدم negative keywords للإنفاق غير المناسب، راجع Search Term Report أسبوعياً، احسب ACOS وTACOS ومساهمة الربح/المرتجعات. قسّم الميزانية على ad groups/keywords لا مئات الحملات، وامنع تغيير bids/budgets بلا floor/ceiling. حدد قاعدة توقف قبل الإنفاق (مثلاً إنفاق 1.5–2× target CAC دون مبيعات يستوجب التحقق من الصفحة/الكلمة/السعر)، ولا تعتبرها معياراً إحصائياً عاماً.
- **Brand Store / Posts / Live / Attribution:** Store مجاني للعلامات المؤهلة في Brand Registry؛ Posts متاح وفق السوق/الحساب ويعرض محتوى صورة/منتج على أماكن التصفح؛ Amazon Live يتيح بثاً تفاعلياً، لكن التطبيق/الأهلية قد تكون US/brand-specific. هذه قنوات محتوى واكتشاف وليست ضمان ranking/GMV. Amazon Ads يشرح المتاجر/المحتوى وأهلية Live في [brand foundation](https://advertising.amazon.com/library/guides/creating-your-brand-foundation-on-amazon) و[Posts](https://advertising.amazon.com/library/guides/increasing-consideration-in-the-shopping-journey-on-amazon).

## 6. TikTok Shop: سوق محلي + محتوى + Affiliate

> الدليل العملي المفصل للدخل، الأدوات وأسعارها، تجربة 30 يوماً واقتصاديات الوحدة هنا: [TikTok Shop Revenue Playbook](tiktok-shop-revenue-playbook.md). القسم أدناه يلخص التشغيل والسياسات، لا يغني عن فتح مركز البائع/المبدع للسوق والحساب المعنيين.

### الأسواق والأهلية: البائع ليس هو المبدع

صفحة TikTok Shop التي راجعناها في 2026 تعرض أسواقاً في أمريكا الشمالية/الجنوبية، آسيا وأوروبا؛ القائمة وإجراءات البيع تختلف حسب البلد والحساب والفئة، لذلك اعتمد [بوابة Seller Center](https://seller.tiktok.com/) والسياسة المحلية وقت التسجيل. لا تستخدم VPN أو وثائق/عنوان/حساب بنك لشخص آخر، ولا تفترض أن تأسيس شركة في سوق مدعوم يضمن قبولها.

- **البائع:** لا يحتاج إلى متابعين لفتح متجر، لكن يحتاج تحققاً/وثائق/حساب دفع وامتثال المنتج والشحن وفق السوق. متطلبات الشخص/الشركة والبنك/المخزن/الإرجاع تتغير حسب المنطقة.
- **Affiliate Creator الأمريكي المستقل:** السياسة المنشورة تذكر 18+، وجوداً في الولايات المتحدة، التحقق من الهوية، و1,000 متابع على الأقل للتقديم الذاتي. الأقل من 5,000 قد يدخل Pilot لا يقل عن 30 يوماً؛ من الحدود الشائعة حتى 3 فيديوهات Shop قابلة للتسوق يومياً و3 LIVE Shop أسبوعياً، مع قيود اكتشاف منتجات/حملات، وقد يكون Extended Pilot أشد. تحقق من الحالة والحدود داخل Creator Center، فهي ليست ضماناً للوصول [Creator Eligibility Policy](https://seller-us.tiktok.com/university/essay?knowledge_id=6939143037667118&lang=en).
- **Official/Marketing Account المرتبط ببائع:** له صلاحيات/حدود تخص المتجر المرتبط، ولا يعني ذلك فتح Affiliate Marketplace بشكل عام أو تجاوز سياسة الأهلية.
- **TikTok One:** مشاريع محتوى/تعاون مدفوعة بين علامة ومبدع، منفصلة عن Affiliate commission على طلبات Shop؛ شروط المشروع وحقوق الإعلان والمنطقة والأجر تظهر عند التقديم.

### Seller Center وتشغيل Affiliate

Seller Center هو مصدر الحقيقة للمنتج، المخزون، الطلب، الرسوم، الشحن، الأداء والتسوية؛ Creator/Affiliate Center هو واجهة أهلية المبدع واختيار المنتج والعمولة. تبويبات/أسماء الواجهة تتغير، فاستعمل Seller University/Partner Center للسوق بدلاً من دليل قديم.

- **Open Collaboration:** يتيح عرض SKU لمبدعين مؤهلين في السوق، ويُستخدم لاكتشاف شركاء أوسع. **Target Collaboration:** دعوات لمبدعين مختارين مع brief/عمولة/عينة وشروط محددة. إعدادات الموافقة، sample، ومعدل العمولة تظهر داخل الحساب؛ Target commission قد تطبق على حالات يتقدم فيها المبدع عبر Open، فراجع سياسة الإعداد قبل إطلاق الحملة [Affiliate setup](https://seller-us.tiktok.com/university/essay?knowledge_id=6837873164896001).
- لا توجد نسبة creator commission مناسبة للجميع. احسب الحد المتاح بعد تكلفة الوحدة والـfulfillment والرسوم والخصم والمرتجع والربح المستهدف، ثم اختر النسبة/الأجر الثابت. لا تخلط أجر TikTok One/UGC بعقد مع عمولة Affiliate.
- العينة المجانية/القابلة للاسترداد/الممولة وشروط إعادتها تختلف حسب الإعداد والسياسة؛ سجّل تكلفة العينة والشحن والـdeliverable ولا تربط العينة بمراجعة إيجابية. اختر المبدع على الملاءمة والجودة لا رقم followers فقط.
- امنح Spark Ads/إعادة استخدام المحتوى فقط بتفويض/عقد يحدد المدة والمنصات/الوجه والصوت/الموسيقى والملفات الخام؛ لا تفترض أن شراء الفيديو يشتري الحقوق تلقائياً. الإفصاح عن العمولة/الهدية/العلاقة التجارية يجب أن يكون واضحاً للمشاهد [FTC Endorsement Guides](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking).

### رسوم، شحن، تسوية

- جدول Referral fee الأمريكي يختلف حسب الفئة؛ الصفحة الرسمية راجعت جداول كثيرة فيها 5–6%، فلا تستخدم نسبة موحدة لكل منتج. توجد تحديثات/استثناءات ورسوم مرتبطة بحالة الطلب/الإرجاع؛ افحص الفئة التي تظهر لك وسجل تاريخها [جدول الرسوم](https://seller-us.tiktok.com/university/essay?knowledge_id=5988482086864682) و[تحديثات الرسوم](https://seller-us.tiktok.com/university/essay?knowledge_id=5982454398175018).
- خيارات الشحن الظاهرة في US تشمل **TikTok Shipping** و**Fulfilled by TikTok (FBT)** و**Seller Shipping لبعض الحسابات المؤهلة**؛ نوع الخدمة المتاح، الرسوم/الأوزان/الأبعاد والـSLA تعتمد على الحساب والمنتج. لا تفترض أن Seller Shipping متاح للجميع أو أن FBT مجاني/إلزامي؛ قارن rate card في Seller Center [Logistics](https://seller-us.tiktok.com/university/essay?knowledge_id=6734735776089869) و[TikTok Shipping](https://seller-us.tiktok.com/university/essay?knowledge_id=1830506744514347).
- **Settlement Report** هو أفضل أساس لمصالحة الرسوم والعمولة والتعديلات على مستوى الطلب/SKU. الداشبورد وGMV Max/commission estimate ليست تسوية نهائية؛ قد تتغير بسبب الإلغاء/المرتجع/زمن ما بعد التسليم [Settlement Report](https://seller-us.tiktok.com/university/essay?knowledge_id=2336057241700098).
- استخدم معادلة: `السعر الصافي قبل الضريبة − landed COGS − الشحن/التنفيذ والتغليف − referral/platform fee الفعلية − creator/ads commissions − coupon − الإعلان − مخصص الإرجاع/العينة`. جدول وسيط: [الملف المالي](financial-plan-and-templates.md) و[مثال مفصل لـTikTok Shop](tiktok-shop-revenue-playbook.md).

### LIVE، الإبداع، الإعلانات وواجهات API

- LIVE يحتاج عرضاً حقيقياً/أسئلة/إشرافاً ومخزوناً وقدرة شحن؛ احسب أجر المضيف/التصوير مقابل هامش الطلبات، لا عدد المشاهدين وحده. لا تستخدم صوتاً مسجلاً أو AI avatar يدعي تجربة حقيقية مكان مضيف LIVE.
- ابدأ بـTikTok Creative Center، تصوير حقيقي/مصادر مرخصة، CapCut أو أدوات المنصة. TikTok AI Video Maker/Symphony قد يتاح لبعض الحسابات وبحدود credits/سياسة متغيرة؛ راجع الصورة/اللون/الحقائق والادعاءات قبل الاستخدام والإفصاح عن AI حيث يلزم.
- **GMV Max:** استخدم Product/LIVE GMV Max فقط بميزانية خسارة محددة وcreative مصرح. تقرير GMV المنسوب قد يضم مبيعات عضوية/affiliate؛ لا تساوه بمبيعات إضافية سببها الإعلان. قارن الإنفاق والتسوية والهامش والمرتجعات على مستوى المتجر/SKU [دليل GMV Max](https://seller-us.tiktok.com/university/essay?knowledge_id=2507006000252685).
- TikTok Shop Open API عبر Partner Center ليست API عامة لكل حساب: تحتاج تطبيقاً، صلاحيات/توقيعاً، OAuth أو تفويضاً، وقد تختلف حسب السوق/الدور [Developer Guide](https://partner.tiktokshop.com/docv2/page/tts-developer-guide)، [Affiliate Seller API](https://partner.tiktokshop.com/docv2/page/affiliate-seller-api-overview). Content Posting API منفصلة عن Shop API وتتطلب تدقيق/تفويض وحدود نشر؛ اعمل approval queue قبل النشر [Direct Post](https://developers.tiktok.com/docs/en/content-posting-api-reference-direct-post?enter_method=left_navigation) و[Content Sharing Guidelines](https://developers.tiktok.com/docs/en/content-sharing-guidelines).

### Shopify / n8n

تطبيق TikTok الرسمي في Shopify مجاني التثبيت؛ اشتراك Shopify والرسوم والإعلانات منفصلة، وتزامن المنتجات/المخزون/الطلبات متاح حسب البلد والأهلية [الإعداد الرسمي](https://help.shopify.com/en/manual/online-sales-channels/tiktok/setup) و[التطبيق](https://apps.shopify.com/tiktok). ابدأ بـCSV من Seller Center أو تكامل Shopify رسمي، ثم n8n لتحقق/تنبيه/حساب هامش فقط. لا تستخدم scraping أو API غير مفوضة، ولا تسمح للـworkflow بتعديل سعر/عمولة/ميزانية/رسالة عميل دون موافقة إنسان.

## 7. Etsy: حرف/تصميم/منتج رقمي/POD

### فتح المتجر والرسوم

تحتاج Etsy Payments في بلد مؤهل، هوية وبنك مطابقين لبلد المتجر؛ صفحة المساعدة الرسمية تقول إنه إذا لم يكن Etsy Payments متاحاً في بلدك، لا تستطيع في العادة فتح متجر جديد. تشمل الدول المعلنة دولاً عربية مثل مصر والمغرب والإمارات، وتتيح Payoneer لبعض الدول المحددة (المشار إليها بنجمة)؛ التفاصيل تتغير ويجب مراجعة القائمة الرسمية قبل تأسيس نشاط [1](https://help.etsy.com/hc/en-us/articles/115015710408-Countries-Eligible-for-Etsy-Payments) [2](https://help.etsy.com/hc/en-us/articles/115015672808-How-to-Open-an-Etsy-Shop).

رسوم US المعلنة: $0.20 لإدراج/تجديد listing، 6.5% transaction على سعر العنصر + الشحن/التغليف، ومصاريف معالجة دفع تختلف حسب بلد الحساب. رسوم إعداد المتجر **قد تظهر مرة واحدة أثناء onboarding** ومقدارها/توفرها يختلف بالعروض والبلد؛ لا تفترض أنها صفر أو ثابتة قبل شاشة التسجيل. Etsy Plus اختياري بـ$10/شهر حسب السياسة الحالية؛ Offsite Ads قد يضيف 12% أو 15% حسب أهلية/حجم المبيعات والقواعد الجارية. اعتمد [Fees & Payments Policy الرسمية](https://www.etsy.com/legal/fees/) وليس حساباً قديماً [1](https://www.etsy.com/legal/fees/). مثال بسيط US لطلب $30 وشحن $0: رسوم listing $0.20 + transaction $1.95 + processing (تقريباً 3%+$0.25 في إعداد أمريكي) $1.15 = نحو $3.30، قبل COGS/إعلان/ضريبة. سعر المعالجة يختلف؛ هذا مثال حسابي لا كشف رسوم نهائي.

### ماذا تبيع؟

- **POD:** تيشيرت/ملصق/مقود/كوب/وسادة/فن منزلي بتصميم أصلي؛ المنصات [Printify](https://printify.com/)، [Printful](https://www.printful.com/)، [Gelato](https://www.gelato.com/)، [Gooten](https://www.gooten.com/). اختر البلد ومركز الإنتاج، sample quality، زمن التوصيل، رسوم شحن الإرجاع، وأدخل production partner في Etsy حين يلزم. لا تبيع تصميم fandom/شخصية/شعار رياضي على أساس أن تغيير الألوان يجعلها قانونية.
- **Digital:** جداول عمل، قوالب أصلية، planner قابل للاستخدام، invitations، CV، ملفات SVG/قص، Notion template، جداول Excel، presets، printable. يحتاج دعم/تعليمات سليمة وحقوق fonts/assets.
- **AI art:** Etsy يسمح بإبداعات AI بناءً على دور إبداعي/توجيه بشري، مع الإفصاح؛ ولا يبيح قوائم bot-generated دون مشاركة بشرية أو تعليمات وظيفية AI-generated (أنماط/وصفات/خطط/دليل خطوات) حسب آخر تحديث 22 أكتوبر 2026 [1](https://www.etsy.com/seller-handbook/article/1522733284810) [2](https://www.etsy.com/seller-handbook/article/1275449912004). لا تنشر ملفات أو تصاميم متشابهة بالجملة. افحص قواعد أي مولد حول حقوق الاستخدام التجاري واحتفظ بسجل prompts/اختيار/تحرير ومصدر الصور.
- **صور listing:** يجب أن تصف ما سيصل بالفعل. بعض الحالات التي فيها production partner لها استثناءات/mockups؛ Etsy تطلب صورة غير معدلة للمنتج على خلفية حقيقية في حالات وفق policy، وتمنع fake inventory/تضليل الصورة [2](https://www.etsy.com/seller-handbook/article/1275449912004).

### Etsy SEO والنمو

- العنوان يشرح نوع القطعة والمقاس/المناسبة بلغة الإنسان؛ الكلمات 13 tags تتنوع في intent والمرادفات بدل تكرار 13 صيغة حرفية.
- الصور: صورة أولى عالية التباين تُظهر المنتج/النتيجة؛ ثانويات للمقاس والمواد والملف المشمول، صورة استعمال حقيقية؛ فيديو قصير واضح.
- الوصف يبدأ بنتيجة المشتري + نطاق الملف/المنتج/ما لا يشمله + المقاس والصيغة + سياسة تنزيل/شحن/تخصيص. لا تحشر كلمات غير مرتبطة بالمنتج.
- Ads: ابدأ ميزانية صغيرة لمجموع Listings مختارة؛ قيّم تكلفة النقر، التحويل، profit بعد fees لا ROAS فقط؛ لا تعلن Listing لا يملك صوراً/تقييم/عرض واضح.
- Offsite Ads attribution والرسوم تختلف؛ لا تقدر على الانسحاب دائماً وفق عتبة المبيعات. راجع الإعدادات والرسوم قبل التسعير.
- Pinterest + Etsy: منشورات عمودية من صور أصلية، link مباشر لListing أو collection، UTM، لوحة لكل niche، أعد التصميم لا تكرر Pin نفسه. يُمكن جدولة من أدوات معتمدة أو Pinterest API.
- Star Seller له شروط من Etsy (رسائل/شحن/مراجعات وغيرها بحسب البلد/تاريخ السياسة)، لا تشتريه ولا تخاطر بشحن غير متتبع لأجل badge.
- **متاجر متعددة:** Etsy يسمح بأكثر من متجر، لكن حساباً منفصلاً وبريداً مختلفاً لكل متجر، ويجب إدراج كل المتاجر التي تديرها في Public Profile لكل حساب والامتثال لسياسة البائع [help](https://help.etsy.com/hc/en-us/articles/360017604474-How-to-Open-a-Second-Shop-on-Etsy). لا تفتح حساباً ثانياً للتحايل على تعليق/رسوم/قواعد أو تكرار قوائم متطابقة.

### Etsy API عبر n8n

احصل على API key/secret من Etsy Developers، OAuth2 مع PKCE، اطلب أقل scopes؛ `listings_w` لإنشاء/تعديل، `transactions_r` للطلبات، `transactions_w` للشحن حيث endpoint يدعمها. كل طلب API v3 يحتاج `x-api-key` (keystring:shared secret) وBearer token عند endpoint المحمي [1](https://developers.etsy.com/documentation/essentials/authentication/) [2](https://developers.etsy.com/documentation/essentials/requests/). الأفضل بناء Draft، تحميل الصور من مصدر تملكه، مراجعة العنوان/الفئة/التصريح والـproduction partner بشرياً، ثم نشر. لا تعتمد على رفع آلاف Listings بدون مراجعة؛ policy Etsy تحظر bot-generated listings بلا مشاركة بشرية فردية.

للمخزون استخدم endpoint inventory الرسمي مع SKU/variant mapping وreconciliation قبل/بعد. للطلب/الشحن استخدم endpoint receipt/shipment الرسمي مع scopes المناسبة، ولا ترسل tracking حتى تأكيد الناقل. للرسائل، إن كانت API الحالية وصلاحيات التطبيق تسمح بقراءة/إرسال conversations، اجمع السؤال وأعد **مسودة** اعتماداً على سياسة/طلب مؤكد؛ أرسلها بعد approval عند شكوى/استرجاع/تغيير order. لا تستخدم حساب/متصفح آلياً لتجاوز API، ولا mass-message.

## 8. أسواق إضافية

- **eBay:** dropshipping من wholesale supplier يسمح به policy، لكن Listing ثم شراء السلعة من متجر/Marketplace آخر ليشحنها لعميل eBay غير مسموح وفق سياسة eBay؛ أنت مسؤول عن موعد الشحن والعميل. النص الرسمي لسياسة eBay: [Dropshipping policy](https://www.ebay.com/help/selling/posting-items/setting-postage-options/drop-shipping?id=4176). استخدم Terapeak/Product Research داخل Seller Hub، Zik/AutoDS فقط عند فهم API/المصدر/امتثال handling time. لا توهم Buyer بمخزون/تسليم.
- **Walmart Marketplace:** لا يحتاج API لكي تقدم على البيع؛ بعد قبول الحساب تعطي Seller Center بيانات developer لاستخدام API أو تختار Solution Provider معتمداً. مرجع التهيئة والـOAuth [1](https://developer.walmart.com/us-marketplace/docs/get-started-as-a-seller). WFS برنامج fulfillment برسوم حسب أبعاد/وزن وتخزين؛ احسب estimator، لا تفترض رقم موحداً.
- **Poshmark/Mercari/Depop:** إعادة بيع thrift تستلزم وصف حالة/صور حقيقية ومصدر أصالة. أدوات crosslisting مثل Vendoo/List Perfectly/Crosslist تقلل إعادة العمل لكن API/أتمتة المنصة تختلف، وقد تكون محاكاة متصفح غير رسمية أو تتعارض مع الشروط؛ راجع كل منصة قبل ربطها. لا تعيد listing بعد بيعه دون مزامنة مخزون.
- **Gumroad/Payhip/Ko-fi/Lemon Squeezy:** بيع ملفات/عضويات/منتجات رقمية؛ قارن رسوم transaction، معالجة، VAT/sales tax كمُسجل merchant of record (Lemon Squeezy وغيرها حسب المنتج/بلد البائع)، payout availability وchargeback. لا تعتمد على «رسوم صفر» قبل احتساب الدفع/الضرائب.
- **Redbubble / Spring / Society6 / Zazzle:** POD marketplace لا يتطلب store خاص، لكن التوزيع/التحكم/الهامش أقل، الربح يعتمد على royalty/markup. رفع نفس design مسموح فقط إذا ملكيته لديك وتوافق شروط منصات الصور/الذكاء الاصطناعي. لا توجد API واحدة موحدة؛ أتمتة النشر بنقرات آلية قد تخالف الشروط. ابدأ بـ3 قنوات وراقب الجودة.
- **Amazon KDP/Merch:** انظر قسم أمازون أعلاه؛ محتوى منخفض الجودة/متكرر أو عناوين غير صادقة قد يضر حسابك. استخدم AI للمساعدة، مراجعة بشرية، إقرار دقيق، وحقوق الصور/الخطوط/الترجمة.

## 9. بروتوكول إطلاق كل قناة

قبل فتح قناة جديدة يجب وجود: (1) المنتج/الحقوق/السعر والضرائب، (2) اتفاق مخزون وسيناريو نفاد، (3) موعد معالجة وشحن قابل للقياس، (4) سياسة إرجاع وخدمة بلغة السوق، (5) اختبار feed/Listing، (6) tracking وUTM، (7) webhook/API مصرح واختبار sandbox، (8) تقرير تكلفة/ربح، (9) إجراء وقف سريع إذا أصبح المخزون أو الشحن أو الحساب غير سليم.
