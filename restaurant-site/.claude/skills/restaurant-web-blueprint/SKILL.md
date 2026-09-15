---
name: restaurant-web-blueprint
description: End-to-end blueprint for building a production restaurant website that is visually distinctive and ranks in both classic Google search and AI answer engines. Use when building, redesigning, or auditing a restaurant/cafe/food-brand site — covers stack selection, the full schema.org JSON-LD stack, local SEO and GEO, Core Web Vitals budgets, Arabic RTL typography, food photography pipeline, motion planning, and conversion features (ordering, reservations, WhatsApp).
metadata:
  origin: project-synthesis
  layer: 4
  sources: schema.org, Google Search Central, MDN, HTTP Archive CWV data, 2026 framework benchmarks
---

# Restaurant Web Blueprint

The master routing document for this project. Everything else in
`.claude/skills/` is a specialist; this skill decides **which specialist to
call, in what order, and what "done" means** for a restaurant website.

Read this first. Then dispatch to the skill named in each section.

---

## 1. Stack decision (settled — do not relitigate without new facts)

A restaurant site is a **content-first marketing site with a few interactive
islands** (menu filters, reservation form, order cart). That profile has one
correct answer in 2026:

| Criterion | Astro 5+ | Next.js 16 | Verdict |
| --- | --- | --- | --- |
| JS shipped by default | 0 KB (islands opt-in) | 80–200 KB React runtime | **Astro** |
| LCP (field median, content page) | 0.5–1.5 s | 1.2–2.5 s | **Astro** |
| INP | 48–150 ms | 92–250 ms | **Astro** |
| Lighthouse | 92–100 | 75–96 | **Astro** |
| Crawlability | Static HTML = what Googlebot sees | SSR/RSC, crawlable but heavier | **Astro** |
| Multi-location / 500+ programmatic pages | Good | Excellent (ISR, `generateStaticParams`) | **Next.js** |
| Auth, accounts, real-time order dashboard | Endpoints only | Full app router | **Next.js** |

**Default: Astro 5+ with Tailwind CSS v4 and React islands**
(`@astrojs/react`, `client:visible` / `client:idle` only).

Switch to Next.js only if the brief includes customer accounts, a real
delivery/dispatch backend, or 20+ locations with programmatic city pages.

Supporting stack:

- **Styling:** Tailwind CSS v4 (CSS-first `@theme`, logical-property utilities
  `ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-` — mandatory for RTL).
- **Images:** `astro:assets` → AVIF + WebP, responsive `srcset`, explicit
  `width`/`height` (CLS = 0).
- **Motion:** native CSS scroll-driven animations (`animation-timeline: view()`)
  for the simple ~80%; GSAP ScrollTrigger or `motion` only for pinned
  sequences. Always gated behind `prefers-reduced-motion`.
- **Forms:** server endpoint + Zod validation; no client-side form library.
- **Fonts:** self-hosted variable WOFF2 subsets, `font-display: swap`,
  preloaded hero face only.

> Routing: `vite-patterns` (Astro is Vite-based), `frontend-patterns`,
> `react-patterns`, `react-performance`, `nextjs-turbopack` (only if Next).

---

## 2. Structured data — the complete restaurant stack

Google prefers **JSON-LD**. Use one `@graph` per page so entities reference each
other by `@id`. Schema must describe content **actually visible on that page**.

Required blocks:

