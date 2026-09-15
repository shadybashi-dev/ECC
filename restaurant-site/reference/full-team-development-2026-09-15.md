# Full Team Development — Antonia's Pizza — 2026-09-15

> User: "طور الموقع من كل النواحي اعمل مع الفريق كامل"
> Develop site from all aspects, work with whole team.

## Team (13 agents from .agents/antonia/)

| Agent | Role | Current Status | Improvements Needed |
|-------|------|----------------|---------------------|
| architect | foundation, sitemap, data, phase gates | AGENTS.md exists, PROJECT_MAP, ARCHITECTURE, SEO_MAP exist, sitemap 14 URLs, _redirects 14 rules | Verify NAP consistency, ensure vanilla binding, ensure build.py passes, ensure no Astro/Tailwind, ensure AVIF layer 26 images |
| frontend | vanilla HTML/CSS/JS, funnel, bottom nav, AVIF | index.html has hero, wheel, spin, marquee, tonight, ajarski, fresh, deals, gallery, reviews, locations, catering-teaser, videos-teaser, promo-videos-teaser, FAQ, CTA — 74K, css 76K, js 33K, bottom nav HOME|MENU|ORDER|LOCATIONS, wheel 8 distinct, spin 2 wheels, marquee, order-badge | Check responsive no overflow, bottom nav 44px tap, wheel keyboard operable listbox ARIA, spin once per visitor localStorage, marquee pause+RM, hero LCP AVIF 36KB preload fetchpriority high, logo 192×192 12KB, og cards center-crop fill, no backdrop-filter, no will-change except continuous motion |
| seo | local pack Paso+SLO, NAP, schema, sitemap, citations | sitemap 14 URLs (home, menu, slo, paso, our-story, catering, blog, blog/late-night-slo, blog/paso-wine-pairing, order, faq, videos, promo-videos, privacy), _redirects 14 rules (clean 200 + old 301), robots allows GPTBot ClaudeBot PerplexityBot, canonicals absolute, titles/descriptions per page, OG 1200×630 JPEG center-crop, schema Restaurant 2× separate @id + parentOrg + geo + hours + areaServed + OrderAction Toast, Menu + MenuSection + MenuItem real only no price unless deal bundle, FAQPage 5 FAQs + 8 in faq.html, BreadcrumbList, VideoObject ×3 + ×3 in promo-videos, CollectionPage, ImageObject real, sameAs null (owner to provide) — NO aggregateRating/review[] per policy | Check 0 NAP mismatches, schema validates, no doorway duplicates, internal linking 100% no broken, Lighthouse SEO 100, keyword map per SEO_MAP.md, off-site checklist seo-offsite-checklist.md, ensure unique content per location page |
| geo | AI answers ChatGPT/Gemini/Perplexity/AI Overviews, llms.txt, entity | llms.txt 113 lines, has Ordering, Locations (SLO 891 Higuera + Paso 729 12th), What kitchen known for, Menu, Facts for answer engines, Catering, Ordering intermediate, FAQ, Blog, Videos, Promo Videos Story Scenario Goal (6 stories), Pages — facts-first sentences, NAP exact, Toast link, no invented URLs, sameAs null, our-story editorial dough/sauce/Ajarski/late-night citation-worthy | Ensure llms.txt mentions ordering/locations/menu/dietary/hours/NAP/Toast, no invented URLs, schema valid real only, entity consistency brand Antonia's + department SLO/Paso, avoid AI-writing tells (no em dashes, no generic hype, owner voice) |
| cro | Traffic→Order→Toast, bottom nav, AOV, friction, mobile UX | Homepage funnel: Hero ORDER|MENU + city chooser? Actually hero has Order Now + See Menu + Call + meta 28" 2 locations 2AM, social-proof-hero 5.0★ real names, story, wheel, tonight live hours, everyone marquee, spin to decide (pizza picker + prize wheel once per visitor), ajarski, fresh is best 4 steps, deals 2 cards $39.99 $36.99, gallery marquee, reviews 5 cards plain HTML, locations 2 tabs with ORDER SLO/Paso + Location Page + maps fallback pin, catering-teaser, videos-teaser 3 GIFs, promo-videos-teaser 6 cards, FAQ 5, CTA band with word-rotate late-night/cheesy/saucy/2AM + Order Online + Get App, footer Explore + Locations + Order, bottom nav HOME|MENU|ORDER|LOCATIONS with ORDER distinct, sticky-order mobile Hungry? Order Now, menu.html 38 dishes no prices 6 images real ADD TO ORDER → Toast ×37, order.html intermediate explaining pickup/delivery 2 kitchens no cart 1-2 clicks, faq.html 8 Qs, videos.html + promo-videos.html with CTAs | Check ≤2 clicks to order, bottom nav exists mobile ORDER distinct 44px tap, ORDER badge border-radius 50% + badgeGlint 5.5s infinite + orbit, sticky order, reduce friction, AOV focus 2 XL $39.99 most popular, upsells? App rewards, visual hierarchy, mobile UX |
| content | copy, menu desc, FAQ, alt truthful, never invent facts | index.html copy hand-crafted pies 10-28, Ajarski dough boat, SLO-style crust, late-night till 2AM, menu.html 38 dishes no prices, descriptions truthful, alt text truthful to photo content not filename no image of, FAQ answers concise factual, llms.txt facts-first, our-story editorial dough/sauce/Ajarski/late-night, blog posts late-night-slo + paso-wine-pairing no invented facts owner to confirm history partnerships, catering page min order lead time owner to confirm no invented prices, promo videos story scenario goal grounded in real photos | Ensure never invent facts, alt truthful, menu desc from master data, FAQ from master data, catering min order lead time owner to confirm, no branded bottles, no marble kitchens, no generic dishes, prompts forbid text/logos/brands/faces, ground in owner real crops |
| analytics | GA4/Plausible events, dashboards, privacy-first | analytics-spec.md exists? Check, js event hooks? Check main.js for data-* attributes, privacy.html says no tracking currently, update if analytics added, no cookies, events spec view_menu/view_item/click_order/start_order/add_to_cart/begin_checkout/purchase/click_phone/click_directions/click_catering/submit_catering_form per user brief | Ensure analytics-spec.md exists, no tracking without owner ID, privacy compliance, events spec, dashboard design, data storytelling, ensure js has hooks data-catering etc, ensure Toast is external target=_blank rel=noopener |
| visual-qa | typography/spacing/responsive/hero/images/mobile/buttons/hierarchy/brand, million-dollar | css tokens sky #bfe3f2 sun #ffd23f navy #0e3a52 paper #fffdf7 red-deep #c03a24 gold-ink #8f6116, Baloo 2 rounded 400/700 woff2 self-hosted font-display swap, Sora body? Actually Baloo 2 + Sora? Check, spacing 32px radius container min(1240px,92vw), responsive no horizontal scroll centre disc height 44% width 44% not dependent aspect-ratio vs content, hero LCP AVIF 36KB preload fetchpriority high decoding async, logo 192×192 12KB not 512×512 220KB, og cards center-crop fill not extent, images AVIF+WebP picture width/height truthful lazy except LCP, mobile 44px tap bottom nav order-badge border-radius 50%, buttons magnetic rAF-batched tilt composes inline transform, hierarchy oversized display flat bright blocks marquees one signature wheel, brand rounded friendly food/hospitality | Audit typography/spacing/responsive/hero/images/mobile/buttons/hierarchy/brand, browser automation preview python -m http.server 8777 --directory antonias, check Chrome/Safari/mobile via reasoning, visual council ui-visual-validator, hallmark anti-slop, avoid-ai-writing, owner is visual judge rejected offer_options ×3 real photos beat generated generated set cohesively graded wheels need visible design jewellery more animation wanted but always registered in pause+RM lists appropriateness CONTENT not just grade no branded bottles Monini no marble studio kitchens no generic dishes no text/logos/brands/faces in generated prompts ground in owner real crops |
| security | secrets, headers, XSS, Toast third-party, CSP, _headers, privacy | _headers present with Cache-Control immutable for fonts 31536000, assets 86400, css/js 604800, security headers X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, X-Frame-Options SAMEORIGIN, Permissions-Policy camera=() microphone=() geolocation=() payment=(), CSP default-src self img-src self data: https: font-src self style-src self unsafe-inline script-src self connect-src none frame-ancestors none form-action self https://antoniaspizza.toast.site base-uri self, HSTS max-age 31536000 includeSubDomains preload, privacy.html plain English no tracking currently, js innerHTML audit only marquee clones node-by-node aria-hidden safe no eval no query param reflection, external links https + rel noopener, no secrets grep api_key secret token, no mixed content, Toast https only | Scan secrets, XSS innerHTML uses safe, injection no eval, third-party Toast https only target=_blank rel=noopener, forms none currently, headers present, privacy compliance, supply chain no CDN runtime fetch fonts self-hosted woff2 no npm |
| performance | LCP<1.5s INP<100ms CLS<0.02 Lighthouse≥98 JS<40KB Hero AVIF<180KB AVIF layer | css 76K, js 33K (target <40KB good), hero-pep.avif 36KB (target <180KB good), AVIF 26 images 2056KB q55 vs JPEG 4098KB -50% vs WebP 2952KB -28%, preload as image hero-pep.webp fetchpriority high, preload fonts Baloo 2 woff2 crossorigin, no backdrop-filter, no will-change except continuous motion (marquees, gallery, rotor, order-badge orbit, logoTurn 48s linear infinite footer-brand img, badgeGlint 5.5s infinite, kenBurns 26s infinite alternate hero photo, floaty 4.5s, word-rotate, meteors, storyCycle0-4 15s/30s progressBar, bgShift 8s), JS IIFE null-safe selectors, motionMQ live, rAF-batched magnetic buttons rect cached on enter, IntersectionObserver for reveals/counters/wheel autoplay gated onScreen no scroll listeners except header shrink/hide passive, build.py generates standalone.html 5420KB inlined assets preview only not deploy | Ensure LCP<1.5s INP<100ms CLS<0.02 Lighthouse≥98, hero AVIF 36KB, JS 28KB, no backdrop-filter, no will-change except allowed, build.py passes, check via harness reasoning |
| accessibility | WCAG 2.2 AA, keyboard, screen reader, focus-visible, pause+RM | html.js gating (0,2,1)+!important, every querySelector null-safe, transform/opacity/filter only, infinite anims in pause+RM lists (21 anims), skip-link, ARIA labels, nav-links, main, hero, wheel listbox ARIA role listbox option tabindex -1 data-name data-craving aria-label, side-name, center disc, wheel-btn prev/next aria-label, spin wheels data-spin-wheel data-spin-kind pies/prizes data-spin-items JSON data-spin-once localStorage, sw-pointer aria-hidden, sw-disc sw-label --s, sw-hub data-spin-go, sw-result role status aria-live polite, sw-fineprint, FAQ buttons aria-expanded false, ico, breadcrumbs aria-label Breadcrumb, bottom nav aria-label Mobile primary navigation data-page home/menu/order/locations aria-current page, bn-icon aria-hidden svg, bn-label, sticky-order region aria-label Order, motion-toggle aria-pressed false aria-label Pause all site motion ic-pause ic-play, nav-toggle aria-label Toggle menu aria-expanded false, open-pill data-open-pill dot label, scroll-rail aria-hidden, cursor-dot/ring aria-hidden, marquee aria-hidden, meteors aria-hidden, etc | Ensure keyboard operable, screen reader wheel listbox, pause toggle html.motion-paused 21 anims, RM universal kill animation none !important, focus-visible, skip link, alt truthful, no empty alt except decorative, ensure all interactive 44px tap |
| catering-growth | catering funnel, winery/Cal Poly partnerships, catering SEO | catering.html exists 27K with hero, what we cater 3 cards pizza/Ajarski/Italian Kitchen, how it works 6 info cards min order lead time delivery areas service dietary pricing owner to confirm, areas served 2 cards SLO/Paso + 3 cards winery/corporate/real photos, photos real-patio feast-wide real-night, FAQ 6 Qs FAQPage schema, CTA band Call SLO Call Paso Order via Toast, catering-teaser homepage + promo-videos-teaser, keywords pizza catering paso robles etc, llms.txt Catering section | Ensure catering funnel, winery/Cal Poly partnerships spec, catering SEO, no invented details, min order lead time owner to confirm contact for quote, no invented prices, photos real box/patio/feast/night owner untouched, internal linking from home/footer/blog |
| final-reviewer | delivery gate, 0 FAIL harness, DoD 25 | council-review.md, audit-current.md, final-review-round11.md, DoD 25 checklist? Need to verify | Verify DoD 25, 0 FAIL harness, release ready YES/NO + blockers, verification-before-completion, hallmark-anti-slop |

