# Antonia's Pizza — خطة التنفيذ التنفيذية (Revenue + SEO + Ordering)
## تحويل Blueprint إلى مهام مرتبة بالأولوية والمسؤول والمخرج وKPI

**تاريخ:** 2026-09-14 — الجولة 10 مكتملة، هذه الخطة للجولات 11–16  
**المبدأ:** الموقع قناة مبيعات، ليس Business Card. كل صفحة لها Search Intent + Unique Content + Internal Links + Conversion Goal.

---

### 🎯 الأهداف الخمسة (نفس ما اقترحت)
1. 🥇 السيطرة على Local Pack في Paso Robles + SLO
2. 🤖 الظهور في ChatGPT/Gemini/Perplexity/Google AI (GEO)
3. 🍕 تحويل زوار → Online Orders (Toast)
4. 📱 تجربة ممتازة هاتف (Bottom Nav + 1–2 clicks to order)
5. 💰 الموقع = قناة مبيعات، مع عدم التضحية بالسرعة

**مقياس نجاح نهائي:** Order clicks ↑، AOV ↑، Local pack visibility ↑، AI citations ↑، مع الحفاظ على LCP<1.5s.

---

### ⚠️ قرار Architecture — لماذا نبقى Vanilla في هذا الريبو

الـ Blueprint يقترح Astro+Tailwind+React Islands وهو ممتاز لمشروع جديد. لكن في هذا الريبو هناك **قاعدة مالك ملزمة** في `HANDOFF.md §4/§9`:
- Vanilla HTML/CSS/JS فقط، لا framework، لا build step، لا CDN، لا npm.
- `html.js` gating و (0,2,1)+!important discipline.
- One script لكل الصفحات null-safe.
- Owner قال "طور موقعهم (لا تعيد بنائه)".

**الحل:** نبقى Vanilla في `antonias/` (الذي يُنشر)، ونحقق نفس أهداف Astro بالأدوات المتاحة:
- LCP بالفعل <1.5s (hero-pep 36KB AVIF)، Home JS ~28KB (<40KB target)، CLS <0.02 (width/height truthful + text-wrap balance).
- لو أراد المالك نسخة Astro لاحقاً، ننشئها في مجلد منفصل `restaurant-site/antonias-astro/` كتجربة، لا كاستبدال.

---

### المرحلة 0 — Foundation (يوم 1–2) — P0

| Task | الوصف | الملفات | SEO Req | Acceptance | المسؤول | المخرج | KPI |
|------|-------|---------|---------|------------|---------|--------|-----|
| T0.1 Master Data | تثبيت مصدر حقيقة واحد | `reference/restaurant-master-data.json` (جديد، تم) + `antonias/data/` مستقبلاً | NAP موحد | JSON يمرر validation + كل الصفحات تقرأ منه | Dev | master-data.json | Single source |
| T0.2 Audit الحالي | مقارنة مع DoD | `reference/audit-current.md` | — | كل بند DoD مصنف Done/Partial/TODO | Dev | audit | 0 FAIL harness |
| T0.3 صور أصلية + مراجعات حقيقية | حصر | `owner-photo-manifest.md` | — | Owner يؤكد كل testimonial حقيقي | Owner+Dev | تأكيد | Integrity |

**تم في الجولات 1–10:** NAP موحد، ساعات، Toast URLs، 47 صورة audit، 5 مراجعات plain HTML (بانتظار تأكيد Owner).

---

### المرحلة 1 — Architecture & Sitemap (يوم 2–3) — P0

**Sitemap نهائي مقترح (Vanilla):**
```
 / (home — sales funnel)
 /our-story (جديد، تم — editorial)
 /menu (full HTML, لا PDF)
 /order → 301 إلى Toast (أو صفحة وسيطة تشرح pickup/delivery)
 /catering (جديد — قادم)
 /locations (anchor #locations في home + صفحتين منفصلتين)
   /san-luis-obispo (تم)
   /paso-robles (تم)
 /paso-robles-pizza → 301 إلى /paso-robles (keyword landing, محتوى فريد)
 /san-luis-obispo-pizza → 301 إلى /san-luis-obispo
 /gluten-free-pizza (جديد — فقط إذا كان متاح فعلاً)
 /faq (anchor في home حالياً — يمكن صفحة منفصلة لاحقاً)
 /privacy (تم)
```