| # | Type | Where | Why |
| --- | --- | --- | --- |
| 1 | `WebSite` + `potentialAction: SearchAction` | home | sitelinks search box |
| 2 | `Restaurant` (NAP core) | home + every location page | local pack, knowledge panel |
| 3 | `OpeningHoursSpecification[]` | inside `Restaurant` | "open now" queries, voice |
| 4 | `GeoCoordinates` | inside `Restaurant` | map proximity ranking |
| 5 | `servesCuisine` / `priceRange` / `acceptsReservations` | inside `Restaurant` | cuisine + budget queries |
| 6 | `amenityFeature[]` | inside `Restaurant` | "outdoor seating", "halal", "wheelchair" |
| 7 | `aggregateRating` | inside `Restaurant` | CTR (only if real, on-page reviews) |
| 8 | `hasMenu` → `Menu` → `MenuSection` → `MenuItem` + `Offer` | menu page | dish-level queries, allergens |
| 9 | `potentialAction: ReserveAction` | home / reserve | reservation rich result |
| 10 | `potentialAction: OrderAction` | home / order | ordering rich result |
| 11 | `FAQPage` | home or FAQ | AI Overviews + People-Also-Ask |
| 12 | `BreadcrumbList` | every interior page | breadcrumb rich result |
| 13 | `ImageObject` (1x1, 4x3, 16x9) | home | image rich results |
| 14 | `Event` | events / live music nights | event rich result |
| 15 | `sameAs[]` | inside `Restaurant` | Instagram, Facebook, Google Business Profile, TripAdvisor |

Hard rules:

1. **NAP consistency.** Name, Address, Phone must match the Google Business
   Profile and every directory **character for character**. Mismatch suppresses
   local ranking more than any other single error.
2. **Never fabricate `aggregateRating`.** Policy violation → structured-data
   manual action.
3. **One schema block per location**, each with a unique `@id`.
4. **Menu lives in HTML**, not a PDF and not an image. PDF/image menus are
   invisible to Googlebot and to screen readers. Link a PDF as a fallback only.
5. Validate every block in the Rich Results Test before deploy; monitor
   Search Console → Enhancements weekly.

> Copy-paste JSON-LD lives in `references/jsonld-stack.md`.
> Routing: `seo` for audit/keywords, this file for implementation.

---

## 3. Local SEO + GEO (AI answer engines)

Classic local SEO:

- [ ] Google Business Profile claimed, categories set, photos uploaded weekly
- [ ] NAP identical across site schema, GBP, and directories
- [ ] One dedicated page per location with its own `Restaurant` block + map
- [ ] `robots.txt` allows everything important; XML sitemap submitted
- [ ] Canonical tags self-referential; no duplicate `www`/non-`www`
- [ ] `hreflang` pairs if bilingual (ar / en) — subdirectories `/ar/`, `/en/`
- [ ] Keyword map: `{cuisine} + {neighborhood}`, `أفضل مطعم {cuisine} في {city}`,
      `{dish} + قرب مني`, `مطعم {cuisine} {city} للعائلات`
- [ ] Internal links: home → menu → each dish section; location pages ↔ menu
- [ ] Real review content on-page (with `Review` schema) — not just stars

GEO — being *cited* by ChatGPT / Perplexity / Gemini / AI Overviews, which is
where "best restaurant in {city}" traffic goes in 2026:

- [ ] Facts stated in **plain declarative sentences**, not only in tables or images
- [ ] Explicit answer blocks: hours, price range, dietary options (halal,
      vegetarian, gluten-free), parking, kids-friendly, delivery radius
- [ ] `FAQPage` with the actual questions people ask an AI assistant
- [ ] Consistent entity naming everywhere (same restaurant name string)
- [ ] `llms.txt` published at root summarising the entity + key pages
- [ ] No content locked behind JS hydration — AI crawlers often don't execute it

---

## 4. Core Web Vitals budget (hard gates, fail the build if exceeded)

| Metric | Budget | Target |
| --- | --- | --- |
| LCP | < 2.5 s | **< 1.5 s** |
| INP | < 200 ms | **< 100 ms** |
| CLS | < 0.1 | **< 0.02** |
| Total JS (home) | < 100 KB | **< 40 KB** |
| Hero image | < 180 KB AVIF | preloaded, `fetchpriority="high"` |
| Fonts | ≤ 2 families, subset | WOFF2 variable, `swap` |
| Lighthouse mobile | ≥ 90 | **≥ 98** |

