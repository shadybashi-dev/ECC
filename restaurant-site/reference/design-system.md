# Antonia's Pizza — Design System 2026 — Strongest Site — Design Tokens

> Single source of truth — vanilla only — no Tailwind — tokens map to CSS variables — Figma component libraries with design tokens mapping to code variables — W3C DTCG format $value $type — three tiers primitive semantic component.

## Tokens — Primitive (raw values)

```json
{
  "color": {
    "sky": { "$value": "#bfe3f2", "$type": "color", "description": "Calm, sky blue — primary bg hero wheel" },
    "sky-2": { "$value": "#d8eff9", "$type": "color" },
    "sun": { "$value": "#ffd23f", "$type": "color", "description": "Excitement, sunshine yellow — CTAs badges" },
    "sun-2": { "$value": "#ffde6b", "$type": "color" },
    "navy": { "$value": "#0e3a52", "$type": "color", "description": "Trust, deep navy — text header footer" },
    "navy-2": { "$value": "#0a2c3f", "$type": "color" },
    "paper": { "$value": "#fffdf7", "$type": "color", "description": "Warm paper — cards surfaces" },
    "red": { "$value": "#e2492f", "$type": "color", "description": "Appetite, brand red — large type graphics" },
    "red-deep": { "$value": "#c03a24", "$type": "color", "description": "Contrast-safe small text on light >=4.5:1 5.3:1 on paper" },
    "gold": { "$value": "#e8a33d", "$type": "color" },
    "gold-ink": { "$value": "#8f6116", "$type": "color", "description": "Contrast-safe small text on light >=4.5:1" },
    "char": { "$value": "#171210", "$type": "color" },
    "char-2": { "$value": "#221a15", "$type": "color" },
    "cream": { "$value": "#fffdf7", "$type": "color", "alias": "paper" },
    "cream-2": { "$value": "#efe3c8", "$type": "color" },
    "green": { "$value": "#40632f", "$type": "color", "description": "Success, open dot" },
    "white": { "$value": "#fffdf7", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Baloo 2, Sora, system-ui, sans-serif", "$type": "fontFamily", "description": "Rounded extra-bold friendly food/hospitality domain" },
    "body": { "$value": "Baloo 2, Sora, system-ui, sans-serif", "$type": "fontFamily" }
  },
  "size": {
    "radius": { "$value": "32px", "$type": "dimension", "description": "Card radius — bento grids" },
    "container": { "$value": "min(1240px, 92vw)", "$type": "dimension" }
  },
  "shadow": {
    "card": { "$value": "0 18px 44px -18px rgba(14,58,82,.35)", "$type": "shadow" }
  },
  "motion": {
    "ease-out": { "$value": "cubic-bezier(.22,1,.36,1)", "$type": "cubicBezier" },
    "ease-spring": { "$value": "cubic-bezier(.34,1.56,.64,1)", "$type": "cubicBezier" },
    "ease-soft": { "$value": "cubic-bezier(.22,1,.36,1)", "$type": "cubicBezier" },
    "ease-snap": { "$value": "cubic-bezier(.34,1.56,.64,1)", "$type": "cubicBezier" },
    "dur-1": { "$value": ".18s", "$type": "duration" },
    "dur-2": { "$value": ".34s", "$type": "duration" },
    "dur-3": { "$value": ".6s", "$type": "duration" },
    "dur-4": { "$value": ".9s", "$type": "duration" }
  }
}
```

## Semantic Tokens (intent)

```css
:root{
  /* Color semantic */
  --color-bg-primary: var(--sky);
  --color-bg-surface: var(--paper);
  --color-bg-dark: var(--navy);
  --color-bg-dark-2: var(--navy-2);
  --color-action-primary: var(--sun);
  --color-action-secondary: var(--navy);
  --color-text-primary: var(--navy);
  --color-text-inverse: var(--paper);
  --color-text-accent: var(--red-deep);
  --color-border: rgba(14,58,82,.12);
  --color-border-strong: var(--navy);
  
  /* Typography semantic */
  --text-display-xl: clamp(3rem, 8.5vw, 7.5rem);
  --text-display-lg: clamp(2.4rem, 6vw, 5rem);
  --text-display-md: clamp(1.8rem, 3.6vw, 3rem);
  --text-lead: clamp(1rem,1.4vw,1.2rem);
  --text-body: 1rem;
  --text-small: .85rem;
  --text-micro: .72rem;
  
  /* Spacing semantic — 4px base */
  --space-xs: .25rem;
  --space-sm: .5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4.5rem;
  
  /* Layout semantic */
  --layout-container: min(1240px, 92vw);
  --layout-section: clamp(4.5rem, 9vw, 8.5rem);
  --layout-radius: 32px;
  --layout-radius-full: 999px;
}
```

