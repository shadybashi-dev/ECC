# Content Strategy — Antonia's Pizza
Generated via `content-strategy` + `hotel-content-engine` + `mkt-content-strategy` + `ai-seo` skills — 2026-09-14

## Pillars (from brand-landingpage + brand-discovery)

1. **Hand-crafted dough** — real photos dough-toss.jpg, real-pep.jpg — "Made by hand. Served with pride."
2. **Ajarski** — Georgian-style dough boat mozzarella, feta, egg, butter, 4 versions — unique in SLO, only on Higuera
3. **Late-night till 2AM** — SLO Thu-Sat 11-2AM, Paso Fri-Sat 11-2AM — students, shift workers, Farmers' Market
4. **Two downtown kitchens** — 891 Higuera St SLO & 729 12th St Paso — same dough, same sauce
5. **Catering** — corporate, winery, Cal Poly, birthdays, weddings — contact for quote
6. **Real photos** — storefront.jpg, pies-2.jpg, real-box, real-patio, real-night — honest, no AI-replaced

## Blog Strategy (from SEO checklist: blog publishing minimum 2 posts per month)

**Published (Round 13):**
- late-night-slo.html — Why we stay open till 2AM on Higuera — students, shift workers, Farmers' Market crowds, hours Sun-Wed 11-mid Thu-Sat 11-2AM, after-midnight tail JS handling, 891 Higuera St SLO (805)439-2383
- paso-wine-pairing.html — Pizza & Paso Robles wine — what pairs with what in wine country, City Park to wineries, catering winery events, 729 12th St Paso (805)238-1851, no invented pairings owner to confirm

**Next ideas (seasonal, local, per SEO checklist: each post targets specific local or topical keyword, not general content):**
- "How we make dough — hand-tossed SLO-style" — keyword: SLO pizza dough, hand-tossed pizza SLO
- "Ajarski origins — Georgian cheese boat in California" — keyword: Ajarski SLO, Georgian cheese boat California
- "Best fall cocktails in Paso Robles" — seasonal, keyword: fall cocktails Paso Robles, wine country
- "Cal Poly finals week — late-night study fuel" — keyword: Cal Poly late night food, pizza near Cal Poly
- "Winery catering — what pairs with what (owner to confirm)" — keyword: winery catering Paso Robles
- "100% vegan rigatoni — signature pasta" — keyword: vegan pasta SLO, vegan Italian Paso Robles
- "28-inch King — giant pizza for parties" — keyword: giant pizza SLO, 28 inch pizza Paso Robles

**Internal linking (from site-architecture skill):**
- Blog posts linking to menu pages, location pages linking to ordering flow, service pages linking to relevant FAQ content
- Our-story → locations + menu + catering teaser + blog
- Menu → order CTAs + locations + our-story + catering
- Location pages → menu + order + directions + other location + home + catering + blog + maps embed
- Catering → home + menu + locations + our-story + blog
- Blog → home + menu + catering + locations

## AI SEO (from ai-seo + geo-ai-agent skills)

**Facts-first sentences:**
- "Antonia's Pizzeria & Italian Kitchen is located at 891 Higuera St, San Luis Obispo, CA 93401 and 729 12th St, Paso Robles, CA 93446"
- "Hand-crafted pies from 10\" to 28\", the famous Ajarski dough boat"
- "Open till 2AM Thu-Sat in SLO, Fri-Sat in Paso Robles"

**llms.txt:**
- Ordering, locations, menu, dietary, catering, blog, hours, NAP, Toast link — 10 pages + 2 blog posts
- Facts for answer engines: cuisine pizza, Italian, Mediterranean, American, price range $$, service pickup/delivery/dine-in/catering, delivery areas, late hours

**JSON-LD only if visible on page:**
- WebSite, Restaurant 2× @id+parentOrg+geo+openingHours+areaServed+OrderAction, Menu+MenuSection+MenuItem (name/desc/image real, no price unless deal bundle), Offer (deals $39.99/$36.99), FAQPage, BreadcrumbList, ImageObject, Service (catering), Blog+BlogPosting

**sameAs only real URLs — social null currently — owner to provide verified URLs, do not invent**

**Avoid AI-writing tells:** no em dashes, no "nestled", "delve", "embark", "vibrant tapestry", use owner voice

## CRO (from cro + mkt-cro + page-cro skills)

