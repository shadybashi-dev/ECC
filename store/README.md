# MALIK & OTB — Independent Store

Professional, self-owned e-commerce store built for MALIK & OTB INC (California, USA).
Market: United States · Language: English · Currency: USD · Timezone: America/Los_Angeles
Contact: piratespizza999@gmail.com

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS · SQLite (dev) / PostgreSQL (prod) · Stripe (test mode)
Real database with SQL migrations · Role-based admin (ADMIN / OPERATOR) · Audit log

## Quick start

```bash
cd store
cp .env.example .env        # fill in real values; never commit .env
npm install
npm run db:migrate          # apply migrations/001_init.sql
npm run db:seed             # admin user + 'general' category
npm run dev                 # http://localhost:3000
```

Admin: `http://localhost:3000/admin` (seeded admin: `admin@malikotb.test` — change the password before staging).

## What works (verified)

- Catalogue: categories, products, variants, images, stock, SEO fields
- Public pages: home, category listing, product page (specs, materials, usage, restrictions, shipping/returns)
- Cart: authenticated & anonymous, stock reservation, overselling blocked
- Checkout: order creation; Stripe payment intent (501/not configured until real Stripe keys are added)
- Orders: order detail for signed-in customers; admin order status/payment/fulfillment updates + audit log
- Auth: sessions (DB-backed, HttpOnly), roles, login/logout/register
- SEO: sitemap.xml, robots.txt, canonical, Open Graph, JSON-LD (Organization/WebSite/BreadcrumbList/Product/Offer), 404, noindex for cart/checkout/auth/admin/test data
- Accessibility: focus styles, reduced-motion, labels/alt-text approach per WCAG 2.2 AA

## What awaits account/product approval

- Real Stripe keys + webhook (payments return 501 in dev/test)
- Verified email sender for `piratespizza999@gmail.com` (order emails are logged to console only)
- Approved product data: no products are for sale yet; everything added so far is DRAFT + tagged test data
- Google Merchant Center feed (prepared, not claimed as accepted)
- Search Console / Bing Webmaster Tools / IndexNow (verification pending)
- Staging URL and production deployment

## Documentation

- `DEPLOYMENT.md` — run, deploy, backup/restore, environment variables
- `OPERATIONS.md` — cost estimate, page map, content plan, first-30-days, works-vs-awaits
- `SEO_GEO_AEO.md` — SEO/GEO/AEO report (measured claims only)

## Important

No product data, prices, GTINs, reviews, or delivery promises were fabricated. Draft items are not shown or purchasable. Test data is tagged, excluded from indexing, and not purchasable.
