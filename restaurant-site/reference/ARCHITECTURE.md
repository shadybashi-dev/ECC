# Antonia's Pizza — ARCHITECTURE.md
Vanilla decision vs Astro proposal — 2026-09-14

## Decision: Stay Vanilla in `antonias/` (deploy folder)

**Owner binding (HANDOFF.md §9):**
- Vanilla HTML/CSS/JS only, no React/Tailwind/Astro/build step/CDN/npm.
- `html.js` gating (0,2,1)+!important, null-safe selectors, transform/opacity/filter only, infinite anims in pause+RM lists.
- `build.py` at `restaurant-site/build.py` (one level above antonias/).
- Owner: "طور موقعهم (لا تعيد بنائه)" — develop their files, keep look/motion.

**Blueprint proposal (Astro+Tailwind+React Islands) is excellent for greenfield, but conflicts with binding.** Solution: stay vanilla in `antonias/`, achieve same perf targets via vanilla optimizations. If owner wants Astro later, create separate `antonias-astro/` as experiment, not replacement.

## How we hit Astro-level targets with vanilla

| Target | Astro way | Vanilla way (implemented) | Current |
|--------|-----------|---------------------------|---------|
| LCP<1.5s | Image optimization, island hydration | hero-pep 36KB AVIF q55 + preload fetchpriority high before stylesheet + img fetchpriority high decoding async + logo 192×192 12KB vs 512×512 220KB (-94%) + self-preconnect deleted | 36KB AVIF meets |
| INP<100ms | Partial hydration | JS 28KB vanilla single IIFE, rAF-batched magnetic, rect cached on enter, IntersectionObserver for reveals/counters/wheel gated onScreen, scroll listener passive only header | 28KB meets |
| CLS<0.02 | Astro layout | width/height truthful, text-wrap balance, centre disc height 44% + width 44% not dependent on aspect-ratio vs content, fonts self-hosted woff2 swap | <0.02 meets |
| Lighthouse≥98 | Astro perf | No backdrop-filter (removed from header.scrolled + menu-rail, alphas .97/.98), no will-change except continuous motion (marquees, gallery, rotor), AVIF+WebP picture, lazy except LCP, preloader deleted, body.loaded gates hero animation on DOMContentLoaded gated html.js so no-JS stays visible | ≥98 expected |
| Home JS<40KB | Islands | main.js ~28KB vanilla | meets |
| Hero AVIF<180KB | Astro image | hero-pep 36KB AVIF | meets |
| Design system | Tailwind tokens | css/style.css single :root (merged 3 → 1, grep -c '^:root{' must stay 1), tokens sky #bfe3f2 sun #ffd23f navy #0e3a52 paper #fffdf7 red-deep #c03a24 gold-ink #8f6116, --radius 32px, --container min(1240px,92vw) | done |
| Routing | Astro file-based | _redirects clean URLs 200, old 301, sitemap 14 URLs (home, menu, slo, paso, our-story, catering, blog, blog/late-night-slo, blog/paso-wine-pairing, order, faq, videos, promo-videos, privacy), canonicals, robots allow answer engines | done |
| Data | Astro content collections | reference/restaurant-master-data.json single source, NAP consistent, consumed by all pages | done |
| Locations | Astro dynamic | 2 separate HTML + unique Restaurant schema @id+parentOrg+geo+openingHours+areaServed+OrderAction, unique content, unique photos | done |
| SEO | Astro SEO plugin | Manual head, schema validated, no aggregateRating/review[] (self-serving policy), FAQPage, BreadcrumbList, ImageObject | done |
| A11y | Astro a11y | html.js gating (0,2,1), wheel listbox ARIA single tab stop arrow/Home/End aria-selected aria-activedescendant, pause toggle html.motion-paused 21 anims, RM explicit list not *, mobile nav visibility hidden delayed, marquee clones aria-hidden node-by-node | done |

## What Astro would add (if owner wants separate experiment)
- Content collections for menu (but we have 38 dishes static, no prices, so low benefit)
- Image component (we already have AVIF layer 26 images 2056KB q55 vs JPEG 4098KB -50% via picture)
- Islands for wheel (but wheel already IIFE, onScreen gated, no framework needed)
- Tailwind (but we have single file design system, no build step, owner forbids)

## File map
- `antonias/css/style.css` — entire design system, one :root, no duplicate, no dead .hero-badge/.float-chip/.price-tag, no backdrop-filter, no will-change except allowed.
- `antonias/js/main.js` — all interactions, one IIFE, $/$$ helpers, null-safe, motionMQ live MediaQueryList, onMotionChange(fn), prefersReduced let, play() checks motionPausedByUser.
- `restaurant-site/build.py` — generates standalone.html inlined for preview, not deploy.

## Gates
- build.py passes, 0 FAIL harness, no console errors, responsive no overflow, wheel 8 distinct labels true, alt truthful, schema valid, sitemap 14 URLs, NAP consistent, Toast ×189 https target=_blank rel=noopener, AVIF 26, WebP 26, JS 32KB, CSS 76K, hero AVIF 36KB, standalone 5420KB.

## Future
- If owner approves Astro, create `restaurant-site/antonias-astro/` with same NAP, same Toast, same real photos, same content, but Astro+Tailwind+React Islands. Keep `antonias/` vanilla as production until Astro passes same DoD + Lighthouse≥98 + owner visual approval.
