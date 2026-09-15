# Antonia's Pizza — AGENTS.md (Map, not Encyclopedia)

> **Rule:** This file is a MAP. It points to sources of truth. It does NOT duplicate them. Keep it <200 lines.

## 0. Binding Owner Rules (read first)
- `HANDOFF.md §9` — **Vanilla only**: HTML/CSS/JS, no React/Tailwind/Astro/build step/CDN/npm.
- `html.js` gating (0,2,1)+!important, null-safe selectors, transform/opacity/filter only, infinite anims in pause+RM lists.
- `restaurant-site/build.py` after touching index/style/main.js (not `antonias/build.py`).
- 8 wheel images distinct, labels true to photo, no prices, no aggregateRating/review[] schema, owner photos storefront.jpg/pies-2.jpg never AI-replaced, all order CTAs → `https://antoniaspizza.toast.site/` target=_blank.

## 1. Sources of Truth
| What | Where |
|------|-------|
| Brand, 2 NAPs, geo, phones, hours, Toast, menu categories, assets ledger, social/GBP null, reviews policy | `../reference/restaurant-master-data.json` |
| Revenue+SEO+Ordering execution plan P0-P3, 16 phases, task table (Files/SEO/Acceptance/Responsible/Output/KPI) | `../reference/executive-execution-plan.md` |
| Owner handoff, file map, design tokens, wheel spec, known issues | `HANDOFF.md` |
| File tree, who owns what | `../reference/PROJECT_MAP.md` (architect generates) |
| Architecture decision vanilla vs Astro, how we hit LCP<1.5s | `../reference/ARCHITECTURE.md` |
| SEO sitemap + keyword intent per URL | `../reference/SEO_MAP.md` + `../reference/keyword-map.md` |
| Analytics event spec (privacy-first) | `../reference/analytics-spec.md` |
| Off-site citations cleanup (Marv's/Bob/Grubhub etc) | `../reference/seo-offsite-checklist.md` |

## 2. Site Structure (deploy `antonias/` as-is)
```
antonias/
├── index.html (home funnel: Hero ORDER|MENU + SLO|Paso chooser, Social Proof, Wheel, Tonight live hours, Ajarski, Deals, Gallery, Reviews plain HTML, Locations 2 cards, FAQ FAQPage, final CTA)
├── menu.html (38 dishes, no prices, 6 images real, ADD TO ORDER → Toast)
├── san-luis-obispo.html + paso-robles.html (unique Restaurant schema @id+parentOrg+geo+hours+areaServed+OrderAction)
├── our-story.html (editorial dough/sauce/Ajarski/late-night 2AM)
├── privacy.html, 404.html, llms.txt, robots.txt, sitemap.xml (5 URLs + privacy), _redirects, _headers
├── css/style.css (single :root, tokens sky #bfe3f2 sun #ffd23f navy #0e3a52 paper #fffdf7 red-deep #c03a24 gold-ink #8f6116)
├── js/main.js (one IIFE, null-safe, motionMQ live, wheel listbox ARIA, pause toggle html.motion-paused 21 anims)
└── assets/img/ (logo.png 192×192 12KB, wheel/ 8 distinct jpg+webp+avif, og/ 1200×630 JPEG center-crop, real-* owner untouched, gen/* masters gitignored, 26 AVIF twins q55 2056KB vs JPEG 4098KB -50%)
```
`build.py` at `restaurant-site/build.py` generates `standalone.html` (preview only).

## 3. Agentic Team (13 specialized)
Located in `.agents/` (Codex/Cursor/Roo) + `../.claude/agents/` + `../../.claude/agents/` (Claude Code):

| Agent | Role | Owns | Skills |
|-------|------|------|--------|
| architect | foundation, sitemap, data, phase gates | reference/*, AGENTS.md, PROJECT_MAP, ARCHITECTURE, SEO_MAP | superpowers-executing-plans, writing-plans, task-coordination |
| frontend | vanilla HTML/CSS/JS, funnel, bottom nav, AVIF layer | *.html, css/style.css, js/main.js, assets/img | frontend-patterns, design-system-patterns, responsive-design |
| seo | local pack Paso+SLO, NAP, schema, sitemap, citations | *.html head/schema, sitemap, robots, _redirects, keyword-map | seo-technical-optimization, seo-analysis-monitoring, seo-cannibalization-detector |
| geo | AI answers ChatGPT/Gemini/Perplexity, llms.txt, entity | llms.txt, schema blocks, our-story | seo-content-planner, brand-discovery |
| cro | Traffic→Order→Toast, bottom nav HOME|MENU|ORDER|LOCATIONS, AOV | index hero/tonight/order-badge, css bottom-nav, menu CTAs | conversion-psychology, visual-hierarchy |
| content | copy, menu desc, FAQ, alt truthful, never invent facts | *.html content, alt, llms.txt | content-marketer, avoid-ai-writing |
| analytics | GA4/Plausible events, dashboards, privacy-first | analytics-spec.md, js event hooks | kpi-dashboard-design, data-storytelling |
| visual-qa | typography/spacing/responsive/hero/images/mobile/buttons/hierarchy/brand, million-dollar | css, img, og | ui-designer, visual-design-foundations, browser-qa |
| security | secrets, headers, XSS, Toast third-party, CSP | _headers, privacy, js innerHTML audit | security-review, sast-configuration |
| performance | LCP<1.5s INP<100ms CLS<0.02 Lighthouse≥98 JS<40KB Hero AVIF<180KB | css, js, img, build.py | application-performance, web-perf-engineer |
| accessibility | WCAG 2.2 AA, keyboard, screen reader, focus-visible, pause+RM | *.html ARIA, css focus/RM, js wheel/motionMQ | wcag-audit-patterns, screen-reader-testing |
| catering-growth | catering funnel, winery/Cal Poly partnerships, catering SEO | index teaser, future catering.html, catering-spec | content-marketer, seo-content-planner |
| final-reviewer | delivery gate, 0 FAIL harness, DoD 25 | council-review.md, audit-current.md | verification-before-completion, hallmark-anti-slop |

**Stack per user brief:**
- Primary Builder: **Codex** (executes tasks)
- Architecture/Review: **Claude Code** (reviews, architect agent)
- Browser/IDE: **Roo Code** (file edit, terminal, browser automation, MCP, custom modes)

## 4. Skills Inventory (198 skills, 100 agents)

**Curated for Antonia's (from wshobson/agents 94 plugins / 202 agents / 183 skills / 105 commands):**
- Dev: `frontend-mobile-development` (nextjs-app-router-patterns, react-state-management, tailwind-design-system → adapt to vanilla), `debugging-toolkit` (debugger, dx-optimizer)
- Testing: `unit-testing` (test-automator), `agent-teams` (multi-reviewer-patterns, parallel-debugging, task-coordination)
- Perf: `performance-testing-review` (performance-engineer), `application-performance` (observability-engineer)
- Security: `security-scanning` (sast-configuration, stride-analysis), `security-compliance`, `backend-api-security`
- SEO: `seo-technical-optimization` (seo-keyword-strategist, seo-meta-optimizer, seo-structure-architect), `seo-analysis-monitoring`, `seo-content-creation`
- A11y: `accessibility-compliance` (wcag-audit-patterns, screen-reader-testing)
- Analytics: `business-analytics` (kpi-dashboard-design, data-storytelling)
- Content: `content-marketing`
- UI: `ui-design` (design-system-patterns, responsive-design, visual-design-foundations)
- Orchestration: `agent-orchestration`, `agent-teams`, `comprehensive-review`
- Superpowers (obra/superpowers): `executing-plans` (phase-gated Execute→Review→Next), `writing-plans`, `dispatching-parallel-agents`, `systematic-debugging`, `verification-before-completion`, `subagent-driven-development`

Full lists: `../.claude/skills/` (198) + `../.claude/agents/` (100) + `/tmp/wshobson-agents/docs/plugins.md` (94 plugins).

## 5. Execution Workflow (superpowers executing-plans)

```
Phase 0 Project Intelligence (architect reads AGENTS.md/README.md/Master Data/SEO/Brand/code/Toast → PROJECT_MAP.md/ARCHITECTURE.md/SEO_MAP.md/RESTAURANT_DATA.md)
  → Gate: docs exist, NAP consistent, sitemap 5 URLs
Phase 1 Foundation (architect+frontend+seo) — tokens/routing/data/locations/nav/footer — vanilla, no Astro
  → Gate: build passes, TS clean (n/a), responsive no console errors
Phase 2 Homepage Funnel (frontend+cro+content+visual-qa) — Hero ORDER|MENU + city chooser, Social Proof, Signature Products, Order CTA, Locations, Catering, Why Antonia's, Reviews, FAQ
  → Gate: funnel order, ≤2 clicks to order, Lighthouse≥98
Phase 3 Menu Engineering (frontend+content+cro+seo) — Hero 5-8 items, Profit/Traffic/Add-ons, ADD TO ORDER CTA, AOV focus
  → Gate: 38 dishes, no prices, 6 images real, 100% CTAs → Toast
Phase 4 Conversion System (cro+frontend+analytics) — Bottom Nav HOME|MENU|ORDER|LOCATIONS + sticky Order
  → Gate: bottom nav exists mobile, ORDER distinct, 44px tap
Phase 5 Local SEO (seo+geo+content) — Paso page best source (address/phone/hours/menu/order/directions/parking/delivery/catering/photos/reviews/FAQ)
  → Gate: unique content vs SLO, schema validates, 0 NAP mismatches
Phase 6 GEO (geo+content+seo) — facts-first, llms.txt, JSON-LD real only, sameAs real
  → Gate: llms.txt mentions ordering/locations/menu/dietary, no invented URLs
Phase 7 Performance (performance+frontend) — LCP<1.5s INP<100ms CLS<0.02
  → Gate: hero AVIF 36KB, JS 28KB, no backdrop-filter
Phase 8 A11y (accessibility+visual-qa) — WCAG 2.2 AA
  → Gate: keyboard, screen reader wheel listbox, pause toggle, RM kill
Phase 9 Security (security) — headers, secrets, XSS
  → Gate: _headers security headers, no secrets, https Toast
Phase 10 Analytics (analytics+cro) — events spec, dashboard
  → Gate: analytics-spec.md exists, no tracking without owner ID
Phase 11 Catering Growth (catering-growth+content+seo) — catering page spec
  → Gate: spec exists, no invented details
Phase 12 Final Review (final-reviewer) — DoD 25, 0 FAIL harness
  → Gate: release ready YES/NO + blockers
```

Each phase: **Execute → Review → Next** per `superpowers-executing-plans`.

## 6. How to Run

**Claude Code:**
```
/agent antonias-architect  # reads HANDOFF, master-data, execution-plan → PROJECT_MAP
/agent antonias-frontend   # builds bottom nav HOME|MENU|ORDER|LOCATIONS
```

**Codex/Cursor:**
- `.agents/` auto-discovered. Primary builder Codex executes tasks from `reference/executive-execution-plan.md` task table.

**Roo Code:**
- Custom modes: Architect (reads), Code (edits), Ask (questions). Browser automation for visual QA (preview `python -m http.server 8777 --directory antonias`).

**Manual:**
```bash
python ../build.py  # after touching index/style/main
python -m http.server 8777 --directory antonias  # preview
```

## 7. Current DoD (from executive-execution-plan.md)
- [x] Homepage prod-ready (funnel + wheel + spin + tonight)
- [x] Menu HTML (38 dishes + 6 images + rail)
- [x] Online ordering (Toast ×37)
- [x] Locations (2 pages + tabs + maps)
- [ ] Mobile UX — bottom nav HOME|MENU|ORDER|LOCATIONS P0 (currently sticky-order only) → NEXT
- [x] JSON-LD validated (no aggregateRating/review[])
- [x] Sitemap 5 URLs + privacy + Robots
- [x] Canonicals, NAP consistent
- [ ] GBP aligned Owner TODO
- [ ] Analytics events Owner TODO
- [x] Core Web Vitals (AVIF 36KB, JS 28KB, CLS<0.02)
- [x] A11y WCAG 2.2 AA + pause
- [x] Images optimized AVIF 50% saving
- [x] SEO titles/descriptions + internal linking + FAQ
- [ ] Catering funnel (spec + page) TODO
- [x] 404/redirect, legacy entities clean
- [x] Final QA (harness 0 FAIL)
- [ ] Production deployment + Search Console Owner TODO

## 8. Next Actions (P0)
1. Bottom Nav mobile HOME|MENU|ORDER|LOCATIONS (frontend+cro) — T4.2
2. Analytics spec + catering spec (analytics+catering-growth) — T13 + T11
3. SEO enrichment Paso/SLO unique (seo+content) — T5.1/5.2
4. Final reviewer gate

---
*Vanilla only. Real photos first. No invented facts. Toast is the only checkout.*
