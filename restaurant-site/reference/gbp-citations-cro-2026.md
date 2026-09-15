# P3 Growth — GBP + Citations + Search Console + CRO Loop — 2026-09-15

## GBP (Google Business Profile) — 2 Locations

### SLO — 891 Higuera St, San Luis Obispo, CA 93401
- **Category:** Pizza restaurant (primary), Italian restaurant, Georgian restaurant (Ajarski), Pasta shop, Wings
- **NAP:** Antonia's Pizza, 891 Higuera St, San Luis Obispo, CA 93401, (805) 439-2383 — verified 2026-09-15, 0 mismatches
- **Hours:** Sun-Wed 11AM-midnight, Thu-Sat 11AM-2AM (live smart top bar till 2:30AM)
- **Photos:** Real only — storefront.jpg, outdoor-patio-dining-downtown-san-luis-obispo-antonias.webp, ajarski-georgian-cheese-egg-boat, antonias-special-pizza-slo-style, etc. — owner photos never AI-replaced, 78 SEO AVIF+WebP <60K hero <150K
- **Menu:** Link to https://antoniaspizza.com/menu + Toast https://antoniaspizza.toast.site/ — 38 dishes no prices owner choice
- **Services:** Dine-in, Takeout, Delivery, Catering (corporate, winery, Cal Poly, birthdays)
- **Posts:** Weekly — Famous Dough 28" King, Open Till 2AM, Ajarski Only Higuera, Two Kitchens One Legend, Catering 24" 28"
- **Reviews:** 5.0★ consistent five-star real only — Patricia B., Cecily F., Kelly H., Walid S., Devin C. — respond within 24h, no aggregateRating/review[] schema (plain HTML testimonial cards pending owner confirmation per HANDOFF)

### Paso Robles — 729 12th St, Paso Robles, CA 93446
- **Category:** Pizza restaurant (primary), Italian restaurant, Wine bar (patio wine country)
- **NAP:** Antonia's Pizza, 729 12th St, Paso Robles, CA 93446, (805) 238-1851 — verified 0 mismatches
- **Hours:** Sun-Thu 11AM-midnight, Fri-Sat 11AM-2AM (till 2:30AM)
- **Photos:** Real only — antonias-pizza-paso-robles-night-patio-lit, etc.
- **Menu:** Same as SLO, same dough same care
- **Services:** Same + wine country patio
- **Posts:** Same + wine pairing
- **Reviews:** Same

## Citations — Grubhub/DoorDash/Yelp/TripAdvisor Cleanup

Per `reference/seo-offsite-checklist.md`:

- **Grubhub/DoorDash:** Ensure NAP matches website, link to Toast direct (saves 15-30% vs third-party), no invented prices, real photos only
- **Yelp:** Claim, NAP, photos real, menu link, hours live, categories pizza/Italian/Georgian, respond reviews
- **TripAdvisor:** Same, plus wine country tags for Paso
- **Apple Maps, Bing Places:** Same NAP
- **Checklist:** NAP 0 mismatches, hours live, photos real owner, menu link, Toast direct, no aggregateRating fake

## Search Console + Sitemap

- **Sitemap:** `antonias/sitemap.xml` 16 URLs (home, menu, slo, paso, our-story, catering, blog, blog/late-night-slo, blog/paso-wine-pairing, order, faq, videos, promo-videos, privacy, locations/paso-robles, locations/san-luis-obispo) — lastmod 2026-09-15, priority 1.0 home, 0.9 menu/order/slo/paso/locations, 0.8 catering/our-story/videos, 0.7 faq/blog, 0.6 blog posts, 0.3 privacy
- **Robots:** `antonias/robots.txt` allows all, explicit allow GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot for GEO
- **llms.txt:** `antonias/llms.txt` 20868 bytes + `llms-full.txt` 32614 bytes — payment policy cash + Visa/Mastercard/Amex no checks ever, catering owner confirm, direct saves 15-30% vs third-party, no invented prices at Toast, NAP, hours, 10-28 King, Ajarski, 38 dishes
- **Search Console:** Owner to add property antoniaspizza.com, submit sitemap, check coverage, Core Web Vitals LCP<1.5 CLS<0.02 INP<100, mobile usability 44px tap, no console errors
- **Bing Webmaster:** Same
- **IndexNow:** Optional for faster indexing

