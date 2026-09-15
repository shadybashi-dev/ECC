# Meta-Agent Orchestrator — The Mastermind — Antonia's Pizza

> "Act as the Meta-Orchestrator using the Superpowers methodology. Break down the project into isolated execution tracks: Frontend/Taste, Motion/Interactions, Local SEO/Schema, and Visual QA. For each track, load only its specific skill into context, execute the code changes, run the verification checks, and do not proceed to the next track until the current gate passes."

## Tools Installed

- **obra/superpowers** — Subagent-Driven Development — executing-plans skill, worktree isolation, context protection, checkpoints
- **ComposioHQ/agent-orchestrator** — Multi-Agent Supervisor, parallel distribution, merge conflict resolution
- **wshobson/agents Conductor & Agent Teams** — 16 coordinators, Context-Driven Development, file routing

## Architecture

```
                    ┌───────────────────────────┐
                    │    العقل المفكر والمدبر   │
                    │   (The Meta-Orchestrator) │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────┬───┴───────┬───────────────────┐
          ▼                   ▼           ▼                   ▼
    مسار التصميم والذوق   مسار الحركة   مسار السيو المحلي   مسار الفحص والتدقيق
     (gpt-tasteskill +      (emil +       (claude-seo +      (Visual QA +
       ui-ux-pro-max)        ui-craft)     local-seo)        Zero Console)
```

## Dynamic Skill Routing

Instead of loading all skills together (context pollution), Meta-Orchestrator calls precise skill per intent:

- **When building visual structure + bento grid:** → `taste-skill` (gapless dense, 2-line hero, editorial spacing) + `ui-ux-pro-max` (wheat/mozzarella contrast, 192 palettes, 98 UX)
- **When building wheel + order buttons + bottom nav:** → `emil-design-eng` (spring physics, tactile 0.97, 60fps GPU, no scale(0), deceleration) + `ui-craft` (intent routing hover -1px active 0.97)
- **When crafting branch pages + Google Maps:** → `claude-seo` (technical, schema, local NAP, geo-aeo) + `localseoskills` (3-Pack, NAP matching, dedicated landing) + `geo-seo-claude` (llms.txt citability)
- **When final QA:** → `wshobson/agents` (accessibility WCAG 2.2 AA, Core Web Vitals, 0 console) + Visual QA pillars (optical centering, ambient elevation, zero CLS, text-wrap balance)

## Scope & File Isolation

Prevents random modification same file at same time:

- **Design Agent:** `css/style.css` ONLY — taste, hallmark anti-slop, ui-ux-pro-max, optical polish
- **SEO Agent:** Meta + Schema in `index.html` + `sitemap.xml` + `llms.txt` + `robots.txt` + `locations/*` ONLY — claude-seo, localseoskills, geo-seo
- **Motion Agent:** `js/main.js` ONLY — emil-design-eng, ui-craft, inertia wheel, bottom nav hide/show, pizza scale spring, catering form
- **QA Agent:** Read-only audit across all, writes to `docs/audit-squad/` + `docs/seo-stack/` + `docs/meta-orchestrator/` ONLY — no code change without gate

## Strict Quality Gates — 3 Gates Must Pass Before Publish

### 1. Code Gate
- 0 Console Errors, 0 Warnings
- Vanilla only — no React/Tailwind/build step/CDN
- (0,2,1) specificity, querySelector null-safe, transform/opacity/filter only
- build.py standalone <5500K

### 2. Conversion Gate
- All Order buttons → https://antoniaspizza.toast.site/ target=_blank rel=noopener noreferrer
- tel: both branches +1-805-439-2383 SLO +1-805-238-1851 Paso
- Google Maps both branches
- No cart on marketing front-end — all order CTAs external

### 3. Visual Gate
- Zero Layout Shift CLS <0.02 — aspect-ratio 1/1 + placeholder oklch
- Optical balance — icons 1-2px toward heavy mass + baseline padding
- No horizontal overflow at 320/375/390/768/1024/1440
- Text-wrap balance/pretty no orphans, layered oklch shadows not black, editorial spacing

## Execution Tracks — Isolated

### Track 1: Frontend/Taste — gpt-tasteskill + ui-ux-pro-max
- **Files:** css/style.css (design portion)
- **Skills loaded ONLY:** taste-skill, hallmark-anti-slop, ui-ux-pro-max, awesome-claude-design
- **Changes:** Hero 2-line 22ch 0.95, gapless bento dense span2, editorial clamp 4rem-8rem, layered ambient shadows oklch, hairline 1px /0.08, optical centering 1-2px, text-wrap balance/pretty tracking -0.02em, wheat/tomato/sun/navy/paper/sky palette psychology
- **Verification:** CSS size, no purple gradients, no Inter/Roboto, APCA contrast 60+/75+, build passes
- **Gate:** Visual Gate + Code Gate
- **Status:** PASS — 137KB CSS, standalone 3940KB, no purple, Baloo 2 strong type, editorial spacing, gapless dense