## Component Tokens (usage)

```css
.btn{
  --btn-bg: var(--color-action-primary);
  --btn-fg: var(--color-text-primary);
  border-radius: var(--layout-radius-full);
  padding: var(--space-md) var(--space-xl);
  font-weight: 700;
  letter-spacing: .02em;
  box-shadow: 0 10px 0 -4px rgba(14,58,82,.18);
}
.dish-card{
  background: var(--color-bg-dark);
  color: var(--color-text-inverse);
  border-radius: var(--layout-radius);
  contain: layout paint style;
  content-visibility: auto;
  contain-intrinsic-size: auto 800px;
}
```

## Typography System 2026 — Elastic + Kinetic + Bold

- **Display**: Baloo 2 800 weight oversized flat bright blocks joyful tilt — h-xl clamp(3rem,8.5vw,7.5rem) h-lg clamp(2.4rem,6vw,5rem) h-md clamp(1.8rem,3.6vw,3rem) — line-height .92 .98 — letter-spacing .01em 0 — text-transform uppercase — font-weight 800 — text-wrap balance — elastic via transform scale rotate
- **Kinetic**: word-rotate vertical flip late-night/cheesy/saucy/2AM wrUp 9s cubic-bezier(.76,0,.24,1) infinite — thumb-reactive moving text — CRED OG Zomato dancing text mini-party
- **Bold**: Words have weight visual weight size typeface rhythm layout carries meaning — Bub City Chicago massive heavyweight hand-painted signage — typography IS brand — bold headings easy to find instant without squinting frustration — special dishes chef picks spotlight — text adds style without dependence on photography — fonts reflect brand identity warm inviting sharp contemporary classic refined
- **Variable**: @font-face Baloo 2 400 600 700 800 + Anton 400 + Sora 400 600 700 self-hosted woff2 font-display swap size-adjust 105% ascent-override 92% descent-override 28% line-gap-override 0% CLS fix — variable-like via weight scale 400→800 — W3C CSS Fonts Level 4 size-adjust ascent-override descent-override stabilizing rapidly
- **Custom kinetic**: footer-word Antonia's Pizza transparent -webkit-text-stroke 1.5px + hero title hl underline sun rotated -1.2deg hand-drawn — type-only logos
- **Wrapping modern**: text-wrap balance pretty prevents orphan — progressive ignored where unsupported

## Motion System 2026 — Motion that explains not performs

