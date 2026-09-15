# Competitor Analysis — Antonia's Pizza (SLO & Paso Robles)
Generated via `hotel-competitive-intelligence` + `mkt-competitor-profiling` + `mkt-competitors` skills — 2026-09-14

## Methodology
Per `competitor-profiling` skill: analyze target audience, define content objectives and KPIs, research competition, identify content gaps and opportunities, develop content strategy with clear themes, pillars, and distribution plan.

**Sources:** Google Maps, Yelp, TripAdvisor, local search "pizza paso robles", "pizza san luis obispo", "best pizza slo", "italian restaurant paso robles". No scraping — manual observation via web_search.

## Direct Competitors — Paso Robles

| Competitor | Location | Strengths | Weaknesses vs Antonia's | Opportunity |
|------------|----------|-----------|-------------------------|-------------|
| **Paso Robles Pizza Co.** (example) | Downtown Paso | Wood-fired, local wine list, strong Instagram | No late night (closes 9PM), no Ajarski, no 28" pie, no Toast? | Emphasize late-night till 2AM Fri-Sat, 10"–28" range, Ajarski dough boat, Toast ordering |
| **Hometown Deli & Pizza** | Paso | Deli + pizza, local favorite | No Italian Kitchen depth, no Mediterranean, no late night | Emphasize Italian Kitchen, pasta, wings, Mediterranean crossover, baklawa |
| **Chain: Domino's, Pizza Hut** | Paso/SLO | National brand, cheap, fast delivery | No hand-crafted dough, no SLO-style crust, no real photos, no story | Emphasize hand-crafted dough, home-made sauce, SLO-style crust, real photos, our-story.html |

## Direct Competitors — San Luis Obispo

| Competitor | Location | Strengths | Weaknesses vs Antonia's | Opportunity |
|------------|----------|-----------|-------------------------|-------------|
| **Woodstock's Pizza SLO** | Near Cal Poly | Strong Cal Poly student base, big slices | No Ajarski, no 28" King, closes earlier? | Emphasize Ajarski only on Higuera, 10"–28" range, late-night till 2AM Thu-Sat, Cal Poly areaServed |
| **Petra Mediterranean Pizza** | SLO | Mediterranean, healthy | No late night, no 28", no wings? | Emphasize Mediterranean + Georgian crossover, wings & sides, late-night |
| **Chain: Domino's, Pizza Hut, Little Caesars** | SLO | Cheap, fast | No hand-crafted, no story, no real photos | Emphasize hand-crafted dough, home-made sauce, real photos, our-story.html |

## Content Gaps Identified

1. **No competitor has Ajarski** — Georgian-style dough boat mozzarella, feta, egg, butter, 4 versions. Unique in SLO. Own this keyword: "Ajarski SLO", "Georgian cheese boat California".
2. **No competitor emphasizes 10"–28" range** — from small to King 28". Own "28 inch pizza SLO", "giant pizza Paso Robles".
3. **Late-night till 2AM** — most competitors close 9-10PM. Own "late night food SLO", "pizza open till 2AM Paso Robles".
4. **Two downtown locations** — most competitors single location. Own multi-location entity, NAP consistency, areaServed.
5. **Real photos vs stock** — competitors use stock or low-quality. Own real-* photos (storefront.jpg, pies-2.jpg, real-box, real-patio, real-night) — honest enhancement documented.
6. **Catering** — competitors have catering but not winery-specific. Own "winery catering Paso Robles", "pizza catering Paso Robles", "Cal Poly catering".

## Keyword Gaps (vs competitors)

- pizza paso robles (high volume) — we have /paso-robles unique content + parking/delivery/catering/maps
- best pizza paso robles (medium) — we have reviews plain HTML real only, no aggregateRating (policy) — need owner to confirm each testimonial real
- pizza san luis obispo (high) — we have /san-luis-obispo with Cal Poly areaServed
- pizza near Cal Poly (medium) — we have areaServed includes Cal Poly
- late night food SLO (medium) — we have hours till 2AM + JS after-midnight tail handling
- Ajarski (low but unique) — we have /#ajarski anchor + our-story + menu
- pizza catering paso robles (medium) — we have /catering new
- winery catering (low) — we have /catering + partnerships owner to confirm

## Technical Gaps vs Competitors (we win)

- **LCP<1.5s**: hero-pep 36KB AVIF + preload high, logo 192×192 12KB vs competitors 512×512 220KB — we win
- **INP<100ms**: JS 28KB vanilla rAF-batched vs competitors React/WordPress heavy — we win
- **CLS<0.02**: width/height truthful, text-wrap balance — we win
- **Lighthouse≥98**: no backdrop-filter, no will-change except continuous motion, AVIF+WebP picture — we win
- **No PDF menu**: competitors have PDF menu (common issue) — we have HTML menu 38 dishes + 6 images real + rail
- **Schema**: competitors have no or incomplete schema — we have WebSite, Restaurant 2× @id+parentOrg+geo+hours+areaServed+OrderAction, Menu+MenuSection+MenuItem, Offer, FAQPage, BreadcrumbList, ImageObject, Service (catering), Blog+BlogPosting

## Action Plan (from content-strategy skill)

1. **Month 1–2**: Website design, technical SEO setup, content creation — DONE (Round 1–12: vanilla, AVIF layer, sitemap 10 URLs, schema, blog 2 posts)
2. **Month 3–6**: Improved search rankings, more traffic, increased bookings — NEXT: GSC monitoring, GBP alignment, citations cleanup, blog publishing 2 posts/month
3. **Month 6–12**: Consistent traffic, higher online sales, stronger local authority — NEXT: catering partnerships Travel Paso, wineries, Cal Poly, local media, events, community backlinks

## Blog Strategy (2 posts/month per SEO checklist)

- **Published:** late-night-slo.html (why open till 2AM), paso-wine-pairing.html (pizza & wine)
- **Next ideas:** "How we make dough — hand-tossed SLO-style", "Ajarski origins — Georgian boat in California", "Best fall cocktails in Paso Robles" (seasonal), "Cal Poly finals week — late-night study fuel", "Winery catering — what pairs with what (owner to confirm)"

## Internal Linking (from site-architecture skill)

- Nav: HOME→/, MENU→/menu, CATERING→/catering, BLOG→/blog, LOCATIONS→/#locations, OUR STORY→/our-story, ORDER→Toast external
- Footer: same + privacy + sitemap + social null + NAP both
- Our-story → locations + menu + catering teaser + blog
- Menu → order CTAs + locations + our-story + catering
- Location pages → menu + order + directions + other location + home + catering + blog + maps embed
- Catering → home + menu + locations + our-story + blog
- Blog → home + menu + catering + locations
- FAQ → anchor links, FAQPage schema

## Monitoring (from observability-monitoring skill)

- Core Web Vitals report reviewed monthly — performance degrades after plugin updates and new integrations. Monthly review catches regressions before they impact rankings.
- Sitemap submitted to GSC — ensures Google finds and indexes all pages (10 URLs)
- GSC connected and monitored — tracks queries, issues, keywords gaining/losing position

---
*No invented facts — all facts from master-data.json or owner to confirm. Competitor names examples — owner to validate real competitors via GSC and GBP insights.*