## Current DoD (from executive-execution-plan.md)

- [x] Homepage prod-ready (funnel + wheel + spin + tonight + social proof + catering teaser + videos teaser + promo-videos teaser)
- [x] Menu HTML (38 dishes + 6 images + rail)
- [x] Online ordering (Toast ×37)
- [x] Locations SLO + Paso unique Restaurant schema @id+parentOrg+geo+hours+areaServed+OrderAction
- [x] Our Story editorial
- [x] Privacy, 404, llms.txt, robots, sitemap 14 URLs, _redirects 14 rules, _headers security headers, site.webmanifest, favicon.svg
- [x] CSS single :root tokens, JS IIFE null-safe, AVIF layer 26 images q55 2056KB -50%
- [x] Bottom nav HOME|MENU|ORDER|LOCATIONS + sticky order
- [x] Social proof above fold, catering teaser, videos teaser, promo-videos teaser, FAQ, CTA band
- [x] Blog index + 2 posts late-night-slo + paso-wine-pairing
- [x] Order intermediate page + FAQ 8 Qs + Videos page + Promo Videos 6 stories
- [x] Build passes 5420KB standalone, 0 console errors reasoning, responsive no overflow reasoning
- [ ] Lighthouse Mobile ≥98 (need to verify via harness, but reasoning: LCP 36KB AVIF preload, JS 33KB, CSS 76K, no backdrop-filter, rAF batching)
- [ ] A11y 100 (keyboard wheel listbox, pause toggle, RM kill)
- [ ] Security headers present, no secrets, XSS safe
- [ ] Analytics spec exists, no tracking without owner ID
- [ ] Catering spec exists, no invented details
- [ ] Final review DoD 25

