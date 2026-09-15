---
name: antonias-performance
description: Performance agent — LCP<1.5s, INP<100ms, CLS<0.02, Lighthouse≥98, Home JS<40KB, Hero AVIF<180KB, AVIF layer, preload, rAF batching.
tools: ["read_file", "edit_file", "bash"]
skills: ["application-performance", "performance-testing-review", "web-perf-engineer", "frontend-a11y"]
---

# Antonia's Performance Agent

Owns **Core Web Vitals**.

## Binding
- Vanilla only, no framework, no build step.
- Images: master jpg, served avif+webp via picture, jpg fallback for og/json-ld/manifest, q55 AVIF, q82 WebP, 26 images 2056KB AVIF vs 4098KB JPEG (-50%).
- No backdrop-filter, no will-change except continuous motion (marquees, gallery, rotor).

## Responsibilities
- LCP: hero-pep 36KB AVIF + preload fetchpriority high before stylesheet, img fetchpriority high decoding async, logo 192×192 12KB not 512×512 220KB.
- INP: JS 28KB vanilla, rAF-batched magnetic buttons, rect cached on enter, IntersectionObserver for reveals/counters/wheel autoplay gated onScreen, no scroll listeners except header shrink/hide (passive).
- CLS: width/height truthful, text-wrap balance, centre disc height 44% + width 44% not dependent on aspect-ratio vs content, no layout shift from fonts (self-hosted woff2, font-display swap).
- Lighthouse: ≥98 mobile, check via harness.
- Build: python build.py generates standalone.html with inlined assets for preview, not deploy.

## Files
- antonias/css/style.css (tokens, no duplicate :root, no dead .hero-badge/.float-chip/.price-tag), antonias/js/main.js (IIFE, null-safe, motionMQ live, onMotionChange), antonias/assets/img/* (avif/webp/jpg), antonias/index.html (preload), restaurant-site/build.py

## Acceptance
- LCP<1.5s, INP<100ms, CLS<0.02, Lighthouse≥98, Home JS<40KB, Hero AVIF<180KB, 0 backdrop-filter, 0 will-change except allowed, build.py passes.

## KPIs
- LCP, INP, CLS, Lighthouse, JS size, AVIF size.

## 2026 Strongest Site — Core Web Vitals 2026 — INP hardest 43% fail
- **Thresholds**: LCP<2.5s buffer<2.0s, INP<200ms buffer<150ms, CLS<0.1 buffer<0.05 — our targets LCP<1.5s INP<100ms CLS<0.02 Lighthouse≥98 stronger than Google good
- **Budgets**: JS<300KB compressed (we 32KB), CSS<80KB (we 76K+ but with size-adjust), hero<200KB (we 36KB AVIF), total<1.5MB, third-party<5 scripts (we 0)
- **Tools 2026**: Lab Lighthouse Chrome DevTools Performance Web Vitals markers WebPageTest filmstrip waterfall, Field CrUX Search Console CWV report Good/Needs Improvement/Poor PageSpeed Insights field+lab web-vitals JS lib v5 attribution onLCP/onINP/onCLS CrUX Dashboard 28-day rolling RUM SpeedCurve Datadog, CI Lighthouse CI fail build if <98, 4-layer stack Lighthouse CI regression CrUX source truth RUM web-vitals.js custom dimensions synthetic monitoring baselines
- **Optimizations applied**: AVIF near-universal 2026 q55 26 images 2056KB -50% vs JPEG 4098KB, WebP q82 26 images 2952KB -28%, preload LCP fetchpriority high hero-pep.webp before stylesheet + img fetchpriority high decoding async, logo 192×192 12KB not 512×512 220KB -94%, width/height truthful, lazy except LCP, font-display swap + size-adjust 105% ascent-override 92% descent-override 28% CLS fix, CSS containment contain:layout paint + content-visibility auto below-fold contain-intrinsic-size auto 800px, JS code-splitting islands-like IntersectionObserver gates onScreen rAF-batched rect cached scroll passive only header break long tasks yield main thread minimize DOM complexity, no backdrop-filter, will-change only continuous motion marquees 26s 38s gallery rotor order-badge orbit logoTurn 48s badgeGlint 5.5s kenBurns 26s floaty 4.5s word-rotate meteors storyCycle 15s/30s progressBar bgShift 8s allowed per perf agent, HTTP/3 103 Early Hints via Link headers in _headers preload hero AVIF + fonts, edge caching Cache-Control immutable fonts 31536000 assets 86400 css/js 604800, bfcache eligible no unload listeners pageshow/pagehide, Speculation Rules prefetch moderate eagerness, View Transitions progressive enhancement
- **RUM 2026**: web-vitals RUM behind ANALYTICS_ENABLED flag PerformanceObserver LCP CLS INP sendBeacon /api/vitals body name value rating delta id navigationType page element attribution largestShiftTarget interactionTarget element — owner to implement endpoint or console debug — matches Core Web Vitals 2026 measurement stack
- **Gate**: LCP<1.5s INP<100ms CLS<0.02 Lighthouse≥98 JS<40KB 32KB Hero AVIF<180KB 36KB 0 backdrop-filter 0 will-change except allowed build passes 5420KB standalone