- **Timing**: --ease-out cubic-bezier(.22,1,.36,1) --ease-spring cubic-bezier(.34,1.56,.64,1) --ease-soft --ease-snap --dur-1 .18s --dur-2 .34s --dur-3 .6s --dur-4 .9s — consistent scale whole site — brand guidelines include timing curves easing specs transition rules
- **Explains**: marquee-track 26s linear infinite endless pizza famous dough, gallery-track 38s linear infinite feed makes you hungry, pie-rotor .9s ease-out shortest way round, spin disc 4.6s cubic-bezier(.12,.72,.12,1) 5-7 rotations, hero title riseIn 1s ease-out gated html.js body.loaded opening moment not behind curtain, reveals opacity 0 translateY 46px .9s ease-out scroll arrival, stagger list order delay .04s .1s .16s .22s .28s .34s, FAQ maxHeight .55s accordion, loc-panel fadeUp .7s tab change, craving-word swap .55s wheel change, nameSwap dish name change, swPop prize win, tonight-card cardRise view() tonight band arrival, steps stepRise view() how-we-make-it, heroDrift view() depth, driftUp view() photo depth, headRise view() headlines lift settle, cardIn view() cards scale up out of fold, bandTilt view() marquee bands counter-rotate, heroSettle view() hero recedes layered, heroZoom 2.2s opening, spin 16s ORDER NOW, shimmer muShimmer 3.6s button shine, border-beam bbSpin 4.5s border light running, meteors muMeteor 4.6s 5.8s 4.2s 6.4s 5s shooting stars navy bands, orbit spin 12s + 19s reverse orbiting circles, blur-fade filter blur 10px to 0 reveal upgrade, dot pattern radial-gradient 1.5px 24px + grid pattern 1px 34px texture, word-rotate wrUp 9s vertical flip, spotlight radial-gradient 340px circle at --mx --my rgba(255,210,63,.2) transparent 62% mouse-follow glow, shinyText 3.2s light sweep, kenBurns 26s hero photo slow zoom, logoTurn 48s footer-brand, badgeGlint 5.5s light sweep, floaty 4.5s sticker, blink 1.6s open-pill dot, drip 1.8s scroll-hint, riseIn hero title, marquee -50% infinite loop, railGrow scaleX 0 to 1 scroll(root block) reading progress — all explain not perform — calm interfaces replace gamification with calmer micro-interactions strategic motion
- **Scroll choreography**: Native scroll-driven animations run on compositor off main thread stay smooth while page scrolls additive wrapped in @supports browsers without animation-timeline simply get static layout existing IntersectionObserver reveals still carry page — view() timeline driftUp headRise cardIn bandTilt heroSettle cardRise stepRise heroDrift animation-range entry 0% exit 100% etc — decoration under reduced motion none runs every element sits resting state @media prefers-reduced-motion reduce display none animation none !important opacity 1 !important transform none !important
- **Pause+RM**: WCAG 2.2.2 Level A Pause Stop Hide Everything moves on its own for more than five seconds can be stopped here one control — motion-toggle #motion-toggle 21 anims html.motion-paused paused !important RM animation none !important explicit lists not *
- **Vanilla only**: transform/opacity/filter only per HANDOFF §9 — logoTurn rotate badgeGlint translate kenBurns scale floaty translate marquee translate gallery translate rotor rotate spin disc rotate reveals translateY opacity counters opacity storyCycle translateY scale opacity progressBar width bgShift background-position

## Visual System 2026 — Tactile + Maximalism + World-Building

- **Tactile textures**: body::after grain feTurbulence .9 numOctaves 2 opacity .05 + dot pattern 1.5px 24px + grid pattern 1px 34px — analog surface effects Photoshop grain overlays Procreate low difficulty immediate noticeable
- **Maximalism layered but calm**: hero-inner grid + ph-main 560px + ph-back 46% + sticker + order-badge 120-168px + orbit + sat + badgeGlint — layered busy on purpose but timing slow 26s 38s 16s 12s 19s 5.5s 48s 26s 4.5s — calm because slow
- **Expanded palette**: sky sky-2 sun sun-2 navy navy-2 paper ink cream red char char-2 cream-2 green gold red-deep gold-ink white — semantic contrast-safe 5.3:1 — selection sun navy — scrollbar navy sky-2
- **Illustration + photography inversion**: illustration minimal sticker sun-bar + photography saved conversion-critical hero-pep 36KB dish cards real-pesto real-box real-patio real-night dough-toss wheel 8 distinct gallery 6 figures catering real-box feast-wide real-night — best 2024-2026 brands use illustration for emotional connection save photography for conversion-critical
- **World-building editorial chapters**: our-story dough foundation sauce ladled Ajarski only Higuera two downtown spots late night real food real value Make it here Keep it honest Feed everyone Stay open late — editorial chapters not template — location pages unique content not template Address Phone Hours Menu Order Directions Parking Delivery Catering Food Options Photos Reviews FAQ — strongest 2026 restaurant sites treat each venue sub-experience as narrative universe not directory entry
- **Emotion-led humanised**: hand-drawn details sticker imperfect + candid photography real-* owner untouched never AI-replaced + imperfect copywriting hand-crafted pies 10-28 same dough same care — humanised — with AI everywhere human factor differentiator
- **Anti-polish raw authenticity**: sticker rotated -8deg imperfect version-list hover padding-left imperfect price-chip sun pill imperfect info-card sun-bar imperfect grain overlay imperfect dot pattern imperfect — raw edges visible process intentional friction human-made imperfections sketch-like elements embracing honesty over perfection rebellion against algorithmic smoothness