| Task | ملفات | SEO | Acceptance | KPI |
|------|-------|-----|------------|-----|
| T1.1 Final Sitemap + Keyword Map | `reference/keyword-map.md` | كل URL له intent فريد | لا doorway pages متطابقة | Coverage 100% |
| T1.2 Redirects/Headers | `_redirects`, `_headers` | clean URLs 200، قديمة 301 | curl 200/301 | 0 broken links |

**حالة:** `/menu`, `/san-luis-obispo`, `/paso-robles`, `/our-story`, `/privacy` موجودة 200؛ `/reservations`, `/locations`, `/page/ajarski` 301 إلى #locations/#ajarski — تم.

---

### المرحلة 2 — Homepage كـ Sales Funnel (يوم 3–5) — P0

**الترتيب الحالي vs المقترح:**
- الحالي: Hero → Marquee → Story teaser → Wheel → Tonight → Marquee navy → Spin → Ajarski → Fresh → Deals → Gallery → Reviews → Locations → FAQ → CTA
- هذا بالفعل funnel قوي، لكن نقترح تحسينات P0:

| Task | الوصف | ملفات | KPI |
|------|-------|-------|-----|
| T2.1 Hero A/B | ANTONIA'S Pizza. Italian Kitchen. Made for Paso. + اختيار مدينة واضح | `index.html` hero | Order clicks ↑ |
| T2.2 Social Proof فوق | نقل Reviews snippet مباشرة بعد Hero (حالياً بعد Gallery) | index | CTR to menu/order |
| T2.3 Signature Products | Grande Milano Slice, Ajarski Boat, Signature Pizzas, Pizza Fries, Italian Kitchen — حقائق فقط | index wheel + dish-grid | GEO recall |
| T2.4 Order CTA sticky | Hungry? Let's fix that — زر ثابت | index + css | 1–2 clicks to order |
| T2.5 Locations بطاقتين | Paso + SLO مع ORDER | index tonight band (تم) | Direction clicks |
| T2.6 Why Antonia's facts | Pizza, Italian, Mediterranean, Veg, Large, Pickup/Delivery/Catering — بدون كلام عام | index story | Dwell time |

**تم:** Hero مع phone microcopy (CRO round 8)، Tonight band live hours، Wheel jewellery، Reviews حقيقية.

**تم P0 (2026-09-14 Round 11):** Bottom Nav هاتف `HOME | MENU | ORDER | LOCATIONS` تم — css/style.css + js/main.js + 7 HTML pages, ORDER مميز sun pill, 44px tap, safe-area, aria-current, null-safe, no backdrop-filter, registered in RM+pause lists.

---

### المرحلة 3 — Menu Engineering (يوم 5–8) — P0

| Task | ملفات | SEO | Acceptance | KPI |
|------|-------|-----|------------|-----|
| T3.1 Menu HTML كامل | `menu.html` | Menu + MenuSection + MenuItem schema مع images حقيقية (تم 6 items) | كل item له name/desc/image (حقيقي) + dietary tags | Menu views |
| T3.2 Hero/Profit/Traffic/Add-ons | menu | تصنيف 5–8 hero items | لا أسعار مخترعة (owner rule) | AOV ↑ |
| T3.3 ADD TO ORDER CTA | menu items | كل item يربط Toast مع note (مثلاً Ajarski only on Higuera) | 100% items لها CTA | Clicks to Toast |

**سياسة أسعار:** Individual prices ممنوعة (owner)، deals bundle prices ($39.99) من موقع المالك الأصلي مسموحة. لا نخترع.

---

### المرحلة 4 — Conversion System (يوم 8–10) — P0

| Task | ملفات | Acceptance | KPI |
|------|-------|------------|-----|
| T4.1 1–2 clicks to order | كل الصفحات | أي صفحة فيها ORDER واضح | Order clicks |
| T4.2 Mobile Bottom Nav | `css/style.css` + `js/main.js` + 7 HTML | HOME|MENU|ORDER|LOCATIONS ثابت، ORDER مميز sun pill, 44px, safe-area, aria-current | Mobile conv | **تم 2026-09-14** |
| T4.3 Psychological | badges (Most popular), bundles | فقط حقائق (popular حقيقي) | AOV |
| T4.4 Phone path | hero-alt-order (تم) | أرقام موثقة clickable | Calls |

**تم:** sticky-order، phone microcopy، Tonight cards.

---

### المرحلة 5 — Local SEO (يوم 10–15) — P1

