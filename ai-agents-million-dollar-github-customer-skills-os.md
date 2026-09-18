# Million-Dollar AI Agent Company — GitHub × Customers × Skills OS

**الإصدار:** V3 Operating System
**التاريخ:** 18 سبتمبر 2026
**المرجع:** `ai-agents-million-dollar-blueprint-v2.md`
**الهدف:** استخدام ECC وGitHub وcustomer evidence وskills لبناء شركة تصل إلى **$1M cumulative revenue** وتهدف إلى **$1M ARR run-rate**.

> هذه ليست دعوة لتفعيل كل skill عشوائياً. نستخدم كل مميزات GitHub والـ skills التي تخفض تكلفة البيع والتنفيذ والمخاطر، ونبقي الباقي خارج المسار حتى يظهر سبب عملي لتفعيله.

---

## 1) الأطروحة الجديدة

```text
GitHub = نظام الحقيقة والإصدارات والحوكمة
Customers = مصدر المشكلة والدفع والـ evidence
ECC Skills = مصنع البحث والبناء والاختبار والتسليم
AI Agents = طبقة التنفيذ
Humans = approval، العلاقات، القرارات عالية المخاطر
```

### لماذا هذا أفضل من “وكيل يعمل وحده”؟

لأن المليون لا يأتي من عدد الـ Agents. يأتي من:

1. workflow واحد يشتريه العميل.
2. delivery قابل للتكرار.
3. evidence يثبت القيمة.
4. versioning يمنع الفوضى.
5. distribution يخفّض CAC.
6. recurring revenue وexpansion.

### المنتج المملوك

# Revenue Response OS

نسخة البداية للشركات المحلية:

```text
Missed call / web lead
        ↓
Lead intake
        ↓
Qualification
        ↓
Human-approved booking/handoff
        ↓
Follow-up بإذن
        ↓
Weekly result report
```

الـ product ليس prompt ولا chatbot. هو **workflow + integrations + evals + reports + operating playbooks**.

---

## 2) نموذج المليون مع GitHub leverage

### Base case [C]

```text
20 Growth clients × $3,000 MRR = $60,000 MRR
 5 Multi-location clients × $5,000 MRR = $25,000 MRR
---------------------------------------------
25 active clients = $85,000 MRR
$85,000 × 12 = $1,020,000 ARR
```

### لماذا GitHub والـ skills مهمان في الحساب؟

بدون system، كل عميل يصبح مشروعاً جديداً.
مع system:

- issue templates تقلل زمن intake.
- reusable workflows تقلل rework.
- PR reviews تمنع production mistakes.
- eval suites تمنع تدهور agent behavior.
- Actions تنتج reports وتفحص dependencies.
- releases تجعل النسخة المعتمدة قابلة للتكرار.
- customer evidence يتحول إلى vertical playbook.

هذه **فرضيات تشغيلية [C]** وليست claim أن GitHub وحده يصنع revenue.

---

# 3) GitHub Operating System

## 3.1 هيكل المستودع

```text
revenue-response-os/
├── CLAUDE.md                         # Kernel: identity + routing + safety
├── AGENTS.md                         # Repo operating rules
├── agents/                           # Specialist agent contracts
├── skills/                           # Reusable workflows / vertical knowledge
├── commands/                         # Human-triggered commands
├── apps/
│   ├── operator-console/             # Approval queue + customer status
│   ├── customer-portal/              # Optional, no raw secrets
│   └── reporting-worker/             # Reports and scheduled jobs
├── packages/
│   ├── agent-contracts/              # Typed input/output schemas
│   ├── vertical-hvac/                # Vertical adapter
│   ├── vertical-plumbing/            # Vertical adapter
│   ├── connectors-crm/               # CRM adapters
│   ├── connectors-calendar/          # Calendar adapters
│   ├── evals/                        # Golden cases + graders
│   ├── cost-control/                 # Usage/cost guards
│   └── policy-engine/                # Consent + human approval rules
├── customers/
│   ├── _template/                    # Non-PII configuration template
│   └── customer-XXXX/                # Sanitized config + versioned playbook
├── data-contracts/
│   ├── lead.schema.json
│   ├── booking.schema.json
│   ├── escalation.schema.json
│   └── report.schema.json
├── evals/
│   ├── capability/
│   ├── regression/
│   ├── adversarial/
│   └── customer-vertical/
├── docs/
│   ├── product/
│   ├── runbooks/
│   ├── customer-success/
│   ├── pricing/
│   └── releases/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── release.yml
│   └── pull_request_template.md
└── scripts/
    ├── customer-report/
    ├── eval-runner/
    ├── cost-report/
    └── redaction/
```

