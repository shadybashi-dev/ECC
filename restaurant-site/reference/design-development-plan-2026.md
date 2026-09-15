# Antonia's Pizza — Design Development Plan 2026 — Million-Dollar Standard

> **Vision:** Transform Antonia's from "good pizzeria site" to "#1 in region" through 2026's strongest design trends — while staying 100% vanilla (no React/Tailwind) per HANDOFF §9. Every decision must pass 3 hard gates: CODE/CONVERSION/OPTICAL&A11Y.

**Date:** 2026-09-15 — P0 complete (0 FAIL 0 WARN, JS 27KB <40KB, build 3683KB, 36 keyframes 7 RM 21 pause)
**Team:** 6 specialized designers (UI, UX, Brand, Motion, Typography, Visual) + 13 core agents = 19 total
**Standard:** Emil Kowalski physics + Responsive Optical Balance + Hallmark 58-Point Anti-Slop

---

## 1. Current Audit — Where We Are (Strengths + Gaps)

### ✅ Strengths (Keep)
- **Tokens:** Single :root with OKLCH + semantic + component tiers — sky #bfe3f2 sun #ffd23f navy #0e3a52 paper #fffdf7 red-deep #c03a24 gold-ink #8f6116 — contrast-safe 4.5:1+ verified
- **Bottom Nav P0:** HOME|MENU|ORDER|LOCATIONS 44px tap safe-area aria-current ORDER sun pill — mobile excellence
- **Motion:** 36 @keyframes, 7 RM blocks (universal kill `animation-iteration-count:1 !important`), 21 pause selectors — WCAG 2.2.2 compliant
- **Performance:** JS 27KB <40KB, CSS 137KB (95KB minified), hero AVIF 36KB <180KB, build 3683KB <4000KB, 51 img consistent 0 mismatches
- **Images:** 78 seo AVIF+WebP <60K (hero <150K), real-* untouched, wheel 8 distinct
- **Typography:** Baloo 2 rounded 400/600/700/800 + Sora 400/600/700 — friendly food/hospitality domain

### ⚠️ Gaps (P1-P2 Opportunities)
- **CSS size:** 137KB raw (95KB minified) vs <80KB target 2026 — 36 keyframes all used, but grain texture (feTurbulence) + some utilities heavy
- **Header/Footer duplication:** Manual duplication across 13 HTML — Vanilla cost, needs template build script (editor.py)
- **Bento grids:** dish-card first-child span 2 exists but not full bento 2.0 organized chaos
- **Elastic typography:** hero title has scaleX 1.02 but not full variable font stretched warped animated
- **Motion identity:** badgeGlint 5.5s + kenBurns 26s + logoTurn 48s exist, but no Rive/Lottie <50KB, no scroll choreography view()
- **Tactile textures:** grain via feTurbulence .85 opacity .04 exists but subtle — could be more tactile maximalism
- **Hand-drawn organic:** sticker rotate -8deg exists but could be more doodles/human imperfections
- **World-building:** loc-hero lead border-left sun exists but could be more editorial chapters

---

## 2. 2026 Design Trends — Applied to Antonia's (Research Synthesis)

From deep research (15 graphic trends 2026 + UX/UI 2026 + restaurant menu 2026):

### Tier 1 — Must Implement (High Impact, Low Risk)
1. **Elastic Typography (variable fonts stretched warped animated)** — Google variable font library, Spotify uses — hero display font stretched on scroll
2. **Motion as Core Identity (animated logo variants, Rive Lottie <50KB, timing curves easing specs)** — logo already rotates 48s, but add Rive for order badge
3. **Tactile Textures (grain Photoshop overlay)** — low difficulty immediate — already have feTurbulence but enhance
4. **Bento Grids 2.0 (organized chaos)** — one hero larger asymmetry — menu page already has first-child span 2
5. **Token-Based Scalability (structured variables color spacing typography motion timing border radius)** — already have 3 tiers primitive/semantic/component + W3C DTCG
6. **Calm Interfaces (replace gamification, calmer micro-interactions, strategic motion explains not performs)** — already have transform/opacity/filter only per HANDOFF

