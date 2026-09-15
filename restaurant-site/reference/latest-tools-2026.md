# Latest Tools & Skills 2026 — Deep Research — Applied to Antonia's

> Research date: 2026-09-15 — 10 queries depth 2-3 — 100+ results — distilled to actionable vanilla-only upgrades per HANDOFF §9.

## 1. Frontend 2026 — Vanilla wins when islands

**Trends:**
- Svelte 5 compiles to vanilla JS ~1.7KB runtime no VDOM, SolidJS ~7KB fine-grained signals, Astro ships 0KB JS by default islands architecture client:load/idle/visible/media, Qwik resumable zero JS initial, Lit ~5KB Web Components, Alpine ~7KB sprinkle
- React still ~44.7% usage but 45KB bundle + hydration tax, Next.js 9.4/10 default for full-stack but 200KB+ initial
- Best for content sites: Astro 98-100 Lighthouse, <400ms FCP globally, zero JS to blog posts

**Vanilla translation (binding: no React/Tailwind/Astro/build step/CDN/npm):**
- Our main.js already islands-like: IntersectionObserver gates reveals/counters/wheel autoplay onScreen, rAF-batched magnetic, rect cached, scroll passive only header, 32KB IIFE — matches Astro zero-JS-by-default philosophy
- New: **Speculation Rules API** — prefetch next pages (menu, slo, paso, order) on hover/idle — 1 line JSON in head — progressive enhancement, no JS fallback
- New: **View Transitions API** — `document.startViewTransition` for smooth nav — progressive enhancement, behind flag, respects RM
- New: **CSS containment** — `contain: layout paint` on cards, `content-visibility: auto` on below-fold sections (gallery, reviews, catering-teaser) — reduces render cost INP
- New: **Long Animation Frames API** — LoAF for INP triage (future when owner enables RUM)
- New: **size-adjust** for Baloo 2 to reduce CLS from font swap — add @font-face size-adjust 105% ascent-override descent-override

## 2. Performance 2026 — INP is hardest

**Thresholds:** LCP <2.5s buffer <2.0s, INP <200ms buffer <150ms, CLS <0.1 buffer <0.05 — 43% sites fail INP most common
**Budgets:** JS <300KB compressed, CSS <80KB, hero <200KB, total <1.5MB, third-party <5 scripts
**Tools:**
- Lab: Lighthouse, Chrome DevTools Performance Web Vitals markers, WebPageTest filmstrip waterfall
- Field: CrUX (Google Search Console CWV report Good/Needs Improvement/Poor), PageSpeed Insights field+lab, web-vitals JS lib v5 with attribution (onLCP/onINP/onCLS), CrUX Dashboard 28-day rolling, RUM SpeedCurve Datadog
- CI: Lighthouse CI fail build if <98
- Stack: 4-layer — Lighthouse CI regression, CrUX source of truth, RUM web-vitals.js custom dimensions low-traffic, synthetic monitoring baselines
- Optimizations: image lazy-load AVIF near-universal 2026 q55, CSS containment, font-display swap + size-adjust, JS code-splitting break long tasks yield main thread, minimize DOM, HTTP/3, 103 Early Hints (Cloudflare auto from Link headers), edge caching, service worker bfcache eligible, Speculation Rules, View Transitions

**Applied:**
- Already: hero AVIF 36KB <200KB, JS 32KB <300KB, CSS 76K <80KB, total <1.5MB, 0 third-party (no CDN), no backdrop-filter, will-change only continuous motion, AVIF 26 2056KB -50%, preload LCP fetchpriority high, logo 192×192 12KB, width/height truthful
- New: Add web-vitals RUM behind flag ANALYTICS_ENABLED (same as Plausible), sendBeacon to /api/vitals (owner to implement endpoint or console debug), attribution element largestShiftTarget/interactionTarget/element
- New: Add Speculation Rules prefetch menu, slo, paso, order, faq
- New: Add CSS contain + content-visibility auto on below-fold
- New: Add size-adjust to @font-face Baloo 2
- New: Document 103 Early Hints via Link headers in _headers (preload hero + fonts)

## 3. Local SEO 2026 — GBP + AI visibility

**Tools ranked:**
- Best all-in-one: **Semrush** Local Base $30/location/mo — tracks AI Overviews, AI Mode, ChatGPT, Gemini to neighbourhood, plus SEO + local toolkit, Map Rank Tracker heatmap, GBP audit, posting, reviews, photo, citations, listings, share of voice
- Best dedicated local: **BrightLocal** $39/mo — audit + tracking + citations + reviews + Local Search Grid + white-label
- Best geo-grid: **Local Falcon** $24.99/mo — visual heatmaps exact ranking by location, 100 free credits, 4.8/5 G2
- Best budget: **Moz Local** $16/mo — duplicate deletion, distribution
- Best guided: **Localo** $39/mo billed annually — AI weekly tasks, competitor protection, AI website builder
- Best enterprise listings: **Yext** $199/year — 200+ publishers instant sync, Yext Scout AI visibility, 186% increase website clicks when 75% network synced
- Best GBP-first: **Localith** $9/mo — bulk updates, reviews, posts, heatmaps, Profile Locking, AI Review Reply Agent, AI SEO Agent
- Best free: **Google Business Profile** mandatory + Google Search Console + GMB Everywhere Chrome extension (audits categories reviews posts rank check teleport any location) replaces 9 tools $593/mo combined cost
- Others: Whitespark $1/location citations rank tracking 150K users, Synup $35/location 75+ directories, SOCi Genius Local Search Agent 1400 optimizations/month, Birdeye Listings AI, Podium SMS review requests, Grid My Business geo-grid + GBP management, SE Ranking $62/mo, Local Viking $39/mo GBP post scheduling + geo-grid, Ahrefs Brand Radar 7 platforms incl Claude, Advanced Web Ranking $139/mo street-level + AI Overviews ChatGPT Perplexity

