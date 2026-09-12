# cts — claude-token-saver

**Node.js خارق لتوفير توكين Claude + أمان كامل للنشر على GitHub. صفر dependencies.**

A super Node.js toolkit that cuts your Claude token usage and cost, while keeping
your repo safe to push to GitHub. **Zero dependencies** — only Node.js built-ins.

---

## المحتوى / Contents

- [ليش cts؟ / Why cts؟](#ليش-cts--why-cts)
- [التثبيت من GitHub / Install from GitHub](#التثبيت-من-github--install-from-github)
- [الاستخدام السريع / Quick start](#الاستخدام-السريع--quick-start)
- [الأوامر / Commands](#الأوامر--commands)
- [كيف توفر التوكين؟ / How it saves tokens](#كيف-توفر-التوكين--how-it-saves-tokens)
- [الأمان / Security](#الأمان--security)
- [الأسعار / Prices](#الأسعار--prices)
- [الاختبارات / Tests](#الاختبارات--tests)

---

## ليش cts؟ / Why cts؟

| المشكلة / Problem | الحل / Solution |
|---|---|
| برومبتات ضخمة تاكل التوكين | `cts optimize` يضغط البرومبت ويفرجيك التوفير |
| Huge prompts eat tokens | `cts optimize` compresses prompts and shows savings |
| ما بتعرف وين عم تروح التوكن | `cts estimate` + `cts audit` يقيس كل شي |
| No visibility into usage | `cts estimate` + `cts audit` measure everything |
| نفس السؤال يتكرر ويدفع كل مرة | كاش محلي + Prompt Caching من Anthropic |
| Repeat questions billed every time | Local cache + Anthropic prompt caching |
| مفاتيح API تتسرب على GitHub | `cts secrets` + pre-commit hook يمنع التسريب |
| API keys leak to GitHub | `cts secrets` + pre-commit hook block leaks |

---

## التثبيت من GitHub / Install from GitHub

المتطلبات: Node.js 18+ فقط. لا حاجة لأي شي ثاني.

Requirements: only Node.js 18+. Nothing else.

```bash
# 1) انسخ الريبو (شallow clone سريع)
git clone --depth 1 https://github.com/shadybashi-dev/ECC.git
cd ECC/claude-token-saver

# 2) ثبّت الأمر cts عالمياً (بدون dependencies — التثبيت فوري)
npm install -g .

# 3) تحقق
cts --help
cts prices
```

أو سطر واحد (يستنسخ ويثبّت):

```bash
curl -fsSL https://raw.githubusercontent.com/shadybashi-dev/ECC/arena/01a09496-ecc/claude-token-saver/install.sh | bash
```

داخل ريبو ECC نفسه يمكنك التشغيل بدون تثبيت:

```bash
npm run tokensaver -- estimate prompt.txt
```

---

## الاستخدام السريع / Quick start

```bash
# 1) قدّر توكين برومبت + اختر مستوى العمق (25/50/75/100%)
cts estimate prompt.txt --model claude-haiku-4-5

# 2) اضغط البرومبت قبل إرساله (وفّر 20-60% عادةً)
cts optimize prompt.txt -o prompt.small.txt

# 3) دقق استهلاك الـ context في مشروعك
cts audit --verbose

# 4) تأكد أن الريبو آمن للدفع على GitHub
cts secrets . && echo "safe to push"

# 5) ركّب حارس الـ pre-commit (يمنع أي commit فيه سيكرت)
cts hook install

# 6) اسأل Claude عبر عميل آمن مع كاش (المفتاح من env فقط)
export ANTHROPIC_API_KEY="...."
cts chat "اشرح الـ prompt caching باختصار" --stats
```

---

## الأوامر / Commands

### `cts estimate <file|->`

يقيس البرومبت ويعرض 4 مستويات عمق مع التكلفة المتوقعة لكل مستوى
(مستوحى من مهارة token-budget-advisor).

```bash
cts estimate prompt.txt --model claude-sonnet-4-6
cat prompt.txt | cts estimate --json
```

### `cts optimize <file|->`

خط ضغط كامل: إزالة محارف unicode الخفية الخطيرة، توحيد المسافات،
حذف الكتل المكررة، تصغير JSON، تقليم كتل الكود الضخمة (مع وسم واضح)،
وتنقية السيكرت — مع تقرير توفير لكل خطوة.

```bash
cts optimize big-prompt.md -o small-prompt.md --strip-comments
cts optimize big-prompt.md --no-redact --max-code-lines 60
```

### `cts audit [dir]`

تدقيق context-budget آلي: يقيس agents و skills و rules و MCP servers
وملفات CLAUDE.md، ويكشف الملفات الثقيلة والسيرفرات الزائدة، ويرتب
التوصيات حسب التوفير.

```bash
cts audit            # في جذر المشروع
cts audit . --verbose --json
```

### `cts secrets [dir]` + `cts redact`

ماسح سيكرت: مفاتيح Anthropic/OpenAI/GitHub/AWS/Slack/Stripe،
private keys، JWT، كلمات سر في URLs، ملفات `.env`... يخرج بكود 1
عند وجود نتائج (جاهز للـ CI).

```bash
cts secrets .
cts secrets --staged        # فحص الـ staged blobs قبل الـ commit
echo "$TEXT" | cts redact   # تنقية نص من السيكرت
```

### `cts hook install|uninstall`

يركّب pre-commit hook يمنع أي commit يحتوي سيكرت. آمن: يستخدم
`execFileSync` بدون shell ولا يتبع symlinks.

### `cts chat "prompt"` (أو `cts ask`)

عميل Anthropic آمن:

- المفتاح **فقط** من `ANTHROPIC_API_KEY` (مستحيل تمريره كوسيط)
- يتجاهل `ANTHROPIC_BASE_URL` افتراضياً (حماية من CVE-2026-21852)
- **Prompt Caching** مفعّل افتراضياً (cache reads ≈ عشر السعر)
- **كاش محلي** بمحتوى الطلب: السؤال المكرر = صفر توكين
- يحذر إذا كان البرومبت يحتوي سيكرت
- يسجل الاستهلاك والتكلفة في `usage.jsonl` خاص (بدون محتوى البرومبت)

```bash
export ANTHROPIC_API_KEY="...."
cts chat "ما هي الـ MCP؟" --model claude-haiku-4-5 --stats
cts chat --system "أجب بالعربية" "اشرح الـ caching" --max-tokens 500
```

### `cts cache stats|clear` و `cts prices`

```bash
cts cache stats   # الإدخالات + الاستهلاك التراكمي + التكلفة
cts cache clear   # مسح الردود المخزنة
cts prices        # جدول الأسعار المستخدم في التقديرات
```

---

## كيف توفر التوكين؟ / How it saves tokens

1. **الضغط قبل الإرسال**: `optimize` يزيل الهدر (مسافات، تكرار، كود زائد).
2. **مستويات العمق**: `estimate` يعرض تكلفة 25/50/75/100% لتختار بوعي.
3. **تدقيق الـ context**: `audit` يجد المكونات الثقيلة (MCP ضخم = آلاف التوكن).
4. **Prompt Caching**: الـ system والسياق الثابت يُقرأ من الكاش (~90% أرخص).
5. **الكاش المحلي**: نفس الطلب مرتين = الدفع مرة واحدة فقط.
6. **الموديل الأرخص**: التقديرات لكل موديل تساعدك تختار Haiku حيث يكفي.

مثال واقعي: برومبت 8,000 توكين على Sonnet 4.6 بسؤال مكرر 10 مرات:

- بدون cts: 80,000 توكين ≈ $0.24 (input فقط)
- مع الكاش المحلي: 8,000 توكين ≈ $0.024 — **توفير 90%**

---

## الأمان / Security

- **صفر dependencies** = صفر supply-chain attacks من حزم خارجية.
- المفتاح لا يظهر أبداً في logs أو أخطاء أو `ps`.
- `ANTHROPIC_BASE_URL` مرفوض افتراضياً؛ أي base مخصص يحتاج
  `CTS_ALLOW_BASE_URL=1` + hostname في `CTS_ALLOWED_HOSTS` + https.
- حد حجم للبرومبت (افتراضي 1MB) وتحقق من أسماء الموديلات.
- الكاش بصلاحيات `0700` والملفات `0600`؛ السجل بدون محتوى.
- إزالة محارف unicode الخفية (zero-width/bidi/tags) من البرومبتات.
- حماية من path traversal وعدم اتباع symlinks في الفحص.

التفاصيل الكاملة: [SECURITY.md](SECURITY.md)

متغيرات البيئة:

| Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | المفتاح (الطريقة الوحيدة) |
| `CTS_MODEL` | claude-sonnet-4-6 | الموديل الافتراضي |
| `CTS_CACHE_DIR` | ~/.cache/cts | مجلد الكاش |
| `CTS_MAX_PROMPT_BYTES` | 1048576 | حد حجم البرومبت |
| `CTS_ALLOW_BASE_URL` | unset | السماح بـ --base-url |
| `CTS_ALLOWED_HOSTS` | api.anthropic.com | hosts المسموحة |
| `CTS_ALLOWED_MODELS` | unset | تقييد الموديلات |
| `CTS_ABORT_ON_SECRET` | unset | إيقاف عند سيكرت بالبرومبت (=1) |
| `CTS_PRICES_JSON` | unset | أسعار مخصصة (JSON) |
| `CTS_TIMEOUT_MS` | 120000 | مهلة الطلب |
| `CTS_ANTHROPIC_BETAS` | unset | هيدر anthropic-beta |

انسخ `.env.example` إلى `.env` محلياً (ولا تدفعه أبداً إلى GitHub):

```bash
cp .env.example .env
```

---

## الأسعار / Prices

الجدول المدمج يعكس الأسعار العامة بتاريخ 2026-09-10
(Haiku 4.5: $1/$5، Sonnet 5: $2/$10، Opus 5: $5/$25، Fable 5.1: $10/$50
لكل مليون توكين input/output، وقراءة الكاش ≈ 10%).

الأسعار تتغير — حدّثها بدون تعديل الكود:

```bash
CTS_PRICES_JSON='{"claude-sonnet-5":{"input":2,"output":10}}' cts estimate p.txt
cts estimate p.txt --prices ./my-prices.json
```

---

## الاختبارات / Tests

بدون أي test-runner خارجي — فقط `node --test`:

```bash
npm test
```

---

## الرخصة / License

MIT — انظر [LICENSE](../LICENSE).