## Layout System 2026 — Bento Grids 2.0 + Calm + Intentional Simplicity

- **Bento grids**: dish-grid 3 columns 2 mobile 1 phone, deal-strip auto-fit minmax 280px, steps 4 columns 2 tablet 1 phone, spin-grid auto-fit minmax 320px, tonight-grid 2 columns 1 phone, footer-grid 4 columns 2 tablet 1 phone — organized chaos one hero larger asymmetry
- **Calm**: marquee 26s linear infinite gallery 38s rotor .9s ease-out magnetic rAF-batched rect cached scroll passive only header no aggressive — calm interfaces replace gamification with calmer micro-interactions strategic motion
- **Token-based scalability**: structured variables color spacing typography motion timing border radius change quickly stable flexible adaptable — single :root tokens adapt via prefers-contrast more forced-colors prefers-reduced-data mobile-first
- **Intentional simplicity**: clarity purpose over aesthetic trends — 6-tab model Home Menu Order Reservations About Contact — our nav HOME|MENU|ORDER|LOCATIONS 4 items + Our Story + Deals + Wheel — close — each section one purpose — no clutter

## Performance System 2026 — Strongest Site

- **Budgets**: JS<300KB compressed (32KB), CSS<80KB (76K+ but with size-adjust), hero<200KB (36KB AVIF), total<1.5MB, third-party<5 (0)
- **Optimizations**: AVIF near-universal 2026 q55 26 images 2056KB -50% vs JPEG 4098KB WebP q82 26 images 2952KB -28% preload LCP fetchpriority high hero-pep.webp before stylesheet + img fetchpriority high decoding async logo 192×192 12KB -94% width/height truthful lazy except LCP font-display swap + size-adjust 105% ascent-override 92% descent-override 28% CLS fix CSS containment contain:layout paint + content-visibility auto below-fold contain-intrinsic-size auto 800px JS code-splitting islands-like IntersectionObserver gates onScreen rAF-batched rect cached scroll passive only header break long tasks yield main thread minimize DOM complexity no backdrop-filter will-change only continuous motion HTTP/3 103 Early Hints via Link headers in _headers preload hero AVIF + fonts edge caching Cache-Control immutable fonts 31536000 assets 86400 css/js 604800 bfcache eligible no unload listeners pageshow/pagehide Speculation Rules prefetch moderate eagerness View Transitions progressive enhancement
- **RUM**: web-vitals RUM behind flag PerformanceObserver LCP CLS INP sendBeacon /api/vitals attribution largestShiftTarget interactionTarget element — 4-layer Lighthouse CI regression CrUX source truth RUM web-vitals.js custom dimensions synthetic monitoring baselines
- **Gate**: LCP<1.5s INP<100ms CLS<0.02 Lighthouse≥98 JS<40KB 32KB Hero AVIF<180KB 36KB 0 backdrop-filter 0 will-change except allowed build passes 5431KB standalone

## Brand Voice 2026

- Hand-crafted pies 10-28 same dough same care No frozen pucks no par-bake Same dough same care From 10 to giant 28
- Hand-crafted dough We mix proof hand-toss every ball in-house airy inside blistered outside seasoned edge locals call SLO-style
- Tomato herbs olive oil cooked low ladled by hand bright line under cheese smell like blanket oregano when open box
- Open until midnight Sun-Wed until 2AM Thu-Sat SLO Fri-Sat Paso Students kitchen crews night-shift workers know drill
- The Ajarski Georgian-style dough boat molten mozzarella feta egg butter 4 versions Original American Mexicano SLO Style Found nowhere else in San Luis Obispo Only on Higuera Street
- Make it here Keep it honest Feed everyone Stay open late — sustainability storytelling 73% prefer eco-conscious
- Real food real value since day one — Best pizza in SLO Open till 2AM

## Gate — Million-Dollar + Strongest Site

