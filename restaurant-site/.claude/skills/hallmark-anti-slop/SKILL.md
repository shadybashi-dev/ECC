# Hallmark — Anti-Slop Design Skill — 58 criteria
Repo: https://www.usehallmark.com/
Description: 58 strict checks preventing purple gradients, dead cards, template slop

## Rules — Binding for Antonia's Pizza

1. No purple/violet gradients — Antonia's uses sun gold #FFD23F, tomato, navy, paper ivory only
2. No dead cards — every card must have hover transform, shadow layer, interaction
3. Pre-emit self-critique: list 3 reasons design is not slop before emit
4. APCA contrast check before code
5. No generic stock icons — use custom or text
6. No Inter/Roboto — strong type only
7. No harsh black shadows — layered oklch ambient only
8. No 0 4px 10px rgba(0,0,0,0.3) — use layered elevation
9. Ensure editorial spacing, not cramped
10. Ensure hero not 3+ lines

## Installation
```bash
npx skills add https://www.usehallmark.com/
# or copy to .claude/skills/hallmark-anti-slop/
```

## Usage for Antonia's
- Call `hallmark-anti-slop` for hero structure + bento grid
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