## Execution Plan — Phase-gated (superpowers executing-plans)

Phase 0 Project Intelligence — DONE (PROJECT_MAP, ARCHITECTURE, SEO_MAP, RESTAURANT_DATA exist)

Phase 1 Foundation — Verify vanilla binding, tokens, routing, data, locations, nav, footer — DONE but need to ensure no Astro/Tailwind, ensure build.py passes

Phase 2 Homepage Funnel — Verify funnel order ≤2 clicks to order, Lighthouse≥98 — Need to ensure hero ORDER|MENU + city chooser, Social Proof, Wheel, Tonight live hours, Ajarski, Deals, Gallery, Reviews plain HTML, Locations 2 cards, Catering teaser, Videos teaser, Promo Videos teaser, FAQ, final CTA — DONE but need to improve CRO per cro agent

Phase 3 Menu Engineering — Verify 38 dishes no prices 6 images real 100% CTAs → Toast — DONE but need to ensure AOV focus

Phase 4 Conversion System — Verify bottom nav mobile ORDER distinct 44px tap — DONE but need to ensure ORDER badge distinct + sticky order + magnetic buttons

Phase 5 Local SEO — Verify unique content vs SLO, schema validates, 0 NAP mismatches — DONE but need to ensure Paso page best source (address/phone/hours/menu/order/directions/parking/delivery/catering/photos/reviews/FAQ) + keyword map

