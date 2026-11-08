# MALIK & OTB — Deployment, Operations & Recovery

Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS · SQLite (dev) / PostgreSQL (staging/prod) · Stripe (test mode).

## 1. Prerequisites
- Node.js 20+
- npm (or pnpm/yarn)

## 2. Local development

```bash
cd store
cp .env.example .env   # fill in real values (see below)
npm install
npm run db:migrate     # apply SQL migrations to ./dev.db
npm run db:seed        # creates admin user (admin@malikotb.test) + 'general' category
npm run dev            # http://localhost:3000
```

Admin UI: `http://localhost:3000/admin` (sign in as the seeded admin).

### Environment variables (`.env`)
| Variable | Purpose | Required |
|---|---|---|
| `DATABASE_URL` | `file:./dev.db` locally; PostgreSQL URL in production | Yes |
| `SESSION_SECRET` | `openssl rand -base64 32` | Yes |
| `SESSION_MAX_AGE` | session TTL seconds (default 14 days) | No |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe test keys until a live account is connected | Yes for payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | publishable key exposed to browser | Yes for payments |
| `SITE_URL` / `NEXT_PUBLIC_SITE_URL` | public site URL (used for sitemap/canonical) | Yes |
| `DEFAULT_FROM_EMAIL` | `piratespizza999@gmail.com` (contact address; verified sender required for real email) | No |
| `RESEND_API_KEY` / SMTP_* | optional verified email sender | No |
| `ALLOW_TEST_DATA` | set `false` in staging/production to hide tagged test data | No |

**Never commit `.env`.** Secrets are never stored in the repository.

## 3. Database migrations
Schema and migrations live in `store/migrations/001_init.sql` (SQLite locally, portable to PostgreSQL).

```bash
npm run db:migrate   # apply pending migrations
npm run db:seed      # idempotent reference data
npm run db:reset     # wipe dev.db, migrate, seed
```

To move to PostgreSQL, change `DATABASE_URL` to a PostgreSQL connection string and update `lib/db.js` to use `pg`/`@prisma`-compatible driver; DDL in `migrations/001_init.sql` is standard SQL.

## 4. Backups & restore (tested)

SQLite: the entire database is a single file (`dev.db`).
- Backup: copy `dev.db` to a safe location (e.g. daily cron to object storage).
- Restore: stop the app, replace `dev.db` with the backup, restart.
- Verify: `npm run db:migrate` (no-op if already applied) and sign in.

PostgreSQL: use `pg_dump` / `pg_restore` or your provider's backup tooling; test restore quarterly.

## 5. Production build

```bash
npm run build    # Next.js production build (verified: passes)
npm run start    # production server
```

Set `NODE_ENV=production` and provide a real `DATABASE_URL` (PostgreSQL) and Stripe live keys before selling.

## 6. Staging
Staging must be password-protected and excluded from search indexing (`X-Robots-Tag: noindex` on admin; `robots.txt` disallows `/admin`). `robots.txt` is not access control — enforce authentication in code.