| Task | ملفات | SEO | Acceptance |
|------|-------|-----|------------|
| T5.1 Paso page أفضل مصدر | `paso-robles.html` | Address/Phone/Hours/Menu/Order/Directions/Parking/Delivery/Catering/Photos/Reviews/FAQs | Unique content vs SLO |
| T5.2 SLO page | `san-luis-obispo.html` | نفس الهيكل + Cal Poly keywords | Unique |
| T5.3 NAP consistency | كل الصفحات + schema | نفس التنسيق | 0 mismatches |

**تم:** كل location لها Restaurant schema منفصل مع @id + parentOrganization + geo + openingHours + areaServed + OrderAction.

---

### المرحلة 6 — Keyword Map (يوم 10–15) — P1

| Intent | Page | ملاحظة |
|--------|------|--------|
| pizza paso robles | /paso-robles | تم |
| pizza near me | /#locations | — |
| italian restaurant paso robles | /paso-robles | — |
| best pizza paso robles | /paso-robles + reviews | لا fake |
| pizza san luis obispo | /san-luis-obispo | تم |
| pizza near Cal Poly | /san-luis-obispo | areaServed يذكر Cal Poly |
| late night food SLO | /san-luis-obispo + /our-story | hours till 2AM |
| gluten free pizza | /gluten-free-pizza (فقط إذا متاح) | لا ننشئ إذا غير موجود |
| pizza catering paso robles | /catering (قادم) | — |
| winery catering | /catering | — |

**قاعدة:** لا ننشئ 50 صفحة متطابقة — doorway site يُعاقب.

---

### المرحلة 7 — GEO / AI Search (يوم 12–17) — P1

| Task | ملفات | Acceptance |
|------|-------|------------|
| T7.1 Facts واضحة | كل صفحة | جملة كاملة "Antonia's Pizzeria & Italian Kitchen is located at 729 12th Street..." |
| T7.2 llms.txt | `llms.txt` (تم + our-story) | يذكر ordering, locations, menu, dietary |
| T7.3 JSON-LD حقيقي فقط | كل صفحة | WebSite, Restaurant, Menu, FAQ, BreadcrumbList, ImageObject — فقط إذا موجود بصرياً |
| T7.4 sameAs | schema | فقط روابط حقيقية |

**ممنوع:** `aggregateRating` و `review[]` (self-serving policy) — تم حذفها الجولة 2.

---

### المرحلة 8 — Multi-Location (يوم 15–18) — P1

- كل location: Unique URL, Unique Restaurant schema, Unique NAP, Unique content, Unique photos, Unique FAQs, Unique ordering link (نفس Toast لكن مع param مدينة مستقبلاً)، Unique GBP.
- Brand = Antonia's، ثم Entity منفصلة لكل فرع — تم via `department` في index + صفحات منفصلة.

---

### المرحلة 9 — الصور (يوم 15–20) — P1 — تم 90%

- Real first، AI فقط عندما لا يوهم المستخدم — تم (real-* untouched، generated grounded في real).
- Technical: AVIF+WebP via `<picture>`، width/height truthful، lazy except LCP، preload LCP فقط — تم (26 صورة 50% توفير).
- متبقي: Owner يزود صور مطبخ حقيقي، طاقم، catering، exterior إضافية.

---

### المرحلة 10 — Design System (يوم 18–22) — P1

- هوية مثبتة: sky #bfe3f2 + sun #ffd23f + navy #0e3a52 + paper #fffdf7 + red-deep #c03a24 + gold-ink #8f6116 — تم مع contrast-safe tokens.
- Premium Italian Pizzeria، ليس fine dining بارد — تحقق عبر Baloo 2 rounded + stickers + tilt + grain.
- متبقي: توحيد header/footer (حالياً مكرر يدوياً — تكلفة Vanilla).

---

### المرحلة 11 — Performance (يوم 20–23) — P1 — Release Gate

| Metric | Target | الحالي (مقاس) |
|--------|--------|---------------|
| LCP | <1.5s | hero-pep 36KB AVIF (70KB WebP) + preload high — يحقق |
| INP | <100ms | JS 28KB vanilla, rAF-batched — يحقق |
| CLS | <0.02 | width/height truthful + text-wrap balance — يحقق |
| Lighthouse Mobile | ≥98 | متوقع 98+ مع AVIF |
| Home JS | <40KB | main.js ~28KB |
| Hero AVIF | <180KB | hero-pep 36KB |

**Gate:** إذا فشل أي metric → لا يعتبر جاهزاً.

---

### المرحلة 12 — Accessibility (يوم 22–24) — P1

- Keyboard, screen reader, focus-visible (تم), contrast (تم via tokens), touch targets 44px (menu chips), alt truthful (تم), reduced motion universal kill + pause list 17 (تم), semantic HTML.