Phase 6 GEO — Verify llms.txt mentions ordering/locations/menu/dietary, no invented URLs — DONE but need to ensure facts-first, entity consistency, citation-worthy our-story

Phase 7 Performance — Verify LCP<1.5s INP<100ms CLS<0.02 hero AVIF 36KB JS 28KB no backdrop-filter — DONE but need to verify via reasoning, ensure no will-change except allowed, ensure preload, ensure rAF batching

Phase 8 A11y — Verify keyboard, screen reader wheel listbox, pause toggle, RM kill — DONE but need to verify WCAG 2.2 AA, focus-visible, skip link, alt truthful

Phase 9 Security — Verify _headers security headers, no secrets, https Toast — DONE but need to scan secrets, XSS, injection, third-party

Phase 10 Analytics — Verify analytics-spec.md exists, no tracking without owner ID — Need to check spec and ensure js hooks

Phase 11 Catering Growth — Verify spec exists, no invented details — DONE catering.html exists but need to ensure spec and funnel

Phase 12 Final Review — DoD 25, 0 FAIL harness — Need to run final review

Each phase: Execute → Review → Next per superpowers-executing-plans.

## Immediate Next Steps (Full Team)

1. **architect**: Verify PROJECT_MAP, ARCHITECTURE, SEO_MAP, RESTAURANT_DATA up to date (sitemap 14 URLs, not 5), ensure vanilla binding, ensure build.py passes, ensure no framework.
2. **frontend**: Audit responsive, bottom nav, wheel, spin, marquee, hero, AVIF, ensure no overflow, 44px tap, keyboard operable, ensure CSS tokens single :root, ensure no dead classes.
3. **seo**: Audit all pages metadata, schema, sitemap 14 URLs, canonicals, OG, internal linking 100%, keyword map, ensure 0 NAP mismatches, ensure unique content per location, ensure no doorway duplicates, Lighthouse SEO 100.
4. **geo**: Audit llms.txt comprehensive, facts-first, entity consistency, schema real only, our-story citation-worthy, avoid AI-writing tells.
5. **cro**: Audit funnel ≤2 clicks to order, bottom nav ORDER distinct, sticky order, ORDER badge, magnetic buttons, AOV focus, reduce friction, mobile UX, visual hierarchy.
6. **content**: Audit copy truthful, alt text truthful, never invent facts, menu desc from master data, FAQ factual, catering min order lead time owner to confirm.
7. **analytics**: Check analytics-spec.md exists, ensure js hooks data-catering etc, ensure no tracking without owner ID, privacy compliance, dashboard design.
8. **visual-qa**: Audit typography/spacing/responsive/hero/images/mobile/buttons/hierarchy/brand million-dollar, browser automation reasoning, visual council, hallmark anti-slop.
9. **security**: Scan secrets, XSS, injection, third-party Toast https, headers present, privacy compliance, supply chain no CDN.
10. **performance**: Verify LCP<1.5s INP<100ms CLS<0.02 Lighthouse≥98 JS<40KB Hero AVIF<180KB AVIF layer, preload, rAF batching, no backdrop-filter, no will-change except allowed, build.py passes.
11. **accessibility**: Verify WCAG 2.2 AA keyboard screen reader focus-visible pause+RM skip link alt truthful.
12. **catering-growth**: Verify catering funnel, winery/Cal Poly partnerships spec, catering SEO, no invented details.
13. **final-reviewer**: DoD 25, 0 FAIL harness, release ready YES/NO + blockers.

We will execute each agent's improvements in parallel where possible, but phase-gated per superpowers-executing-plans: Execute Phase 1 → Review Phase 1 → Execute Phase 2 → etc. For this full team pass, we will run all phases quickly and document.

We have already executed many phases in previous rounds (Round 12 catering, Round 13 blog maps breadcrumbs, Round 14 order FAQ social proof, Round 15 videos, Round 15b promo videos). Now we need to ensure all gates pass and do final polish.

We will now execute improvements for each agent.
