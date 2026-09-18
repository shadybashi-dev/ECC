# خطة المليون دولار من AI Agents — V2

**تاريخ الإصدار:** 18 سبتمبر 2026
**الهدف الافتراضي:** $1,000,000 company revenue خلال 24–36 شهراً، مع الوصول إلى $1,000,000 ARR run-rate كهدف توسع.
**الوضع:** خطة تخطيطية قابلة للاختبار؛ لا يوجد أي ضمان للنتيجة.

> **القرار المختصر:** لا نبني “جيش Agents” عاماً. نبني شركة تملك نتيجة واحدة: **استرداد وتأهيل وحجز الطلبات للشركات المحلية**. نبدأ بـ California home services، ثم نوسع إلى verticals متشابهة، ثم نحول التنفيذ المتكرر إلى platform/partner product.

---

## 1) حدد أي مليون تريد

| الهدف | ما يعنيه | خطة هذه الوثيقة |
|---|---|---|
| $1M cumulative revenue | مجموع المبيعات منذ البداية | هدف قابل للتحقيق حسابياً خلال 24–36 شهراً في نموذج service → product |
| $1M ARR | $83,333 MRR متكرر | هدف الشركة الأساسي في المرحلة الثالثة |
| $1M net profit | ربح بعد كل المصاريف والضرائب | ليس الهدف الأول؛ يحتاج revenue أعلى بكثير |
| $1M personal cash | المال الذي يصل إلى المؤسس | مختلف عن company revenue وARR |

### الافتراض الأساسي

نقيس نجاح الخطة على مستويين:

1. **قريب:** $1M cumulative company revenue.
2. **قابل للتوسع:** $83,333+ MRR، أي $1M ARR run-rate.

لا نخلط الإيراد مع الربح أو المال الشخصي.

---

## 2) الأطروحة التجارية

```text
العميل لديه طلب موجود
        ↓
الطلب يضيع في المكالمات/النماذج/المتابعة
        ↓
Revenue Response OS يلتقطه ويؤهله ويحجزه
        ↓
Human handoff
        ↓
قياس before/after
        ↓
Recurring fee + setup + expansion
```

### لماذا هذه الأطروحة؟

- العميل يدفع أصلاً على الإعلانات أو يملك inbound demand.
- الـ workflow متكرر وقابل للقياس.
- المشتري غالباً owner أو operations manager.
- لا نحتاج أن نخلق audience ضخمة قبل أول cash.
- يمكن استخدام AI تدريجياً؛ البداية لا تتطلب autonomous voice agent.
- كل نتيجة موثقة تتحول إلى content وcase study وsales asset.

### القاعدة

> **لا نبيع AI. نبيع workflow outcome يستخدم AI عند الحاجة.**

---

## 3) المنتج الأساسي: Revenue Response OS

### العميل الأول

ابدأ بـ **واحد فقط**:

- HVAC
- plumbing
- electrical
- roofing
- home-service maintenance

الاختيار الافتراضي: **HVAC أو plumbing في California**. لا نبدأ بـ real estate وhome services وe-commerce معاً.

### الوعد

> **We help local service businesses capture, qualify, and move more of their existing demand into booked work — with human-approved AI workflows.**

بالعربية:

> **نساعد الشركات المحلية تستعيد الطلبات التي تصلها، تؤهلها، وتحولها إلى مواعيد، مع موافقة بشرية على الحالات الحساسة.**

### Modules

1. **Lead Intake** — web forms، missed-call events، email، أو channel يملكه العميل.
2. **Qualification** — service، location، urgency، preferred time، basic context.
3. **Routing** — team member، service area، calendar، أو human escalation.
4. **Booking** — اقتراح موعد بناءً على availability، بدون اختراع availability.
5. **Follow-up** — فقط ضمن consent والقواعد المعتمدة.
6. **Scope Draft** — تحويل notes/photos إلى draft scope؛ لا يرسل binding quote وحده.
7. **Weekly Report** — response، qualified، booked، human handoff، cost، failures.
8. **Quality/Safety Layer** — logs، evals، budget، kill switch، rollback.