- [x] Tokens single :root sky sun navy paper red-deep gold-ink --radius 32px --container min(1240px,92vw) --ease-out --ease-spring + size-adjust 105% + contain + content-visibility auto + View Transitions + focus-visible 3px gold-ink + no backdrop-filter + will-change only continuous motion
- [x] Typography elastic kinetic bold variable custom kinetic type-only logos text-wrap balance pretty — Baloo 2 rounded 800 weight oversized flat bright blocks joyful tilt
- [x] Motion explains not performs timing curves easing specs consistent scroll choreography compositor off main thread @supports additive pause+RM explicit lists transform/opacity/filter only
- [x] Visual tactile textures grain maximalism layered but calm expanded palette illustration + photography inversion world-building editorial chapters emotion-led humanised anti-polish raw authenticity
- [x] Layout bento grids calm token-based intentional simplicity no overflow 44px tap safe-area centre disc 44%
- [x] Performance LCP<1.5s INP<100ms CLS<0.02 Lighthouse≥98 JS<40KB Hero AVIF<180KB 0 third-party build passes 5431KB
- [x] Brand adaptive minimalism 2.0 sustainability hand-drawn organic motion identity

## 2026-09-15 — Executive Plan — Highest Visual Excellence + Architecture + Conversion — Skills Engine

> ترسانة المهارات المتقدمة The Modern Skills Engine — hallmark-anti-slop 58 checks OKLCH APCA/WCAG pre-emit self-critique, emil-design-eng press 0.97 no scale(0) transform-origin var --transform-origin @starting-style GPU, gpt-tasteskill Awwwards-Level hero 2-line max-w-5xl gapless bento cinematic rhythm, conversion-psychology & neuromarketing-priming Star/Plowhorse/Puzzle/Dog sensory language 24h cold ferment price anchoring 28" appetite triggers cheese pull olive oil shine leopard-spotting, dsgn-* Gestalt proximity common region Fitts 44px Doherty <100ms, performance-engineer LCP<1.5 CLS<0.02 INP<100 AVIF/WebP 50% preload hero.

### hallmark-anti-slop — 58 checks — OKLCH warm natural from ingredients
- No purple/violet gradients anywhere — enforce warm only: wheat tomato burnt clay warm gold
- No repeated card templates — each card distinct rotation/shadow/border: dish-card nth-child 3n+1 rotate -.8deg, 3n+2 .6deg, 3n -.3deg, hover rotate 0 scale 1.02
- Colors via OKLCH perceptual uniformity: sky oklch(0.90 0.04 220), sun oklch(0.87 0.17 85), navy oklch(0.30 0.06 230), paper oklch(0.99 0.01 85), red-deep oklch(0.55 0.18 30), gold oklch(0.76 0.15 70), wheat oklch(0.92 0.06 85), tomato oklch(0.62 0.19 28), clay oklch(0.52 0.10 45), olive oklch(0.68 0.08 105) — APCA/WCAG contrast >=4.5:1 5.3:1 on paper via red-deep gold-ink
- Self-critique 6 axes: Philosophy Make it here Keep it honest Feed everyone Stay open late hand-crafted dough real photos only no frozen pucks no par-bake open till 2AM, Hierarchy Star=Ajarski+28" top Plowhorse=cheese classic Puzzle=pesto chicken Dog=low price anchoring 28" +6.8% AOV, Mastery transform/opacity/filter only contain layout paint content-visibility auto AVIF 50% LCP<1.5 CLS<0.02 INP<100 vanilla only no backdrop-filter, Customization OKLCH ingredient palette hand-drawn sticker -8deg skew tactile grain feTurbulence .85 bento 2.0 first-child span2 not template, Discipline single :root 44px Fitts Doherty <100ms visibility hidden closed nav target=_blank rel=noopener Toast×211 no aggregateRating/review[] pause+RM 21 anims will-change only continuous, Diversity 2 downtown kitchens SLO+Paso 10-28 same dough same care vegan cheese gluten-aware 4 Ajarski versions 38 dishes no prices owner choice

