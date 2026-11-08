# MALIK & OTB — Operations, Cost, Sitemap & 30-Day Plan

## 1. Estimated monthly operating cost (USD)

| Component | Choice | Est. cost/month |
|---|---|---|
| Hosting (Next.js server) | Small VPS or Vercel hobby/pro | $0 – $20 |
| Database | PostgreSQL (Neon/Supabase free tier) or self-hosted SQLite | $0 – $20 |
| Email | Resend free tier or SMTP | $0 – $25 |
| Payments | Stripe (pay-per-transaction, no monthly fee) | $0 + 2.9% + 30¢ per successful charge |
| Domain | registrar | ~$1–$2/mo amortised |

## 3. Pages & features map

Public:
- `/` — Home (featured products, categories, contact)
- `/categories` — category index
- `/category/[slug]` — category listing (breadcrumbs)
- `/product/[slug]` — product page: images, specifications, materials, usage, restrictions, shipping & returns, price, stock
- `/cart` — cart (authenticated or anonymous)
- `/checkout` — order creation + Stripe test payment
- `/orders/[orderNumber]` — order detail (signed-in customers)
- `/track` — guest order tracking by order number + email
- `/compare` — product comparison (up to 4 products)
- `/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`
- `/about`, `/contact`, `/help`, `/help/how-to-order`, `/help/how-returns-work`, `/help/out-of-stock`, `/help/how-to-buy-safely`, `/help/shipping-returns-explained`, `/help/choosing-the-right-product`
- `/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms`
- `/robots.txt`, `/sitemap.xml`, `/404`

Admin (role-gated: ADMIN / OPERATOR):
- `/admin` — dashboard with revenue, orders, refunds, low-stock, and analytics events (views, add-to-cart, checkout, purchase, refund, estimated conversion)
- `/admin/products` — list, create, edit (status, price, SEO, test-data flag)
- `/admin/products/[slug]` — edit product, variants, stock, delete product/variant
- `/admin/categories` — category CRUD
- `/admin/orders` — order list; `/admin/orders/[orderNumber]` — status/payment/fulfillment updates + audit log
- `/admin/settings` — operator-configurable store settings
- `/admin/system-health` — system health: order counts, product counts, migrations, webhooks
- `/admin/audit-log` — audit log of operator actions (last 100 events)
- `/admin/audit-log/[id]` — audit event detail

Backup & restore:
- `npm run db:backup` — copies dev.db to backups/
- `npm run db:restore <file>` — restores dev.db from a backup
- `npm run db:verify` — runs migrations idempotently

n8n automation (stubs, not live automation):
- `POST /api/n8n/webhook?topic=<topic>` — receives webhooks for product-research, supplier-offers, content-drafts, order-exceptions, customer-service, revenue-reconciliation. Logs only; no financial action.

**Total: approximately $0 – $65/month** before sales volume. No third-party commerce platform fee.

## 2. Pages & features map

Public:
- `/` — Home (featured products, categories, contact)
- `/categories` — category index
- `/category/[slug]` — category listing (breadcrumbs)
- `/product/[slug]` — product page: images, specifications, materials, usage, restrictions, shipping & returns, price, stock
- `/cart` — cart (authenticated or anonymous)
- `/checkout` — order creation + Stripe test payment
- `/orders/[orderNumber]` — order detail (signed-in customers)
- `/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`
- `/about`, `/contact`, `/help`, `/help/how-to-order`, `/help/how-returns-work`, `/help/out-of-stock`
- `/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms`
- `/robots.txt`, `/sitemap.xml`, `/404`

Admin (role-gated: ADMIN / OPERATOR):
- `/admin` — dashboard (counts, revenue, low-stock)
- `/admin/products` — list, create, edit (status, price, SEO, test-data flag)
- `/admin/products/[slug]` — edit product, variants, stock reservations
- `/admin/categories` — category CRUD
- `/admin/orders` — order list; `/admin/orders/[orderNumber]` — status/payment/fulfillment updates + audit log

## 3. Content plan (after product facts are approved)

1. "How to place an order" (help center) — done.
2. "How returns work" (help center) — done.
3. "An item is out of stock" (help center) — done.
4. Buying guides & comparisons — to be written once approved product specifications exist (per your instruction: no fabricated products, prices, GTINs, or reviews).
5. FAQ — original, visitor-focused, no rich-result promises.

## 4. First 30 days (operator runbook)

Days 1–7: Connect Stripe test account → webhook → verify `payment_intent.succeeded` confirms orders and deducts stock. Connect a verified email sender (Resend/SMTP) using `piratespizza999@gmail.com`; configure `DEFAULT_FROM_EMAIL`. Run backup/restore drill.
Days 8–14: Operator onboards: create categories, add real products as DRAFT, review stock thresholds, train operator on admin roles (no financial authority for operator; refunds require ADMIN).
Days 15–21: Add approved products as ACTIVE (never fabricate). Publish shipping/returns policies after legal review. Submit sitemap to Search Console / Bing Webmaster Tools (verify ownership first).
Days 22–30: Staging smoke test (mobile + desktop, cart, checkout, inventory block, refund flow). Measure LCP/INP/CLS with real tooling. Document go/no-go for live Stripe keys.

## 5. What works vs. what awaits account/product approval

Works: catalogue, categories, search, cart, order creation, stock reservation + overselling prevention, authenticated sessions + roles + audit log, Stripe webhook handling (paid/failed/refunded), order status management, sitemap/robots/JSON-LD, WCAG 2.2 AA focus/targets, reduced-motion.

Awaits: real Stripe keys + webhook endpoint (payments currently 501/not configured), verified email sender (order confirmation emails logged to console only), approved product data (no products are for sale yet), Google Merchant Center feed (prepared, not claimed as accepted), Search Console/Bing verification (not claimed), staging URL & production deployment.