### ما لا يفعله النظام

- لا يشخص حالة خطرة.
- لا يعطي سعراً نهائياً من تلقاء نفسه.
- لا يضمن job أو revenue.
- لا يرسل bulk messages بلا opt-in.
- لا ينفذ medical/legal/financial decisions.
- لا يكتب في CRM أو يغير calendar دون schema validation وصلاحية محددة.

---

## 4) لماذا California home services قبل غيرها؟

هذا ليس claim بأن السوق مضمون. هو قرار wedge بسبب:

- lead urgency.
- phone/web inbound واضح.
- appointment/estimate قابل للقياس.
- local buyer decision cycle أقصر نسبياً من enterprise.
- يمكن تشغيل أول version ببيانات العميل وCRM بسيط.
- مناسب لمسار California ServiceLead Agent الموجود.

### التوسع لاحقاً

```text
HVAC/plumbing
      ↓
Electrical/roofing/cleaning/solar
      ↓
Property maintenance
      ↓
Real estate lead-to-viewing
      ↓
Partner white-label
```

لا ننتقل إلى vertical جديد حتى يصبح لدينا:

- 3–5 عملاء في vertical الحالي.
- نفس workflow يتكرر بنسبة 70% تقريباً. **[C] معيار داخلي.**
- baseline وcase study.
- template deployment.
- support يمكن تفويضه.

---

## 5) Offer ladder

كل الأسعار التالية **[C] فرضيات اختبار** وليست market facts.

| العرض | ما يحصل عليه العميل | السعر التجريبي |
|---|---|---:|
| **Leak Diagnostic** | map للـ funnel، baseline، 20–30 data points، automation opportunities | $1,000–$3,000 مرة واحدة |
| **30-Day Pilot** | intake واحد، qualification، human handoff، dashboard، tests، report | $5,000–$12,000 setup + $1,500–$3,000/mo |
| **Growth OS** | integrations، booking، follow-up، QA/evals، weekly optimization | $10,000–$20,000 setup + $3,000–$6,000/mo |
| **Multi-location** | branches، roles، routing، SLA، partner/white-label support | $25,000–$50,000 setup + $7,500–$15,000/mo |

### شروط التسعير

- API، voice، SMS، BSP usage: pass-through أو fair-use limit واضح.
- لا يوجد unlimited support.
- custom integration خارج scope يحتاج change order.
- attribution definitions مكتوبة قبل التشغيل.
- أول عميلين يمكن تخفيض setup مقابل access للـ baseline وtestimonial بإذن العميل، لا مقابل revenue claim غير مثبت.

### لا نستخدم

- “Guaranteed $10k/month.”
- “We will double your revenue.”
- “100% autonomous.”
- “No staff required.”
- “AI never makes mistakes.”

---

## 6) الحساب نحو المليون

### المسار A — $1M ARR

```text
20 Growth clients × $3,000 MRR = $60,000 MRR
 5 Multi-location clients × $5,000 MRR = $25,000 MRR
---------------------------------------------
25 active clients               = $85,000 MRR
$85,000 × 12                    = $1,020,000 ARR
```

هذه **[C] معادلة تخطيطية**، لا forecast.

### المسار B — $1M cumulative revenue

خلال 24–36 شهراً:

```text
25 clients × average $2,500 MRR × average 10 active months
= $625,000 recurring revenue

25 setup projects × average $10,000
= $250,000 setup revenue

Digital products / paid diagnostics / workshops
= $125,000 planning scenario

Total = $1,000,000 cumulative revenue
```

الـ digital product هنا ليس الافتراض الرئيسي؛ يمكن استبداله بمزيد من setup أو partner revenue.

### المسار C — partner-assisted

```text
10 partners
× 10 active client accounts each
× $800 platform/service MRR
× 12 months
= $960,000 ARR
```