### ممنوع

- raw customer conversations داخل Git.
- API keys أو access tokens داخل files.
- customer PII داخل public issues أو Discussions.
- تغيير production config مباشرة من branch.
- workflow خارجي ينفذ side effect لأن issue body طلب ذلك.

---

## 3.2 GitHub Features التي نستخدمها

### Repository and Branch Protection

- `main`: production-approved only.
- `staging`: integration and customer-safe test.
- feature branch لكل change.
- required PR review.
- CODEOWNERS حسب domain.
- required status checks.
- signed commits حيث تكون متاحة.
- no force push إلى protected branches.

### Issues

نحوّل GitHub Issues إلى operations system:

| Issue type | الاستخدام |
|---|---|
| `customer-signal` | مشكلة أو طلب متكرر من عميل |
| `pilot-intake` | نطاق pilot وقبول العميل |
| `incident` | failure أو incorrect output |
| `eval-regression` | انخفاض جودة agent |
| `integration` | CRM/calendar/provider work |
| `feature` | capability جديدة بعد evidence |
| `renewal-risk` | انخفاض usage أو قيمة العميل |
| `cost-anomaly` | usage أو API bill غير طبيعي |
| `case-study` | evidence بموافقة العميل |

كل issue يجب أن يحتوي على:

- customer segment.
- workflow.
- evidence.
- frequency.
- business impact.
- confidence grade `[A/B/C]`.
- privacy classification.
- owner.
- acceptance criteria.
- merge/release gate.

### GitHub Projects

نستخدم Project Views منفصلة:

1. **Revenue Pipeline** — prospect → discovery → paid audit → pilot → growth → renewal.
2. **Delivery Kanban** — ready → configuring → eval → staging → approval → production → report.
3. **Product Evidence** — requests مصنفة حسب frequency وwillingness-to-pay.
4. **Risk Board** — incidents، privacy، cost، security، policy.
5. **Content Pipeline** — source → script → QA → approval → published → measured.

Custom fields:

- `customer_id`
- `vertical`
- `revenue_stage`
- `MRR`
- `severity`
- `evidence_grade`
- `data_classification`
- `release_gate`
- `owner`
- `next_action_date`

### Pull Requests

لا يوجد feature يدخل production بدون PR يحتوي:

- problem statement.
- customer evidence link أو سبب platform work.
- scope/non-scope.
- changed contracts.
- tests/evals.
- cost impact.
- security/privacy impact.
- rollback plan.
- human approval requirement.

### GitHub Actions

الـ workflows المقترحة:

```text
pull_request
  → lint/type/test/security/eval

push to staging
  → integration tests + sanitized customer fixtures

manual approval
  → production deploy

schedule daily
  → cost report + incident scan + eval drift

schedule weekly
  → customer health report + pipeline review

release tag
  → changelog + artifacts + versioned runbook
```

### Environments

- `development`
- `staging`
- `production`
- `customer-sandbox`

Production environment يحتاج:

- required reviewers.
- secrets منفصلة.
- deployment approval.
- audit trail.
- rollback artifact.

### GitHub Secrets وOIDC

- لا نحفظ API keys في repo.
- نستخدم GitHub Environments أو cloud secret manager.
- OIDC للـ cloud deploy بدلاً من long-lived credentials.
- customer-specific secrets منفصلة.
- rotation policy.
- لا تضع secret في action logs.

### Packages

GitHub Packages أو registry خاص للـ:

- vertical adapters.
- typed contracts.
- evaluation harness.
- reporting worker.
- internal SDK.

كل package يحتاج license وversion وowner وchangelog.

### Releases

كل release يحتوي:

- semantic version.
- changed behavior.
- customer impact.
- migrations.
- eval summary.
- security notes.
- rollback instructions.
- known limitations.

### Codespaces / Dev Containers

استخدم Dev Container لتسهيل onboarding:

- نفس Node/Python versions.
- نفس test/eval commands.
- no secrets داخل container.
- seed data synthetic فقط.
- contractor يستطيع تنفيذ adapter دون الوصول إلى customer production.

### Security Features

فعّل وراجع:

- Dependabot.
- CodeQL.
- secret scanning.
- dependency review.
- OSSF/SLSA workflows حسب الحاجة.
- CODEOWNERS.
- branch protection.
- environment approvals.

هذه features لا تلغي security review؛ هي دفاع إضافي.

