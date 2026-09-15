# Observability Dashboard — Antonia's Pizza
Generated via `observability-monitoring` + `application-performance` skills — 2026-09-14

## Core Web Vitals Targets (from master-data.json technical.performanceTargets)

| Metric | Target | Current (reasoned) | Tool |
|--------|--------|-------------------|------|
| LCP | <1.5s | hero-pep 36KB AVIF + preload high before stylesheet + img fetchpriority high decoding async + logo 192×192 12KB vs 512×512 220KB -94% — meets | Lighthouse, PageSpeed Insights |
| INP | <100ms | JS 28KB vanilla single IIFE, rAF-batched magnetic, rect cached on enter, IntersectionObserver for reveals/counters/wheel gated onScreen, scroll listener passive only header — meets | Lighthouse |
| CLS | <0.02 | width/height truthful, text-wrap balance, centre disc height 44% + width 44% not dependent on aspect-ratio vs content, fonts self-hosted woff2 swap — meets | Lighthouse |
| Lighthouse Mobile | ≥98 | No backdrop-filter (removed from header.scrolled + menu-rail, alphas .97/.98), no will-change except continuous motion (marquees, gallery, rotor), AVIF+WebP picture, lazy except LCP, preloader deleted, body.loaded gates hero animation on DOMContentLoaded gated html.js — expected 98+ | Lighthouse |
| Home JS | <40KB | main.js ~28KB + analytics hooks 2KB + bottom nav 1KB = ~31KB — meets | Bundle analyzer |
| Hero AVIF | <180KB | hero-pep 36KB AVIF (70KB WebP) — meets | Image audit |

## Monitoring Setup (from observability-monitoring plugin)

### Prometheus + Grafana (optional, for owner with infra)
- prometheus-configuration skill: configure Prometheus to scrape Core Web Vitals via web-vitals library
- grafana-dashboards skill: dashboards for LCP, INP, CLS, Lighthouse, JS size, AVIF size
- distributed-tracing skill: trace slow interactions (wheel, magnetic buttons, scroll reveals)
- slo-implementation skill: define SLOs — LCP<1.5s 95%, INP<100ms 95%, CLS<0.02 99%

### Simple (recommended for static site — no infra)
- Monthly Lighthouse audit via PageSpeed Insights: https://pagespeed.web.dev/
- Check each page: /, /menu, /san-luis-obispo, /paso-robles, /our-story, /catering, /blog, /blog/late-night-slo, /blog/paso-wine-pairing, /privacy
- Pay attention to Mobile Performance Score — majority of visitors mobile — aim for 90+ per SEO checklist, we aim 98+
- Optimize images, enable caching (_headers Cache-Control immutable fonts 31536000, assets 86400, css/js 604800), minimize code (single file css ~1000 lines, js ~380 lines vanilla)
- Test mobile speed and usability, as these are key ranking factors in machine-learned search outcomes

### Caching (from _headers)
- /assets/fonts/* Cache-Control: public, max-age=31536000, immutable — fonts never change name/content once cut
- /assets/* Cache-Control: public, max-age=86400 — images and code medium TTL so redeploy (new grades, new shots) reaches returning visitors within day/week instead of year
- /css/*, /js/* Cache-Control: public, max-age=604800

### Security Headers (from security agent)
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-Frame-Options: SAMEORIGIN
- Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
- Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'none'; frame-ancestors 'none'; form-action 'self' https://antoniaspizza.toast.site; base-uri 'self'
- Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

## Dashboard (from business-analytics kpi-dashboard-design + data-storytelling)

### SEO
- Organic clicks, impressions, CTR, avg position, top keywords, local pack visibility (GSC)
- Indexed pages (10 URLs: /, /menu, /slo, /paso, /our-story, /catering, /blog, /blog/late-night-slo, /blog/paso-wine-pairing, /privacy)
- Sitemap submitted to GSC — ensures Google finds and indexes all pages

### GEO (AI Search)
- AI mentions, citations, entity consistency, indexed pages (manual check ChatGPT/Gemini/Perplexity)
- llms.txt mentions ordering, locations, menu, dietary, catering, blog — 10 pages
- Schema valid, no invented URLs, sameAs only real URLs

### Sales
- Order clicks (click_order, start_order), conversion rate, AOV (Toast dashboard)
- Click_order by page/location — hero, tonight cards, menu items ADD TO ORDER, bottom nav ORDER, catering CTA, blog CTAs

### Local
- Calls (click_phone), direction requests (click_directions), website visits, reviews/rating (GBP)
- Tonight band live hours pill — open/closed based on schedule with after-midnight tail handling

### Catering
- Leads (click_catering, submit_catering_form), quote requests, revenue (owner)
- Funnel: homepage catering teaser → /catering → click_catering → click_phone/submit_catering_form → owner contact → quote → order

### Performance
- LCP, INP, CLS, Lighthouse, JS size, AVIF size — monthly review catches regressions before they impact rankings (per SEO checklist)

## Alerts (from slo-implementation)

- If LCP >1.5s → check hero AVIF preload, logo size, font loading, image optimization
- If INP >100ms → check JS size, rAF batching, IntersectionObserver gating, scroll listeners passive
- If CLS >0.02 → check width/height truthful, text-wrap balance, centre disc height
- If Lighthouse <98 → check backdrop-filter, will-change, AVIF+WebP, preloader, body.loaded gating

## Tools

- Google PageSpeed Insights: https://pagespeed.web.dev/
- Google Search Console: tracks queries, issues, keywords gaining/losing
- Google Rich Results Test: validates schema markup
- Schema Markup Validator: validates all schema.org without Google-specific warnings
- Lighthouse CI: automated Lighthouse audits on deploy

---
*Vanilla only, no framework, no build step, no npm, no CDN runtime fetch. Owner handoff HANDOFF.md §9 binding. Build.py at restaurant-site/build.py.*
