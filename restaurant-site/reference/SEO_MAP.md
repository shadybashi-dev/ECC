# Antonia's Pizza — SEO_MAP.md
Sitemap + Keyword Intent + Internal Links — 2026-09-15 — Full Team

## Sitemap (14 URLs — home, menu, slo, paso, our-story, catering, blog, blog/late-night-slo, blog/paso-wine-pairing, order, faq, videos, promo-videos, privacy)
```
/ (home — sales funnel) — intent: pizza near me, Antonia's brand, best pizza SLO, open till 2AM, 74K + social-proof-hero + catering-teaser + videos-teaser 3 GIFs + promo-videos-teaser 6 stories
 /menu — intent: menu, pizza menu, Ajarski menu — 38 dishes no prices 6 images real ADD TO ORDER → Toast ×37
 /san-luis-obispo — intent: pizza san luis obispo, pizza near Cal Poly, late night food SLO — 891 Higuera St (805)439-2383 Sun-Wed 11-mid Thu-Sat 11-2AM
 /paso-robles — intent: pizza paso robles, best pizza paso robles, italian restaurant paso robles — 729 12th St (805)238-1851 Sun-Thu 11-mid Fri-Sat 11-2AM
 /our-story — intent: brand story, dough, sauce, Ajarski, late-night — editorial citation-worthy
 /catering — intent: pizza catering paso robles, winery catering, Italian catering — 27K hero what we cater how it works areas photos FAQ CTA
 /blog — intent: blog, pizza stories, dough, late nights, wine country — index + 2 posts
 /blog/late-night-slo — intent: late night SLO culture why open till 2AM — story
 /blog/paso-wine-pairing — intent: Paso wine country pairings — story
 /order — intent: order online, pickup delivery Toast — intermediate explaining 1-2 clicks 2 kitchens no cart
 /faq — intent: FAQ hours locations menu ordering catering Ajarski — 8 Qs FAQPage
 /videos — intent: videos, logo animations, promo shorts — 28K 3 GIFs + 3 CSS videos + promo + tools VideoObject ×3
 /promo-videos — intent: promo videos story scenario goal — 49K 6 stories Famous Dough 15s Open Till 2AM 30s Ajarski 20s Two Kitchens 25s Catering 30s 10 to 28 15s CSS story players VideoObject ×3
 /privacy — intent: privacy policy — plain English no tracking currently
```

Clean URLs via `_redirects` (14 rules):
```
/menu → /menu.html 200
/san-luis-obispo → /san-luis-obispo.html 200
/paso-robles → /paso-robles.html 200
/our-story → /our-story.html 200
/catering → /catering.html 200
/order → /order.html 200 (intermediate explaining pickup/delivery via Toast 1-2 clicks)
/faq → /faq.html 200 (8 Qs)
/videos → /videos.html 200 (logo animations promo shorts)
/promo-videos → /promo-videos.html 200 (6 stories with story scenario goal)
/promo → /promo-videos.html 200 alias
/blog → /blog/index.html 200
/blog/late-night-slo → /blog/late-night-slo.html 200
/blog/paso-wine-pairing → /blog/paso-wine-pairing.html 200
/privacy → /privacy.html 200
/llms.txt → /llms.txt 200
Old live site 301s:
/page/ajarski → /#ajarski 301
/locations → /#locations 301
/reservations → /#locations 301
```

## Keyword Map (from executive-execution-plan.md, no doorway duplicates)