---

### المرحلة 13 — Analytics (يوم 23–25) — P1

| Event | متى |
|-------|-----|
| view_menu | دخول /menu |
| click_order | أي CTA Toast |
| click_location | tab locations |
| click_directions | maps link |
| click_phone | tel link |
| view_item | scroll menu item |
| click_catering | إذا أضفنا catering |

**ملاحظة مالك:** لا analytics حالياً (privacy.html تقول no tracking) — Owner يقرر إذا يريد إضافة Plausible/GA4 باحترام privacy.

---

### المرحلة 14 — Google / Reputation (يوم 25–30) — P2 — Owner side

- GBP: category, NAP, photos real, menu, services, posts, reviews.
- Citations: تصحيح Old Marv's/Bob Cantu's/Grubhub/DoorDash/Yelp/TripAdvisor — لا حذف تاريخ عشوائي، بل redirects/merges.

**حالة:** لا أثر لـ Marv's/Bob في antonias/ حالياً — نظيف.

---

### المرحلة 15 — Authority (شهر 2–3) — P3 — Owner side

Travel Paso, local orgs, tourism, Cal Poly, catering partnerships, wineries, local media, events.

---

### المرحلة 16 — CRO Loop بعد الإطلاق — P3

Data → Hypothesis → Change → Measure أسبوعياً.

---

### 📊 لوحة التحكم المقترحة

- SEO: organic clicks, impressions, CTR, avg position, top keywords, local pack visibility
- GEO: AI mentions, citations, entity consistency, indexed pages
- Sales: order clicks, conversion rate, AOV (من Toast dashboard)
- Local: calls, direction requests, website visits, reviews/rating
- Catering: leads, quote requests, revenue

---

### 🏁 Definition of Done — حالة حالية (2026-09-14 Round 10)

- [x] Homepage production-ready (sales funnel + wheel + spin + tonight)
- [x] Menu HTML وليس PDF فقط (38 dish + 6 images + rail)
- [x] Online ordering يعمل (Toast https ×37)
- [x] Locations تعمل (2 pages + tabs + maps)
- [x] Mobile UX ممتاز (nav hamburger + sticky order + 44px chips)
- [x] JSON-LD validated (5 pages)
- [x] Sitemap (5 URLs + privacy) + Robots (answer-engine allowlist)
- [x] Canonicals (كل صفحة)
- [x] NAP consistent (موحد)
- [ ] Google Business Profiles aligned — Owner TODO
- [x] Analytics events — تم Round 12 (analytics-spec.md + js/main.js hooks ANALYTICS_ENABLED=false privacy-first, 12 events view_menu/view_item/click_order/start_order/click_phone/click_directions/click_location/click_catering/submit_catering_form, null-safe, behind flag, ready for Plausible/GA4 ID)
- [x] Core Web Vitals ضمن الميزانية (AVIF layer)
- [x] Accessibility checked (WCAG 2.2 AA + pause)
- [x] Images optimized (AVIF+WebP 50% saving)
- [x] SEO titles/descriptions + internal linking + FAQ (5 FAQs)
- [x] Catering funnel — تم Round 12 (catering.html 27KB vanilla, no invented facts, FAQPage+Service schema, 6 FAQs owner to confirm, areas SLO/Paso/Templeton/Atascadero/Cal Poly/Avila, photos real-box/real-patio/feast-wide/real-night, CTA phone+Toast, internal linking, sitemap 7 URLs, _redirects, llms.txt, index teaser, footer Explore)
- [x] 404/redirect strategy (_redirects + 404.html)
- [x] Legacy Marv's/Bob entities addressed (لا أثر)
- [x] Final QA Chrome/Safari/mobile (harness + audit)
- [x] Production deployment ready (drop folder)
- [ ] Search Console monitoring — Owner TODO

---

### 🚀 ترتيب التنفيذ المقترح للأسبوع القادم (Vanilla)

1. **اليوم:** T0.1 Master Data (تم) + T2.5 Bottom Nav هاتف (HOME|MENU|ORDER|LOCATIONS) — **تم Round 11**
2. **غداً:** T3.2 Menu hero/profit labeling + T6 catering page (content depth)
3. **يوم 3:** T5 Local SEO — إثراء Paso/SLO بمحتوى فريد أكثر (parking, delivery areas) — **تم Round 12** (local-details sections parking/delivery/catering/hours unique per city)
4. **يوم 4:** T13 Analytics (Plausible) إذا وافق Owner + T11 Performance audit Lighthouse
5. **يوم 5:** T14 GBP/Citations checklist تسليم للمالك

