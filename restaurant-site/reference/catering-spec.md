# Catering Spec — Antonia's Pizza
Funnel + Content + SEO — 2026-09-14 — Owner to confirm details

## Current State
- `reference/restaurant-master-data.json` catering.offered=true, note: owner to confirm catering menu, min order, lead time.
- No dedicated catering page — homepage has teaser only.
- Candidate for next content page: /catering

## Owner Questions (must answer before building page, never invent)

1. Catering menu: which items? Pizza 10"-28", Ajarski, Pasta, Wings & Sides, Salads, Sandwiches? Same as regular menu or separate catering menu?
2. Min order: $ amount or # of people? e.g., $150 min, 10 people min?
3. Lead time: 24h? 48h? Same day possible?
4. Delivery areas: same as regular (SLO, Paso, Templeton, Cal Poly, Avila, Los Ranchos) or extended? Delivery fee?
5. Service: drop-off only? Setup? Staffed? Plates/utensils included?
6. Dietary: vegetarian, vegan cheese, gluten-free available for catering?
7. Contact: phone (805)439-2383 / (805)238-1851 same? Email? Form? Toast catering link?
8. Photos: real catering photos (box, patio, feast) — owner to provide.
9. Pricing: per person? Packages? Deals? Owner to provide if wants published, otherwise "Contact for quote" (no invented prices).
10. Winery catering: partnerships with wineries? Travel Paso? Events?

## Proposed Page Structure: /catering

```
 /catering
├── Hero: "Catering — Hand-crafted pies for your event" + ORDER CATERING CTA (phone + Toast if available)
├── What we cater: pizza, Italian, winery, corporate, Cal Poly, birthdays, weddings (facts only)
├── Menu: categories from catering menu (owner confirms)
├── How it works: min order, lead time, delivery areas, service
├── Photos: real box, patio, feast, real-* owner untouched
├── Areas: SLO, Paso Robles, Templeton, Atascadero, Cal Poly, Avila Beach, Los Ranchos, Santa Margarita
├── FAQs: min order, lead time, dietary, delivery fee, setup, cancellation
├── CTA: Call (805)439-2383 + (805)238-1851 + Directions + Order via Toast (if catering link)
└── Internal links: home, menu, locations, our-story
```

## SEO

| Keyword | Page | Content |
|---------|------|---------|
| pizza catering paso robles | /catering | Address 729 12th St, Phone (805)238-1851, delivery areas Paso/Templeton/Atascadero |
| pizza catering san luis obispo | /catering | Address 891 Higuera St, Phone (805)439-2383, delivery areas SLO/Cal Poly/Los Ranchos/Avila |
| winery catering | /catering | Winery partnerships, Travel Paso |
| italian catering | /catering | Italian catering, pasta, pizza |
| corporate catering paso robles | /catering | Corporate, events |
| Cal Poly catering | /catering | Cal Poly areaServed |

- Schema: no MenuItem prices unless owner provides, FAQPage for catering FAQs, ImageObject real photos, no aggregateRating.
- Internal linking: from homepage catering teaser, locations, our-story, menu.
- No doorway: one catering page, not 10 city variations.

## Funnel

```
Homepage catering teaser → /catering → click_catering → click_phone / submit_catering_form → owner contact → quote → order
```

- Events: click_catering, submit_catering_form, click_phone (analytics-spec.md).

## Partnerships (off-site, owner side)

- Travel Paso, local orgs, tourism, Cal Poly, wineries, local media, events, community.
- Provide outreach checklist for owner in seo-offsite-checklist.md.

## Files

- Future: `antonias/catering.html` (when owner confirms)
- This spec: `reference/catering-spec.md`
- Master data: `restaurant-master-data.json` catering note
- Homepage teaser: `antonias/index.html` catering section (exists)

## Acceptance

- Spec exists with owner questions, no invented details, teaser present, keywords mapped, no prices invented.

## KPIs

- Catering leads, quote requests, revenue (from owner), click_catering events, calls.

## Next

- Owner answers 10 questions → build /catering page vanilla, no framework, same design system, AVIF+WebP, width/height truthful, lazy except LCP, FAQPage schema, ORDER CATERING CTA → phone + Toast.
