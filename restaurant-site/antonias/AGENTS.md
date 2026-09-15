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

## 2. Site Structure (deploy `antonias/` as-is) — Strongest Site 2026
```
antonias/
├── index.html (home funnel: Hero ORDER|MENU + SLO|Paso chooser, Social Proof 5.0★, Wheel 8 distinct, Tonight live hours SCHEDULES, Everyone marquee, Spin-to-decide 2 wheels, Ajarski, Fresh steps, Deals $39.99/$36.99, Gallery, Reviews plain HTML, Locations 2 tabs, Catering teaser, Videos teaser 3 GIFs, Promo Videos teaser 6 stories, FAQ 5, CTA word-rotate, footer Explore+Locations+Order)
├── menu.html (38 dishes no prices 6 images real ADD TO ORDER → Toast + strategic CTAs each category trust-microcopy + deals + AOV focus + rail live counts + category rail)
├── san-luis-obispo.html + paso-robles.html (unique Restaurant schema @id+parentOrg+geo+hours+areaServed+OrderAction+hasMap+priceRange+servesCuisine+paymentAccepted)
├── our-story.html (editorial dough/sauce/Ajarski/late-night 2AM citation-worthy facts-first quotable stats)
├── catering.html 27K (hero what we cater how it works areas photos FAQ CTA + Service schema + FAQPage 6)
├── blog/index.html + 2 posts late-night-slo + paso-wine-pairing (CollectionPage + BreadcrumbList no invented facts)
├── order.html 12K (intermediate explaining pickup/delivery via Toast 1-2 clicks 2 kitchens no cart + BreadcrumbList + CollectionPage)
├── faq.html 15K (8 Qs FAQPage + BreadcrumbList + CollectionPage)
├── videos.html 28K (3 GIFs rotate pulse reveal + 3 CSS videos spin pulse reveal + promo + tools + VideoObject ×3)
├── promo-videos.html 49K (6 stories Famous Dough 15s Open Till 2AM 30s Ajarski 20s Two Kitchens 25s Catering 30s 10 to 28 15s CSS story players + VideoObject ×3)
├── privacy.html plain English no tracking currently + 404.html branded
├── llms.txt 113 lines + Videos + Promo Videos 6 stories + Quotable Stats + Comparison Content + Prompts + Freshness 2026-09-15
├── robots.txt allow answer engines GPTBot ChatGPT-User ClaudeBot Claude-Web PerplexityBot Google-Extended Bingbot + Sitemap
├── sitemap.xml 14 URLs (home menu slo paso our-story catering blog blog/late-night-slo blog/paso-wine-pairing order faq videos promo-videos privacy) weekly/monthly/yearly priority 1.0→0.3
├── _redirects 14 rules clean 200 + old 301 + /videos 200 + /promo-videos 200 + /promo 200 + /order 200 + /faq 200 + /blog 200
├── _headers security + 2026: X-Content-Type-Options nosniff Referrer-Policy strict-origin-when-cross-origin X-Frame-Options SAMEORIGIN Permissions-Policy camera mic geo payment usb COOP same-origin CORP same-site CSP default-src self img-src self data: https: font-src self style-src self unsafe-inline script-src self connect-src none frame-ancestors none form-action self https://antoniaspizza.toast.site base-uri self upgrade-insecure-requests HSTS max-age 31536000 includeSubDomains preload + Cache-Control immutable fonts 31536000 assets 86400 css/js 604800 + Link preload hero AVIF + fonts 103 Early Hints
├── css/style.css 76K+ single :root tokens sky #bfe3f2 sun #ffd23f navy #0e3a52 paper #fffdf7 red-deep #c03a24 gold-ink #8f6116 --radius 32px --container min(1240px,92vw) + size-adjust 105% ascent-override 92% descent-override 28% line-gap-override 0% CLS fix + contain layout paint + content-visibility auto below-fold + View Transitions + focus-visible 3px gold-ink + prefers-contrast more + forced-colors + no backdrop-filter + will-change only continuous motion
├── js/main.js 32KB+ 801+ lines one IIFE null-safe $ $$ motionMQ live autoplay registry stop start motionPausedByUser markLoaded body.loaded DOMContentLoaded custom cursor pointer fine header height --header-h ResizeObserver rAF header shrink hidden scroll down passive mobile nav scroll reveals IntersectionObserver 0.16 stat counters 0.6 data-count hero parallax 3D tilt magnetic rAF FAQ accordion location tabs open/closed live SCHEDULES close>1440 spills tail marquee duplication node-by-node aria-hidden review scroller drag menu rail live counts menu category rail spin-to-decide 8 segments pointer 12 o'clock onceKey localStorage footer year pie wheel pinza.com-style rotating slice carousel auto-rotate click-to-focus drag-to-spin synced labels + spotlight tracking + bottom nav HOME|MENU|ORDER|LOCATIONS + analytics P0 privacy-first behind flag ANALYTICS_ENABLED false track plausible gtag view_menu view_item IntersectionObserver 0.5 click_order toast.site data-loc start_order click_phone tel: click_directions maps click_location loc-tabs click_catering data-catering submit_catering_form + web-vitals RUM 2026 PerformanceObserver LCP CLS INP sendBeacon /api/vitals attribution + View Transitions API progressive enhancement respects RM + bfcache pageshow/pagehide + global motion pause WCAG 2.2.2
└── assets/img/ (logo.png 192×192 12KB logo-180.png 11KB wheel/ 8 distinct jpg+webp+avif 24 total og/ 1200×630 JPEG center-crop home menu slo paso story real-* owner untouched storefront.jpg pies-2.jpg never AI-replaced gen/* masters gitignored 26 AVIF twins q55 2056KB vs JPEG 4098KB -50% vs WebP 2952KB -28% hero-pep.avif 36KB LCP + assets/video/ 5 files 788KB logo-rotate 285KB logo-pulse 83KB logo-reveal 246KB promo-fade 48KB promo-with-logo 120KB + story players CSS)
```
`build.py` at `restaurant-site/build.py` generates `standalone.html` 5420KB preview only (1 stylesheet inlined 1 script inlined 37 assets inlined 11 page links absolute).

