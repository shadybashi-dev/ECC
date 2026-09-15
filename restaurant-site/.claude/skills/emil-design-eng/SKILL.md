# Emil Kowalski — Spring Physics Motion
Repo: https://github.com/emilkowalski/skills
Description: Spring physics, tactile press, no scale(0), origin-aware popovers, 60fps GPU

## Rules — Binding for Antonia's Pizza

1. Buttons :active transform scale(0.97) — tactile micro-interaction 0.15s cubic-bezier(0.2,0,0,1)
2. Ban scale(0) — use scale(0.95) + opacity 0 for enter, prevents dead start
3. Spring: cubic-bezier(.34,1.56,.64,1) or .22,1,.36,1 for natural deceleration
4. Origin-aware popovers: popover transform-origin from click position
5. 60fps GPU: translateZ(0) translate3d(0,0,0) rotate(0deg) will-change transform backface-visibility hidden
6. Deceleration curve: sw-disc 4.6s cubic-bezier(.12,.72,.12,1) — smooth brake
7. Inertia momentum wheel already uses GPU
8. All motion registered in pause + reduced-motion lists

## Installation
```bash
npx skills add https://github.com/emilkowalski/skills
# or copy to .claude/skills/emil-design-eng/
```

## Usage for Antonia's
- Call `emil-design-eng` for hero structure + bento grid
- Apply spring physics + tactile press + GPU 60fps
- Ensure Awwwards-level, anti-slop, no purple gradients, no Inter/Roboto
- Ensure editorial spacing + gapless bento dense + 2-line hero
- Ensure WCAG 2.2 AA + Core Web Vitals + 0 console errors
- Persistent design system tokens

## Pre-emit Self-Critique (Required before code)
- Is this Awwwards-level? Would it win SOTD?
- Is it slop/template? If yes → reject and redesign with strong character type + layered shadows + optical centering
- APCA contrast check: body 60+ Lc, small 75+ Lc
- Hero 2 lines max?
- Bento gapless dense?
- Motion spring not linear? GPU accelerated?
- No purple gradients? No harsh black shadows?
- Editorial spacing breathing room?
- 1-2 clicks order? Price anchoring 28"?

## Status
Installed: 2026-09-15
Applied to: antonias/css/style.css + index.html + js/main.js
Build: standalone 3930KB <5500K