لا نبدأ بهذا المسار قبل إثبات direct delivery. الشركاء يضاعفون support complexity إذا لم يكن onboarding موحداً.

---

## 7) unit economics التي تحكم القرار

### مثال عميل Growth [C]

| البند | التخطيط |
|---|---:|
| MRR | $3,000 |
| API/BSP/hosting/usage | $250–$700 |
| direct support وQA | $300–$600 |
| gross profit التقريبي | $1,700–$2,450 |
| gross margin التقريبي | 57%–82% |

هذه ليست نتائج فعلية. نسجل التكلفة الحقيقية لكل tenant من أول يوم.

### Gates مالية داخلية [C]

- target gross margin بعد productization: 70%+.
- CAC payback: أقل من 4 أشهر.
- لا custom feature بلا paid change order.
- لا employee full-time قبل تغطية 3 أشهر من تكلفته من recurring revenue.
- إذا تجاوز support 5 ساعات/شهر للعميل ضمن الباقة، نصلح product أو نرفع السعر.
- لا نسمح بـ API spend يتجاوز الحد بدون alert وhuman review.

### معادلات

```text
Gross margin = (Revenue - direct delivery cost) / Revenue
CAC payback = CAC / (MRR × gross margin)
Churn = lost recurring clients / starting recurring clients
Net revenue retention = (starting MRR + expansion - contraction - churn) / starting MRR
```

---

## 8) خارطة 36 شهراً

### المرحلة 0 — Validation، الأيام 1–30

**الهدف:** لا code كبير؛ نثبت أن شخصاً سيدفع.

- 3 vertical hypotheses فقط.
- 30 discovery conversations.
- 100-account prospect list.
- 5 audits.
- 3 paid pilot offers.
- عميل pilot واحد مدفوع على الأقل.
- synthetic demo وbaseline template.

**Kill criteria:**

- أقل من 8 مقابلات من أصل 30 تصف نفس الألم → غيّر vertical.
- أقل من 3 عروض pilot مدفوعة أو serious procurement → غيّر offer/ICP.
- لا owner ولا data access → لا pilot.

### المرحلة 1 — Proof، الأيام 31–90

**الهدف:** 3–5 عملاء، $5k–$15k MRR scenario [C].

- تنفيذ يدوي جزئياً.
- نفس workflow، لا custom platform.
- case study واحدة بموافقة العميل.
- golden test set من 50–100 حالة. **[C] معيار داخلي.**
- dashboard يفرق بين leads، qualified، booked، attended، paid job.
- contractor للتنفيذ فقط إذا تكرر العمل 3 مرات.

### المرحلة 2 — Productized delivery، الأشهر 4–6

**الهدف:** 6–10 عملاء، $15k–$30k MRR scenario [C].

- onboarding form.
- data mapping template.
- CRM/calendar adapter.
- approval queue.
- standard contract وDPA.
- failure library.
- weekly client report.
- founder يقود sales، contractor يقود implementation.

### المرحلة 3 — Repeatable company، الأشهر 7–12

**الهدف:** 10–15 عملاء، $30k–$50k MRR scenario [C].

- vertical واحد فقط.
- channel partner واحد.
- customer success owner part-time.
- paid diagnostic engine.
- content channel يشرح proof وليس hype.
- pricing revision حسب support وmargin.
- لا SaaS عام بعد إلا إذا تكرر نفس الطلب من 5+ عملاء.

### المرحلة 4 — Scale، الأشهر 13–24

**الهدف:** 15–25 عميل، $50k–$85k MRR scenario [C].

- 20 Growth/Multi-location clients.
- 2–3 implementation contractors.
- QA/evals owner.
- sales pipeline موثق.
- partner channel ثانٍ.
- tenant isolation.
- observability وcost controls.
- multi-location expansion لدى العملاء الحاليين.

### المرحلة 5 — $1M ARR، الأشهر 24–36

**الهدف:** 25 active accounts أو mix enterprise equivalent.

