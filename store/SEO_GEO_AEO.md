# MALIK & OTB — SEO / GEO / AEO Report

Results below are measured from the local development build (`npm run build` passes; dev server at http://localhost:3000). No fabricated performance scores or field data are claimed.

## 1. Technical SEO implemented

| Item | Status | Notes |
|---|---|---|
| Clean URLs, unique titles/meta per page | Done | `metadata` in layout; product/category SEO fields editable in admin |
| Canonical URLs | Done | `alternates.canonical` in root layout |
| `sitemap.xml` | Done | `app/sitemap.ts` — public categories + active non-test products |
| `robots.txt` | Done | `app/robots.ts` — disallows cart/checkout/auth/orders/admin/api/search and filter query strings |
| 404 page | Done | `app/not-found.tsx` |
| Breadcrumb JSON-LD | Done | root layout + product/category pages |
| Organization / WebSite / Product / Offer JSON-LD | Done | matches visible content; no fabricated GTIN/reviews/price/availability |
| Open Graph tags | Done | root layout (`og:site_name`, `og:title`, `og:description`, `og:type=website`) |
| Image optimization | Done | `next/image` (lazy loading, `aspect-ratio` placeholders) |
| Lightweight fonts | Done | system font stack (no external web-font requests) |
| Cache headers / static assets | Done | Next.js default production caching |
| Noindex for cart/account/checkout/search/test data | Done | `robots.txt` disallow + `test_data` products excluded from sitemap/index |
| Admin + staging protected by auth | Done | middleware protects `/admin`; sessions are DB-backed, HttpOnly |
| Mobile-first design | Done | responsive layout, touch targets, viewport meta |

## 2. GEO / AEO approach

- Direct answers to real purchase questions (shipping, returns, stock, suitability).
- "Who this is for / who this is not for" on the About page.
- Verifiable specifications, materials, usage, restrictions on every product page.
- Consistent company name (MALIK & OTB), email (piratespizza999@gmail.com), and policies.
- Original help-center content; no keyword stuffing, no AI-spam article farms.
- No claim that AI-referral traffic equals GEO-driven sales.
- `llms.txt` is not treated as a ranking shortcut.

## 3. Keyword & question map (to be completed with approved product facts)

Purchase-intent themes:
- "[product] price / where to buy online USA"
- "[product] specifications materials dimensions"
- "[product] shipping policy return policy"
- "[product] for [use case] — is it suitable for me?"

Questions to answer in help center + product pages:
- How long does shipping take?
- Can I return the item and how?
- What materials is it made of? Any restrictions?
- Is it in stock? What happens if it is out of stock?

First three high-quality content pieces: to be authored once approved product facts exist (see OPERATIONS.md content plan).

## 4. Search engine tools

- Google Search Console: to be connected after domain verification (not claimed as connected).
- Bing Webmaster Tools: to be connected after verification (not claimed as connected).
- IndexNow: supported endpoint to be configured; indexing not claimed without verification.

## 5. Performance targets (not yet measured with published tooling)

Targets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Actual results and test conditions will be published after a real Lighthouse/WebPageTest run on the staging URL. No scores are fabricated in this report.