### Tier 2 — Should Implement (Medium Impact, Medium Effort)
7. **Maximalism Visual Density (layered busy on purpose)** — layered shapes textures hand-drawn — add to deals section
8. **Adaptive Brand Systems (Figma component libraries design tokens mapping to code)** — already have design-system.md 12K
9. **Hand-Drawn Organic (imperfect lettering organic linework human authorship value AI market)** — sticker rotate -8deg exists
10. **Minimalism 2.0 (bolder shapes punchy accent dramatic whitespace oversized typography clarity with attitude)** — section padding clamp 5rem 10vw 9.5rem already
11. **Custom Kinetic Type-Only Logos (typography IS identity)** — Antonia's wordmark could be kinetic
12. **Emotion-Driven Color Motion Micro-Interactions (excitement calm confidence memorable)** — hero-photo hover saturate 1.05

### Tier 3 — Could Implement (Experimental, High Effort)
13. **AI Art Aesthetic** — careful, avoid fake storefront — food only
14. **Immersive 3D Commerce** — 3D with restraint — maybe pizza scale visualizer already has spring
15. **Scrollytelling + Doodles Human Imperfections** — doodle notebook chef drawings family-friendly genuine
16. **Immersive Experiential Motion Interaction Storytelling** — scroll choreography view() compositor off main thread

---

## 3. Design System Evolution — Tokens V2 (2026 Strongest)

### Current :root (140KB CSS)
```css
:root{
  --sky:#bfe3f2; --sky-2:#d8eff9; --sun:#ffd23f; --sun-2:#ffde6b;
  --navy:#0e3a52; --navy-2:#0a2c3f; --paper:#fffdf7; --red:#e2492f;
  --red-deep:#c03a24; --gold:#e8a33d; --gold-ink:#8f6116; --char:#171210;
  --radius:32px; --container:min(1240px,92vw);
  --ease-out:cubic-bezier(.22,1,.36,1); --ease-spring:cubic-bezier(.34,1.56,.64,1);
  --ease-soft:cubic-bezier(.22,1,.36,1); --ease-snap:cubic-bezier(.34,1.56,.64,1);
}
```

### Proposed V2 — Add 2026 Tokens (Keep Vanilla)
```css
:root{
  /* Existing + OKLCH for P3 */
  --sky-oklch:oklch(0.90 0.04 220); --sun-oklch:oklch(0.87 0.17 85); --navy-oklch:oklch(0.30 0.06 230);
  
  /* NEW 2026: Motion timing (Emil Kowalski physics) */
  --motion-duration-fast: .18s; --motion-duration-medium: .34s; --motion-duration-slow: .6s; --motion-duration-xslow: .9s;
  --motion-ease-spring: cubic-bezier(.34,1.56,.64,1); --motion-ease-out: cubic-bezier(.22,1,.36,1);
  --motion-ease-soft: cubic-bezier(.25,.46,.45,.94); /* new: softer */
  --motion-ease-bounce: cubic-bezier(.68,-0.55,.265,1.55); /* new: bounce */
  
  /* NEW 2026: Typography elastic */
  --text-elastic-min: 0.85; --text-elastic-max: 1.15; /* scaleX range */
  --text-display-elastic: clamp(2.8rem, 8vw, 7rem) / 0.9; /* tighter line-height for elastic */
  
  /* NEW 2026: Bento grids */
  --bento-gap: clamp(1rem, 2vw, 1.5rem); --bento-radius: 24px; --bento-radius-lg: 32px;
  
  /* NEW 2026: Tactile */
  --grain-opacity: 0.04; --grain-turbulence: 0.85;
  
  /* NEW 2026: Z-index system */
  --z-base: 1; --z-sticky: 10; --z-header: 20; --z-bottom-nav: 30; --z-modal: 40; --z-cursor: 50;
}
```