### Discussions وPages

- Discussions: academy questions، public roadmap، non-sensitive community.
- Pages: docs أو public changelog فقط.
- لا تستخدم Discussions لدعم customer فيه PII.
- لا تعرض customer metrics إلا بإذن صريح وتجميع مناسب.

### GitHub Apps / Webhooks

استخدمها فقط عند وجود حاجة:

- issue opened → create customer work item.
- PR merged → update release/implementation state.
- workflow failed → incident ticket.
- release published → customer changelog.

كل webhook يجب أن يحتوي على:

- signature verification.
- replay protection.
- idempotency key.
- rate limit.
- least privilege.
- safe failure path.

---

# 4) Customer Operating System

## 4.1 أنواع العملاء

### Design Partner

- عميل حقيقي.
- يدفع pilot مخفضاً أو بسعر كامل.
- يقدم baseline وfeedback.
- لا يملك حق تغيير architecture وحده.

### Reference Customer

- لديه نتيجة موثقة.
- يوافق على case study محدودة.
- لا نستخدم اسمه أو أرقامه دون permission.

### Expansion Customer

- يضيف location أو workflow أو team seats.
- يحسن NRR بدلاً من الاعتماد فقط على new logos.

### Channel Partner

- agency، CRM integrator، call center، أو consultant.
- يجلب عدة عملاء.
- يحتاج enablement وsupport boundaries.

### Customer Advisory Circle

5–8 عملاء متشابهين، اجتماع شهري قصير:

- أعلى ألم.
- آخر failure.
- ما الذي سيدفعون له.
- feature requested.
- هل سيجددون ولماذا.

لا تجعل Advisory Circle مجموعة مجانية تطلب custom work بلا نهاية.

---

## 4.2 Lifecycle

```text
Target account
    ↓
Discovery
    ↓
Paid diagnostic
    ↓
Pilot contract
    ↓
Baseline
    ↓
Implementation
    ↓
Eval + staging
    ↓
Customer approval
    ↓
Production
    ↓
Weekly report
    ↓
30-day review
    ↓
Renewal / expansion / exit
```

### لكل عميل artifacts ثابتة

- customer brief.
- data-processing classification.
- workflow map.
- success metrics.
- acceptance criteria.
- configuration manifest.
- test cases.
- runbook.
- weekly report.
- renewal plan.
- postmortem عند الفشل.

---

## 4.3 Customer Evidence Loop

```text
Customer conversation
        ↓
Redact PII
        ↓
Create evidence issue
        ↓
Classify frequency + willingness-to-pay
        ↓
Update vertical skill or eval
        ↓
Implement via PR
        ↓
Run regression suite
        ↓
Release version
        ↓
Measure customer outcome
```

### Promotion rule

لا نحول كل طلب فردي إلى feature.

| الحالة | القرار |
|---|---|
| طلب واحد بلا budget | document فقط |
| طلبان بنفس workflow | discovery/experiment |
| 3+ عملاء يدفعون أو يطلبون نفس الشيء | product candidate |
| feature تؤثر على safety أو privacy | security + architecture review |
| feature ترفع support أكثر من revenue | لا تطلقها قبل re-price |

---

# 5) Skills Routing Matrix

## 5.1 قبل البيع

| المهمة | Skills / agents |
|---|---|
| Market sizing وdemand | `market-research`, `deep-research`, `research-ops` |
| Competitor set | `competitive-platform-analysis`, `benchmark-methodology` |
| Offer وpositioning | `brand-discovery`, `product-capability`, `product-lens` |
| Sales narrative | `marketing-campaign`, `brand-voice`, `investor-materials` عند الحاجة |
| Customer interview synthesis | `scientific-thinking-scholar-evaluation`, `market-research` |

ملاحظة: `investor-*` لا يستخدم لإيهام العملاء؛ يستخدم فقط عندما يصبح fundraising قراراً حقيقياً.

## 5.2 البناء

| المهمة | Skills / agents |
|---|---|
| Plan | `planner`, `plan-canvas` |
| Architecture | `architect`, `agentic-engineering`, `agentic-os` |
| API/CRM integration | `api-design`, `api-connector-builder`, `backend-patterns` |
| Database/tenant data | `database-reviewer`, `database-migrations` |
| Frontend operator console | `frontend-patterns`, `dashboard-builder`, `accessibility` |
| Contracts | `contract-first`, `api-design` |
| Scheduling | `production-scheduling` |

## 5.3 موثوقية الوكلاء