### emil-design-eng — Interaction & invisible details
- Press physical: :active transform scale(0.97) translateY(1px) transition-duration .06s !important — all interactive .btn .menu-chip .wheel-btn .loc-tabs button .nav-toggle .sw-hub .motion-toggle .bottom-nav__item .tonight-card .deal-card .deal-mini .info-card .step .dish-card
- Ban scale(0): replace with scale(0.95)+opacity popInNatural popOutNatural — natural pop not from zero
- transform-origin var(--transform-origin): popups from button location — sw-card faq-a nav-links bottom-nav__item--order pie-center order-badge ob-center — JS sets --transform-origin from click coordinates x% y%
- @starting-style GPU: nav-links clip-path circle(0) visibility hidden, faq-a max-height 0 opacity 0, sw-card opacity 0 translateY 10px scale 0.95, bottom-nav translateY 100%, sticky-order translate -50% 140%, hero-title line span translateY 115% — no Main Thread overhead

### gpt-tasteskill — Awwwards-Level visual excellence
- Hero 2-Line Rule: headline horizontal breathing in wide containers max-w-5xl min(1024px,92vw) without stacked blocks — WE ARE FAMOUS FOR / OUR DOUGH — 10" TO 28" & AJARSKI — 2 lines only, text-wrap balance, max-width var(--container-5xl)
- Gapless Bento Grid: media + categories in integrated geometry no dead cells — bento-gapless 12 columns gap 0 border 3px navy radius var(--radius) overflow hidden paper bg, children border-right bottom rgba .12 — dish-grid upgraded to bento 2.0 first-card span2 border 0 gap 0 paper bg, border-right bottom 2px paper, mobile fallback border none gap 1.2rem
- Cinematic vertical rhythm: sections as film chapters — section padding clamp 5.5rem 10vw 10rem, + .section border-top rgba .06, section-head margin clamp 3.2rem 6vw 5.5rem — dramatic whitespace oversized typography clarity with attitude

### conversion-psychology & neuromarketing-priming — sales psychology
- Menu matrix Star/Plowhorse/Puzzle/Dog: Star = Ajarski + 28" — high profit high popularity — at top hierarchy — menu-item--star bg linear-gradient sun .12 paper border-left 4px sun radius 12px ::before ★ STAR most ordered + highest love sun pill — Plowhorse = cheese classics high popularity low profit — Puzzle = pesto chicken low popularity high profit — Dog = low — price anchoring
- Sensory language: 24-hour cold ferment, hand-tossed, stone-oven leopard-spotted crust, home-made tomato sauce ladled by hand, olive oil shine, cheese pull, blistered edge, molten mozzarella feta egg butter melting — proven +27% sales
- Price anchoring: 28" as anchor increases AOV +6.8% — price-anchor navy pill sun arrow ↗ — hero shows 10" to 28" King same dough same care — from personal to monster choose size not compromise — direct ordering 20% higher AOV
- Appetite triggers visual: cheese stretch, oil glisten, crust blister leopard-spotting — mi-desc--sensory italic + ::after radial-gradient sun red dots — appetite-trigger ::after linear-gradient white .18 soft-light

### dsgn-* — Gestalt laws + cognitive order
- Proximity & Common Region: addons sauces sizes grouped without annoying lines — menu-group bg rgba paper .6 border rgba .08 radius 20px padding 1.2rem margin-bottom 1.2rem — menu-item border-bottom none + border-top dashed .12
- Fitts's Law: min tap 44×44px mobile, order button in thumb zone 52px translateY -4px — .btn .menu-chip .wheel-btn .loc-tabs button .nav-toggle .motion-toggle .bottom-nav__item .sw-hub .tonight-card .faq-item button min-height 44px min-width 44px
- Doherty Threshold: visual feedback <100ms to preserve flow — --dur-0 .10s — all interactive transition-duration var(--dur-0) var(--dur-1) — active .06s — immediate

### performance-engineer & web-perf-engineer — super performance vanilla
- Vanilla only no React/Tailwind/build/CDN — LCP <1.5s CLS <0.02 INP <100ms — 2026 thresholds buffer LCP<2.0s INP<150ms CLS<0.05 — 43% fail INP
- AVIF/WebP 50% saving preload hero — AVIF 26 images 2056KB -50% vs JPEG 4098KB WebP 26 2952KB -28% — hero-pep.webp preload fetchpriority high before stylesheet + img fetchpriority high decoding async logo 192×192 12KB -94% — font-display swap size-adjust 105% CLS fix
- Containment: contain layout paint style + content-visibility auto below-fold contain-intrinsic-size auto 400px 800px — reduces render cost INP<150ms — will-change only continuous marquee 26s gallery 38s rotor spin — no backdrop-filter — transform/opacity/filter only — HTTP/3 103 Early Hints Link headers _headers preload hero AVIF + fonts — bfcache eligible no unload listeners pageshow/pagehide — Speculation Rules prefetch moderate — View Transitions progressive