### Figma Mapping (for owner/designer handoff)
- Primitive: color.sky #bfe3f2 → CSS var(--sky) → Figma variable $sky
- Semantic: color.bg.primary = sky → CSS var(--color-bg-primary) → Figma alias
- Component: btn.bg = sun → CSS var(--btn-bg) → Figma component property
- Export: Style Dictionary W3C DTCG JSON → CSS + Tailwind + iOS + Android

---

## 4. Six Designer Tracks — Isolated Execution (Superpowers Pattern)

### Track A — UI Designer (Bento Grids 2.0 + Calm Interfaces + Token Scalability)
**Responsible:** `ui-designer` agent — Skills: `design-system-patterns`, `responsive-design`, `visual-design-foundations`
**Output:** `css/style.css` bento improvements + `reference/bento-audit.md`
**KPI:** Bento grid coverage 100% menu + deals, calm interface score (no gamification)
**DoD:**
- [ ] Menu page: dish-grid bento 2.0 — first card span 2 (hero), second rotate -1.5deg, third rotate 1deg, organized chaos asymmetry
- [ ] Deals section: $39.99 + $36.99 cards with layered busy — stickers + grain + tilt
- [ ] Token scalability: all spacing uses --space-* semantic, not raw px
- [ ] Calm interfaces: no confetti, no points, micro-interactions explain not perform (e.g., FAQ accordion height anim explains content)

**Implementation (Vanilla):**
```css
.dish-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--bento-gap)}
.dish-card:first-child{grid-column:span 2;transform:rotate(-1.5deg) scale(1.02)} /* hero */
.dish-card:nth-child(2){transform:rotate(1deg)} /* chaos */
@media(max-width:768px){.dish-card:first-child{grid-column:span 1}} /* responsive optical balance */
```

### Track B — UX Designer (User Journeys + Intentional Simplicity + Immersive + Thumb-Friendly)
**Responsible:** `ux-designer` — Skills: `conversion-psychology`, `visual-hierarchy`, `ux-research`
**Output:** `index.html` funnel improvements + `reference/journey-map.md`
**KPI:** 1-2 clicks to order from any page, thumb-friendly 44px+ all CTAs, dwell time ↑
**DoD:**
- [ ] Journey: Home → Menu → Toast in 2 clicks verified (bottom nav ORDER always visible)
- [ ] Intentional simplicity: 6-tab model (Hero, Wheel, Locations, Deals, Gallery, FAQ) — no more than 6 sections above fold
- [ ] Thumb-friendly: bottom nav 44px min, ORDER sun pill 52px, sticky-order 44px, menu chips 44px
- [ ] Immersive: Tonight band live hours + pizza scale visualizer spring oscillation + portion calculator

### Track C — Brand Designer (Adaptive Systems + Minimalism 2.0 Bold + Sustainability + Hand-Drawn + Motion Identity)
**Responsible:** `brand-designer` — Skills: `brand-discovery`, `design-system-patterns`, `visual-design-foundations`
**Output:** `assets/img/og/` 4 cards + `favicon.svg` + `reference/brand-audit.md`
**KPI:** Brand consistency 100% across OG, favicon, logo, tokens
**DoD:**
- [ ] Adaptive: logo.png 192x192 + favicon.svg work on light/dark + OG 1200x630 center-crop home/menu/slo/paso
- [ ] Minimalism 2.0: oversized typography h-xl clamp(3.2rem,9vw,8rem) line-height .9 + dramatic whitespace section padding clamp(5rem,10vw,9.5rem)
- [ ] Hand-drawn: sticker rotate -8deg skewX -1deg + version-list li::before width 0→100% sun bar + info-card h3::before rotate -1.5deg
- [ ] Motion identity: logoTurn 48s linear infinite on footer-brand img + badgeGlint 5.5s on order badge — alive human
- [ ] Sustainability: trust-microcopy "Real photos only owner photos never AI-replaced" + no prices (owner rule) + direct ordering saves 15-30%

