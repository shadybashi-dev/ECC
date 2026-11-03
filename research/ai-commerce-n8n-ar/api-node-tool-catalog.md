# دليل الأدوات المرتبطة بعقد n8n: قنوات التواصل، المنصات، البيانات وواجهات API

هذه القائمة تكمل [دليل الأدوات](tool-catalog.md) و[n8n workflows](n8n-workflows.md). الحسابات الأساسية قد تكون بلا اشتراك شهري، لكن API access ليس «غير محدود/مجانياً»: قد توجد رسوم usage، موافقة تطبيق، حدود معدل، شروط تجارية أو رسوم منصة/مزود/رسائل/إعلانات. الأسعار تختلف بالدولة والخطة؛ راجع صفحات التسعير والوثائق الرسمية قبل البناء.

| الخدمة/العقدة | الرابط | السعر/خطة مجانية | API / n8n | بديل/ملاحظات |
|---|---|---|---|---|
| Shopify | [pricing](https://www.shopify.com/pricing) | اشتراك متجر مدفوع؛ الخطط الأمريكية السنوية من Basic $29 (راجع السعر الحي) | Shopify node/triggers + Admin GraphQL API + webhooks؛ لا رسم API مستقل عادة، لكن تحتاج خطة وصلاحيات | WooCommerce/BigCommerce |
| WooCommerce | [core](https://woocommerce.com/) / [REST API](https://developer.woocommerce.com/docs/apis/rest-api/) | Plugin مجاني؛ استضافة/دومين/بوابة وإضافات منفصلة | WooCommerce node + REST v3 + webhooks | Shopify hosted |
| Stripe | [pricing](https://stripe.com/pricing) | لا اشتراك قياسي؛ رسوم معالجة/نزاع حسب السوق والمنتج | Stripe node/API/Webhooks؛ API عادة لا رسوم مستقلة عن transaction | PayPal/بوابة بلد مرخصة |
| PayPal | [merchant fees](https://www.paypal.com/us/business/paypal-business-fees) | حساب business عادة دون رسوم شهرية أساسية؛ transaction/FX/dispute fees تختلف | PayPal node/REST API/webhooks | Stripe/بوابة محلية |
| Gmail | [pricing](https://workspace.google.com/pricing.html) / [Gmail API](https://developers.google.com/gmail/api) | Gmail الشخصي مجاني؛ Google Workspace اشتراك لكل مستخدم (أسعار تختلف حسب المنطقة) | n8n Gmail node + OAuth/quota؛ limits/API policy | SMTP provider/transaction email service |
| SMTP | [Brevo](https://www.brevo.com/pricing/) / [Postmark](https://postmarkapp.com/pricing) | مزودون بباقات مجانية محدودة أو مدفوعة حسب البريد | Email/SMTP node أو HTTP API؛ SPF/DKIM/DMARC لازم | Gmail SMTP للاختبار فقط، وليس bulk promo |
| Telegram Bot API | [official docs](https://core.telegram.org/bots/api) | API مجانية عادة؛ تكلفة سيرفر البوت/المزود منك | Telegram node؛ إنشاء bot عبر BotFather | Slack/Discord/Email alerts |
| Slack | [pricing](https://slack.com/pricing) / [API](https://api.slack.com/) | Free محدود؛ المدفوع per user | Slack node/OAuth/webhooks وAPI limits | Telegram/Discord/Email |
| Discord | [developer docs](https://discord.com/developers/docs) | الحساب/السيرفر مجاني؛ API limits | Discord node/webhook/bot token؛ لا ترسل marketing unsolicited | Slack/Telegram |
| WhatsApp Business Platform | [Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/) / [pricing](https://developers.facebook.com/docs/whatsapp/pricing/) | لا تفترض اشتراك API مجاني شامل؛ رسوم الرسائل/فئة/بلد recipient + BSP/CRM حسب الخيار | HTTP Request/Meta integration؛ webhook؛ templates/opt-in/number verification | Email/SMS/WhatsApp provider معتمد |
| Facebook Pages/Instagram | [Meta developer](https://developers.facebook.com/docs/) / [Instagram publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) | API account لا اشتراك شهري ثابت عادة؛ حملات Ads منفصلة | OAuth, app review/permissions, professional account/scopes, rate limit | Buffer/Later/Meta Business Suite native |
| X (Twitter) | [Developer Platform](https://developer.x.com/) | الوصول/الأسعار تتغير حسب API tier؛ تحقق قبل بناء/اشتراك | n8n X node/HTTP API مع account/app scopes؛ لا تعتبر النشر مجاني | scheduler معتمد مثل Buffer/Publer إذا يدعم tier |
| LinkedIn | [API docs](https://learn.microsoft.com/linkedin/) / [developer](https://www.linkedin.com/developers/) | API access يتطلب app/permission review؛ لا رسوم API عامة ثابتة لكن خطة الأدوات قد تكون مدفوعة | LinkedIn node/API مع scopes/organization role | Buffer/Hootsuite أو نشر يدوي |
| Reddit | [API docs](https://www.reddit.com/dev/api/) / [developer terms](https://www.redditinc.com/policies/data-api-terms) | الاستخدام/الأسعار والسياسات تتغير؛ لا تفترض free commercial access | Reddit node/OAuth/API quota؛ subreddit self-promotion rules | RSS/المتابعة اليدوية للمحتوى العام |
| YouTube Data API | [official](https://developers.google.com/youtube/v3) | لا رسوم API تقليدية ضمن quota الافتراضية، لكن units/limits/review تتغير؛ Google Cloud/رفع/إعلانات منفصلة | YouTube node/OAuth/quota، API upload/metadata وفق scope | YouTube Studio/native scheduling |
| Mailchimp | [pricing](https://mailchimp.com/pricing/marketing/) / [API](https://mailchimp.com/developer/marketing/api/) | Free محدود بحسب contacts/sends/market؛ مدفوع حسب القائمة/الميزات | Mailchimp node/API/webhooks؛ لا تسوق بلا consent | Klaviyo/Omnisend/Brevo |
| HubSpot | [pricing](https://www.hubspot.com/pricing/crm) / [API](https://developers.hubspot.com/docs/api/overview) | CRM مجاني محدود؛ Marketing/Sales hubs مدفوعة حسب seats/contacts | HubSpot node/API OAuth/limits | Airtable/Zoho/SuiteCRM |
| Google Ads | [pricing](https://ads.google.com/home/pricing/) / [API](https://developers.google.com/google-ads/api) | API عادة بلا رسوم منفصلة؛ تكلفة الإعلانات حسب auction؛ developer token/access level | Google Ads node/API OAuth/token + approval/use limits | Ads UI/report export |
| Meta Ads | [Marketing API](https://developers.facebook.com/docs/marketing-apis/) | API access لا اشتراك API ثابت غالباً؛ ad spend/agency/app costs منفصلة | n8n HTTP/Graph API, app review, business permissions | Meta Ads Manager/native reports |
| Google Sheets | [API docs](https://developers.google.com/sheets/api) | حساب Google مجاني بمساحة/حدود؛ Workspace مدفوع | Google Sheets node/OAuth/API quota | CSV/Postgres/Airtable |
| Airtable | [pricing](https://airtable.com/pricing) / [API](https://airtable.com/developers/web/api/introduction) | Free محدود؛ tiers مدفوعة حسب seats/records | Airtable node/OAuth/API per-plan limits | Google Sheets/Postgres |
| Notion | [pricing](https://www.notion.so/pricing) / [API](https://developers.notion.com/) | Free personal؛ plans فرق/AI مدفوعة | Notion node/API integration scopes | Docs/Sheets/Outline/BookStack |
| Google Drive | [pricing](https://one.google.com/about) / [API](https://developers.google.com/drive/api) | مساحة مجانية محدودة؛ Workspace/Google One مدفوع | Google Drive node/OAuth/API quota | S3/Nextcloud/OneDrive |
| Mailchimp Email node | [n8n docs](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.mailchimp/) | خطط mailchimp وليس n8n | native node أو HTTP | Brevo/Klaviyo |
| Gmail/SMTP notifications | [n8n Email docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.email/) | n8n لا يفرض اشتراك بريد؛ مزود SMTP يفرض رسومه | Email Send node | Transactional email provider |

## ملاحظات تكلفة/الامتثال

1. لكل قناة فرّق بين: اشتراك المنصة، رسم الـAPI/استخدامه، رسوم الرسائل/المعاملة، ميزانية الإعلان، مزود integrator/agency، وتكاليف الضرائب.
2. ابدأ test/dev app أو sandbox، ثم اطلب أقل permissions؛ OAuth tokens تنتهي، وAPI quotas تتغير.
3. للمراسلات التسويقية خزّن موافقة/مصدر/توقيت وإلغاء الاشتراك؛ لا تعامل Gmail/Telegram/WhatsApp node كاستثناء من قانون الرسائل.
4. للمنصات الاجتماعية، API رسمي قد يرفض أتمتة المحتوى أو يشترط مراجعة app. لا تستخدم browser automation لتجاوز هذا الشرط.
5. استخدم `HTTP Request` إذا لا توجد native node فقط بعد التحقق من API docs/terms/security. لا ترسل بيانات بطاقة/health/address إلى أدوات AI دون سبب/اتفاق معالجة بيانات.