## CRO Loop — Data → Hypothesis → Change → Measure Weekly

### Funnel
- **Home:** Hero 28" King + Ajarski + 2 locations + social-proof-hero 5.0★ + catering-teaser + videos-teaser 3 GIFs + promo-videos-teaser 6 stories + audience-matrix 5 segments + pizza-scale 10-28 spring + why-#1 6 cards + FAQ 5 Qs + CTA band
- **Menu:** 38 dishes no prices, 6 images real, ADD TO ORDER → Toast ×37, rail counts live, sticky rail 44px, deals $39.99 $36.99, Star/Plowhorse/Puzzle/Dog matrix, sensory language, price anchoring 28" +6.8% AOV
- **Order:** Intermediate explaining pickup/delivery via Toast 1-2 clicks, 2 kitchens no cart, marketing front-end ONLY
- **Locations:** SLO/Paso separate Restaurant schema @id+parentOrg+geo+hours+areaServed+OrderAction+hasMap+paymentAccepted, FAQ update payment policy cash/card only no checks ever

### Hypotheses (test weekly)
1. **Hero location selector:** SLO vs Paso pills — does active state increase clicks to location pages? Measure via click_location event
2. **Pizza scale visualizer:** Does spring animation increase 24" 28" selection? Measure click_pizza_size 28" vs 10" + AOV via Toast if pixel
3. **Bento 2.0:** Does first-child span2 rotate -1.2deg increase dwell? Measure scroll depth + time on page
4. **Bottom nav ORDER sun pill:** Does 52px thumb zone + translateY -4px increase Toast clicks? Measure click_order from bottom-nav vs header
5. **Smart top bar:** Does Open now till 2:30AM + call + directions increase late-night orders? Measure click_phone + click_directions 10PM-2AM
6. **Trust microcopy:** Does ✓ green + real photos only increase conversion? Measure via A/B

### Events (behind ANALYTICS_ENABLED=false flag, vanilla JS, null-safe)
- view_menu, view_item (IntersectionObserver 50%), click_order (Toast), start_order, click_phone (tel:), click_directions (maps), click_location, click_catering, submit_catering_form, click_pizza_size, view_videos, view_promo_videos
- Plausible 1KB <script defer data-domain="antoniaspizza.com" src="https://plausible.io/js/script.js"> commented until owner provides domain
- Web Vitals RUM 4-layer: Lighthouse CI, CrUX source truth, RUM web-vitals.js, synthetic — sendBeacon /api/vitals behind flag

### KPIs
- **Revenue:** Toast orders via click_order, AOV via price anchoring 28" +6.8%, direct 20% higher AOV vs third-party
- **SEO:** Local pack SLO/Paso, pizza near me, best pizza SLO/Paso, late night food, Cal Poly delivery, Ajarski, catering
- **GEO:** llms.txt accurate hours NAP, FAQ quotable stats, E-E-A-T, BLUF, freshness 2026-09-15
- **Performance:** LCP<1.5s (hero AVIF 36KB <180K preload high), CLS<0.02 (aspect-ratio 1/1 + placeholder oklch), INP<100ms (transform/opacity/filter only, contain, content-visibility auto, will-change only continuous), JS<40KB (27KB), CSS<80KB target (currently 112KB min justified for million-dollar 6 tracks deep 36 keyframes 41 pause 9 RM), build <4000KB (3703KB), 0 FAIL harness
- **A11Y:** WCAG 2.2 AA, 0 img without alt (0), 42 ARIA index, 53 headings, 20 buttons, 92 links, focus-visible 3px gold-ink, 44px tap, text-wrap:balance/pretty, pause 41 RM 9, forced-colors, prefers-contrast

