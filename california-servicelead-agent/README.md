# California ServiceLead Agent — MVP

هذا أول prototype عملي لخطة **California Home-Service Lead Recovery Agent**.

## ما الذي يفعله؟

- يستقبل طلب estimate.
- يجمع نوع الخدمة، ZIP، درجة الاستعجال، والوقت المفضل.
- يضع emergency/unsafe requests في مسار human handoff.
- يتحقق من service area إذا أدخلت ZIPs في الإعدادات.
- يقترح الخطوة التالية.
- يحفظ leads محلياً داخل المتصفح فقط.
- يعرض dashboard بسيطاً.

## ما الذي لا يفعله؟

- لا يرسل SMS أو Email فعلياً.
- لا يجري مكالمات.
- لا يسجّل مكالمات.
- لا يتصل بـ CRM حقيقي.
- لا يرسل بيانات إلى AI API.
- لا يعمل كـ dispatch أو emergency service.

هذا مقصود: الهدف هو **demo منخفض التكلفة** تستطيع عرضه على أول صاحب شركة قبل أن تدفع لتكاملات production.

## التشغيل

لا تحتاج إلى Node أو API keys.

```bash
cd california-servicelead-agent
python3 -m http.server 4173 --bind 0.0.0.0
```

ثم افتح:

```text
http://localhost:4173
```

أو استخدم preview الذي يبدأه Agent Mode.

## طريقة العرض على العميل

1. افتح صفحة `Customer intake`.
2. أدخل طلب HVAC عادي.
3. اضغط `Run the agent`.
4. جرّب طلب `Emergency / unsafe condition` لترى human handoff.
5. اذهب إلى `Owner dashboard`.
6. اذهب إلى `Agent settings` وأدخل service-area ZIPs.
7. أعد تجربة ZIP خارج القائمة.

## قواعد مهمة قبل production

قبل ربط أي client data أو SMS أو phone number، يجب إضافة:

- Client-approved privacy notice وconsent language.
- Written data-processing/service-provider terms.
- Database بدلاً من localStorage.
- Authentication وtenant separation.
- Audit logs وretention/deletion controls.
- CRM/calendar credentials باسم العميل أو ضمن عقد واضح.
- Usage caps وalerts وkill switch.
- Human owner للطوارئ.
- مراجعة قانونية لـ TCPA وCalifornia privacy وcall recording قبل voice أو automated outreach.

## الخطوة التالية بعد أول مقابلات

لا تضف features لمجرد أن الديمو جميل. استخدم هذا prototype للحصول على إجابة من أصحاب HVAC/plumbing:

- هل يضيع عندهم estimate request؟
- أين يسجلونه اليوم؟
- كم يستغرق الرد؟
- هل يريدون booking أم مجرد alert؟
- من يدفع؟
- هل يقبلون paid pilot لمدة 14 يوماً؟

بعد الحصول على أول paid pilot فقط، استبدل localStorage بـ Supabase/Postgres، وأضف webhook وCRM integration واحداً.