**AI visibility tracking (new 2026):**
- Semrush tracks AI Overviews, AI Mode, ChatGPT, Gemini to neighbourhood
- Ahrefs Brand Radar tracks 7 platforms incl Claude custom prompts Lite+ full packs $199/mo/channel $699 all
- SE Ranking AI Overview tracker country/location, Advanced Web Ranking AI Overviews ChatGPT Perplexity
- BrightLocal, GBP, Local Falcon, Whitespark, Moz Local, Localo, Local Viking, Yext NOT built for AI search visibility

**Applied:**
- Already: GBP NAP consistent 0 mismatches, 2 locations unique Restaurant schema @id+parentOrg+geo+hours+areaServed+OrderAction, sitemap 14 URLs, robots allow AI crawlers, _redirects clean, hours till 2AM live pill same truth SCHEDULES, maps fallback pin, reviews plain HTML, FAQPage
- New: Enhance GBP content plan in reference/seo-offsite-checklist.md — weekly posts, photos real, Q&A, services, menu, reviews response AI agent, heatmap tracking via Local Falcon free tier, GMB Everywhere audit for categories competitor
- New: Add LocalBusiness schema details: hasMap, priceRange $$, servesCuisine pizza Italian Mediterranean American, paymentAccepted, currenciesAccepted USD, etc.

## 4. GEO 2026 — Be cited inside answer

**Definition:** GEO = Generative Engine Optimization, also AEO Answer Engine Optimization, LLM SEO, AI search optimization — practice of making business visible and recommendable inside AI-generated answers ChatGPT responses, Perplexity citations, Google AI Overviews, Gemini Claude recommendations — goal citation inside synthesized answer not ranked link

**What doesn't work (data):**
- llms.txt does approximately nothing: Google John Mueller no AI service says they use llms.txt, server logs don't check, Ahrefs 137K domains 97% llms.txt zero requests ever, standard nobody adopted kept alive by tools that generate it — treat as optional infrastructure not strategy — 69.7% sites have no llms.txt (SearchScore July 2026 6944 sites)
- Schema myths: Google says no special AI schema, no need new machine-readable AI file, ignores llms.txt