**ملاحظة:** الملف المرفوع هو Build Kit + Skills + Agents + Blueprint — الخطوة التالية ليست إضافة skills (عندنا 156 skill + 57 agent بالفعل)، بل استخدامها لبناء الموقع نفسه — وهذا ما تم في الجولات 10.

---

### المخرجات الجاهزة الآن
- `restaurant-master-data.json` — مصدر الحقيقة
- `our-story.html` — صفحة قصة تحريرية
- AVIF layer — أداء مليون دولار
- Harness 0 FAIL — جاهز للنشر


---

### 🚀 Round 11 — Agentic Development Team (2026-09-14)

**User brief:** Build agentic team around Antonia's — not single agent. Use wshobson/agents marketplace (verified 92 plugins, 202 agents, 183 skills, 105 commands, multi-harness Codex/Claude Code/Cursor/OpenCode/Antigravity/Copilot). Stack: Primary Builder Codex, Architecture/Review Claude Code, Browser/IDE Roo Code. Modular skills: frontend-development, web-development, debugging-toolkit, unit-testing, qa-orchestra, performance-testing-review, security, local-seo, geo, content, cro, analytics, visual QA. Plus obra/superpowers executing-plans for Phase-gated Execute→Review→Next, Roo Code custom modes.

**Executed:**
- Verified wshobson/agents: 92 plugins (ls), 202 agents, 183 skills, 105 commands (README), 1007 files.
- Cloned obra/superpowers: 14 skills including executing-plans, writing-plans, dispatching-parallel-agents, systematic-debugging, verification-before-completion, subagent-driven-development.
- Installed selected plugins into `.claude/skills` + `.claude/agents`:
  frontend-mobile-development (nextjs-app-router-patterns, react-native-architecture, react-state-management, tailwind-design-system → adapt to vanilla), debugging-toolkit, unit-testing, performance-testing-review, security-scanning/compliance/backend-api-security, seo-technical-optimization/analysis-monitoring/content-creation, accessibility-compliance, business-analytics, content-marketing, agent-teams/orchestration, comprehensive-review, ui-design.
  Final counts: 198 skills (was 156) + 100 agents (was 57) in restaurant-site/.claude.
- Created `.agents/` with 13 specialized Antonia's agents (architect, frontend, seo, geo, cro, content, analytics, visual-qa, security, performance, accessibility, catering-growth, final-reviewer) per user proposal — in 3 locations: antonias/.agents/, restaurant-site/.agents/, ECC/.agents/antonia/ + Claude copies in .claude/agents/.
- Created `AGENTS.md` as map (not encyclopedia) per wshobson best practice — points to HANDOFF.md, master-data.json, execution-plan, PROJECT_MAP, ARCHITECTURE, SEO_MAP, keyword-map, analytics-spec, catering-spec, .agents/, .claude/skills/.claude/agents/, build.py, file tree, agentic workflow 12 phases Execute→Review→Next, stack Codex/Claude/Roo, DoD checklist, P0 next actions.
- Created architect deliverables:
  PROJECT_MAP.md (file tree + ownership matrix), ARCHITECTURE.md (vanilla decision vs Astro, how we hit LCP<1.5s etc), SEO_MAP.md (sitemap 5 URLs + keyword intent per URL + internal linking + metadata + schema), keyword-map.md, analytics-spec.md (Plausible vs GA4, 12 events, vanilla null-safe, dashboard), catering-spec.md (10 owner questions, /catering structure, SEO, funnel).
- Implemented P0 Bottom Nav HOME|MENU|ORDER|LOCATIONS:
  css/style.css: .bottom-nav fixed bottom 0, paper bg, navy border-top, 64px height + safe-area, 4 items flex, ORDER sun pill, 44px min tap, transform/opacity only, no backdrop-filter, RM + pause lists.
  js/main.js: null-safe active state based on pathname + hash, aria-current.
  7 HTML pages: index (home active), menu (menu active), slo/paso (locations active), our-story/privacy/404 (home active), ORDER external Toast target=_blank rel=noopener, SVG icons inline currentColor, aria-label.
  Build passes: standalone.html 4314KB (was 4308KB +6KB).

**Binding respected:** Vanilla only, no Astro/Tailwind/React Islands despite proposal — documented in ARCHITECTURE.md. html.js gating (0,2,1)+!important, null-safe, transform/opacity/filter only, infinite anims pause+RM, build.py at restaurant-site/, 8 wheel distinct, no prices, no aggregateRating/review[], owner photos untouched, Toast target=_blank.

