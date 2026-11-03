# n8n: البنية المركزية، تشغيل آمن، و15 Workflow للتجارة الإلكترونية

## 1. n8n مقابل Make وZapier

| المعيار | n8n | Make | Zapier |
|---|---|---|---|
| التكلفة | Community self-hosted مجاني وفق Sustainable Use License + تكلفة VPS/صيانة؛ Cloud على عدد تنفيذات workflow؛ الأسعار تتغير [pricing](https://n8n.io/pricing/) | Free حتى 1,000 credits/mo؛ Core نحو $9/mo لـ10,000 credits؛ Pro ~$16؛ Teams ~$29 وفق صفحة السعر المراجعة [Make pricing](https://www.make.com/en/pricing) | Free 100 tasks/mo؛ Professional يبدأ من ~$19.99/mo، ثم task tiers أعلى [Zapier pricing](https://zapier.com/pricing) |
| التحكم/الخصوصية | self-hosting، HTTP Request، JavaScript/Python، قواعد بيانات | SaaS بصري قوي | SaaS سهل وواسع التكامل |
| منحنى التعلم | متوسط/مرتفع؛ الأفضل للمنطق وAPI والـdebug | متوسط | منخفض |
| استخدام مثالي | تكاملات مخصصة، webhooks، AI + منطق branching، تشغيل داخلي | اتصالات SaaS بصرية معقولة | سير خطي سريع لتطبيقات شائعة وبلا تشغيل سيرفر |
| المخاطر | تحتاج نسخاً احتياطياً، مراقبة، تحديث، أمن، ترخيص؛ Community لا تعني أن السيرفر مجاني | حدود الخطة/التنفيذ | تكلفة المهام/قفل المزود/قيود التحكم |

**اختيار سريع:** n8n Cloud إذا لا تريد DevOps؛ self-hosted إذا لديك قدرة Linux/Docker/نسخ احتياطية/مراقبة؛ Make/Zapier إذا تريد إعداداً سريعاً ولا تحتاج منطق أو تحكم خاص. Community self-hosted لا يحاسبك وفق عدّاد Cloud لكل workflow execution، لذلك لا يوجد حد تنفيذ SaaS بالمعنى المعتاد؛ لكن CPU/RAM/database/API rate limits/النسخ/الوقت والسعة والليسانس تحد التشغيل فعلياً. مجاني البرنامج لا يعني سيرفراً مجانياً أو «بلا حدود». Community self-hosted مجاني للاستخدام الداخلي وفق الترخيص، لكنه ليس إذناً لإعادة بيع محرر n8n كخدمة SaaS أو كشفه للعميل. راجع [Sustainable Use FAQ](https://docs.n8n.io/n8n-community-license/community-license/license-faq) قبل البيع كـAgency أو تضمين n8n في منتج.

## 2. Cloud أم VPS؟

| الوضع | يختاره | تكلفة تشغيل تقريبية | انتبه إلى |
|---|---|---|---|
| n8n Cloud | صاحب متجر لا يدير خوادم | لقطة التسعير الرسمية وقت المراجعة: Starter $20/شهر عند الدفع السنوي لـ2,500 workflow executions؛ Pro $50/شهر لـ10,000؛ Business $800/شهر لـ40,000 ومذكور self-hosted؛ افتح السعر الحالي/الدورة/العملة [pricing](https://n8n.io/pricing/) [1](https://n8n.io/pricing/) | حجم execution، تخزين السجل، المنطقة، concurrency، مسار خروج، وتكلفة APIs ليست ضمن n8n |
| VPS | مطور/وكالة/فريق لديه وقت تشغيل | Hetzner/DO غالباً نحو $5–$15+ شهرياً لخادم تجريبي/صغير؛ إنتاج بقاعدة بيانات/نسخ احتياطية/CPU/RAM أعلى؛ لا تعمم السعر | البريد/SSL/نسخ/ترقيات/رصد/incident response؛ ليست «مجاني بلا حدود» |
| Railway/Render | تجربة/نشر PaaS سريع | الدفع حسب CPU/RAM/storage/egress وخطة الخدمة؛ الرقم يتغير | persistent volume، stable outbound IP، limits، sleep/scale-to-zero، webhook stable domain |
| سيرفر خاص/VPS + Docker | توازن مرن | تكلفة الخادم + إدارة | مسؤولية كاملة عن الأسرار، patching، firewall، recovery |

**الموارد:** prototype خفيف قد يعمل على 1–2 vCPU و2–4 GB RAM، لكنه لا يصلح لمدى ثابت من الحمل. في إنتاج التجارة احسب Postgres، Binary storage، worker، execution payloads، AI jobs، concurrent webhooks، وأوقات النسخ. زد الموارد بعد قياس CPU/RAM/queue lag لا بالتخمين.

## 3. تثبيت Docker خطوة بخطوة (قالب داخل هذا المستودع)

هذا المثال لـUbuntu Linux مع نطاق DNS تملكه. الملفات المرافقة في `research/n8n-workflows/`: `docker-compose.production.yml`, `Caddyfile`, `.env.example`. لا تشغّلها قبل تثبيت **إصدار n8n/runner محدد ومُختبر** في `.env`. راجع docs الحالية لـ[Docker/hosting](https://docs.n8n.io/hosting/) و[queue mode](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode) و[task runners](https://docs.n8n.io/deploy/host-n8n/configure-n8n/set-up-task-runners).

1. احجز دوميناً/خادماً واربط `A` (و`AAAA` إن مدعوم) بـIP VPS. افتح الجدار الناري لـTCP 22 من عنوان إدارة موثوق، و80/443 للعامة. لا تفتح 5678/5432/6379/5679/6333 للعامة.
2. ادخل SSH بمفتاح، حدّث النظام، أنشئ مستخدم نشر غير root وفعّل firewall/updates. مثال Ubuntu (راجع إصدار Ubuntu/تعليمات Docker الرسمية قبل التشغيل؛ لا تستخدم `curl | sh` عمياء):

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo docker version
sudo docker compose version
```

لا تضف مستخدمك إلى مجموعة `docker` إلا إذا قبلت أن المجموعة تمنح صلاحيات تقارب root؛ استخدم `sudo docker compose` لمشغل محدود أو طبّق وصولاً إدارياً آمنًا.

3. أنشئ `/opt/n8n` ومجلد `shared` بصلاحيات مالك تشغيل. انسخ ملف Compose/Caddy/.env.example إلى المكان، ثم:

```bash
cd /opt/n8n
cp .env.example .env
chmod 600 .env
# ولّد أسراراً منفصلة؛ لا تستخدم النصوص المثال:
openssl rand -hex 32   # N8N_ENCRYPTION_KEY
openssl rand -hex 32   # POSTGRES_PASSWORD
openssl rand -hex 32   # REDIS_PASSWORD
openssl rand -hex 32   # N8N_RUNNERS_AUTH_TOKEN
```

4. عيّن `N8N_DOMAIN`، `GENERIC_TIMEZONE`، نفس رقم إصدار n8n/runner الذي اختبرته، وألصق أسراراً مختلفة. احتفظ بمفتاح `N8N_ENCRYPTION_KEY` في password manager/نسخة مشفرة: فقدانه قد يجعل credentials غير قابلة للقراءة.
5. تحقق من Compose قبل التشغيل. تأكد أن tag متاح لـn8n **وكذلك runners** ومطابق للنسخة المدعومة في docs:

```bash
docker compose --env-file .env -f docker-compose.production.yml config
docker compose --env-file .env -f docker-compose.production.yml pull
docker compose --env-file .env -f docker-compose.production.yml up -d
docker compose --env-file .env -f docker-compose.production.yml ps
docker compose --env-file .env -f docker-compose.production.yml logs --tail=100 -f n8n
```

6. افتح `https://n8n.example.com` بعد نجاح شهادة Caddy، أنشئ حساب المالك/تفعيل 2FA إن متاح، أضف credentials من واجهة n8n، وضع workflow أولاً على Draft/غير فعال.
7. أضف اختباراً: manual workflow صغير، webhook test، database health، إعادة تشغيل السيرفر، التأكد من بقاء workflows/credentials، ثم فعّل workflow محدود.
8. النسخ: PostgreSQL dump مشفر يومياً وخزّنه خارج VPS (S3-compatible/نسخة لدى مزود مختلف)، ونسخة volume/binary data حسب الاستخدام. جرّب restore في staging شهرياً. لا تعتبر snapshot داخل نفس الخادم Backup.
9. التحديث: اقرأ release notes، خذ backup، اختبر staging/import workflows، حدث tag لا `latest`، راقب أخطاء/queue/credentials ثم فعل production. n8n يوصي باستخدام external task runners لحماية Code node في الإنتاج؛ لا تعتمد internal mode مع أسرار/بيانات حساسة [task runners](https://docs.n8n.io/deploy/host-n8n/configure-n8n/set-up-task-runners).

**ملاحظة Compose:** ملفنا يستخدم Postgres + Redis + queue worker + external task-runner sidecars + Caddy. n8n docs تنص أن Queue mode يستخدم Redis، ولا توصي بSQLite مع Queue، وأن `N8N_ENCRYPTION_KEY` يجب أن يكون متطابقاً بين main/workers [queue docs](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode) [key docs](https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/). لا تتوسع بـreplicas عشوائية؛ زِد worker/runner sidecar متطابقين بعد اختبار، وراقب دعم الإصدارات. Compose starter ليس مصادقة/نسخ/HA جاهزة تلقائياً.

## 4. إدارة الأسرار والبيانات في n8n

- استخدم `Credentials` (OAuth/API key/HTTP Header Auth) بدلاً من API keys داخل `Code`, `Set`, نص Slack، workflow JSON أو git.
- أضف حماية لواجهة الإدارة: HTTPS، كلمات مرور قوية/2FA، VPN/IP allowlist إن أمكن، minimum users، لا مشاركة حساب المالك، MFA على مزودي Shopify/Google/Amazon/Meta.
- ضع `N8N_ENCRYPTION_KEY` ثابتاً ومختلفاً عن DB password، حدّث secrets بعد تسريب، لا تُرسل `.env` للعميل، ولا ترفع execution data إلى Git.
- Redact PII قبل LLM: الاسم/العنوان/الهاتف/email/order contents غير ضروريين غالباً. احتفظ بسياسة retention. لا تستخدم بيانات طلبات لتدريب نموذج إذا شروط المورد لا تسمح.
- Webhook: استخدم path صعب التخمين لكنه ليس مصادقة؛ تحقق من signature/token، timestamp/idempotency، schema، rate limit، source IP إن كانت موثوقة، ثم acknowledgement سريع.
- Code node: Sandbox ليس بديلاً عن فصل الهوية. n8n يوصي task runners الخارجية في الإنتاج لأن Code node قد يستعرض البيئة/الأسرار إذا كان التكوين غير آمن [docs](https://docs.n8n.io/deploy/host-n8n/configure-n8n/set-up-task-runners/).
- `Execute Command`: عاملها كصلاحية root تقريباً. لا تمرر قيمة من webhook مباشرة إلى shell؛ لا تستخدمها كـAPI node؛ عطلها لمن لا يحتاجها. على Cloud عادة مقيدة/غير متاحة.
- `Error Trigger`: مسار منفصل يرسل alert (Execution URL + workflow + sanitized error) إلى Telegram/Slack/email. لا يرسل access token أو نص عميل.
- `Wait/Rate Limit`: احترم 429 و`Retry-After` وAPI terms؛ لا تستخدم loop للتجاوز.

## 5. عقد n8n الأساسية في سياق التجارة

قد تتغير أسماء عقد/إصداراتها. استخدم native node إذا يغطي العملية؛ HTTP Request عندما تحتاج endpoint رسمياً؛ وثّق API version/credential/permissions.

### AI/LLM

| العقدة | الاستخدام | حدود مهمة |
|---|---|---|
| OpenAI | Chat/Responses/embeddings/images حسب node/model | API منفصل عن ChatGPT Plus؛ token cost وحماية PII؛ Structured Output للتحقق |
| Anthropic | Claude messages/analysis | API key منفصل عن اشتراك Claude UI؛ صيغة/قواعد context متغيرة |
| Google Gemini | Gemini API/Vertex حسب node | API key/region/privacy؛ لا تخلط Google One مع API bill |
| Hugging Face | Inference providers/models | حد rate/توافر model/ترخيص؛ قد يلزم endpoint مدفوع |
| AI Agent | استخدام tools/LLM لخطوات متعددة | أضف iteration max، tool allowlist، timeouts، approval human، وخطر prompt injection؛ لا تجعله root/admin |
| Memory | ذاكرة جلسة قصيرة عبر Postgres/Redis/Window | لا تخزن معلومات الدفع/PII غير اللازمة؛ زمن الاحتفاظ مضبوط |
| Vector store (Qdrant/Pinecone وغيرها) | RAG لسياسات/FAQ/catalog | لا تجعل embeddings مصدر حقيقة؛ حدث/احذف المستندات؛ filter على متجر/لغة/صلاحية؛ فصل tenant |

### التجارة والدفع

| العقدة | استخدام | حواجز |
|---|---|---|
| Shopify | طلبات/منتجات/عملاء/تقارير حسب node والنسخة | API scopes أقل صلاحية؛ عند gap استخدم GraphQL Admin API وversion pin؛ تحقق من Webhook HMAC |
| WooCommerce | منتجات/طلبات/عملاء/كوبونات | REST key منفصل؛ HTTPS؛ لا تضف consumer secret في query string إلا كحل أخير آمن بالـTLS |
| Stripe | Payment intents/refunds/events | اختبر test mode؛ webhooks signed؛ لا تشارك مفاتيح live، لا تخزن بيانات بطاقة |
| PayPal | Orders/capture/refunds | sandbox/live منفصلان؛ verify webhook؛ راجع hold/reserve والـseller protection |

### تواصل وإشعارات

- **Email/Gmail/SMTP:** transaction email عبر مزود مناسب، DKIM/SPF/DMARC، unsubscribe لحملات التسويق، suppress bounced/complaint؛ Gmail API quota مختلفة.
- **Telegram:** بوت للتنبيه الداخلي/approvals، لا ترسل PII أو رابط admin عام؛ لا تستخدمه كقناة تسويق غير موافق عليها.
- **Slack/Discord:** تنبيه فريق؛ قنوات خاصة، لا تنشر credential أو order details للجمهور.
- **WhatsApp Business Platform:** Cloud API عبر Meta + templates وتراخيص/opt-in وقواعد المنطقة؛ n8n غالباً يستخدم HTTP Request أو عقدة تكامل موثوقة. لا تستخدم WhatsApp Web bot/رقم غير مصرح. API رسوم رسائل/مزود تتغير بحسب الدولة والنوع؛ راجع [Meta pricing](https://developers.facebook.com/docs/whatsapp/pricing/).

### قنوات اجتماعية

- **Facebook/Instagram:** Graph API، product catalog، messaging/publishing بحسب scopes وموافقة التطبيق. Instagram API نشر من حساب احترافي، access token/permissions/limits؛ حدّ النشر في docs قد يصل 100 منشور API في 24 ساعة للحساب، لكن لا يعني أن النشر بهذا الحجم مفيد [official content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/).
- **X:** واجهة X/API access/limits والتكلفة والسياسات تتغير؛ تحقق من الخطة قبل بناء جدولة. لا تستخدم محاكاة متصفح للتحايل.
- **LinkedIn:** API publishing محدود بتطبيقات/صلاحيات وموافقة؛ مناسب لمحتوى B2B بصيغة معتمدة.
- **Reddit:** Reddit API OAuth وشروط وتعليمات لكل subreddit؛ لا تستخدم bot promotional/spam ولا scrape على نطاق كبير.
- **YouTube:** YouTube Data API OAuth/quotas، رفع/جدولة/metadata؛ لا تكرر محتوى منخفض القيمة لتجاوز سياسات monetization.
- **TikTok:** Shop API يختلف عن TikTok for Developers Content Posting API؛ الموافقات وعملية audit حقيقية. التطبيقات غير المدققة تنشر Private فقط وفق docs [1](https://developers.tiktok.com/docs/en/content-sharing-guidelines).

### تسويق/مبيعات/عمل

- **Mailchimp / HubSpot:** قوائم موافق عليها، segmentation وflows؛ HubSpot للـCRM/pipeline؛ تحقق من email/SMS limits وAPI scopes.
- **Google Ads:** Google Ads API تحتاج developer token وOAuth/manager account حسب العملية؛ لا تفترض أن n8n node يغطي كل Reports/تغييرات.
- **Meta Ads:** Marketing API عبر HTTP/Graph API، صلاحيات business/app review، تبويب reports؛ لا تعدل Budget تلقائياً بلا سقف يومي/approval.
- **Google Sheets/Airtable/Notion/Drive:** جيد للـMVP/مستندات. لا تخزن فيها كلمات مرور أو بطاقات/PII غير لازم. Sheet ليس ledger موثوق عند concurrent writes؛ أضف `external_id` وupsert / Postgres.

### Developer nodes

- **HTTP Request:** أهم عقدة: method, URL, headers auth credential, query/body, pagination, response, timeout، retry. استخدم HTTP Request API رسمية، لا تحوّل scrapers المخالفة إلى HTTP Request.
- **Webhook:** استقبال أحداث order/payment; اجعل ACK سريعاً، تحقق signature، اختبر production vs test URL.
- **Code:** تحويل schema، حساب score/fees، dedup، JSON parse. لا تستخدمه لإعادة كتابة LLM output بلا schema. Python/JS support يتغير مع task-runner.
- **Execute Command:** مشغل shell حساس وخطر؛ حظره ما لم تلزم حاجة محددة في self-hosted مع allowlist وصلاحيات أقل.
- **Cron/Schedule Trigger:** جدولة التوقيت بالمنطقة المناسبة، off-peak، jitter، منع duplicate runs; حدّ execution/timeouts.

## 6. الأنماط المشتركة لكل Workflow تجاري

استخدمها كقالب واحد لكل تدفق:

```text
Trigger -> Verify/Normalize -> Dedupe -> Fetch official data -> Rule checks
 -> AI draft/score (optional) -> Structured parse -> IF thresholds -> Human approval
 -> Write via official API -> Log result + source/version -> Notify -> Error branch/monitor
```

أضف جدولاً داخلياً `automation_events` (Postgres) به `source_event_id UNIQUE`, `source`, `received_at`, `payload_hash`, `state`, `attempts`, `last_error`, `external_id`. ضع `Retry on 429/5xx` مع backoff، لا تعاود 4xx بصورة أعمى. أضف «Kill switch» (Environment/DB flag) لوقف النشر/الإعلانات/الشراء فوراً.

## 7. خمسة عشر Workflow خطوة بخطوة

### Workflow 1 — مرشح منتج/منتجات واعدة يومياً

**الهدف:** shortlist لا قرار شراء تلقائي. **Nodes:** Schedule Trigger، HTTP Request لـAPI مسموح أو مصدر feed مرخص، Code normalization، Split Out، Data Store/Postgres dedupe، LLM node/Structured Output، Code margin calculator، IF hard filters، Google Sheets/Airtable، Telegram/email، Error Trigger.

1. Schedule يومي 06:00 المنطقة المناسبة؛ مصادر أقل عدد وأكثر موثوقية (Amazon Opportunity Explorer/Supplier feed/Google Trends RSS/Partner API) لا scraping AliExpress/Amazon بشكل يخالف الشروط.
2. احفظ `source`, `source_product_id`, `collected_at`, URL، سعر ظاهر/عملة، reviews، trend sample والحدود. لا تستنتج حجم المبيعات من ترتيب أو لقطة واحدة.
3. Code يطبع SKU/عنوان/عملة/URL/dimensions ويمنع duplicate بـunique key؛ لا تنفذ API كل مرة للمنتج نفسه.
4. احسب COGS + شحن المورد + شحن العميل + رسوم القناة + تجهيز + نسبة مرتجعات احتياطية. مرر إلى AI حقائق محفوظة فقط، واطلب score مع أسباب/درجة ثقة/مخاطر JSON.
5. IF يستبعد أي حقوق/IP/فئة تنظيمية/هامش سالب/حجم بيانات غير كاف؛ إذا `score ≥ 75` أرسل **مرشحاً** لا «منتج رابح».
6. حفظ صف Sheet/DB وإرسال Telegram فيه المصادر والأسئلة المطلوبة (اطلب sample؟ أين الإثبات؟)؛ زر/رابط يفتح صف review. لا شراء تلقائي.
7. بعد أسبوع احسب نسبة المرشحين الذين اجتازوا العينة/تحويل فعلي، وعدل الدرجات بناءً على النتائج لا رأي النموذج.

**مقياس نجاح:** مرشح/ساعة تحليل، نسبة sample pass، هامش بعد اختبار وليس عدد المنتجات المكتشفة. **ممنوع:** تجاوز captcha، نسخ صور منافسين، رفع منتج تلقائياً من نتيجة AI.

### Workflow 2 — مراقبة الاتجاهات

**Nodes:** Cron (كل 4–24 ساعة)، RSS/Google Trends API إن كان لديك وصول، Pinterest/TikTok Creative Center عبر مصادر مصرح، Reddit API، Code normalization، DB history، AI cluster، IF z-score/threshold، Telegram alert.

1. ثبت region/locale/time window. Google Trends يعطي اهتماماً نسبياً وليس حجم بحث خام؛ لا تقارن قيم 0–100 المنفصلة كأنها أعداد بحث. لدى Google API رسمية لكنها alpha بالتقديم ومحدودة الوصول؛ لا تفترض أنك حصلت عليها [docs](https://developers.google.com/search/apis/trends).
2. اجمع 10–50 عبارة من Feed/API رسمي/مصدر مرخص. كبداية منخفضة الحجم، جرّب `RSS Read` على `https://trends.google.com/trending/rss?geo=US` إن كان الـfeed متاحاً في المنطقة، أو تصدير يدوي؛ لا تسحب واجهة Explore داخلية بوتاً.
3. احسب baseline 28 يوماً/rolling median، نسبة التغيير، وعدد مصادر مستقلة. لا تنبه لمجرد أعلى نقطة لمرة واحدة.
4. AI يجمع الصيغ المتقاربة ويقترح منتجات/مناسبات، مع `evidence_urls` وعدم اختلاق الطلب أو السعر. دققه بشرياً.
5. IF: نمو قوي + إشارتان مستقلتان + عدم حساسية/سلامة؛ Telegram «إشارة تحتاج تحقق» مع رسوم trend.
6. Store trend observations في DB، وانقضِ التنبيه/قيّم بعد 7 أيام.

**مصادر:** Google Trends RSS/الصفحة + Pinterest Trends + TikTok Creative Center + Reddit API. لا تخلط كلمات ترند في listings على نحو مضلل.

### Workflow 3 — تحليل تغيرات المنافسين بشكل قانوني

**Nodes:** Schedule، Google Sheet of competitor public URLs، HTTP Request لـpublic product pages بحجم معتدل/مسموح أو API/provider مرخص، HTML/JSON parser، diff/hash، DB، AI summary، email weekly.

1. اختَر 5–20 صفحات عامة لمنافسين، راجع شروط الموقع وrobots/access controls، قلل معدل الطلب. الأفضل متابعة RSS/Shopify public feeds/API partner أو خدمة مخصصة مرخصة.
2. سجّل URL، التاريخ، title/price/availability/visible variant/shipping claim، content hash. لا تجمع customer data ولا ads غير متاحة رسمياً.
3. قارن بآخر snapshot؛ اطرح changes (price > 5%, new product, out of stock, new shipping claim) مع رابط/source.
4. AI يلخص «ما تغير» ويقترح فرضيات اختبار، لا يفترض أن المنافس ربح/مبيعاته تحققت.
5. تقرير أسبوعي مع snapshot/raw data access محدود؛ احذف البيانات القديمة وفق retention.

### Workflow 4 — تحسين Listing جديد بالذكاء الاصطناعي (Draft → مراجعة → نشر)

**Trigger:** Shopify `products/create` webhook أو Product status Draft؛ Nodes: Webhook/Shopify Trigger، HMAC verification، Get product، AI structured generation، Code schema/claims validation، IF، Human approval (Slack/Telegram/Forms)، HTTP GraphQL Admin API `productUpdate`، error branch.

1. لا تعتمد webhook body دون signature؛ idempotency على product id + `updated_at`. لا تعالج منتجات معلّقة/حساسة آلياً.
2. اسحب facts من product/metafields: مادة، مقاس، لون، warranty, shipping days، `approved_claims`. لا تخترع benefit/clinical result.
3. Prompt ينتج `seo_title`, `description_html`, `metafields/tags` مع عدم استخدام claims غير موجودة. رفض كلمات «cure/guaranteed» ما لم approved substantiation.
4. Code يتحقق طول title/meta، links، punctuation، HTML allowlist، وجود حقائق، ويمنع policy words. إذا Fail: notify، لا تنشر.
5. أرسل preview للمراجع، ثم n8n Wait/Human approval. لا تستخدم AI image generation لتصوير سلعة بشكل غير مطابق؛ صورة المنتج الأصلية هي المرجع.
6. GraphQL Admin API نسخة مثبتة؛ mutation `productUpdate` أو `productSet` حسب API version/المخطط وقت التشغيل. تحقق من `userErrors`, response id، إعادة القراءة ومقارنة. لا تنشر تلقائياً لكل قناة من webhook واحد.

**مهم:** n8n template `02-shopify-graphql-ai-product-factory.json` هو starter يحتاج مراجعة schema/version/credentials، لا يمثل ضماناً أنه import-and-run مع كل n8n release.

### Workflow 5 — خطة محتوى اجتماعي يومية متكيفة مع المنصة

**Nodes:** Schedule/DB calendar، AI brief، content variant per channel، legal/brand validator، human approval، Google Drive asset library، native social API/scheduler، analytics API/report.

1. مصدر المحتوى: تجارب استخدام/مراجعات حقيقية/FAQs؛ أعطِ كل عنصر `product facts`, permitted claims, audience, campaign, asset rights.
2. AI يكتب 3–5 خيارات (ليس 10–20 منشوراً لكل منصة كل يوم لمجرد الرقم)؛ Instagram caption/alt، Pinterest title/description، LinkedIn B2B، TikTok script/shotlist، YouTube title/chapters تختلف.
3. dedupe semantic hash؛ ضف حقوق الاستخدام والموسيقى/الـcreator؛ disclosure affiliate/ads إذا لزم؛ لا تنسخ فيديو منافس.
4. Queue approval في Notion/Airtable/Slack، وبعد الموافقة وجدولة عبر API رسمي أو أداة approved scheduler. خزن provider post ID والرابط/status.
5. بعد 24h/7d اجمع impressions/clicks/saves/visits/orders عبر API المتاحة. راعِ attribution window وprivacy. لا تجعل AI يقيس «نجاحاً» من مشاهدات فقط.
6. أعد تغذية الأداء (Aggregates) لا PII إلى prompt؛ اختبر hook/format واحداً في كل مرة.

**قيود:** TikTok Direct Post يحتاج scopes/audit وقد ينشر Private للتطبيقات غير المدققة [guidelines](https://developers.tiktok.com/docs/en/content-sharing-guidelines). Instagram publishing يحتاج professional account/permissions/limits [docs](https://developers.facebook.com/docs/instagram-platform/content-publishing/).

### Workflow 6 — خط إنتاج إعلان فيديو قصير

**Nodes:** CRM product approved، AI script JSON، claim/brand validator، ElevenLabs TTS أو تسجيل بشري، video render API/CapCut يدوي، ffmpeg (على worker مصرح)، subtitles، QA human، publish queue.

1. ابدأ بـ1 منتج مثبت وحقائق، لا تولّد فيديو كاملاً من صورة مزيفة لمنتج غير موجود. اكتب hook 0–3s، demo 3–15s، proof/qualifier، CTA.
2. اطلب 3 hooks ونصاً لا يتجاوز وقتاً/عدد كلمات محدداً؛ راجع الادعاء/التوافق/الإفصاح الترويجي؛ إذا يعرض creator/voice clone تأكد من إذن وحقوق.
3. TTS: HTTP Request لعقدة ElevenLabs الرسمية بمفتاح مخزن في Credential. خزّن binary خارج n8n payload عند الكبر. ElevenLabs audio لا ينتج فيديو.
4. فيديو: API مزود رسمي أو قالب CapCut/ffmpeg عند الترخيص. ارفع assets إلى S3/Drive موقّع، ركب صوت/subtitles/brand overlay/CTA؛ راجع الموسيقى المرخصة. لا تفترض وجود CapCut public API لكل ميزة.
5. QA قبل النشر: نسخة 9:16، safe area، subtitle، صوت، سعر/خصم صحيح، disclosure، no unlicensed music, 1080×1920 أو حسب المنصة، مدة مطابقة.
6. Human approve، ثم API/scheduler رسمي مع token صالح؛ TikTok audit أو Instagram permissions. خزّن URL/failure/result.

**لتجنب «100 فيديو في يوم»:** إنتاج عشرات النسخ المكررة يضر الجودة وحساب المنصة وقد يصير spam. ركز 3–8 variants حقيقية لكل أسبوع، اختبر التحويل، وبعدها وسع صيغة فعالة.

### Workflow 7 — دعم عملاء/RAG مع تصعيد بشري

**Nodes:** Shopify Inbox/chat/Email/WhatsApp webhook، verify identity/context، Redaction، Qdrant/Vector Store + approved FAQ، AI Agent، Shopify Order Lookup read-only، rules/PII filter، Human handoff، reply channel.

1. المعرفة: سياسات شحن/ضمان/ترجيع مع version/date، صفحات المنتج المعتمدة. index في Qdrant مع `document_id`,`locale`,`updated_at`. لا تستخدم مراجعات عامة أو Prompts كحقيقة.
2. تحقق عميل الحساب/البريد/رقم الطلب قبل كشف tracking/address. إذا channel غير موثق، أعطِ instructions عامة فقط.
3. Agent يجيب بأقصر جواب، يستشهد برابط السياسة الداخلية، يرد «لا أملك معلومة مؤكدة» عند نقص المصدر؛ ما يوافق على refund/discount/medication/claims تلقائياً.
4. Read-only tools: `order_status`, `shipping_policy`, `product_facts`. اترك refund/modify order للأدمن أو Workflow بapproval.
5. Escalate عند angry/high-risk, payment dispute, injury, privacy request, refund demand, sentiment confidence low، أو tool error.
6. احفظ conversation id والحالة والنتيجة لا نصوص حساسة أكثر من اللازم. أرسل feedback للموظفين.

### Workflow 8 — أمر/شحن وتتبع

**Nodes:** Shopify `orders/paid` → verify/dedupe → IF fulfillment eligibility → order lock → supplier API create order → response validation → write tracking/invoice → customer update → delayed polling/carrier webhook → exception queue.

1. قبل أي شراء آلي، whitelist المورد/SKU، تحقق من مخزون المورد وسعر الشحن والبلد والعنوان/فئة المنتج؛ reserve idempotency key `channel-order-line`.
2. لا ترسل order لعنوان/منتج غير صالح، ولا تستخدم API غير رسمية. CJ has docs/API but payload/token/endpoints change; اكتب mapping حسب docs الحالية واختبر sandbox [CJ developer docs](https://developers.cjdropshipping.com/).
3. التعامل مع timeouts: لا تعيد POST `create order` دون idempotency/reconciliation؛ استعلم عن orderNumber عند الشك، أو ارسل manual task.
4. بعد تأكيد المورد، update fulfillment/tracking عبر GraphQL mutation supported; تأكد carrier/رقم التتبع/منطقة، سجل التاريخ.
5. أبلغ العميل فقط عند tracking حقيقي، باستخدام بريد transaction/WhatsApp template موافق؛ لا ترسل مراجعة قبل الوصول.
6. webhook shipping + Cron استعلام متباعد؛ عند تأخير/رفض يتوقف fulfillment، لا يعيد شراء آلي.
7. اطلب تقييم صادق بعد فترة وصول مع رابط المنصة الرسمي؛ لا تربط incentive بترتيب/نجوم ولا ترسل review gating.

### Workflow 9 — بريد ترحيب/سلة/ما بعد الشراء/عودة

**Nodes:** Ecommerce events → consent/status filter → segmentation → provider-native flow أو n8n orchestration → personalization AI optional → send test/internal → scheduler → metrics/unsubscribe sync.

1. احصل على lawful opt-in، سجّل `consent_source/time/text`; فصل receipt/transactional عن marketing. CAN-SPAM يتطلب عنوان/إلغاء وتطبيق الإلغاء، والـSMS له قوانين/قواعد أشد حسب البلد؛ استشر قبل الإطلاق.
2. أسهل/أوثق: دع Klaviyo/Omnisend يتعامل مع flow/events، واستخدم n8n لتحميل product feed/إثراء approved fields والتقارير. لا تبن من n8n mass email مجرد لأن Gmail node موجود.
3. Welcome 3 رسائل: قيمة/قصة حقيقية، أفضل المنتجات/FAQ، عرض عند وجود سياسة واضحة. Abandoned cart 1–3 رسائل محدودة بتوقيت/consent وsuppress بعد الشراء. Post-purchase: تعليمات استخدام، shipping support، cross-sell منطقي بعد فترة، طلب review صادق من الجميع. Winback based on normal repurchase cycle، sunset لإيقاف الخاملين.
4. AI يخصّص snippets من بيانات غير حساسة، لا يخترع خصم/stock/claims، ولا يذكر اسم/تفاصيل حساسة في subject. اختبار A/B صغير؛ إلغاء الاشتراك يعمل ويُزامن.
5. راقب delivery, complaint, unsubscribe, conversion, margin per recipient لا open rate فقط (Apple privacy يؤثر على open).

### Workflow 10 — دفتر ربح/تقرير يومي

**Nodes:** Cron → Shopify/marketplace sales API → payments settlement/payouts → ad spend → supplier invoices/shipping → currency conversion source → Postgres ledger → Code arithmetic → report PDF/Sheet → Telegram.

1. اجمع orders المدفوعة/المستردة، discounts, shipping collected, tax, channel fees, payment fees, COGS unit, fulfillment, ad spend, returns. لا تستخدم Gross sales وحدها.
2. اربط كل transaction بمفتاح ثابت. لا تضاعف الطلبات إن وصلت webhook + API reconciliation؛ upsert.
3. احتفظ بمصدر سعر الصرف/timezone، وافصل gross revenue, net sales, contribution, gross margin, operating expenses, tax payable.
4. أرسل daily: Revenue / contribution / ad spend / unfulfilled / refunds / low stock / cash payout expected; أظهر `data completeness %` و«تقديري» عند غياب تكلفة.
5. إذا margin < floor أو order count discrepancy > threshold، alert owner. لا تحرر تقرير محاسبي/ضريبي نهائي دون reconciliation/محاسب.

### Workflow 11 — قواعد تسعير ذكية بحدود

**Nodes:** Cron/API competitor lawful snapshot + internal costs/stock + pricing rules + Code calculate + IF floor/cap + Slack approval + marketplace update API + read-back + audit log.

1. عرّف `min_price = (all variable costs + ad allowance + target contribution + fixed cost allocation)/(1-variable fees percent)` مع مراعاة رسوم ثابتة/ضريبة. لا تعتمد على AI وحده بالحساب.
2. competitor price مصدر علني/مسموح مع timestamp/shipping/delivery/variant matched؛ لا تقارن SKU مختلفاً أو سعر without shipping.
3. قواعد محددة: تغير بحد أقصى 3–5%/يوم، أرضية لا تكسر الهامش، سقف يومي، عدم تعديل عند stock<buffer، عدم المنافسة على Buy Box بPrice War، لا تسعير تمييزي غير قانوني.
4. أول 2–4 أسابيع إرسال recommendation للموافقة، بعد replay/QA فقط السماح بتغييرات داخل bands. Audit previous/new/why/source/actor. Kill switch فوري.

### Workflow 12 — Etsy Product pipeline (Human-in-the-loop)

**Nodes:** product idea approved → image generation/local design → human curation → export templates/mockups → metadata AI → Etsy API draft → schema/policy check → preview approval → publish → mirror only approved POD channels.

1. كل عنصر له brief/creative contribution، prompt/model/license، human-selected final art، disclosure AI إذا استُخدم، rights check للخط/asset.
2. لا تولد functional guide/pattern/recipe/instruction بـAI للبيع على Etsy، ولا قائمة bot-only؛ نص AI عام قد يساعد في وصف غير وظيفي لكن يجب تحريره وتدقيقه. اطلع على آخر السياسة [Etsy AI](https://www.etsy.com/seller-handbook/article/1522733284810).
3. إعداد ملف للطباعة 300DPI/مقاس صحيح/CMYK إن طلبت المطبعة، preview واضح، لا تولد صورة تشبه منتج ملموس لم تنتجه. POD production partner disclose.
4. `createDraftListing` يتطلب معلومات الفئة والتصميم/الكمية/السعر/صور وربما الشحن، OAuth scopes + API key [Etsy Listing Tutorial](https://developers.etsy.com/documentation/tutorials/listings/).
5. اعرض draft للمستخدم للموافقة؛ API `updateListing`/`uploadListingImage` حسب docs والحدود؛ اقرأ response/Listing status قبل إيقاظ قناة POD.
6. لا تنشر تلقائياً إلى Redbubble/Society6 إن لا توجد API رسمية/إذن. صدّر asset/csv، ثم نشر يدوي/تكامل معتمد.

### Workflow 13 — مراقبة مخزون المورد/إيقاف إعلان

**Nodes:** Supplier stock API/CSV → cron → compare canonical SKU+variant → threshold and confidence → Postgres → IF stock low → Shopify inventory mutation → pause campaign (official Marketing API, approval) → alert supplier/customer-service.

1. مخزون المورد ليس guaranteed; خذ timestamp/safety buffer/lead time. لا تعتبر «available» ضماناً.
2. لا توقف/تشغل إعلان إذا feed stale أو SKU mapping غير دقيق. أرسل manual approval عند اختلاف القناة.
3. غيّر availability لـ0 أو pause product على المتجر أولاً وفق القاعدة؛ الإعلان قد يتأخر، لذلك webhook update/report يكرر القراءة ويؤكد النتيجة.
4. اقترح بدائل بناء على matching specs/quality/approval، ولا تستبدل بمنتج مختلف في طلب قائم دون موافقة المشتري.
5. سجل كل state transition ومصدره. اختبار inventory decrement concurrent.

### Workflow 14 — اكتشاف مؤثرين/أفيليت/عمولات

**Nodes:** TikTok Shop Affiliate/creator marketplace approved export/API → qualify metrics → CRM → personalized email/DM template draft → human review → consent status → track creator code/affiliate ID → settlement report.

1. لا scrape بريد/هاتف خاص أو تبعث رسائل غير مرغوبة جماعية؛ استخدم creator marketplace أو عنوان تجاري/opt-in/علاقة محتوى مع احترام منصة التواصل.
2. score: تفاعل حقيقي حديث، تطابق جمهور، نوع محتوى، disclosure سابق، جودة مشاهدات، بلد/توافر، تكلفة عينة/حقوق الفيديو.
3. AI يكتب مسودة بمعلومات صحيحة، مخصصاً بسطر حقيقي عن المحتوى (لا يخترع علاقات/إعجابات)، Human approve. سجل عدم التواصل/opt-out.
4. العقد: نسبة/commission base/مدة الإسناد/المرتجعات/الحد الأدنى/الدفع/الدعاية/Disclosure/حقوق إعادة الاستخدام/whitelisting/مدة الحصرية/الموافقة على claims/محتوى غير مسموح.
5. قياس: GMV، refunded orders، net contribution، sample cost، creative licenses، affiliate commission، code leakage. ادفع على orders المؤهلة وفق الاتفاق لا view count.

### Workflow 15 — كتاب KDP بمساعدة AI (شبه تلقائي، لا auto-publish)

**Nodes:** Keyword/reader research manually approved → outline LLM → source/citation review → chapter drafts → editorial checklist → original assets rights check → cover/page layout → plagiarism/fact check → KDP upload checklist → human sign-off → manual upload/publish → performance monitoring.

1. اختر niche عبر problem/reader/demand/competition; لا تنشئ مئات journals متطابقة.
2. AI يقترح outline فقط؛ مؤلف يضيف تجربة/أمثلة/تحقق حقائق ومصادر/تحرير. تجنب محتوى متخصص طبي/قانوني/مالي بلا مراجعة مؤهل.
3. احتفظ بمواد مرجعية/حقوق quotes والصور/الخرائط والخطوط. لا تستخدم كاتباً/صورة/شخصية مرخصة دون ترخيص.
4. KDP يتطلب من الناشر الإعلان عن **AI-generated** النص/الصور/الترجمات عند النشر بحسب form؛ AI-assisted حيث المبدع أنشأ المحتوى والـAI ساعد في التحرير/التدقيق له تعامل مختلف في policy؛ راجع الصفحة الرسمية الآن [KDP content guidelines](https://kdp.amazon.com/en_US/help/topic/G200672390).
5. لا توجد API عامة عملية لنشر كتاب KDP أتوماتيكياً؛ ارفع يدوياً إلى KDP وراجع preview, metadata, pricing/territories/royalty، checklist، ثم اضغط Publish بنفسك. لا تتجاوز واجهة النشر بالـbrowser bot.

## 8. AI Agents: بناء مقيد ومفيد لا «موظف مستقل»

لكل Agent: **الدور، مصدر المعرفة، الأدوات المسموح بها، أنواع الأفعال الممنوعة، حد المحاولات/التكلفة، حارس الحقائق، escalation، سجل القرار.**

- Product scout: يقرأ بيانات مرخصة/مملوكة، يصنف، يقترح اختبار؛ لا ينشئ purchase order.
- Ads analyst: يقرأ campaign metrics، يقترح budget/creative؛ لا يعدل live budget من دون approval/حد يومي.
- Support: read-only order status + FAQ، لا refunds/order changes إلا workflow منفصل بمراجعة.
- Market monitor: مصادر public/permissioned، cite URLs/collected_at، يرسل signal لا قرار.
- Content planner: يعيد تدوير موادك المصرح بها، يكتب drafts، لا نشر ذاتي قبل مراجعة.

**مواجهة prompt injection:** تعامل كل نص من صفحة/رسالة/Review كبيانات غير موثوقة لا instructions. لا تعطي Agent secrets/manager access، افصل tools (read vs write)، allowlist hosts، validate outputs، ولا تدعِه يفتح browser عشوائي أو يرسل طلبات بأذونات admin. أوقفه عند structured output غير صالح أو `confidence < threshold`.

## 9. مصادر وقوالب n8n إضافية

- [n8n repository](https://github.com/n8n-io/n8n)
- [Self-hosted AI Starter Kit](https://github.com/n8n-io/self-hosted-ai-starter-kit)
- [أكثر من قوالب n8n مجتمعياً — enescingoz](https://github.com/enescingoz/awesome-n8n-templates)
- [awesome-n8n](https://github.com/restyler/awesome-n8n)
- [قوالب workflow رسمية](https://n8n.io/workflows/)
- [MCP community node](https://github.com/nerding-io/n8n-nodes-mcp) — افحص الصيانة/الأمان والـpermissions قبل التنصيب.
- [Firecrawl community/official n8n nodes](https://www.npmjs.com/package/@mendable/n8n-nodes-firecrawl) — خدمة scraping محتوى عام حسب الشروط، مدفوعة حسب credits؛ لا تمنحك حق تجاوز access controls.
- [Crawlee](https://github.com/apify/crawlee) و[Apify n8n integration](https://github.com/apify/n8n-nodes-apify) — استخدام قانوني/متوافق فقط.
- ملفات JSON تجريبية في `research/n8n-workflows/01..05*.json`. راجع README قبل import: بعض الحقول Credential IDs/API scopes/versions placeholders، وWorkflow 4 و5 توضيحيان وليس production-ready.
