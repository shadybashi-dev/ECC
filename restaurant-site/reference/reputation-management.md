# Reputation Management — Antonia's Pizza
Generated via `hotel-reputation-intelligence` + `mkt-review-management` skills — 2026-09-14

## Policy (from master-data.json)
- Only real customer quotes, owner must confirm each testimonial card is real. No aggregateRating or review[] schema on-site (self-serving policy).
- Visible: Patricia B., Cecily F., Kelly H., Walid S., Devin C. — plain HTML pending owner confirmation they're real.

## Review Response Automation (from local business automation skill)

**Who buys it:** Restaurants, salons, dental offices, gyms, retail shops — any local business with active review presence that understands reviews affect ranking and conversion rate.

**What it does:** Aggregates reviews from Google, Yelp, TripAdvisor, Facebook, etc., analyzes sentiment, benchmarks vs competitors, automates response drafts for owner approval.

**For Antonia's (manual, no API keys in repo):**

### Google Business Profile (GBP) — Owner TODO
- Category: Pizza restaurant, Italian restaurant, Mediterranean restaurant
- NAP: 891 Higuera St SLO (805)439-2383, 729 12th St Paso (805)238-1851 — consistent with master-data.json
- Photos: real-* owner untouched (storefront.jpg, pies-2.jpg, real-box, real-patio, real-night, real-pep, real-pesto) — honest enhancement documented
- Menu: link to https://antoniaspizza.com/menu (HTML, not PDF)
- Services: pickup, delivery, dine-in, catering
- Posts: weekly — new deals, late-night hours, catering, blog posts
- Reviews: respond within 24h, thank positive, address negative with empathy + offline contact

### Response Templates (no AI-writing tells, no em dashes, owner voice)

**Positive 5★:**
> Thank you, [Name]! We're glad you enjoyed [specific dish mentioned]. Our dough is hand-tossed daily and sauce made fresh — same at both downtown kitchens 891 Higuera St SLO and 729 12th St Paso. Hope to see you again soon, open late till 2AM Thu-Sat SLO and Fri-Sat Paso. — Antonia's Team

**Negative (late delivery):**
> Hi [Name], sorry your order was late — we know timing matters, especially late night. Please call us at (805) 439-2383 SLO or (805) 238-1851 Paso so we can make it right. We track delivery via Toast and our own fleet. — Antonia's Team

**Negative (food quality):**
> Hi [Name], sorry the [dish] wasn't right — our dough is hand-crafted and sauce home-made daily, so we want it to be right every time. Please call (805) 439-2383 or (805) 238-1851 and ask for manager so we can fix it. — Antonia's Team

**Catering inquiry:**
> Thank you for considering Antonia's for catering! We cater pizza 10"–28", Italian kitchen, winery events, corporate, Cal Poly, birthdays & weddings. Min order and lead time owner to confirm — please call (805) 439-2383 SLO or (805) 238-1851 Paso for quote. More: https://antoniaspizza.com/catering — Antonia's Team

### Sentiment Analysis (manual)

- Track keywords: dough, sauce, crust, Ajarski, late night, delivery, parking, catering, Cal Poly, wine country
- Positive signals: hand-crafted, home-made, SLO-style, open late, real photos, 10"–28" range, Ajarski unique
- Negative signals: late, cold, parking, delivery fee, min order, lead time — address with owner to confirm details

### Competitive Benchmarking

- Monitor competitors' review counts, ratings, response rates, review keywords
- Antonia's advantage: real photos, late-night till 2AM, Ajarski unique, 10"–28" range, two downtown locations, catering winery-specific
- No fake reviews, no review gating, no aggregateRating schema on-site (policy)

### Citations Cleanup (from seo-offsite-checklist.md)

- Old Marv's/Bob Cantu's/Grubhub/DoorDash/Yelp/TripAdvisor — ensure no legacy entity mention on-site (already clean), provide off-site cleanup guide for owner: redirects/merges, not random deletion, NAP consistent

### Monitoring

- Weekly: GBP insights — calls, direction requests, website visits, reviews/rating
- Monthly: review sentiment, competitor benchmarking, citation consistency
- Quarterly: refresh website content — seasonal menu items, blog posts (e.g., "Best Fall Cocktails in [City]"), update metadata

---
*No invented facts — all facts from master-data.json or owner to confirm. No API keys in repo. Bridge runs owner-side (env key) or manual paste; never fake external-model output.*