Enforcement:

1. Preload the hero image; reserve its box with explicit aspect-ratio.
2. Everything below the fold: `loading="lazy"`, `decoding="async"`.
3. Zero render-blocking third-party scripts in `<head>`. Load Maps/booking
   widgets after `load` or on interaction.
4. No layout-shifting banners, no CLS from webfont swap (size-adjust fallback).
5. Motion uses `transform`/`opacity` only — never animate `top`/`width`/`height`.

> Routing: `react-performance`, `production-audit`, `verification-loop`.

---

## 5. Arabic / RTL — non-negotiable typography and layout rules

Applies whenever the site is Arabic or bilingual. Retrofitting RTL onto a
finished LTR layout costs more than rebuilding; build it in from file one.

Document level:

```html
<html lang="ar" dir="rtl">
```

Layout:

- **Logical properties only.** `ms-4` not `ml-4`; `pe-6` not `pr-6`;
  `start-0` not `left-0`; `text-align: start` not `right`.
- Flexbox `row` auto-mirrors. `row-reverse` double-flips back to LTR — avoid.
- Mirror icons that imply direction (arrows, back, chevrons). Never mirror
  logos, clocks, checkmarks, or media playback icons.
- Wrap embedded LTR runs (phone numbers, emails, URLs, brand names) in
  `<bdi>` or `unicode-bidi: isolate; direction: ltr`.

Typography:

| Rule | Value |
| --- | --- |
| Body line-height | **1.7 – 1.85** (Latin gets away with 1.5; Arabic crashes) |
| `letter-spacing` | **0 — always.** Tracking breaks connected-script ligatures |
| Bold usage | Sparingly; Arabic bold reads heavy |
| Mobile body size | ≥ 16 px (below this iOS zooms on form focus and kills conversion) |
| Word spacing | +0.05 em improves readability |

Font stacks (self-hosted, subset to Arabic + Latin + digits):

- **Cairo** — modern, versatile, headings + body
- **Tajawal** — compact, efficient, data-dense menus and prices
- **IBM Plex Sans Arabic** — dual-script, corporate/premium, best mixed ar+en
- **Noto Kufi Arabic** — clean geometric, strong display headings
- **Amiri / Aref Ruqaa** — calligraphic display accent, headings only, large sizes

For a restaurant: pair **one** display face (Noto Kufi Arabic or Amiri for a
heritage/traditional feel) with **one** body face (Tajawal or IBM Plex Sans
Arabic). Load the Arabic face only on `/ar/`, the Latin face only on `/en/`.
Never ship both to the same page.

Forms:

- Labels **above** the field, never beside it.
- `dir="rtl"` + `text-align: start` on the input.
- Validation messages written in natural Arabic (MSA or the local dialect),
  never machine-translated.
- Default to Western Arabic numerals (0–9) for prices unless the audience
  expects Eastern (٠–٩) — and be consistent site-wide.

> Routing: `arabic-rtl-best-practices`, `arabic-rtl-mobile`,
> `ux-writing-arabic`, `accessibility`.

---

## 6. Design direction — pick one before writing a line of CSS

The ECC web rules carry an **Anti-Template Policy**: no default card grids, no
centered-hero-plus-gradient-blob, no uniform radius/shadow everywhere, no
`#F4F1EA` cream + terracotta + serif (the single most recognisable
AI-generated restaurant look in 2026).

Choose from these restaurant-appropriate directions, then commit:

| Direction | Feels like | Palette anchor | Type | Motion |
| --- | --- | --- | --- | --- |
| **Charcoal & Ember** | grill house, smoke, fire | near-black + ember orange + bone | condensed display | slow parallax, ember glow |
| **Souk / Heritage** | Levantine or Gulf tradition | deep green or burgundy + brass + plaster | Kufi display + Tajawal body | geometric SVG draw-on |
| **Coastal Fresh** | seafood, Mediterranean | sea blue + sand + citrus | light humanist sans | gentle horizontal drift |
| **Farm to Table** | organic, seasonal | fern green + marigold + cream | serif display | bento stagger reveals |
| **Late Night** | shawarma/street food, delivery-first | midnight purple + neon accent | bold geometric | punchy micro-interactions |
| **Fine Dining Editorial** | tasting menu, reservation-led | ivory + ink + one metallic | high-contrast serif | cinematic scrollytelling |