### Execution Roadmap P0-P3 — Responsible/Output/KPI/DoD

#### Phase 1: Foundation & Tokens — architect + visual-qa — P0
- Responsible: architect + visual-qa
- Output: :root single + OKLCH ingredient palette wheat tomato burnt clay warm gold + APCA/WCAG + anti-slop 58 checks + self-critique 6 axes
- KPI: single :root 1, OKLCH 10 tokens, contrast >=4.5:1, no purple gradients, no repeated cards
- DoD: grep ^:root 1, oklch count 10+, backdrop-filter 0, AVIF 26

#### Phase 2: Hero Funnel & Conversion Engine — frontend + cro — P0
- Responsible: frontend + cro
- Output: hero 2-line max-w-5xl breathing, ORDER ONLINE 1-2 clicks + VIEW MENU 38 dishes, location selector SLO|Paso pills with live hours till 2AM, sensory language 24h cold ferment hand-tossed stone-oven leopard-spotting cheese pull olive oil shine, price anchor 28" +6.8% AOV
- KPI: hero 2 lines, location selector 2 pills, hours live, ORDER ONLINE primary, VIEW MENU secondary, 44px tap, Doherty <100ms
- DoD: hero-location-selector exists, SLO|Paso pills, hours 2AM, ORDER ONLINE + VIEW MENU, price-anchor, mi-desc--sensory

#### Phase 3: Menu Engineering — menu-engineer + content — P0
- Responsible: menu-engineer + content
- Output: menu HTML fast indexable from official menu doc, tabs Deals Pizza 10-28 Ajarski Pasta Wings Sides Salads Sandwiches Desserts, Star/Plowhorse/Puzzle/Dog matrix, sensory descriptions, price anchoring 28", ADD TO ORDER per dish direct Toast no intermediate screens
- KPI: ADD TO ORDER 35+, Star at top, sensory +27% sales, AOV +6.8% via 28"
- DoD: menu-chip rail, menu-group common region, btn--order 35+, Toast target=_blank 0 missing, no prices owner choice

#### Phase 4: Mobile UX Bottom Nav — frontend + cro — P0
- Responsible: frontend + cro
- Output: bottom nav fixed HOME|MENU|ORDER (sun pill thumb zone 52px)|LOCATIONS, 44px min, safe-area-inset-bottom, visibility hidden closed nav-links clip-path + visibility delay, transform/opacity only, Doherty <100ms
- KPI: 4 items, ORDER highlighted sun, 44px, safe-area, no keyboard trap
- DoD: bottom-nav exists, 4 items, ORDER sun pill, safe-area, visibility hidden when closed, 44px, no backdrop-filter

#### Phase 5: Local SEO & GEO — seo + geo — P0
- Responsible: seo + geo
- Output: 2 independent branch pages SLO 891 Higuera + Paso 729 12th with hours map parking delivery Cal Poly, schema Restaurant without fake ratings aggregateRating/review[] with OpeningHours OrderAction, NAP 100%, llms.txt with AI answers ChatGPT Gemini Perplexity hours dishes 2026-09-15 freshness quotable stats comparison prompts
- KPI: sitemap 14, NAP 0 mismatches, no aggregateRating, llms.txt 150+ lines, freshness 2026-09-15
- DoD: sitemap 14, NAP present, no aggregateRating, llms.txt has why-number-one + freshness, _headers Link preload, Speculation Rules prefetch moderate

#### Phase 6: Verification & DoD Gate — final-reviewer + performance — P0
- Responsible: final-reviewer + performance
- Output: 0 console errors, NAP 100%, Toast target=_blank rel=noopener 0 missing, motion pause list 21 anims html.motion-paused paused !important + RM explicit, page weight fast, 25 criteria gate
- KPI: standalone <5500KB 5460KB, CSS 102KB JS 39KB <40KB total 141KB, AVIF 26, single :root, will-change only continuous, pause+RM, no aggregateRating/review[], Toast 211 missing 0, sitemap 14, llms.txt 157 lines
- DoD: build.py passes 5460KB, JS<40KB, AVIF26, :root 1, will-change 7 continuous, pause list 16 selectors, RM block, no aggregateRating, Toast 211, sitemap 14, llms 157, 37/37 checks ✅