| المهمة | Skills / agents |
|---|---|
| Agent action space | `agent-harness-construction` |
| Architecture audit | `agent-architecture-audit` |
| Evals | `agent-eval`, `eval-harness`, `agent-self-evaluation` |
| RAG quality | `rag-pipeline-reviewer`, `iterative-retrieval` |
| Cost/latency | `cost-aware-llm-pipeline`, `cost-tracking`, `benchmark-optimization-loop` |
| Autonomous loops | `autonomous-agent-harness`, `continuous-agent-loop` مع approval gates |
| Regression | `ai-regression-testing`, `verification-loop` |

## 5.4 التشغيل والدخل

| المهمة | Skills / agents |
|---|---|
| Automation inventory | `automation-audit-ops`, `workspace-surface-audit` |
| Billing/refunds | `customer-billing-ops`, `finance-billing-ops` |
| Delivery quality | `delivery-gate`, `production-audit` |
| GitHub operations | `github-ops`, `git-workflow` |
| Security | `security-review`, `security-scan`, `deployment-patterns` |
| Team execution | `team-agent-orchestration`, `dev-team` |
| Content distribution | `content-engine`, `crosspost`, `video-editing` |

## 5.5 القاعدة

لا تفعّل skill لأن اسمها مثير. فعّلها عندما يكون هناك:

- work item.
- owner.
- input.
- output artifact.
- acceptance criteria.
- cost ceiling.
- human gate إذا كان هناك side effect.

---

# 6) Agent Team داخل Revenue Response OS

## COO / Kernel

مسؤول عن:

- routing.
- prioritization.
- cost ceiling.
- state transitions.
- stop conditions.
- human approvals.

لا يقرر claims أو customer refunds أو production deploy وحده.

## Specialist agents

### Customer Intelligence

- `Market Scout`
- `Account Researcher`
- `Interview Synthesizer`
- `Competitor Mapper`
- `Pricing Analyst`

### Sales and offer

- `Diagnostic Agent`
- `Offer Agent`
- `Proposal Agent`
- `Case Study Agent`
- `Renewal Risk Agent`

### Delivery

- `Lead Intake Agent`
- `Qualification Agent`
- `Booking Agent`
- `Follow-up Agent`
- `Scope Agent`
- `Reporting Agent`

### Platform

- `Connector Builder`
- `Knowledge Curator`
- `Eval Runner`
- `Cost Controller`
- `Security Reviewer`
- `Release Manager`

### Human-only gates

- outbound campaign approval.
- sensitive claims.
- refunds/credits.
- pricing changes.
- production access.
- public case studies.
- affiliate disclosures.
- deletion of customer data.

---

# 7) GitHub-native workflows

## Workflow A — Customer signal

```text
Customer submits feedback
        ↓
Issue form validates fields
        ↓
Auto-label: customer-signal + vertical
        ↓
Product owner triage
        ↓
Link to Project
        ↓
Promote to skill/eval only if threshold passes
```

## Workflow B — Agent change

```text
Issue: change request
        ↓
Planner creates implementation plan
        ↓
Feature branch
        ↓
TDD + eval definition first
        ↓
Implementation
        ↓
Code review + security review
        ↓
Staging deploy
        ↓
Customer fixture tests
        ↓
Human approval
        ↓
Production release
```

## Workflow C — Incident

```text
Agent failure
        ↓
Incident issue
        ↓
Disable risky tool / kill switch
        ↓
Redact evidence
        ↓
Root cause analysis
        ↓
Regression test
        ↓
Fix PR
        ↓
Postmortem
        ↓
Customer update
```

## Workflow D — Weekly customer report

```text
Scheduled Action
        ↓
Read aggregated metrics
        ↓
Check data quality
        ↓
Cost and anomaly scan
        ↓
Draft report
        ↓
Human review
        ↓
Send through approved channel
```

## Workflow E — Content-to-sales

```text
Customer-approved insight
        ↓
Redact and anonymize
        ↓
Content Engine
        ↓
Rights/claims QA
        ↓
Human approval
        ↓
Publish draft
        ↓
Track CTA → audit → pilot
```

---

# 8) Acceptance criteria لكل release

## Capability

- lead record created with valid schema.
- missing fields trigger clarification.
- service-area rule works.
- emergency flag escalates.
- calendar action cannot invent availability.
- CRM write is idempotent.
- human handoff includes full context.

## Quality