Then apply the **theme-factory** themes as palette seeds
(`golden-hour` and `botanical-garden` are explicitly hospitality-oriented;
`midnight-galaxy` for late-night venues) — but always re-anchor the palette to
the restaurant's actual food photography, never to the preset alone.

Requirements every surface must hit (from `rules/web/design-quality.md`):
hierarchy through scale contrast, intentional rhythm, depth/layering,
characterful type pairing, semantic colour, designed hover/focus/active states,
and **one** memorable moment — spend the boldness in exactly one place.

> Routing: `frontend-design` (aesthetic direction), `frontend-design-direction`,
> `design-system`, `make-interfaces-feel-better`, `theme-factory`,
> `brand-discovery` (if the brand itself is undefined).

---

## 7. Page architecture (sitemap)

```
/                    Home        — hero, signature dishes, hours, map, CTA
/menu                Menu        — HTML menu, MenuSection/MenuItem schema, filters
/menu/{section}      Optional deep pages for high-volume dishes
/about               Story       — chef, sourcing, heritage (E-E-A-T signal)
/reserve             Reservation — ReserveAction, party size, time slots
/order               Order       — OrderAction / WhatsApp / delivery partners
/gallery             Photography — ImageObject, lazy grid
/events              Events      — Event schema (live music, Ramadan, tastings)
/contact             Contact     — FAQPage, map, click-to-call
/locations/{slug}    Only if multi-location
/blog                Optional    — Recipe/story content for topical authority
```

Nav: sticky, scroll-hide on mobile, bottom nav or drawer for thumb reach in RTL
(the right edge is the RTL thumb zone). Max 5 top-level items.

Every page: one primary intent, one primary CTA, `BreadcrumbList`, unique
`title` (≤ 60 chars) and `meta-description` (≤ 155 chars) containing the
localised keyword.

---

## 8. Graphics & food-photography pipeline

- Shoot or generate at **3 aspect ratios** minimum: 16:9 hero, 4:3 cards, 1:1 social.
- Deliver **AVIF first, WebP fallback**, `<picture>` + `srcset` at 1x/2x.
- Hero ≤ 180 KB; card images ≤ 60 KB; gallery thumbs ≤ 25 KB.
- Explicit `width`/`height` or `aspect-ratio` on every image (CLS).
- Colour-accurate, appetite-driven: warm highlights, deep shadows, visible
  texture/steam. Desaturated food photography reads as unappetising.
- Generate missing dish photography with `fal-ai-media` (or the workspace image
  tool) — always label AI imagery internally and never misrepresent a dish the
  restaurant does not serve.
- Add `grain`/texture only if the chosen design direction calls for it.

> Routing: `fal-ai-media`, `design-system`, `make-interfaces-feel-better`.

---

## 9. Conversion features (what actually makes a restaurant site pay)

Ranked by measured impact for food businesses:

1. **Click-to-call** and **WhatsApp order button** — sticky on mobile, `tel:` /
   `wa.me` with a prefilled message.
2. **"Open now" indicator** computed from `openingHoursSpecification` — local time.
3. **Reservation widget** — party size, date, time; `ReserveAction` target.
4. **Menu that is readable** — searchable/filterable, dietary badges
   (halal / vegetarian / gluten-free / spicy), prices never hidden behind a PDF.