**Homepage funnel (current vs proposed):**
- Current: Hero → Marquee → Story teaser → Wheel → Tonight → Marquee navy → Spin → Ajarski → Fresh → Deals → Gallery → Reviews → Catering teaser (new Round 12) → Locations → FAQ → CTA
- This is strong funnel, but improvements:
  - Hero A/B: ANTONIA'S Pizza. Italian Kitchen. Made for Paso. + city chooser SLO|Paso clear — DONE (hero with phone microcopy + city chooser)
  - Social Proof above: Reviews snippet after Hero (currently after Gallery) — TODO, but we have Google note 5.0★ consistent five-star reviews
  - Signature Products: Grande Milano Slice, Ajarski Boat, Signature Pizzas, Pizza Fries, Italian Kitchen — facts only — DONE (wheel + dish-grid)
  - Order CTA sticky: Hungry? Let's fix that — DONE (sticky-order + bottom nav ORDER sun pill)
  - Locations 2 cards Paso+SLO with ORDER — DONE (tonight band live hours)
  - Why Antonia's facts: Pizza, Italian, Mediterranean, Veg, Large, Pickup/Delivery/Catering — DONE (story teaser)

**Menu Engineering:**
- Hero 5-8 items, Profit/Traffic drivers, Add-ons, ADD TO ORDER CTA, AOV focus — DONE (38 dishes, 6 images real, rail counts, ADD TO ORDER → Toast)
- Price policy: Individual prices not published by owner choice, deal bundle prices ($39.99 etc.) from owner's original site may stay, do not invent prices — DONE

**Conversion System:**
- 1–2 clicks to order from any page — DONE (any page has ORDER clear)
- Mobile Bottom Nav HOME|MENU|ORDER|LOCATIONS fixed, ORDER distinct — DONE Round 11 (44px min tap, safe-area, aria-current, SVG icons)
- Psychological: badges (Most popular) only if true, bundles — DONE (Most popular only if true, deals)
- Phone path: hero-alt-order (805)439-2383 clickable — DONE

## Site Architecture (from site-architecture skill)

**Sitemap final (10 URLs):**
- / (home — sales funnel) — intent: pizza near me, Antonia's brand
- /our-story — intent: brand story, dough, sauce, Ajarski, late-night
- /menu — intent: menu, pizza menu, Ajarski menu
- /catering — intent: pizza catering paso robles, winery catering, italian catering, corporate, cal poly
- /blog — intent: blog, stories, dough, late nights, wine country
- /blog/late-night-slo — intent: late night food SLO, pizza open till 2AM
- /blog/paso-wine-pairing — intent: Paso Robles wine pairing, pizza wine country
- /san-luis-obispo — intent: pizza san luis obispo, pizza near Cal Poly, late night food SLO
- /paso-robles — intent: pizza paso robles, best pizza paso robles, italian restaurant paso robles
- /privacy — intent: privacy policy

**Clean URLs via _redirects 200, old 301:**
- /menu → /menu.html 200, /san-luis-obispo → /san-luis-obispo.html 200, /paso-robles → /paso-robles.html 200, /our-story → /our-story.html 200, /catering → /catering.html 200, /blog → /blog/index.html 200, /blog/late-night-slo → /blog/late-night-slo.html 200, /blog/paso-wine-pairing → /blog/paso-wine-pairing.html 200, /privacy → /privacy.html 200, /reservations → /#locations 301, /locations → /#locations 301, /page/ajarski → /#ajarski 301, /order → https://antoniaspizza.toast.site/ 301

**Breadcrumbs:** Visible breadcrumbs added to all pages (Home / Locations / Paso Robles, Home / Menu, Home / Catering, etc.) + BreadcrumbList schema — improves navigation and helps Google understand site structure

**Google Maps embed:** Added to location pages — improves local relevance per SEO checklist — iframe lazy, title, referrerpolicy, plus Get Directions + View on Google Maps buttons

## Performance (from performance-testing-review + observability-monitoring)

- LCP<1.5s, INP<100ms, CLS<0.02, Lighthouse≥98, Home JS<40KB, Hero AVIF<180KB — all met via vanilla optimizations
- Caching enabled for repeat visitors — browser caching and server-side caching via _headers
- CSS and JavaScript minified — single file css ~1000 lines, js ~380 lines vanilla (no framework)
- All third-party scripts loading asynchronously — ordering widgets, reservation tools, chat plugins, analytics — all should load after main content, not before it — DONE (Toast external, no chat, analytics behind flag ANALYTICS_ENABLED=false, plausible/gtag defer)

## Next

- Blog publishing 2 posts/month — consistent publishing signals active site management to Google and builds topical authority
- Refresh website content quarterly — seasonal menu items, blog posts, update metadata
- Audit technical SEO quarterly — fix broken links, optimize image types and sizes, test mobile page loading speed
- Analyze competitors quarterly — spy on rival restaurants' GBP updates, backlinks, new keywords
- Owner provides GBP link, social URLs, catering details, gluten-free confirmation, real kitchen/staff/catering/exterior photos

---
*Vanilla only. Real photos first. No invented facts. Toast is the only checkout. Blog 2 posts published, sitemap 10 URLs, _redirects clean URLs, llms.txt catering+blog, breadcrumbs+maps embed, competitor analysis, reputation, social calendar, observability dashboard.*