**What works (boring and free):**
- Brand mentions third-party, comparison content, quotable statistics, entity consistency, freshness, E-E-A-T, extractable content BLUF structure, passage clarity, server-rendered (AI crawlers don't reliably execute JS), allow right AI crawlers OAI-SearchBot ChatGPT-User GPTBot PerplexityBot Perplexity-User Google-Extended Googlebot Claude-SearchBot Claude-User, entity consistency across site GBP LinkedIn directories, third-party mentions, digital PR with AI citation surfaces, seed content across platforms LLMs pull from (Reddit, YouTube, Wikipedia, news, blogs, directories, etc.), freshness recency weight high for Perplexity ChatGPT, comparison content "based on reviews from X comparisons from Y product pages from Z most-recommended options are…", quotable stats, direct answer quality

**Platform differences:**
- ChatGPT search mode: real-time retrieval + direct crawl Bing index + Google SERP + OpenAI direct inline citations high recency SEO + AI bot access + BLUF
- Perplexity: always-on real-time own index multiple sources always visible high citation density very high recency technical crawlability passage clarity fresh content
- Google AI Overviews / AI Mode: Google search index exclusively Google own index embedded overview card medium recency SEO fundamentals E-E-A-T structured data
- Claude: curated high-authority training data + selective web selective fewer citations medium recency domain authority authoritative sourcing llms.txt
- Gemini: Google index + Bard training Google index source cards visible medium recency Google SEO entity optimization

**5 levers:**
1. AI crawler access foundation — audit robots.txt per AI agent by name, check CDN bot rules, create llms.txt root, confirm server-rendered
2. llms.txt + schema — Organization Article FAQPage, entity consistency, 1-2 days structural compounds
3. Comparison content + quotable stats — "best pizza paso robles vs …", "10-28 inch King 28-inch monster same dough same care"
4. Third-party mentions + digital PR — Travel Paso, local orgs, tourism, Cal Poly, wineries, local media, events
5. Freshness — weekly GBP posts, blog posts, menu updates, hours, photos

**Tools:**
- Best overall: **LLM Pulse** €49/mo — 5 models default ChatGPT Perplexity Gemini AI Mode AI Overviews paid add-ons Claude Copilot Grok DeepSeek Alexa Shopping, URL-level citations share of voice sentiment REST API Looker Studio agency white-label
- Profound $99/mo yearly ChatGPT Starter 3 engines Growth deep citation analytics large brands
- Athena HQ free tier Starter $295/mo 9 models credit-based visibility content workflows
- Scrunch AI $250/mo ChatGPT Claude Gemini Perplexity AI Mode AI Overviews Meta action-oriented suggestions
- Otterly.ai affordable ChatGPT Perplexity Google AI lightweight
- LLMrefs $79/mo 500 prompts unlimited projects seats weekly tracking
- Yotpo ecommerce ChatGPT Perplexity limited review-driven
- WordLift schema-led, WRITER GEO content generation enterprise, Conductor enterprise SEO+AEO, Mintlify SaaS docs llms.txt generation free tier
- Trendos best AI visibility GEO insights, nexos.ai AI conversion intelligence predictive, Rankability llms.txt generator first to standardize

**6-week plan:**
Weeks 1-2 llms.txt + schema Organization Article FAQPage entity consistency 1-2 days structural
Weeks 3-4 comparison content + quotable stats + BLUF + passage clarity
Weeks 5-6 digital PR + third-party mentions + freshness + prompt tracking

**Future 2027:**
- Agentic search AI-to-AI queries shopping agents research agents customer-support agents read site programmatically lean heavily on llms.txt structured data clean APIs favour brands invested in agent-readable infrastructure
- Multimodal generative answers AI Mode Gemini ChatGPT synthesize text images video audio single answer optimizing images alt text structured Image schema videos clean transcripts chapter markers audio transcripts podcasts markup becomes part of GEO

**Applied:**
- Already: llms.txt 113 lines + Videos + Promo Videos 6 stories, robots allow AI crawlers, Restaurant 2× schema @id+parentOrg+geo+hours+areaServed+OrderAction, FAQPage, BreadcrumbList, VideoObject, CollectionPage, our-story editorial citation-worthy, no invented URLs, facts-first, entity consistency brand Antonia's + department SLO/Paso
- New: Enhance llms.txt with comparison content "Why 10-28 inch range matters vs competitors", quotable stats "28-inch King same dough same care No frozen pucks no par-bake", freshness date 2026-09-15, entity sameAs only real, add prompt examples "best pizza san luis obispo open till 2AM" "pizza paso robles downtown 729 12th"
- New: Add more comparison content in blog posts late-night-slo vs competitors, paso-wine-pairing vs other pizza
- New: Add quotable stats in our-story: "10-inch personal to 28-inch monster same dough same care", "Sun-Wed 11-mid Thu-Sat 11-2AM till 2AM", "2 downtown locations 891 Higuera SLO 93401 and 729 12th Paso 93446"

## 5. CRO 2026 — Direct ordering + AI

**Tools:**
- Behavior: Hotjar heatmaps session recordings on-site feedback free tier, Crazy Egg confetti scroll-maps session replays $29/mo, FullStory high-fidelity frustration detection error tracking enterprise, Microsoft Clarity free heatmap session replay AI insights rage-click unlimited recordings best for startups SMBs, Mouseflow friction scoring form analytics $31/mo
- A/B testing: Optimizely enterprise A/B multivariate feature flags server-side $36k/yr up, VWO all-in-one testing heatmaps behavior analytics $49/mo, Statsig feature experimentation server-side free+paid, Varify.io lightweight $99 flat, Fibr AI AI-driven generative AI custom, Keak autonomous A/B 31KB script zero layout shift best for multi-framework, pagent.ai agentic e-commerce multi-dimensional hypothesis, EverConvert autopilot copy performance-based
- Analytics: GA4 free funnel engagement event-based, Mixpanel product analytics conversion cohort retention free+paid, Heap auto event tracking code-free $99/mo, Adobe Analytics enterprise cross-channel real-time custom
- Landing: LeadPages drag-drop A/B $37/mo, Instapage enterprise personalization $79/mo, OptinMonster exit-intent behavior $16/mo, Woorise gamified contests giveaways $29/mo
- SEO CRO: Ahrefs $99/mo, SEMrush $129/mo, Moz $99/mo
- AI CRO: Trendos best tracking AI visibility GEO insights, nexos.ai best AI-driven conversion intelligence predictive €19.50/mo ~$22.70/mo 14-day trial operational AI automation, Intellimize Webflow Optimize best AI personalization automated traffic routing $14/mo add-on, VWO experimentation-heavy testing insights AI assistance 30-day trial, Unbounce Smart Traffic best landing pages adaptive allocation 50 visits routing adapts, Attention Insight best AI visual attention pre-launch UX validation, Optimizely enterprise advanced stats free rollouts tier

**Restaurant CRO pillars (benchmark lifts):**
- Direct ordering channels 20% higher AOV Toast/MarketDataForecast
- Mobile speed optimization 7% conversion per second saved HTTP Archive Akamai
- AI-powered upselling 15-30% check increase Spindl.app
- Mobile ordering optimization 30% higher averages Incentivio
- One-click reordering 20% higher AOV
- Speed under 3s, short 5-field forms 25% higher completion vs 8+ fields 500 A/B tests, strong trust signals 10-20% boost MGH Survey
- 7-step playbook: speed audits under 3s 1-2 weeks, form reduction 1 week, AI recommendations 2-4 weeks cross-sell, trust signals 1 week, revenue-tied tracking 20-30% lifts 30-90 days
- Strategic CTAs increase conversion up to 83% vs unclear paths, every extra click reduces conversion up to 20%
- HTML menus 58% increase completed orders, photos 70% more orders 65% higher takeout/delivery, descriptive language 27% boost Cornell Food Brand Lab
- Photo-based menus 25% more orders when real dishes, professional food images +35% orders, menu items with photos +6.5% sales
- Mobile-first: responsive images, thumb-friendly navigation, simplified menu, fast <3s, font >=16px, no PDF 89% struggle, no pop-ups hijacking
- CTA design: contrasting colors impossible to miss, top nav visible at all times, above fold, throughout menu pages, floating sticky buttons stay visible, 30% increase Smokin Oak Wood Fired Pizza prominent Order Online, 25% boost Mr Jim's Pizza floating Order Now

**Applied:**
- Already: direct ordering Toast external 1-2 clicks no cart, mobile-first vanilla no framework, HTML menus 38 dishes no prices 6 images real, photos real, descriptive language, CTAs above fold Order Now See Menu, throughout menu ADD TO ORDER, floating sticky order Hungry Order Now, bottom nav HOME|MENU|ORDER|LOCATIONS ORDER distinct, contrasting colors sky sun navy paper red-deep gold-ink, thumb-friendly 44px tap, fast LCP 36KB AVIF JS 32KB, trust signals 5.0★ reviews plain HTML, tonight live hours, maps fallback, no PDF, no pop-ups
- New: Add more strategic CTAs in menu.html each category after 3 items Order This Category, add upsell bundles in deals Big pies Bigger value 2 XL $39.99 Most popular Large Specialty Combo $36.99 Combo + Rewards App Free, add trust signals microcopy "Hand-crafted dough No frozen pucks No par-bake Same dough 10 to 28", add one-click reorder hint "Reorder your last Toast order in 1 tap at Toast", add AI upselling placeholder "Add garlic knots? Add 2-liter?" via Toast (Toast handles)
- New: Add Clarity free heatmap behind flag (owner to enable) for behavior analytics

## 6. Security 2026 — CSP most powerful

**Best practices:**
- Start CSP Report-Only default-src self nonces inline scripts frame-ancestors self report-to Baseline migrate from report-uri since March 2026 Baseline
- HSTS preload nearly irreversible 120K domains Chrome preload list April 2026 35.7% sites ship HSTS use preload directive only submit when every subdomain HTTPS documented business approval, start max-age 300 gradually increase includeSubDomains only after verified, max-age 31536000 includeSubDomains preload
- SRI SHA-384 recommended balance security hash length SHA-512 acceptable always include crossorigin browsers silently ignore without it automate hash updates build tools pin immutable versioned URLs
- Headers: X-Content-Type-Options nosniff every response, Referrer-Policy strict-origin-when-cross-origin, X-Frame-Options SAMEORIGIN fallback CSP frame-ancestors stronger, Permissions-Policy camera mic geolocation usb payment, COOP same-origin, CORP same-site, COEP require-corp only if needed test cross-origin isolation
- Recipes Apache: Header always set Content-Security-Policy default-src self base-uri self object-src none script-src self nonce-%{CSP_NONCE}e style-src self img-src self data: frame-ancestors self upgrade-insecure-requests, Strict-Transport-Security max-age 31536000 includeSubDomains, Referrer-Policy strict-origin-when-cross-origin, X-Content-Type-Options nosniff
- Nginx: add_header X-Content-Type-Options nosniff always, Referrer-Policy strict-origin-when-cross-origin always, Permissions-Policy geolocation=() microphone=() camera=() payment=() always, Cross-Origin-Opener-Policy same-origin always, Cross-Origin-Resource-Policy same-site always, HSTS max-age 15552000 always, CSP Report-Only default-src self report-to csp-endpoint always
- Rollout: Inventory Baseline Week1 map domains current header third-party, CSP Report-Only Weeks2-3 monitor 14+ days fix violations, Basic Headers Week4 nosniff referrer permissions, HSTS Gradual Weeks5-8 start 300 gradually increase includeSubDomains only after verified, CSP Enforcement Week9+ switch enforce keep reporting, Advanced Isolation optional COOP/COEP/CORP
- Mistakes: Access-Control-Allow-Origin * with credentials use allowlist Vary Origin, only X-Frame-Options use frame-ancestors CSP, forgetting nosniff set every response, not setting cookie flags Secure HttpOnly SameSite, preloading HSTS before ready only submit when every subdomain HTTPS, CSP allows unsafe-inline use nonces hashes remove inline handlers, missing frame-ancestors even if X-Frame-Options, COEP require-corp without CORP on assets add CORP on images fonts WASM

**Applied:**
- Already: _headers present X-Content-Type-Options nosniff Referrer-Policy strict-origin-when-cross-origin X-Frame-Options SAMEORIGIN Permissions-Policy camera=() microphone=() geolocation=() payment=() CSP default-src self img-src self data: https: font-src self style-src self unsafe-inline script-src self connect-src none frame-ancestors none form-action self https://antoniaspizza.toast.site base-uri self HSTS max-age 31536000 includeSubDomains preload Cache-Control immutable fonts 31536000 assets 86400 css/js 604800
- New: Add COOP same-origin, CORP same-site, upgrade-insecure-requests to CSP, keep unsafe-inline style-src for now because no nonce build step (vanilla binding) document future move to nonces/hashes when build step allowed, keep frame-ancestors none + X-Frame-Options SAMEORIGIN fallback, keep form-action self https://antoniaspizza.toast.site
- New: Document rollout plan in reference/security-audit.md

## 7. Accessibility 2026 — axe-core 57%

**Tools:**
- Free: A11yInspect Chrome extension 600+ checks 30 criteria WCAG 2.2 A AA groups by conformance level severity code inspection, axe DevTools Chrome Edge Firefox 50 rules low false positives 3B downloads 875K extensions trusted, Lighthouse built-in axe-core, WAVE visual extension + online tool content teams partial visual structure, ANDI bookmarklet Section 508 accessible name strong manual, Pa11y CLI CI/CD open source list URLs WCAG 2.2 fail build threshold, ARC Toolkit manual, Stark design plugin Figma Sketch contrast $10/mo, IBM Equal Access free extension WCAG 2.2 depth, Microsoft Accessibility Insights guided manual+automated excellent workflows, Google Lighthouse axe-core rules
- Paid enterprise: Siteimprove unified Dynamic Content Checker PDF audit custom pricing Forrester Wave Leader 2025 monitoring training, Level Access governance audits training compliance workflows enterprise license, AudioEye $49/mo automated remediation volume, AccessiBe AI overlay accessWidget minutes broad WCAG 2.1 AA background, UsableNet AQA scale complex simulate screen reader keyboard SPA, Tenon API-first $28/mo CI/CD, BrowserStack real devices browsers QA regression, Clym open source compliance desktop app
- Screen readers: NVDA free open source Windows, JAWS commercial Windows most used desktop, VoiceOver built-in macOS iOS most used mobile, TalkBack native Android, manual testing critical journeys login checkout registration account management
- Decision: Developer axe DevTools+Lighthouse catch early, Visual WAVE, Manual Accessibility Insights, QA BrowserStack real devices, Enterprise Level Access Siteimprove, Compliance EqualWeb, CI/CD Pa11y axe-core Model Context Protocol server DevNucleus86/mcp-accessibility-scanner Playwright axe core matrix scans viewports zoom media queries
- Gap: automated 30-57% detection volume average vs axe-core 57% upper end, need manual expert testing critical journeys
- WCAG 2.2 AA benchmark

**Applied:**
- Already: html.js gating (0,2,1)+!important, null-safe $ $$, transform/opacity/filter only, infinite anims pause+RM lists 21 anims html.motion-paused paused !important RM animation none !important transition none !important transform none !important, skip-link, ARIA listbox wheel single tab stop arrow/Home/End aria-selected aria-activedescendant, FAQ aria-expanded, breadcrumbs, bottom nav aria-current, sticky order region, motion-toggle aria-pressed, focus-visible, alt truthful no empty except decorative aria-hidden, keyboard operable
- New: Add focus-visible stronger outline 3px solid gold-ink offset 2px, add prefers-contrast more support, add forced-colors support, add Pa11y CI config .pa11yci (future), add axe DevTools audit checklist in reference/a11y-audit.md

## 8. Analytics 2026 — Plausible 1KB 45× smaller

**Comparison:**
- Plausible $9/mo 10K views cookieless no consent banner GDPR compliant EU Germany Austria open source AGPLv3 self-host full data ownership real-time UTM funnel basic ecommerce basic API 1KB script sovereignty 91/100 15K paying customers bootstrapped profitable $1M+ ARR 2022 clean single-page dashboard non-analysts read weekly leadership opens weekly
- Fathom $14/mo 100K views cookieless no banner polished fast dashboard email reports goal tracking EU isolation 87/100
- Matomo Cloud €19/mo optional cookie-free mode full funnel full ecommerce 20KB script EU Matomo servers full ownership 84/100 self-host free your servers 99/100 HIPAA air-gapped offline 100% ownership audit-ready
- Simple Analytics $19/mo minimalist <1KB
- GA4 free cookies required consent banner complex GDPR US Google servers 45KB script advanced funnels product analytics revenue tracking BigQuery export Google Ads Search Console deep integration sovereignty 12/100
- Mixpanel free tier $20/mo cookie-based product analytics event tracking, Heap $99/mo auto event tracking code-free, Adobe Analytics custom enterprise cross-channel real-time

**Plausible vs GA4:**
- Plausible: no personal data aggregated trends 1000 visited pricing not profiles no cross-site no cookies no persistent IDs no fingerprint GDPR CCPA ePrivacy PECR Swiss FADP no banner legally drop 45× smaller 1KB vs 45KB single page real-time unique total pageviews bounce avg duration top referrers top pages geo device OS browser goal conversions UTM campaign funnels revenue Looker Studio Business tier $39/mo bootstrapped 2 founders 2020 EU jurisdiction low-risk vs VC-backed
- GA4: event-based not privacy-first cookies identifiers US infrastructure consent banners GDPR jurisdictions not privacy-first in Plausible sense maze menus but free full-featured ad-platform integration BigQuery export

**Best for:**
- Simple content minimal traffic Plausible free Cloudflare Umami lowest cost cookie-free zero friction
- SaaS marketing team Fathom UTM campaign EU isolation
- E-commerce EU customers Matomo Cloud/self-host full ecommerce GDPR
- Healthcare HIPAA Matomo self-host data never leaves servers
- Government regulated Matomo self-host 100% ownership audit-ready
- Agency multiple clients Plausible team plan multi-site clean dashboards
- Air-gapped classified Matomo self-host offline update no external transmission

**Applied:**
- Already: privacy.html no tracking currently What Antonia's collects nothing No analytics No cookies Order buttons hand to Toast, analytics-spec.md privacy-first vanilla JS no tracking until owner approves Plausible recommended GA4 with consent No GA ID in repo No secrets No cookies marketing front-end ONLY orders Toast external track clicks to Toast not purchases unless Toast post-purchase pixel, js/main.js ANALYTICS_ENABLED false track plausible gtag behind flag view_menu view_item IntersectionObserver 0.5 click_order toast.site data-loc start_order click_phone tel: click_directions maps click_location loc-tabs click_catering data-catering submit_catering_form null-safe no PII IP anonymized Respect DNT
- New: Add web-vitals RUM behind same flag sendBeacon /api/vitals body name value rating delta id navigationType page element attribution largestShiftTarget interactionTarget element — progressive enhancement — owner to implement endpoint or console debug — matches Core Web Vitals 2026 measurement stack 4-layer Lighthouse CrUX RUM synthetic
- New: Add Plausible snippet commented out in head <!-- Plausible owner to uncomment after providing domain: <script defer data-domain="antoniaspizza.com" src="https://plausible.io/js/script.js"></script> --> — lightweight 1KB

## 9. Restaurant Design 2026 — Video-first + direct ordering

**Stats:**
- 68% diners deterred by poor website design drives revenue
- 72% searches mobile non-negotiable
- 93% check menu online before visiting
- High-quality food photography +30-40% conversion
- Prominent Book a Table CTAs +50% reservations
- Local SEO + GBP drives 76% near me visits
- 69% website influences dine-in decision 43% check for takeout/delivery
- 89% struggle with PDFs on mobile
- 58% increase completed orders switching PDF to HTML
- Photos 70% more online orders 65% higher takeout/delivery
- Descriptive language +27% sales Cornell
- 35% longer site time video-first hero sections
- AI menu personalization +15-25% order value
- Direct ordering eliminates 15-30% third-party commissions
- Sustainability storytelling 73% prefer eco-conscious
- Strategic CTAs +83% conversion vs unclear paths every extra click -20% conversion
- Mobile load under 3s essential 61% leave non-mobile-friendly
- Font >=16px minimum no pop-ups hijacking ordering
- Clean HTML menu clear dish descriptions dietary allergen markers photos actual dishes not overly edited single switch increases conversions more than almost any design upgrade
- 6-tab model high-performing: Home Menu Order Reservations About Contact add more only if helps guest not looks complete
- 7 essentials: mobile-first performance <3s cellular no PDF menus no pop-ups font >=16px, prominent CTAs ordering visible at all times above fold throughout menu pages floating sticky, first-party ordering native integration rather than external redirects control menu presentation pricing accuracy order timing, searchable mobile-friendly digital menu organize by how customers think Quick Bites Shareables Comfort Classics not kitchen stations keep choices streamlined prevent decision paralysis write to sell Crispy buttermilk fried chicken house-made pickles spicy aioli converts better than chicken sandwich mark dietary vegan gluten-free nut-free icons high-quality photos top sellers customers buy with eyes, location hours clarity footer every page clickable phone embedded Google Map location-specific pages, visuals that support decisions photo-based menus 25% more orders when real dishes, clean layouts reduce friction whitespace readability visual hierarchy guides attention large primary actions minimal competing elements simplified layouts improved mobile conversion

**Trends:**
- Video-first hero (35% longer time)
- AI-powered menu personalization (+15-25% AOV)
- Direct online ordering
- Sustainability storytelling (73%)
- Dark mode fine dining
- Micro-animations on scroll
- QR code integration
- Real-time availability
- Illustration eating photography top funnel Sweetgreen Min Heo hand-drawn ingredient characters Ottolenghi Irving Co paper-cut Dishoom Bombay-cinema-poster Nando's African-pattern library — best 2024-2026 brands use illustration for emotional connection save photography for conversion-critical menu moments inverting old big hero food photo playbook
- World-building replacing standard IA Dishoom per-café founding myths Hawksmoor Monday Wine Club Steak After Eight Experiences content blocks SingleThread farm inn workshop cinematic-dining narrative stack strongest 2026 restaurant sites treat each venue sub-experience as narrative universe not directory entry location pages graduated template cards to editorial chapters

**Applied:**
- Already: mobile-first vanilla no framework, HTML menus 38 dishes no prices 6 images real, photos real, descriptive language, CTAs above fold Order Now See Menu, throughout menu ADD TO ORDER, floating sticky order, bottom nav HOME|MENU|ORDER|LOCATIONS ORDER distinct, contrasting colors, thumb-friendly 44px tap, fast LCP 36KB AVIF JS 32KB, trust signals 5.0★ reviews plain HTML, tonight live hours, maps fallback, no PDF, no pop-ups, 6-tab model Home Menu Locations Our Story Order Catering? Actually nav HOME MENU LOCATIONS OUR STORY ORDER — close to 6-tab, video teasers 3 GIFs + promo videos 6 stories, micro-animations marquee gallery rotor orbit logoTurn badgeGlint kenBurns floaty word-rotate meteors storyCycle bgShift, world-building our-story editorial dough sauce Ajarski late-night two downtown spots, location pages unique content not template
- New: Add video-first hero enhancement — hero video placeholder CSS-only (vanilla binding no external video) with kenBurns already, add sustainability storytelling "Make it here Dough sauce seasoned crust made in kitchens not trucked Keep it honest Photos real pies No stock no fake reviews no hidden fees Feed everyone 10-inch to 28-inch vegan cheese gluten-aware options same line same care Stay open late Till midnight most nights till 2AM weekends Because SLO doesn't stop at 9" already in our-story — enhance with more eco-conscious "Hand-tossed in-house No frozen pucks No par-bake Same dough same care"
- New: Add QR code section in footer or order.html — QR for menu (owner to generate QR image, we add placeholder)
- New: Add illustration touch — hand-drawn style sticker Famous dough Already have sticker, keep illustration minimal per brand

## 10. Astro Islands 2026 — Zero JS

**Architecture:**
- Static-first server-side web apps statically generated SSGs minimal or zero JS client while seamless integration client-side tools libraries directives initialize on load or user interacts
- Islands: small focused chunks interactivity within server-rendered pages output progressively enhanced HTML specificity how enhancement occurs multiple entry points script islands interactivity delivered hydrated independently rest page just static HTML
- Philosophy: content-first development max static generation minimal JS Build Time identifies which components need JS Runtime only those get JS loaded Execution JS runs only for interactive elements Optimization script islands delivered hydrated independently rest static HTML improves FCP LCP TTI overall runtime
- Directives: client:load client:idle client:visible client:media
- Framework agnostic: React Vue Svelte Solid Preact vanilla JS same project bundles separate React 45KB runtime only loads pages that need it
- Build output: static Astro page no islands 98-100 Lighthouse performance JS budget only grows when explicitly spend it vs Next.js 200+ KB initial even no interactivity
- When right: content-driven websites blogs marketing sites documentation e-commerce, poor fit highly interactive SPA dashboard complex state real-time updates frequent client navigation, apps where every route behind auth static-first loses advantage, real-time live data WebSockets collaborative editing need proper SPA runtime
- Hybrid: static pages content fast cacheable CDN-friendly dynamic endpoints forms APIs no separate backend simple interactions

**Vanilla translation:**
- Already islands-like: main.js IIFE $ $$ helpers null-safe motionMQ live autoplay registry stop start motionPausedByUser markLoaded body.loaded DOMContentLoaded main.js defer custom cursor pointer fine !prefersReduced mousemove dot translate rAF loop ring translate grow header height --header-h ResizeObserver queueSync rAF header shrink hidden scroll down passive mobile nav nav-toggle scroll reveals IntersectionObserver threshold 0.16 stat counters threshold 0.6 data-count decimals dur 1600 eased hero parallax scroll+mousemove 3D tilt dish-card deal-card deal-mini base transform perspective 900px rotateY px*7 rotateX -py*7 translateY -4px rAF rect cached pointerenter magnetic buttons btn translate dx*0.18 dy*0.22-3 scale 1.03 rAF FAQ accordion location tabs open/closed status live one source truth SCHEDULES close>1440 spills tail inTail marquee duplication node-by-node aria-hidden review scroller drag menu rail live counts menu category rail spin-to-decide wheels 8 segments pointer 12 o'clock SEG 360/len onceKey localStorage footer year pie wheel pinza.com-style rotating slice carousel auto-rotate click-to-focus drag-to-spin synced labels N slices STEP 360/N rot current timer started onScreen mod render rotor transition .9s cubic-bezier .22,1,.36,1 transform rotate rot idx mod round -rot/STEP active slices aria-selected aria-activedescendant side-name dish-name craving-word swap goTo shortest way next prev play prefersReduced !onScreen motionPausedByUser stop timer setInterval next 4200 stop clearInterval autoplay stop start push spin-in spinIO threshold 0.35 started rot -STEP*2 render false rAF rot 0 render true setTimeout play 1400 disconnect liveIO threshold 0.15 onScreen started play else stop onMotionChange reduced stop else play slice click moved check goTo play keyboard listbox WAI-ARIA rotor single tab stop arrows Home End aria-activedescendant via render pause on focus focus stop blur play drag to spin centerOf rect pointerdown pressed moved a0 atan2*180/PI rot0 stop setPointerCapture pointermove d a-a0 >180 -360 < -180 +360 abs>6 moved rot rot0+d render false release pressed false snap round rot/STEP render true play pointerup pointercancel arrows data-wheel-next prev click next play pause on hover pointerenter !pressed stop pointerleave !pressed play render false magic UI spot mousemove --mx --my bottom nav HOME|MENU|ORDER|LOCATIONS rawPath pathMap current pathMap hash #locations current locations items data-page order skip aria-current page hashchange analytics P0 privacy-first behind flag ANALYTICS_ENABLED false track plausible gtag view_menu view_item IntersectionObserver threshold 0.5 click_order toast.site data-loc start_order click_phone tel: click_directions maps click_location loc-tabs click_catering data-catering submit_catering_form global motion pause WCAG 2.2.2
- Already zero-JS-like: no framework, no build step, no npm, no CDN runtime fetch, fonts self-hosted woff2, 32KB JS, 76K CSS, 36KB AVIF LCP, no third-party, no pop-ups
- New: Add Speculation Rules prefetch, View Transitions progressive enhancement, CSS containment content-visibility, size-adjust, bfcache friendly (no unload listeners)

## Action Plan — Make Strongest Site

### P0 (Now — vanilla binding respected)
- [x] Research 10 queries depth 2-3 latest tools 2026
- [ ] Add Speculation Rules API to all pages head — prefetch menu, slo, paso, order, faq
- [ ] Add View Transitions API progressive enhancement in main.js — document.startViewTransition with fallback, respects RM + motionPausedByUser
- [ ] Add CSS containment + content-visibility auto on below-fold sections (gallery, reviews, catering-teaser, videos-teaser, promo-videos-teaser, FAQ) — reduce INP
- [ ] Add @font-face size-adjust ascent-override descent-override to Baloo 2 to reduce CLS
- [ ] Enhance _headers with COOP same-origin CORP same-site upgrade-insecure-requests
- [ ] Enhance llms.txt with comparison content, quotable stats, freshness date 2026-09-15, prompt examples
- [ ] Add web-vitals RUM behind ANALYTICS_ENABLED flag sendBeacon /api/vitals attribution
- [ ] Add Plausible snippet commented out in head
- [ ] Add more strategic CTAs in menu.html each category + trust microcopy hand-crafted no frozen pucks
- [ ] Update reference docs PROJECT_MAP ARCHITECTURE SEO_MAP with new tools
- [ ] Build + commit + push

### P1 (Next — owner side)
- Owner to enable Plausible domain antoniaspizza.com or GA4 ID G-XXXXXXXX + privacy approval
- Owner to setup /api/vitals endpoint or use Plausible custom events for web-vitals
- Owner to audit GBP with GMB Everywhere Chrome extension + Local Falcon heatmap free tier + BrightLocal trial
- Owner to provide QR code image for menu
- Owner to confirm catering min order lead time + winery partnerships + Cal Poly partnerships
- Owner to provide social URLs + GBP links + 1024 logo asset
- Owner to confirm testimonials real + history partnerships blog

### P2 (Future — if binding relaxed)
- If owner approves Astro, create antonias-astro/ with islands architecture, same NAP Toast real photos content, but Astro+Tailwind+React Islands — keep antonias/ vanilla production until Astro passes same DoD + Lighthouse≥98 + owner visual approval
- Add nonces/hashes to CSP when build step allowed
- Add service worker for offline menu + bfcache optimization
- Add AI-powered menu personalization (requires backend)

## Gate — Strongest Site Checklist

- [ ] LCP <1.5s INP <100ms CLS <0.02 Lighthouse≥98 (reasoned)
- [ ] JS <40KB 32KB, CSS <80KB 76K, hero AVIF <180KB 36KB, total <1.5MB, 0 third-party
- [ ] Sitemap 14 URLs valid, robots allow AI crawlers, _headers security + COOP CORP, _redirects 14 rules
- [ ] llms.txt comprehensive comparison + quotable stats + freshness + prompts + no invented URLs
- [ ] Schema valid Restaurant 2× @id+parentOrg+geo+hours+areaServed+OrderAction+hasMap+priceRange+servesCuisine+paymentAccepted + Menu+MenuSection+MenuItem real + Offer + FAQPage + BreadcrumbList + VideoObject + CollectionPage + ImageObject
- [ ] CRO funnel ≤2 clicks to order, bottom nav mobile ORDER distinct 44px tap, ORDER badge distinct orbit badgeGlint, sticky order, magnetic rAF, strategic CTAs throughout, trust microcopy, direct ordering 20% higher AOV, mobile speed 7% per second, photos 70% more orders
- [ ] A11y WCAG 2.2 AA axe DevTools 50 rules + WAVE visual + Pa11y CI + manual NVDA JAWS VoiceOver TalkBack + keyboard wheel listbox + pause toggle + RM kill + focus-visible + skip link + alt truthful
- [ ] Security no secrets XSS safe Toast https rel noopener no mixed content CSP default-src self img-src self data: https: font-src self style-src self unsafe-inline script-src self connect-src none frame-ancestors none form-action self https://antoniaspizza.toast.site base-uri self upgrade-insecure-requests COOP same-origin CORP same-site HSTS preload ready
- [ ] Analytics privacy-first Plausible 1KB 45× smaller than GA4 + web-vitals RUM behind flag no tracking without owner ID + events documented
- [ ] Visual million-dollar typography Baloo 2 rounded size-adjust + spacing 32px radius container min(1240px,92vw) + responsive no overflow centre disc 44% + hero LCP 36KB + logo 192×192 12KB + og center-crop fill + AVIF+WebP picture + mobile 44px tap + buttons magnetic + hierarchy oversized display flat bright blocks marquees one signature wheel + brand rounded friendly food/hospitality + real photos beat generated + no branded bottles Monini no marble studio kitchens no generic dishes prompts forbid text/logos/brands/faces ground in owner real crops
- [ ] Content truthful never invent facts depends on Master Data + alt truthful + menu desc from master data + FAQ factual + catering min order lead time owner to confirm + blog no invented history partnerships
- [ ] Catering funnel + winery/Cal Poly + keywords mapped + no prices invented + photos real + FAQPage + Service schema
- [ ] Build passes 5420KB standalone 1 stylesheet inlined 1 script inlined 37 assets inlined 11 page links absolute + 0 FAIL harness + no console errors reasoning + responsive no overflow reasoning + wheel 8 distinct labels true