5. **Google Map embed** loaded lazily, with directions link.
6. **Reviews on-page** — real quotes, `Review` schema, link to GBP.
7. **Instagram feed** — lazy, after `load`, never render-blocking.
8. **Order online** — deep-link to the delivery partner (Talabat / Jahez /
   HungerStation / Uber Eats) with `OrderAction`; build a native cart only if
   the brief demands it.

Measure: GA4 events on `call`, `whatsapp`, `reserve_start`, `menu_view`,
`directions`. These are the real KPIs — not pageviews.

---

## 10. Accessibility gates (WCAG 2.2 AA)

- Contrast ≥ 4.5:1 body, ≥ 3:1 large text — test the actual food photos behind text.
- Keyboard-reachable nav, visible focus ring (not `outline: none`).
- Touch targets ≥ 44×44 px (WCAG 2.2 Target Size).
- All images have meaningful `alt`; decorative images `alt=""`.
- Menu is a real list/table structure, not a screenshot.
- `prefers-reduced-motion` disables all non-essential animation.
- Skip link, landmark regions, one `h1` per page, logical heading order.
- Screen-reader test with real Arabic content (NVDA/VoiceOver read RTL differently).

> Routing: `accessibility`, `frontend-a11y`.

---

## 11. Build sequence (execute in this order)

1. **Brief** — restaurant name, cuisine, city, languages, price range, real
   menu, real photos, phone, address, hours, social links, ordering partner.
   Missing facts → ask, never invent. (`brand-discovery` if identity is fuzzy)
2. **Design direction** — pick one from §6, write the token file
   (4–6 hex values, 2 typefaces, spacing scale, radius scale, shadow scale).
   Review the plan against the Anti-Template Policy *before* coding. (`frontend-design`)
3. **Scaffold** — Astro + Tailwind v4 + `@astrojs/sitemap` + `astro:assets`.
   Set `<html lang dir>` correctly from commit one.
4. **Content model** — menu as a typed data file (`src/data/menu.json` +
   Zod schema) so HTML menu and `Menu` JSON-LD generate from one source of truth.
5. **Pages** — home → menu → contact/reserve → about → gallery.
6. **Structured data** — full §2 stack, generated from the same data files.
7. **SEO layer** — titles, descriptions, OG/Twitter cards, canonical, sitemap,
   robots, `llms.txt`, hreflang if bilingual.
8. **Performance pass** — hit every §4 budget, image pipeline, font subsetting.
9. **QA** — Lighthouse, Rich Results Test, RTL visual check, keyboard walk,
   mobile thumb-zone check, real Arabic copy review. (`browser-qa`, `click-path-audit`)
10. **Deploy** — static host/CDN, HTTPS, security headers, 404/redirect map,
    Search Console + GBP verification. (`deployment-patterns`, `production-audit`)

---

## 12. Skill routing table

| Task | Use |
| --- | --- |
| Aesthetic direction, avoiding template look | `frontend-design`, `frontend-design-direction` |
| Colour/font presets | `theme-factory` |
| Tokens, consistency audit | `design-system` |
| Spacing, states, micro-detail polish | `make-interfaces-feel-better` |
| Animation system | `motion-foundations` → `motion-patterns` → `motion-advanced` / `motion-ui` |
| AI imagery | `fal-ai-media` |
| Arabic RTL layout | `arabic-rtl-best-practices`, `arabic-rtl-mobile` |
| Arabic UI copy | `ux-writing-arabic` |
| Technical + on-page SEO | `seo` |
| Brand identity / voice | `brand-discovery`, `brand-voice` |
| Launch content, social | `content-engine`, `marketing-campaign` |
| Competitor / market scan | `market-research` |
| Component & framework patterns | `frontend-patterns`, `react-patterns`, `vite-patterns` |
| Speed | `react-performance`, `rules/web/performance.md` |
| Accessibility | `accessibility`, `frontend-a11y` |
| Visual/interaction QA | `browser-qa`, `click-path-audit`, `ui-demo` |
| Tests | `e2e-testing`, `react-testing` |
| Pre-launch gate | `production-audit`, `verification-loop` |
| Shipping | `deployment-patterns`, `git-workflow` |
| Ordering/reservation API | `api-design`, `backend-patterns` |
| Conversion psychology, menu engineering, CRO | `conversion-psychology` |
| Visual/sensory priming, color & appetite | `neuromarketing-priming` |
| Strongest UI stack, hero patterns, perf gates | `ui-stack-excellence` |
| Realistic food imagery (ComfyUI / fal.ai / hosted) | `food-photography-generation`, `comfyui-image-generation` |
| Competitor + market scan | `competitive-platform-analysis` → `benchmark-methodology` → `competitive-report-structure`, `market-research`, `data-scraper-agent` |
| Deep multi-source research | `deep-research` |
| Security (forms, endpoints, headers) | `security-review` |
| Post-deploy monitoring | `canary-watch`, `production-audit` |
| Project memory across sessions | `ck` |
| Build orchestration | `orch-build-mvp` |
| Finding a skill you don't have | `skill-scout` |

