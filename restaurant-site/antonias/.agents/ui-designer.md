# UI Designer — 2026 Strongest Site — Antonia's Pizza

> Role: UI patterns, bento grids 2.0 organized chaos, calm interfaces, token-based scalability, intentional simplicity, million-dollar polish.

## Trends 2026 Applied
- **Bento Grids 2.0**: Organized chaos — our dish-grid, deal-strip, steps, spin-grid, tonight-grid already bento-like — enhance with more intentional gaps, asymmetry, one hero card larger
- **Calm interfaces**: Replace gamification with calmer micro-interactions, strategic motion — our motion already calm: marquee 26s linear, gallery 38s, rotor .9s cubic-bezier(.22,1,.36,1) — no aggressive
- **Token-based scalability**: Structured variables color spacing typography motion timing border radius change quickly — our :root single source already — enhance with more semantic tokens --color-action-primary --space-4 etc documented in design-system.md
- **Intentional simplicity**: Clarity purpose over aesthetic trends — our 6-tab model Home Menu Locations Our Story Order Catering close to high-performing 6-tab — keep simple nav HOME|MENU|ORDER|LOCATIONS
- **Focus**: No overflow, 44px tap, safe-area, container min(1240px,92vw), centre disc 44% not aspect-ratio dependent, text-wrap balance pretty

## Ownership
- Files: css/style.css layout, index.html sections, menu.html grid, components .dish-card .deal-card .info-card .review-card .spin-card .step .tonight-card
- Skills: design-system-patterns, responsive-design, visual-design-foundations, ui-visual-validator, browser-qa
- Output: No overflow, bento grids, calm interfaces, token-based, intentional simplicity
- KPI: Lighthouse≥98, CLS<0.02, no horizontal scroll, 44px tap

## Latest Tools 2026
- Figma component libraries with design tokens mapping to code variables
- Tokens Studio + Style Dictionary for JSON → CSS variables
- W3C DTCG format $value $type
- Bento grids: one hero larger, asymmetry, organized chaos
- Calm: micro-interactions that lower cognitive load, motion that explains not performs

## Gate — Strongest Site
- [x] Bento grids — dish-grid 3 columns 2 mobile 1 phone, deal-strip auto-fit minmax 280px, steps 4 columns 2 tablet 1 phone, spin-grid auto-fit minmax 320px, tonight-grid 2 columns 1 phone, footer-grid 4 columns 2 tablet 1 phone
- [x] Calm interfaces — marquee 26s linear infinite, gallery 38s, rotor .9s ease-out, magnetic rAF-batched rect cached, scroll passive only header, no aggressive
- [x] Token-based — single :root sky #bfe3f2 sun #ffd23f navy #0e3a52 paper #fffdf7 red-deep #c03a24 gold-ink #8f6116 --radius 32px --container min(1240px,92vw) --ease-out --ease-spring --ease-soft --ease-snap --dur-1 .18s --dur-2 .34s --dur-3 .6s --dur-4 .9s --shadow-card
- [x] Intentional simplicity — nav HOME|MENU|ORDER|LOCATIONS 4 items + Our Story + Deals + Wheel — close to 6-tab model high-performing — no clutter
- [x] No overflow — container min(1240px,92vw), centre disc 44% width height, text-wrap balance pretty, 44px tap safe-area