- $83,333+ MRR.
- renewal وexpansion أعلى من new-logo dependence.
- delivery team لا يعتمد على المؤسس.
- 70%+ template reuse. **[C]**
- strategic choice: vertical SaaS، managed service، أو partner platform.

---

## 9) خطة المبيعات للوصول إلى 25 عميلاً

### Funnel تخطيطي [C]

لكل 1 new client:

```text
100 target accounts
        ↓ 30% qualified
30 qualified accounts
        ↓ 30% positive/reply
9 discovery calls
        ↓ 33% serious fit
3 proposals/pilots
        ↓ 33% close
1 new client
```

هذه ليست benchmark؛ هي math تشغيلية نراقبها ونستبدلها ببياناتنا.

### أول 5 عملاء

Founder-led:

- 20 personalized outreaches/week.
- 5 discovery calls/week target بعد أول أسبوعين.
- لا bulk DM.
- لا cold SMS أو automated voice بلا consent.
- استعمل public business signals، لا personal data scraped.
- اعرض audit محدداً، لا “نقدر نعمل أي شيء بالـ AI”.

### من 6 إلى 15

- referrals.
- case studies.
- local marketing agencies.
- CRM implementers.
- call answering companies.
- trade associations.

### من 15 إلى 25+

- partner channel.
- multi-location expansion.
- annual contracts.
- implementation certification.
- outbound محدود من human team مع compliance.

---

## 10) Content engine يخدم المبيعات

المحتوى ليس المحرك الوحيد؛ هو trust وCAC engine.

### قناة واحدة

اختر English أو Arabic حسب buyer. لا تخلط جمهورين في الحساب الأول.

### أعمدة المحتوى

1. **Lead Leak Teardowns** — كيف تضيع الطلبات.
2. **Build in Public** — demo ببيانات وهمية.
3. **Failure Cases** — متى لا نسمح للـ Agent بالتصرف.
4. **Unit Economics** — API cost، support، margin.
5. **Client Workflow Education** — شرح قبل/بعد بدون كشف معلومات حساسة.

### CTA واحد

```text
Comment / click → Lead Leak Scorecard → paid diagnostic → pilot
```

لا نستخدم claims عن revenue إلا بعد consent، evidence، وqualification واضحة.

### Publishing policy

- owned/licensed media فقط.
- official YouTube/TikTok APIs أو native scheduler.
- drafts/private first.
- human approval قبل public publish.
- FTC affiliate disclosures قرب الرابط.
- realistic synthetic media disclosure حيث يلزم.

---

## 11) Agent army داخل الشركة

### Revenue agents

1. **Market Scout** — يبحث عن industry pain.
2. **Account Researcher** — يبني target list مع signal.
3. **Audit Agent** — يحلل funnel بموافقة العميل.
4. **Offer Agent** — ينشئ scope وpilot draft.
5. **Lead Intake Agent** — يلتقط inbound.
6. **Qualification Agent** — يجمع minimum fields.
7. **Booking Agent** — يطلب appointment ضمن calendar rules.
8. **Follow-up Agent** — drafts/send وفق consent.
9. **Scope Agent** — draft estimate بلا سعر نهائي مستقل.
10. **Reporting Agent** — KPI وlimitations.
11. **Margin Agent** — تكلفة API/support لكل tenant.
12. **Supervisor** — state، budget، permissions، stop، escalation.

### Content/QA agents

13. Research.
14. Script.
15. Rights/claims.
16. Production.
17. Analytics.
18. Case-study consent.
19. Regression/evals.
20. Knowledge-base updater.

### ترتيب البناء

```text
Intake → Qualification → Human handoff → Report
```

ثم:

```text
Booking → Follow-up → Scope → Multi-location → Partner platform
```

لا نبني swarm قبل أن يشتغل workflow واحد مع عميل وbaseline.

---

## 12) التقنية والحوكمة

### MVP stack