## 3. Agentic Team (13 core + 6 design = 19 specialized)
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
| **ui-designer** | **UI patterns, bento grids 2.0, calm interfaces, token-based scalability** | css layout, grids, components | design-system-patterns, responsive-design, visual-design-foundations |
| **ux-designer** | **User journeys, intentional simplicity, immersive experiential, emotion-driven, thumb-friendly** | index funnel, menu categories, navigation | conversion-psychology, visual-hierarchy, ux-research |
| **brand-designer** | **Adaptive brand systems, minimalism 2.0 bold, sustainability, hand-drawn organic, motion identity** | css tokens, logo, og cards, brand touchpoints | brand-discovery, design-system-patterns, visual-design-foundations |
| **motion-designer** | **Motion as core identity, motion that explains not performs, timing curves easing specs, Lottie/Rive <50KB, kinetic typography, scroll choreography, pause+RM** | css keyframes, js autoplay registry, motionMQ | motion-design, animation-engineering, view-transitions-api |
| **typography-designer** | **Elastic typography stretched warped animated, kinetic letters dance thumb-reactive, bold typography, variable fonts, custom kinetic, type-only logos, typography IS identity** | css typography, @font-face, display, footer-word | typography-systems, variable-fonts, kinetic-typography |
| **visual-designer** | **Tactile textures grain, maximalism visual density layered busy on purpose, expanded color palettes, illustration eating photography, world-building editorial chapters, emotion-led humanised, anti-polish raw authenticity** | css textures, colors, brand, real photos, og cards | visual-design-foundations, ui-visual-validator, brand-discovery |

**Stack per user brief:**
- Primary Builder: **Codex** (executes tasks)
- Architecture/Review: **Claude Code** (reviews, architect agent)
- Browser/IDE: **Roo Code** (file edit, terminal, browser automation, MCP, custom modes)
- **Design Team**: **6 specialized designers** — UI, UX, Brand, Motion, Typography, Visual — million-dollar standard, latest trends 2026, design tokens, Figma component libraries, Rive/Lottie, elastic kinetic typography, bento grids, calm interfaces, world-building

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