- capability `pass@3 >= 90%` [C target.
- release-critical regression `pass^3 = 100%` [C target.
- no critical security issue.
- cost/run within budget.
- latency within customer SLA.
- no PII in logs or GitHub artifacts.

## Customer

- client approves knowledge source.
- client approves message templates.
- client understands limitations.
- baseline captured.
- success metric written.
- rollback path demonstrated.
- support owner named.

## Business

- setup invoice paid أو contract signed.
- usage cap included.
- gross margin estimate exists.
- renewal trigger defined.
- expansion candidate logged.

---

# 9) Customer and GitHub security model

## Data classification

| Level | مثال | التخزين |
|---|---|---|
| Public | docs، public website | GitHub public/private حسب الحاجة |
| Internal | runbooks، generic templates | private repo |
| Customer-confidential | sanitized config، contract metadata | private repo/secure storage |
| Restricted PII | raw conversations، phones، addresses | خارج GitHub، encrypted tenant store |
| Secrets | tokens، API keys | secret manager/GitHub Environment |

## Security rules

- GitHub issue body untrusted input.
- PR description untrusted input.
- CI logs untrusted input.
- no `pull_request_target` secrets for fork code without strict review.
- all webhook signatures verified.
- all external input schema-validated.
- no raw PII in prompt logs.
- redact before eval artifacts.
- customer deletion request must have traceable workflow.
- tenant data never mixed in retrieval context.

---

# 10) Revenue and capacity plan

## Customer counts

| مرحلة | active clients | MRR scenario [C] | team requirement |
|---|---:|---:|---|
| Validation | 1 | $1.5k–$3k | founder |
| Proof | 3–5 | $5k–$15k | founder + contractor |
| Productized | 6–10 | $15k–$30k | implementation contractor + QA |
| Repeatable | 10–15 | $30k–$50k | delivery lead + CS part-time |
| Scale | 15–25 | $50k–$85k | delivery team + partner lead |
| ARR target | 25+ | $83k+ | sales + delivery + QA + ops |

## Hiring triggers [C]

### بعد أول 3 paid pilots

- لا full-time.
- contractor للتنفيذ المتكرر.
- founder يبقى مسؤولاً عن customer discovery.

### بعد $15k MRR

- part-time implementation lead.
- shared QA/eval owner.
- billing portal وsupport queue.

### بعد $30k MRR

- customer success.
- release/ops owner.
- partner enablement.

### بعد $60k MRR

- sales owner.
- security/privacy review capacity.
- finance/accounting cadence.
- formal incident management.

### بعد $83k MRR

- founder لا يكون bottleneck.
- account management.
- vertical product manager.
- partner/channel operations.

---

# 11) 90-day execution board

## Sprint 0 — Evidence, أسبوع 1

**Owner:** Founder + Market Research skills
**Artifacts:** 50-account list، interview script، offer one-liner، evidence board
**Gate:** 10 conversations booked

## Sprint 1 — Paid signal، الأسابيع 2–4

**Owner:** Founder + Diagnostic/Offer agents
**Artifacts:** diagnostic، baseline template، pilot contract، 3 proposals
**Gate:** one paid pilot أو سبب pivot موثق

## Sprint 2 — MVP، الأسابيع 5–8

**Owner:** Planner + Architect + API/Connector builder
**Artifacts:** lead schema، intake workflow، approval queue، initial evals
**Gate:** 50 golden cases + staging demo

## Sprint 3 — First result، الأسابيع 9–12

**Owner:** Delivery + Eval + Security
**Artifacts:** customer report، incident/runbook، case study request
**Gate:** customer accepts result أو workflow limitation documented

## Sprint 4 — Productize، الأشهر 4–6

**Owner:** Product + Team orchestration
**Artifacts:** reusable adapter، onboarding، GitHub Actions، release v0.2
**Gate:** 3 customers share same 70% workflow [C]

---

# 12) Daily / weekly operating cadence

## Daily

- new customer signals.
- blocked delivery items.
- failed agents.
- cost anomaly.
- approvals pending.
- one revenue action by founder.

## Weekly

- pipeline and cash collected.
- MRR and churn risk.
- customer health.
- eval drift.
- security/dependency alerts.
- open incidents.
- content CTA results.
- one decision: keep, improve, pivot, kill.

## Monthly

- pricing review.
- gross margin by customer.
- product requests by frequency.
- partner performance.
- release notes.
- customer advisory circle.
- skill promotion review.
- capability inventory.

---

# 13) ماذا يعني “استخدم كل المهارات” عملياً؟

لا نريد 286 skill تعمل في الخلفية وتستهلك context. نستخدم **skill registry**:

| Skill status | المعنى |
|---|---|
| Core | تعمل أسبوعياً: research، planner، api، eval، security، cost، delivery |
| Vertical | تعمل فقط لـ HVAC/plumbing أو vertical محدد |
| Conditional | تعمل عند billing، RAG، video، deployment، partner |
| Experimental | لا production؛ تحتاج eval أولاً |
| Deprecated | لا تستخدم؛ سبب الإيقاف موثق |

كل skill يجب أن يحتوي على:

- owner.
- trigger.
- inputs.
- outputs.
- tools.
- cost ceiling.
- risks.
- acceptance criteria.
- last verified date.
- related customer evidence.

إذا تكرر workflow مرتين، نحوله إلى skill. إذا لم يُستخدم خلال 90 يوماً، نراجعه أو نؤرشفه.

---

# 14) قواعد عدم الانحراف

- لا نفتح vertical ثاني بسبب الملل.
- لا نبيع feature قبل وجود evidence.
- لا نسمح للـ customer بفرض architecture غير آمنة.
- لا نضع PII في GitHub.
- لا نعتبر GitHub star أو skill موجود دليلاً على business demand.
- لا نعتبر likes أو views إيراداً.
- لا نعتبر pipeline cash.
- لا نعتبر vendor case study proof مستقلاً.
- لا نستخدم Agent ليوافق على نفسه.
- لا ننشر customer result دون consent.

---

# 15) القرار التنفيذي

## أول منتج

```text
Revenue Response OS
for one California home-service vertical
```

## أول customer segment

```text
3–5 local businesses with inbound demand and weak follow-up
```

## أول GitHub capability

```text
Issue Forms + Projects + protected PR flow + eval workflow
```

## أول skill stack

```text
market-research
→ product-capability
→ planner/architect
→ api-connector-builder
→ agent-harness-construction
→ agent-eval/eval-harness
→ security-review
→ cost-tracking
→ customer-billing-ops
→ delivery-gate/verification-loop
```

## أول milestone مالي

```text
1 paid pilot
not 1,000 followers
```

## هدف 36 شهراً

```text
25 active accounts
$83k+ MRR
$1M ARR run-rate
```

### الحكم

نعم، يمكن استعمال ECC كـ **company operating system**، لكن GitHub والـ skills يرفعان reliability والـ delivery capacity فقط. لا يعوضان:

- مقابلات العملاء.
- البيع.
- تنفيذ النتيجة.
- جمع evidence.
- retention.
- إدارة المال.

المليون يصبح معقولاً عندما يتحول كل customer outcome إلى:

```text
Evidence → Issue → Skill/Eval → PR → Release → Customer value → Renewal
```

---

## مراجع داخل المستودع

- `AGENTS.md` — agent-first، TDD، security، Git workflow، وquality gates.
- `skills/agentic-os/SKILL.md` — kernel، agents، commands، scripts، data، persistent memory.
- `skills/agent-harness-construction/SKILL.md` — action space، schemas، observations، recovery، cost.
- `skills/agent-eval/SKILL.md` — pass rate، cost، time، consistency، worktree isolation.
- `skills/eval-harness/SKILL.md` — capability/regression evals، pass@k، human grader.
- `skills/market-research/SKILL.md` — evidence-first research، counterarguments، decision output.
- `skills/deep-research/SKILL.md` — multi-source research، citations، source untrustedness.
- `skills/content-engine/SKILL.md` — source-first، platform-native content، rights/claims QA.
- `skills/customer-billing-ops/SKILL.md` — customer billing and safe remediation.
- `skills/finance-billing-ops/SKILL.md` — revenue truth، pricing، code-backed billing.
- `skills/automation-audit-ops/SKILL.md` — inventory configured/authenticated/verified automation.
- `skills/delivery-gate/SKILL.md` — deterministic session quality gate.
- `skills/github-ops/SKILL.md` — issues، PRs، CI، releases، Dependabot، security alerts.
- `skills/team-agent-orchestration/SKILL.md` — ownership، Kanban، handoffs، merge gates.
- `skills/security-review/SKILL.md` — application/security review checklist.
- `skills/verification-loop/SKILL.md` — build، type، lint، test، security، diff verification.

**تنبيه:** هذه وثيقة تجارية وتقنية، وليست legal advice أو revenue guarantee. كل pricing، margin، conversion، customer count، وtimeline موسوم أو يجب اعتباره `[C]` حتى تثبته بيانات دفع حقيقية.