### Track D — Motion Designer (Motion Core + Timing Curves + Lottie/Rive <50KB + Kinetic Typography + Scroll Choreography)
**Responsible:** `motion-designer` — Skills: `motion-design`, `animation-engineering`, `view-transitions-api`
**Output:** `css/style.css` keyframes + `js/main.js` autoplay registry + `reference/motion-audit.md`
**KPI:** 36 keyframes (keep), 7 RM blocks, 21 pause selectors, Lottie <50KB if added, transform/opacity/filter only
**DoD:**
- [ ] Timing curves: --ease-spring .34,1.56,.64,1 + --ease-out .22,1,.36,1 + --ease-soft + --ease-bounce — Emil Kowalski physics
- [ ] Rive/Lottie: if added, <50KB, registered in pause+RM lists, transform/opacity/filter only
- [ ] Kinetic typography: hero title elasticSettle .6s ease-spring .8s + nameSwap .55s + craving swap
- [ ] Scroll choreography: view() API progressive enhancement, compositor off main thread, hero parallax 3D tilt magnetic rAF
- [ ] Pause+RM: every infinite animation in html.motion-paused list + @media prefers-reduced-motion universal kill

**Existing Motion Inventory (Keep):**
- badgeGlint 5.5s infinite (order badge light sweep), kenBurns 26s infinite alternate (hero), logoTurn 48s linear infinite (footer), blink 1.6s infinite (open pill dot), marquee 20s linear infinite, floaty 3.5s/4.5s, spin 16s linear infinite, etc.

### Track E — Typography Designer (Elastic + Kinetic Letters + Bold + Variable Fonts + Custom Kinetic + Type-Only Logos)
**Responsible:** `typography-designer` — Skills: `typography-systems`, `variable-fonts`, `kinetic-typography`
**Output:** `css/style.css` typography + `assets/fonts/` 8 woff2 + `reference/typography-audit.md`
**KPI:** Variable fonts loaded, elastic typography on hero, kinetic letters, text-wrap:balance
**DoD:**
- [ ] Elastic: hero display font stretched warped animated — Google variable font library — scaleX 0.85→1.15 on scroll
- [ ] Variable: Baloo 2 400/600/700/800 + Sora 400/600/700 — size-adjust 105% ascent-override 92% descent-override 28% CLS fix
- [ ] Kinetic: nameSwap + craving swap + word-rotate CTA + hero title span scaleX 1.02 .98 1.01
- [ ] Bold: h-xl clamp(3.2rem,9vw,8rem) .9 + h-lg 2.6rem 6.5vw 5.4rem .95 + h-md 2rem 4vw 3.4rem 1
- [ ] Type-only logo: Antonia's wordmark could be kinetic — typography IS identity
- [ ] Balance: text-wrap:balance on all headings + display + lead — type-designer discipline

### Track F — Visual Designer (Tactile Textures Grain + Maximalism Density + Expanded Palettes + Illustration+Photography + World-Building Editorial + Emotion-Led + Anti-Polish)
**Responsible:** `visual-designer` — Skills: `visual-design-foundations`, `ui-visual-validator`, `brand-discovery`
**Output:** `css/style.css` textures + `assets/img/` real photos + `reference/visual-audit.md`
**KPI:** Tactile grain visible, maximalism in deals, world-building in locations, emotion-led, anti-polish
**DoD:**
- [ ] Tactile: grain via feTurbulence .85 numOctaves 3 opacity .04 on hero/wheel/loc-hero — Photoshop overlay low difficulty immediate
- [ ] Maximalism: deals section layered busy on purpose — stickers + grain + tilt + trust-microcopy
- [ ] Expanded palettes: sky #bfe3f2 sun #ffd23f navy #0e3a52 paper #fffdf7 red-deep #c03a24 gold-ink #8f6116 + OKLCH P3
- [ ] Illustration+Photography: Sweetgreen Min Heo hand-drawn save photography conversion-critical — top funnel illustration, bottom funnel real photos
- [ ] World-building: loc-hero lead padding-left 1.2rem border-left 4px sun rotate -.5deg + location pages graduated template cards to editorial chapters per-venue founding myths
- [ ] Emotion-led: hero-photo hover box-shadow 0 40px 100px -20px saturate 1.05 + btn filter brightness 1.05 active .95
- [ ] Anti-polish: raw edges visible process intentional friction sketch-like honesty over perfection — trust-microcopy "Real photos only"