| Keyword | Intent | Page | Content Requirements | Schema |
|---------|--------|------|----------------------|--------|
| pizza paso robles | local transactional | /paso-robles | Address 729 12th St, Phone (805)238-1851, Hours Sun-Thu 11-mid Fri-Sat 11-2AM, Menu, Order, Directions, Parking, Delivery, Catering, Photos real, Reviews plain HTML, FAQ | Restaurant @id paso + parentOrg Antonia's + geo 35.6269594,-120.6906368 + openingHours + areaServed Paso/Templeton/Atascadero + OrderAction Toast |
| pizza near me | local near me | /#locations | 2 cards SLO+Paso with ORDER, live hours pill, maps links | - |
| italian restaurant paso robles | local italian | /paso-robles | Italian Kitchen, Pasta, Ajarski Georgian boat, Pizza Fries | same |
| best pizza paso robles | local best (no fake) | /paso-robles + reviews | Reviews real only (Patricia B. etc) plain HTML, no aggregateRating | no aggregateRating |
| pizza san luis obispo | local transactional | /san-luis-obispo | Address 891 Higuera St, Phone (805)439-2383, Hours Sun-Wed 11-mid Thu-Sat 11-2AM, Cal Poly areaServed, Menu, Order, Directions, Parking, Delivery | Restaurant @id slo + geo 35.279991,-120.6618261 + areaServed SLO/Cal Poly/Los Ranchos/Avila/Edna/Sycamore Springs |
| pizza near Cal Poly | local Cal Poly | /san-luis-obispo | areaServed includes Cal Poly, late night Thu-Sat 2AM, Slice & Coke | same |
| late night food SLO | late night | /san-luis-obispo + /our-story | Hours till 2AM Thu-Sat, after-midnight tail handling in JS (close >1440 = 1560 = 2AM, checks yesterday row at 00:30) | OpeningHours |
| gluten free pizza | dietary (only if offered) | /gluten-free-pizza future OR /menu dietary tags | Only if owner confirms gluten-free offered, otherwise no page (don't invent) | MenuItem dietary |
| pizza catering paso robles | catering transactional | /catering future | Min order, lead time owner to confirm, photos real box/patio, contact phone + form | - |
| winery catering | catering winery | /catering | Winery partnerships, local orgs, tourism | - |
| italian catering | catering italian | /catering | Italian catering, pasta, pizza | - |

**Rule:** No 50 doorway pages with same content swapped city name — doorway site penalized. Each location unique content.

## Internal Linking
- Nav: HOME → /, MENU → /menu, LOCATIONS → /#locations, OUR STORY → /our-story, ORDER → Toast external
- Footer: same + privacy + sitemap + social null (owner to provide) + NAP both locations
- Our-story → locations + menu + catering teaser
- Menu → order CTAs + locations + our-story
- Location pages → menu + order + directions + other location + home
- FAQ → anchor links, FAQPage schema

## Metadata (per page)
- Title: ≤60 chars, includes city for location pages, brand for home
- Description: ≤155 chars, includes NAP + late night + Toast for home, includes address+phone+hours for location pages
- Canonical: absolute https://antoniaspizza.com/...
- OG: 1200×630 JPEG center-crop fill (not extent), og/home.jpg etc, stays JPEG (not AVIF)
- Alt: truthful to photo content, not filename, no "image of"
- llms.txt: ordering, locations, menu, dietary, hours, NAP, Toast

## Schema (valid, no self-serving)
- WebSite (home)
- Restaurant 2× separate @id (slo, paso) + parentOrganization Antonia's + geo + openingHours + areaServed + OrderAction Toast + department in index
- Menu + MenuSection + MenuItem (name/desc/image real, no price unless deal bundle from owner)
- Offer (deals $39.99 etc from owner site)
- FAQPage (5 FAQs)
- BreadcrumbList
- ImageObject (real photos)
- Event (future catering)
- sameAs only real URLs (social null currently — owner to provide)
- NO aggregateRating, NO review[] (policy)

## Off-site (owner side)
- GBP: category, NAP, photos real, menu, services, posts, reviews
- Citations: Old Marv's/Bob Cantu's/Grubhub/DoorDash/Yelp/TripAdvisor — clean, no legacy mention on-site (already clean), provide off-site cleanup guide in seo-offsite-checklist.md
- Authority: Travel Paso, local orgs, tourism, Cal Poly, catering partnerships, wineries, local media, events, community

## Gates — Full Team 2026-09-15
- Sitemap 14 URLs valid, robots allow answer engines GPTBot ClaudeBot PerplexityBot, canonicals absolute present, NAP 0 mismatches, schema validates (Restaurant 2× @id+parentOrg+geo+hours+areaServed+OrderAction, Menu+MenuSection+MenuItem real no price unless deal bundle, Offer $39.99 $36.99, FAQPage 5+8, BreadcrumbList, VideoObject ×6, CollectionPage, ImageObject), Lighthouse SEO 100, no doorway duplicates, internal linking 100% no broken (nav/footer/our-story/menu/locations/catering/blog/videos/promo-videos/order/faq), OG cards center-crop fill 1200×630 JPEG, alt truthful, llms.txt 113 lines + Videos + Promo Videos 6 stories, Toast ×189 https target=_blank rel=noopener, AVIF 26 WebP 26 2056KB -50%, JS 32KB CSS 76K hero AVIF 36KB standalone 5420KB, social-proof-hero + catering-teaser + videos-teaser 3 GIFs + promo-videos-teaser 6 cards, order.html + faq.html + videos.html 28K + promo-videos.html 49K, blog index + 2 posts, maps embed Round13, _headers security headers present, _redirects 14 rules.
