# Awwwards Taste & Anti-Slop — Leon Lin gpt-tasteskill
Repo: https://github.com/Leonxlnx/taste-skill
Description: Awwwards-Level Design Engineering — ban Inter/Roboto, Hero 2-Line Rule, Gapless Bento Grid dense, Editorial Spacing, Pre-emit Self-Critique, APCA contrast

## Rules — Binding for Antonia's Pizza

1. BAN Inter, Roboto, Open Sans, Lato auto — must use strong character type: Baloo 2, display serif, hand-drawn, or custom — Antonia's uses Baloo 2 + display 800 already PASS
2. Hero 2-Line Rule: hero title max 2 lines, no stacking — use text-wrap balance + max-width 18ch-24ch, font-size clamp, line-height 0.95-1.05
3. Gapless Bento Grid: grid-auto-flow dense, no dead gaps, first child span 2, aspect-ratio preserved, bento 2.0 organized chaos
4. Editorial Spacing: section padding clamp(4rem,10vw,8rem), gap clamp(2rem,5vw,4rem), breathing room between sections
5. Pre-emit Self-Critique: before writing code, critique: is this Awwwards? Would it win? If template → reject
6. APCA contrast: check L* contrast not just WCAG 4.5:1, ensure 60+ Lc for body, 75+ for small
7. No purple gradients — Antonia's warm wheat/tomato/ivory only — oklch warm
8. Tactile grain, hand-drawn sticker -8deg skew, token-based design system

## Installation
```bash
npx skills add https://github.com/Leonxlnx/taste-skill
# or copy to .claude/skills/taste-skill/
```

## Usage for Antonia's
- Call `taste-skill` for hero structure + bento grid
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