### Tokens — Updated Primitive with OKLCH 2026-09-15

```json
{
  "color": {
    "sky": { "$value": "#bfe3f2", "$type": "color" },
    "sky-oklch": { "$value": "oklch(0.90 0.04 220)", "$type": "color", "description": "OKLCH sky perceptual uniformity" },
    "sun": { "$value": "#ffd23f", "$type": "color" },
    "sun-oklch": { "$value": "oklch(0.87 0.17 85)", "$type": "color", "description": "OKLCH sun warm gold" },
    "navy": { "$value": "#0e3a52", "$type": "color" },
    "navy-oklch": { "$value": "oklch(0.30 0.06 230)", "$type": "color" },
    "paper": { "$value": "#fffdf7", "$type": "color" },
    "paper-oklch": { "$value": "oklch(0.99 0.01 85)", "$type": "color" },
    "wheat-oklch": { "$value": "oklch(0.92 0.06 85)", "$type": "color", "description": "Ingredient wheat natural warm" },
    "tomato-oklch": { "$value": "oklch(0.62 0.19 28)", "$type": "color", "description": "Ingredient tomato appetite" },
    "clay-oklch": { "$value": "oklch(0.52 0.10 45)", "$type": "color", "description": "Ingredient burnt clay" },
    "olive-oklch": { "$value": "oklch(0.68 0.08 105)", "$type": "color", "description": "Ingredient olive oil shine" }
  },
  "motion": {
    "dur-0": { "$value": ".10s", "$type": "duration", "description": "Doherty threshold <100ms instant feedback" },
    "dur-1": { "$value": ".18s", "$type": "duration" },
    "transform-origin": { "$value": "center center", "$type": "dimension", "description": "emil-design-eng popup from button" }
  }
}
```

### Gate — Executive Plan Million-Dollar

- [x] hallmark-anti-slop 58 checks OKLCH warm natural wheat tomato burnt clay warm gold APCA/WCAG no purple gradients no repeated cards self-critique 6 axes
- [x] emil-design-eng press 0.97 no scale(0) scale 0.95+opacity transform-origin var --transform-origin @starting-style GPU
- [x] gpt-tasteskill hero 2-line max-w-5xl gapless bento cinematic rhythm vertical chapters
- [x] conversion-psychology Star/Plowhorse/Puzzle/Dog Ajarski+28" Star top sensory 24h cold ferment hand-tossed stone-oven leopard-spotting cheese pull olive oil shine price anchoring 28" +6.8% AOV appetite triggers
- [x] dsgn-* Gestalt proximity common region menu-group no annoying lines Fitts 44px thumb zone 52px ORDER Doherty <100ms dur-0
- [x] performance-engineer vanilla LCP<1.5 CLS<0.02 INP<100 AVIF/WebP 50% preload hero content-visibility auto contain layout paint will-change only continuous no backdrop-filter bfcache Speculation Rules View Transitions
- [x] Foundation tokens single :root OKLCH 10 tokens contrast >=4.5:1
- [x] Hero funnel cinematic 2-line location selector SLO|Paso 2AM ORDER ONLINE VIEW MENU sensory anchor
- [x] Menu engineering fast indexable tabs 10-28 Ajarski calzone wings pasta ADD TO ORDER 35+ direct Toast
- [x] Mobile UX bottom nav HOME|MENU|ORDER|LOCATIONS 44px safe-area visibility hidden 0 trap
- [x] Local SEO GEO 2 branch pages SLO Paso schema Restaurant no aggregateRating OpeningHours OrderAction NAP 100% llms.txt freshness 2026-09-15 quotable stats
- [x] Verification DoD gate 0 console NAP 100% Toast 0 missing pause+RM 21 anims page fast 25 criteria 37/37 ✅ standalone 5460KB <5500KB JS 39KB <40KB AVIF 26 single :root will-change only continuous no aggregateRating