---

## 12b. The specialist team (agents)

Dispatch one owner per task. Never let two agents edit the same surface.

| Agent | Model | Owns |
| --- | --- | --- |
| `restaurant-growth-lead` | opus | Orchestration, sequencing, arbitration, definition of done |
| `ui-design-director` | opus | Aesthetic direction, palette, type, hero, anti-template bar |
| `conversion-psychologist` | opus | Choice architecture, anchoring, friction audit, instrumentation |
| `neuromarketing-director` | sonnet | Color/sensory priming, gaze cueing, appetite language |
| `food-visual-producer` | sonnet | Food imagery across ComfyUI / fal.ai / hosted, export specs |
| `menu-engineer` | sonnet | Menu IA, pricing display, descriptions, MenuItem schema |
| `seo-specialist` | sonnet | Technical SEO, JSON-LD, CWV, local + AI search |
| `a11y-architect` | sonnet | WCAG 2.2 AA, keyboard, contrast, RTL |
| `performance-optimizer` | sonnet | LCP/INP/CLS, image pipeline, font subsetting, bundle budget |
| `e2e-runner` | sonnet | Order path, reservation path, viewport matrix |
| `security-reviewer` | sonnet | Forms, endpoints, payment redirects, headers |
| `marketing-agent` | sonnet | Campaigns, landing copy, social, launch content |
| `code-reviewer` / `react-reviewer` / `typescript-reviewer` | sonnet | Implementation review |
| `doc-updater` | sonnet | Content accuracy, NAP consistency |
| `chief-of-staff` | sonnet | Cross-cutting coordination when several agents are in flight |
| `canary-watch` (skill) | — | Post-deploy URL monitoring |

Escalation: when design ambition and a performance gate conflict, the gate wins.
Find the zero-JS version of the idea.


---

## 13. Definition of done

A restaurant site is not finished until **all** of these are true:

- [ ] Lighthouse mobile ≥ 95 across Performance / A11y / Best Practices / SEO
- [ ] LCP < 1.5 s, CLS < 0.02, INP < 100 ms on a throttled mid-tier mobile
- [ ] Rich Results Test passes with **zero errors and zero warnings**
- [ ] NAP on the site === NAP on Google Business Profile === schema NAP
- [ ] Menu is real HTML with `MenuItem` schema; no PDF-only menu
- [ ] Reservation and/or ordering CTA works end to end on mobile
- [ ] Full RTL mirror verified on 360 px, 768 px, 1440 px with real Arabic copy
- [ ] Arabic line-height ≥ 1.7 and `letter-spacing: 0` everywhere
- [ ] `prefers-reduced-motion` respected; keyboard-only navigation complete
- [ ] sitemap.xml + robots.txt live, Search Console verified, `llms.txt` published
- [ ] The design would not be mistaken for a template — one memorable moment,
      palette anchored in the actual food, deliberate type pairing