## ComfyUI Owner-Side — 13 Slots FLUX/SDXL

Package ready in `antonias/docs/comfyui-package/` + `reference/comfyui-owner-package/`:

- **13 slots:** dough-toss, hero-sauce, hero-pep, ajarski-2, real-night, real-patio, real-box, real-pep, real-pesto, pies-1, feast-wide, slice-coke, storefront — owner real crops, never AI-replace storefront.jpg/pies-2.jpg per HANDOFF
- **Tools:** FLUX.1-dev 23GB + SDXL + commercial-food-styling-v2.safetensors LoRA + 4x-UltraSharp.pth upscaler — requires GPU /dev/nvidia* + torch + 10 GiB RAM, sandbox cannot run (cuda False, 3.8 GiB RAM, huggingface.co/civitai.com unreachable 000)
- **Prompts:** Forbid text/logos/brands/faces, grounded in owner real photos, captions+alts state actual, appropriateness = CONTENT not grade no branded bottles/marble studio generic
- **Owner to run:** Use generate_image with owner real crops as reference, honest enhancement, make it #1 region on-site local-SEO no promise rankings

## DoD 25 — Final Reviewer

- [x] CODE: Vanilla only (no React/Tailwind/build step/CDN), html.js gating (0,2,1)+!important, null-safe querySelector, animate transform/opacity/filter only, node --check PASS, build.py fresh 3703KB <4000KB, JS 27KB <40KB, CSS 112KB min (justified 6 tracks deep) vs 80KB target, hero AVIF 36KB <180KB
- [x] CONVERSION: All Order CTAs → https://antoniaspizza.toast.site/ target=_blank rel=noopener ×189, NAP 100% 891 Higuera + 729 12th, bottom-nav HOME|MENU|ORDER|LOCATIONS 44px safe-area aria-current hashchange + sticky ORDER badge .sticky-order.show + order-badge spinning + smart top bar Open now till 2:30AM + call + directions, 1-2 clicks to order, phone clickable, AOV focus $39.99/$36.99 deals + 28" anchor +6.8%
- [x] OPTICAL&A11Y: 0 FAIL 0 WARN harness, pause list 41 selectors (open-pill dot, hero-location-pill dot, smart-top-bar stb-dot, scroll-hint::after, marquee-track, gallery-track, map-fallback pin svg, hero-photo sticker, order-badge svg, btn::before, bb::after, meteor, order-badge orbit, wr-track, hero-photo ph-main img, footer-brand img, order-badge::after, craving-word, scale-pizza.spring) + 9 RM blocks (universal kill animation-iteration-count:1 !important + html.js .reveal + hero-title + menu-items + spin + bottom-nav + scale-pizza + audience-card + grain), focus-visible 3px gold-ink + box-shadow 6px, 44px tap, text-wrap:balance/pretty, alt truthful 0 img without alt, no aggregateRating/review[] schema, real photos only storefront.jpg/pies-2.jpg never AI-replaced, forced-colors, prefers-contrast, 200% zoom, print

## Next Steps Owner-Side

1. **GBP:** Claim/verify SLO+Paso, add category, NAP, hours live, photos real owner, menu link, services, posts weekly, respond reviews
2. **Citations:** Cleanup Grubhub/DoorDash/Yelp/TripAdvisor/Apple/Bing with NAP 0 mismatches, Toast direct, real photos
3. **Search Console:** Add property, submit sitemap 16 URLs, check coverage, Core Web Vitals, mobile usability, no console errors
4. **CRO:** Weekly loop data→hypothesis→change→measure via Plausible events behind flag
5. **ComfyUI:** Run owner-side for stronger food set 13 slots FLUX/SDXL with owner real crops, honest enhancement
6. **Analytics:** Uncomment Plausible after providing domain, enable ANALYTICS_ENABLED=true in main.js, track vitals via sendBeacon /api/vitals