---

## 5. Implementation Phases — P1-P3 (Superpowers Executing-Plans)

### Phase P1 — Foundation + Performance (Done + Continue)
- [x] Tokens single :root + OKLCH + semantic + component + W3C DTCG
- [x] Bottom nav HOME|MENU|ORDER|LOCATIONS + sticky order
- [x] Motion 36 keyframes 7 RM 21 pause
- [x] JS 27KB <40KB + CSS 95KB minified (target <80KB) + build 3683KB <4000KB + hero AVIF 46KB <180KB
- [x] 0 FAIL 0 WARN harness + 51 img consistent
- [ ] **Next:** Further CSS <80KB via unused keyframe audit + header/footer template unification (editor.py for 15 pages)

### Phase P2 — Design Polish (Next Sprint)
- [ ] Bento grids 2.0 audit + implementation (dish-grid + deals)
- [ ] Elastic typography variable font stretch (hero)
- [ ] Tactile textures grain enhancement (hero + wheel + loc-hero)
- [ ] Hand-drawn organic stickers + doodles (deals + info cards)
- [ ] World-building editorial chapters (SLO/Paso pages more unique)

### Phase P3 — Growth + Owner-Side (Parallel)
- [ ] GBP: category, NAP, photos real, menu, services, posts, reviews
- [ ] Citations: Grubhub/DoorDash/Yelp/TripAdvisor cleanup per seo-offsite-checklist.md
- [ ] Search Console + sitemap 14 URLs
- [ ] CRO loop: data → hypothesis → change → measure weekly
- [ ] ComfyUI owner-side: 13 slots FLUX/SDXL for stronger food set (package ready in comfyui-owner-package/)

---

## 6. Acceptance Criteria — DoD 25 (Final Reviewer)

Per `reference/council-review.md` + Hallmark 58-Point Anti-Slop:

- [ ] **CODE:** Vanilla only (no React/Tailwind/build step/CDN), html.js gating (0,2,1)+!important, null-safe selectors, transform/opacity/filter only, node --check PASS, build.py fresh <4000KB, JS <40KB, CSS <80KB (or 95KB minified with justification), hero AVIF <180KB
- [ ] **CONVERSION:** All Order CTAs → toast.site target=_blank, NAP 100% 891 Higuera + 729 12th, bottom nav HOME|MENU|ORDER|LOCATIONS, sticky order, 1-2 clicks to order, phone clickable, AOV focus $39.99/$36.99 deals
- [ ] **OPTICAL&A11Y:** 0 FAIL harness, pause list covers all infinite anims, RM universal kill, focus-visible 3px gold-ink, 44px tap targets, text-wrap:balance, alt truthful, no aggregateRating/review[] schema, real photos only storefront.jpg/pies-2.jpg never AI-replaced

---

## 7. Skills Required per Agent (from user's patch plan)

| Agent | Responsibility | Skills (from patch) |
|-------|----------------|---------------------|
| frontend & cro | Vanilla JS + bottom nav + CRO | `frontend-patterns`, `conversion-psychology`, `visual-hierarchy` |
| seo & geo & content | Real content + Local SEO | `seo-technical-optimization`, `seo-content-planner`, `avoid-ai-writing` |
| performance & visual-qa | Images AVIF/WebP + design match + perf | `application-performance`, `web-perf-engineer`, `browser-qa` |
| accessibility | Screen reader + keyboard | `accessibility-compliance`, `wcag-audit-patterns` |
| analytics & catering-growth | Events + catering | `kpi-dashboard-design`, `data-storytelling`, `content-marketer` |
| architect & final-reviewer | Code review + gates | `superpowers-executing-plans`, `hallmark-anti-slop`, `delivery-gate` |
| ui-designer | Bento grids 2.0 + calm + token scalability | `design-system-patterns`, `responsive-design`, `visual-design-foundations` |
| ux-designer | Journeys + simplicity + immersive + thumb | `conversion-psychology`, `visual-hierarchy`, `ux-research` |
| brand-designer | Adaptive + minimalism 2.0 + hand-drawn + motion identity | `brand-discovery`, `design-system-patterns`, `visual-design-foundations` |
| motion-designer | Motion core + timing curves + Lottie/Rive + kinetic + scroll | `motion-design`, `animation-engineering`, `view-transitions-api` |
| typography-designer | Elastic + kinetic + bold + variable + type-only logos | `typography-systems`, `variable-fonts`, `kinetic-typography` |
| visual-designer | Tactile grain + maximalism + palettes + illustration+photo + world-building + anti-polish | `visual-design-foundations`, `ui-visual-validator`, `brand-discovery` |