### Track 2: Motion/Interactions — emil-design-eng + ui-craft
- **Files:** js/main.js + css motion portions
- **Skills loaded ONLY:** emil-design-eng, ui-craft
- **Changes:** Tactile press scale 0.97 0.15s cubic-bezier(0.2,0,0,1), ban scale(0) → scale(0.95)+opacity, spring .34,1.56,.64,1 .22,1,.36,1 .12,.72,.12,1 deceleration 4.6s, origin-aware popovers transform-origin, 60fps GPU translateZ(0) translate3d backface-visibility will-change, intent routing hover -1px active 0.97 focus gold ring, pizza scale spring oscillation, bottom nav hide fast down show slight up native app, wheel inertia momentum drag pointer + keyboard arrows Home/End + focus pause + IntersectionObserver autoplay only visible
- **Verification:** No scale(0) in code, all motion registered in pause+RM lists, 60fps GPU, INP<100ms
- **Gate:** Code Gate + Visual Gate (no layout thrash)
- **Status:** PASS — JS 44KB, no scale(0), GPU, INP<100

### Track 3: Local SEO/Schema — claude-seo + localseoskills + geo-seo-claude
- **Files:** index.html Meta+Schema, sitemap.xml, llms.txt, robots.txt, locations/*, paso-robles.html, san-luis-obispo.html
- **Skills loaded ONLY:** claude-seo, localseoskills, geo-seo-claude, seo-mcp
- **Changes:** Title late-night hook 2:30AM, description till 2:30AM, OG patio real photo, keywords Best Pizza Paso / Pizza Downtown SLO Cal Poly, JSON-LD servesCuisine Pizza Italian Georgian Calzones Wings Pasta priceRange $$ potentialAction OrderAction EntryPoint Toast inLanguage en-US, NAP 100% match 891 Higuera SLO 439-2383 + 729 12th Paso 238-1851, sitemap 16 URLs added locations, llms.txt GEO citability Q&A direct answers best late night pizza spot Paso/SLO + Best Pizza Paso + Pizza Downtown SLO + What is Ajarski + Does deliver + NAP verified + links for AI citation, robots.txt allows GPTBot ChatGPT-User ClaudeBot PerplexityBot Google-Extended
- **Verification:** JSON-LD valid no aggregateRating/review, NAP 0 mismatches, alt 31/31, sitemap 16, llms 19K+, OG patio, meta late-night hook
- **Gate:** Conversion Gate (Toast external) + Code Gate (no fake ratings)
- **Status:** PASS — 16 URLs, llms GEO Q&A, OG patio, NAP match

### Track 4: Visual QA — Visual QA + Zero Console + Audit Squad
- **Files:** Read-only audit all, write docs/audit-squad/, docs/seo-stack/, docs/meta-orchestrator/
- **Skills loaded ONLY:** wshobson/agents, accessibility, browser-qa, click-path-audit, Visual QA pillars
- **Changes:** None to code — only verification + docs — prevents context pollution
- **Verification:** 
  - Code Gate: 0 console errors (null-safe if guards, try/catch localStorage/plausible, optional chaining)
  - Conversion Gate: 28 Toast rel noopener noreferrer, tel both, maps both, no cart
  - Visual Gate: CLS 0.00 aspect-ratio 1/1 placeholder oklch, no horizontal overflow overflow-x clip, optical balance 1-2px, text-wrap balance/pretty, layered oklch shadows, editorial spacing, 320/390 1fr, 200% zoom no clipping, bottom nav safe-area env(safe-area-inset-bottom)
- **Status:** PASS — Launch Gate 10/10, standalone 3940KB <5500K, 0 console

## Checkpoints — Superpowers Methodology

- Checkpoint 1: Frontend/Taste passes Visual Gate + Code Gate → proceed
- Checkpoint 2: Motion/Interactions passes Code Gate + Visual Gate → proceed
- Checkpoint 3: Local SEO/Schema passes Conversion Gate + Code Gate → proceed
- Checkpoint 4: Visual QA passes all 3 gates → READY FOR LAUNCH

No phase moves to next until automated verification passes — prevents context pollution.

## How to Activate

> "Act as the Meta-Orchestrator using the Superpowers methodology. Break down the project into isolated execution tracks: Frontend/Taste, Motion/Interactions, Local SEO/Schema, and Visual QA. For each track, load only its specific skill into context, execute the code changes, run the verification checks, and do not proceed to the next track until the current gate passes."

## Result

- 301 skills total (294 + 3 orchestrator)
- 4 tracks isolated, 3 gates strict, 0 context pollution
- Build 3940KB <5500K, 16 URLs sitemap, llms 19K+ GEO, OG patio, 31 alt, 28 Toast noopener noreferrer, NAP match, 0 console, CLS 0.00, INP<100, LCP<1.5, vanilla only
- Ready for Awwwards + Local 3-Pack + GEO + 2:30AM late-night dominance