- Orchestration: n8n internal أو Python/LangGraph.
- Agent logic: OpenAI Agents SDK أو LangGraph حسب الحاجة.
- Data: Postgres/Supabase مع tenant isolation.
- CRM: نظام العميل؛ spreadsheet فقط للـ pilot.
- Calendar: Google/Microsoft calendar مع availability rules.
- Voice/SMS: official provider بعد consent ومراجعة terms.
- Dashboard: approval-first web UI أو Google Sheet في أول نسخة.
- Video: Remotion/FFmpeg مع license review.
- Publishing: YouTube official API، TikTok approved path/native scheduler.

### Go-live checklist

- 50–100 test cases including failures. **[C]**
- prompt injection tests.
- data leakage tests.
- cost ceiling.
- max retries.
- tool schema validation.
- human handoff SLA.
- audit log.
- rollback.
- kill switch.
- retention/deletion policy.
- client-approved messages.
- separate credentials per tenant.

OpenAI documentation توصي باستخدام traces وgraders وevaluation runs، وتوصي بـ human approval قبل external side effects الحساسة [B](https://developers.openai.com/api/docs/guides/agent-evals) [B](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals).

### تراخيص الأدوات

- n8n: راجع Sustainable Use/Enterprise license قبل بيع hosted multi-tenant product.
- Dify: راجع قيود license والbranding قبل commercial resale.
- Remotion: راجع Company License عند تجاوز شروط الاستخدام المجاني.
- كل GitHub repo: license، dependencies، security، secrets، maintenance.

---

## 13) المخاطر الكبرى

| الخطر | ما قد يحصل | الحماية |
|---|---|---|
| لا أحد يدفع | demos كثيرة وzero pilots | paid diagnostic، kill criteria |
| commodity pricing | العميل يقارن بـ $99 chatbot | vertical outcome + attribution + managed service |
| custom work | كل عميل workflow مختلف | scope، change order، vertical focus |
| low margin | support/API يأكل الربح | usage limits، cost ledger، re-pricing |
| churn | العميل لا يرى value | owner، baseline، weekly report، activation |
| AI error | wrong answer/booking | KB boundaries، evals، human handoff |
| policy violation | spam/unauthorized messages | opt-in، official APIs، audit |
| founder bottleneck | كل delivery عندك | playbooks، contractors، QA |
| overbuilding | SaaS قبل demand | 5 similar paying customers gate |
| claims risk | fake revenue/testimonials | evidence grades، consent، disclosures |

---

## 14) لوحة القيادة الأسبوعية

### Revenue

- cash collected.
- signed MRR.
- recurring active MRR.
- setup revenue.
- pipeline weighted فقط كـ pipeline، ليس revenue.
- gross margin.
- churn/expansion.

### Sales

- accounts researched.
- personalized outreaches.
- positive replies.
- discovery calls.
- paid diagnostics.
- pilot proposals.
- close rate.
- days to close.

### Delivery

- time to first value.
- implementation hours/client.
- support hours/client.
- successful tool calls.
- escalation rate.
- approval latency.
- incidents.
- cost/run.

### Customer result

- leads captured.
- response time.
- qualified leads.
- bookings.
- attendance.
- paid jobs where attribution is agreed.
- client-reported satisfaction.

### Decision rules [C]

- 2 أسابيع دون pipeline مؤهل → غيّر channel أو message.
- 30 مقابلة دون paid pilot → غيّر offer/vertical.
- 3 pilots دون measurable improvement → أوقف workflow.
- gross margin أقل من 60% بعد 2 cycles → re-price أو kill.
- churn من أول 3 أشهر أعلى من 5% شهرياً → توقف التوسع وراجع onboarding/value.

---

## 15) خطط الفشل والبدائل

### إذا فشل California home services

انتقل إلى واحدة فقط:

1. **California Bid Radar** — public bid matching + compliance matrix + human-reviewed proposal.
2. **Property Maintenance Triage** — email/web/voice intake + work-order draft.
3. **Logistics Document Intake** — invoices/PDF/email → ERP-ready record.

لا تغير أكثر من variable واحد في كل test.

### ما لا أجعله محرك المليون

- generic AI academy.
- prompt packs وحدها.
- mass faceless content.
- copied clips.
- fake engagement.
- affiliate spam.
- SaaS عام قبل paid pilots.
- fully autonomous medical/legal/financial agent.

---

## 16) أول 14 يوماً

### يوم 1

حدد: ARR أم cumulative revenue؟ اختر HVAC/plumbing، لغة، منطقة، وساعاتك.

### يوم 2

اكتب offer من سطر واحد، وما لا يشمله.

### يوم 3

أنشئ list من 50 business accounts مع public signal.

### يوم 4–6

15 discovery invitations، 5 calls مستهدفة، لا bulk automation.

### يوم 7

ابنِ synthetic demo: intake → qualify → handoff → report.

### يوم 8–10

نفذ 5 mini audits، لا تطلب production access بعد.

### يوم 11–12

أرسل 3 paid pilot proposals.

### يوم 13–14

اتخذ GO/PIVOT/KILL قراراً مبنياً على الدفع أو access أو owner commitment.

**لا تبني dashboard أو multi-agent swarm إذا لم تحصل على هذه الإشارة.**

---

## 17) القرار النهائي

### GO

نعم لبناء شركة AI Agents تصل إلى مليون **إذا** بدأنا بـ:

```text
One vertical
One painful workflow
One measurable outcome
One paid pilot
One approval-first system
One repeatable delivery template
```

### النموذج الذي نلتزم به

```text
California home-service revenue recovery
        ↓
3–5 paid pilots
        ↓
Productized Revenue Response OS
        ↓
20–25 recurring accounts
        ↓
Partners / multi-location
        ↓
$83k+ MRR
        ↓
$1M ARR run-rate
```

### الحكم الصريح

الهدف ممكن حسابياً، لكنه ليس نتيجة “ذكاء اصطناعي يعمل وحده”. يحتاج:

- sales يومية.
- customer access.
- proof.
- delivery team.
- pricing discipline.
- compliance.
- human approval.
- الاستعداد لقتل فكرة لا يدفع لها السوق.

---

## مصادر أساسية

### Platform / policy

1. YouTube monetization policies: https://support.google.com/youtube/answer/1311392
2. YouTube altered/synthetic content disclosure: https://support.google.com/youtube/answer/14328491
3. YouTube Data API: https://developers.google.com/youtube/v3/docs/videos/insert
4. TikTok Content Posting API: https://developers.tiktok.com/docs/en/content-posting-api-get-started
5. TikTok Content Sharing Guidelines: https://developers.tiktok.com/docs/en/content-sharing-guidelines
6. FTC endorsement guides: https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking

### California / market

7. Cal eProcure official portal: https://www.dgs.ca.gov/PD/Resources/Page-Content/Procurement-Division-Resources-List-Folder/Cal-eProcure-Portal-to-Access-Bid-Opportunities
8. California FI$Cal procurement resources: https://fiscal.ca.gov/user-support/cal-eprocure-resources/
9. CallRail home-services benchmark signal: https://www.callrail.com/blog/home-services-statistics
10. Vendasta AI receptionist case study: https://www.vendasta.com/blog/call-answering-service-for-small-business/

### Agent engineering

11. OpenAI Agent Evals: https://developers.openai.com/api/docs/guides/agent-evals
12. OpenAI Guardrails/Human Review: https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
13. LangGraph: https://github.com/langchain-ai/langgraph
14. OpenAI Agents SDK: https://github.com/openai/openai-agents-python
15. n8n license: https://github.com/n8n-io/n8n/blob/master/LICENSE.md
16. Dify license: https://github.com/langgenius/dify/blob/main/LICENSE
17. Remotion license: https://www.remotion.dev/license

**ملاحظة:** أي سعر، conversion، عدد عملاء، margin أو revenue forecast غير موسوم كمصدر أولي هو [C] scenario. لا تستخدم الخطة كوعد استثماري أو legal advice.