All 19 agents have MD files in `.agents/` + `.claude/agents/` + `antonias/.agents/` — ready to execute.

---

## 8. Quick Wins — Implement Now (Vanilla, No Framework)

### 8.1 Elastic Typography (Hero)
```css
.hero-title span{display:inline-block;transform-origin:left;transition:transform .6s var(--ease-spring)}
.hero.in .hero-title span{animation:elasticSettle .6s var(--ease-spring) .8s both}
@keyframes elasticSettle{0%{transform:scaleX(.85)}60%{transform:scaleX(1.15)}100%{transform:scaleX(1)}}
```

### 8.2 Bento Grids 2.0 (Menu)
```css
.dish-grid{grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--bento-gap,1.5rem)}
.dish-card:first-child{grid-column:span 2;transform:rotate(-1.5deg) scale(1.02)}
.dish-card:nth-child(2){transform:rotate(1deg)}
@media(max-width:768px){.dish-card:first-child{grid-column:span 1;transform:none}}
```

### 8.3 Tactile Grain Enhancement
```css
.hero::before,.wheel-section::before,.loc-hero::before{
  content:"";position:absolute;inset:0;pointer-events:none;opacity:var(--grain-opacity,.04);
  background:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

### 8.4 Hand-Drawn Stickers
```css
.sticker{transform:rotate(-8deg) skewX(-1deg);border:2px dashed var(--navy);border-radius:12px}
.version-list li::before{content:"";position:absolute;left:0;bottom:-2px;width:0;height:4px;background:var(--sun);transform:rotate(-1deg);transition:width .4s var(--ease-out)}
.version-list li:hover::before{width:100%}
```

### 8.5 World-Building Editorial
```css
.loc-hero .lead{padding-left:1.2rem;border-left:4px solid var(--sun);transform:rotate(-.5deg)}
.trust-microcopy{padding-left:1.6rem;position:relative;opacity:.7;font-size:.85rem}
.trust-microcopy::before{content:"↳";position:absolute;left:0;top:0}
```

---

## 9. Next Steps — What to Build First?

**User asked:** "هل تود البدء بتنفيذ مسار معين أولاً، مثل توجيه العميل frontend للبدء فوراً في برمجة شريط التنقل السفلي للهواتف المحمولة؟"

**Answer:** Bottom nav already exists and passes P0 (HOME|MENU|ORDER|LOCATIONS) — verified 54 CSS refs + 6 HTML + JS aria-current. No need to rebuild.

**Proposed next (P1-P2):**
1. **frontend + ui-designer:** Bento grids 2.0 + elastic typography (quick wins 8.1 + 8.2) — 0.5 day
2. **motion-designer + typography-designer:** Kinetic letters + scroll choreography view() + Rive <50KB research — 1 day
3. **visual-designer + brand-designer:** Tactile grain enhancement + hand-drawn stickers + world-building editorial — 0.5 day
4. **performance + accessibility:** Further CSS <80KB + a11y audit + Lighthouse ≥98 — 0.5 day
5. **seo + geo + content:** Payment policy already added, but add more GEO quotable stats + comparison content — 0.5 day

**Total:** 3 days for P1-P2 design polish, then P3 owner-side GBP/citations/Search Console.

**Do you want to start with Track A (Bento + Elastic) now?** — It's isolated, vanilla-only, no framework, and will be visible immediately in preview.