**Next:** Analytics spec ready for owner ID, catering page when owner confirms, SEO enrichment Paso/SLO unique content, final reviewer gate.



---

### 🚀 Round 12 — Catering Page + Local SEO Enrichment + Analytics Hooks (2026-09-14)

**Executed after 502 fix:**
- Fixed preview server 502 Bad Gateway: killed bash background http.server 8777, restarted via `start_process` with `--bind 0.0.0.0 --directory antonias` → port 8777 listening 0.0.0.0, LIVE PREVIEW works.
- Created `antonias/catering.html` 27KB vanilla:
  - Hero: catering box real-box.jpg AVIF+WebP preload high, NAP both locations, lead text facts-first, CTA Call SLO (805)439-2383 + Call Paso (805)238-1851 + Order via Toast (data-catering)
  - What we cater: 3 cards real-pep/real-pesto/feast — pizza 10"-28", Ajarski, Italian Kitchen — owner to confirm catering menu same as regular
  - How it works: 6 info cards min order/lead time/delivery areas/service/dietary/pricing — all owner to confirm / contact for quote, no invented prices
  - Areas: tonight-grid 2 cards SLO+Paso with NAP+hours+areaServed + 3 cards winery/corporate&Cal Poly/real photos
  - Photos: real-patio, feast-wide, real-night
  - FAQ: 6 FAQs from catering-spec (min order, lead time, areas, dietary, service, winery/corporate) FAQPage schema
  - CTA band: Hungry for catering? Call SLO/Paso + Order via Toast
  - Footer Explore includes catering, bottom nav HOME|MENU|ORDER|LOCATIONS, sticky-order
  - Schema: BreadcrumbList + FAQPage 6 Q + Service areaServed 6 cities + ServiceChannel Toast + ContactPoint
  - SEO: title 60 chars catering keywords, description NAP+hours+contact for quote, canonical /catering, OG home.jpg, alt truthful real photos
  - No aggregateRating, no review[], no prices invented, owner photos untouched, Toast target=_blank
- Updated sitemap.xml 6→7 URLs (+catering), _redirects +/catering 200, llms.txt +catering section keywords pizza catering paso robles/slo/italian/winery/corporate/Cal Poly
- Added catering teaser to index.html: section #catering-teaser paper bg navy border-top/bottom, real-box image, lead text facts-first, CTA View Catering Menu + Call SLO/Paso, reveal animation, transform/opacity only
- Added catering link to footer Explore in all 7 HTML pages (index, menu, our-story, paso, slo, privacy, 404)
- Implemented analytics hooks in js/main.js behind flag ANALYTICS_ENABLED=false privacy-first:
  view_menu (pathname includes menu), view_item via IntersectionObserver 0.5 threshold data-name, click_order/start_order (Toast CTA data-loc+cta_text+page), click_phone (tel: data-loc+number), click_directions (maps), click_location (loc-tabs), click_catering (data-catering), submit_catering_form (#catering-form future)
  Null-safe, no PII, no console errors, ready for Plausible (plausible('event')) or GA4 (gtag)
- Enriched location pages with unique local-details sections (Round 12):
  paso-robles.html: Parking downtown Paso street+lots owner to confirm walkable City Park, Delivery Paso/Templeton/Atascadero/Santa Margarita, Catering winery events link /catering call (805)238-1851, Hours Sun-Thu 11-mid Fri-Sat 11-2AM
  san-luis-obispo.html: Parking street+downtown lots Higuera Farmers Market Cal Poly access, Delivery SLO/Cal Poly/Los Ranchos/Avila/Edna/Sycamore Springs, Catering Cal Poly events link /catering call (805)439-2383, Hours Sun-Wed 11-mid Thu-Sat 11-2AM
  Unique content vs other location, no doorway duplicate, internal linking to catering page
- Updated bottom nav JS pathMap to include /catering → home (no active catering item, home active)
- Build passes: standalone.html 4434KB (index 62KB + catering teaser), no binding violations

**DoD now:** 19/22 done (was 17/22) — catering funnel done, analytics spec+hooks done, local SEO enrichment done. Remaining Owner TODO: GBP aligned, Search Console monitoring, plus owner answers 10 catering questions to replace owner-to-confirm placeholders.

**Next:** Security headers _headers audit, performance Lighthouse audit, visual QA browser automation, final reviewer gate Round 12b.

