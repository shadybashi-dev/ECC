# n8n starter files for the Arabic e-commerce automation guide

These files accompany `../ai-commerce-n8n-ar/`. They are **starting examples**, not audited production workflows, and they are not a promise that an import will run unchanged on every n8n release. API versions, node versions, credentials, scopes, payload schemas, and Marketplace policies change. Run only against test/staging credentials until validated.

## Included

| File | Purpose | Before production |
|---|---|---|
| `01-ai-winning-product-hunter.json` | Scheduled public/authorized source → LLM shortlist → score filter → Sheets/Telegram | Replace research source with official API or licensed feed; fix response parsing to that API; add dedupe, sample/rights checks and human review |
| `02-shopify-graphql-ai-product-factory.json` | Shopify product webhook → LLM draft → GraphQL `productUpdate` | Verify webhook HMAC, API version and mutation input against the store's API schema; make output structured, add IF approval, correct IDs/credential binding; leave product Draft until approved |
| `03-tiktok-reels-ai-video-pipeline.json` | Script → TTS → video render concept | Confirm current vendor endpoints/schemas/plan/API access; upload generated audio/video to authorized storage; add human review and TikTok API approval/audit; no automatic public posting in this sample |
| `04-omnichannel-rag-customer-support-agent.json` | Customer message → AI agent + memory concept | Add actual model, vector DB, knowledge-base, read-only lookup and output channel connections; authenticate caller; remove/ redact PII; add escalation. No tools/models are wired into this minimal skeleton |
| `05-auto-order-fulfillment-tracking-sync.json` | Shopify order → supplier order → WhatsApp concept | Validate supplier endpoint/body/token against current official API docs and sandbox; verify Shopify signature/idempotency/stock/address; never place live orders until tested; WhatsApp templates need approval/consent |
| `docker-compose.production.yml` | PostgreSQL + Redis queue mode + worker + external task runners + Caddy TLS (+ optional Qdrant profile) | Pin tested compatible n8n/runner image tags; secure .env, DNS, firewall, backups, restore test, monitoring and access controls |
| `Caddyfile` | HTTPS reverse proxy using DNS domain | Set `N8N_DOMAIN` in `.env`; open only ports 80/443 publicly |
| `.env.example` | Variable names only | Copy to `.env` on server; replace all placeholders with independently generated secrets. Never commit `.env` |

## Import a JSON workflow

1. Update n8n to a known version in a **test instance** and note node types available.
2. In the n8n editor choose **Import from File**, import one JSON file.
3. Add each credential using n8n Credentials UI. **Do not place keys or tokens in the workflow JSON.**
4. Replace `YOUR_*`, `{{$env.*}}`, example shop domains, API endpoints and spreadsheet IDs with controlled sandbox resources.
5. Compare every endpoint and field to current provider docs. The examples have placeholder prompts and may require adjustment to the node's installed version/schema.
6. Add error branches, retries with backoff, idempotency, schema checks, logging with PII redaction, human approval and alerting.
7. Test success, duplicate webhook, timeout, 429, 4xx, invalid JSON, supplier outage, out-of-stock, refund/cancel, permission revocation and replay.
8. Inspect the execution payload for PII/secrets. Set execution retention and prune policy.
9. Activate only after one controlled live test with a single low-risk SKU and written rollback plan.

## Docker Compose quick start (operator-operated, not a managed service)

1. Provision Ubuntu/Debian VPS + a domain; set DNS `A`/`AAAA` to the server. Permit 22 only from a trusted admin IP and 80/443 publicly. Keep 5432/6379/5678/5679/6333 private.
2. Install Docker Engine/Compose from Docker's official docs. Copy Compose/Caddy/`.env.example` to a protected deployment directory and create `shared/` if needed.
3. Copy `.env.example` to `.env`, `chmod 600 .env`, set `N8N_DOMAIN`, a **specific tested release version**, timezone, and four independently random secrets (`POSTGRES_PASSWORD`, `REDIS_PASSWORD`, `N8N_ENCRYPTION_KEY`, `N8N_RUNNERS_AUTH_TOKEN`). Confirm a matching runner image tag exists. Stable encryption key is critical for credentials.
4. Validate then start:

```bash
docker compose --env-file .env -f docker-compose.production.yml config
docker compose --env-file .env -f docker-compose.production.yml pull
docker compose --env-file .env -f docker-compose.production.yml up -d
docker compose --env-file .env -f docker-compose.production.yml ps
docker compose --env-file .env -f docker-compose.production.yml logs --tail=100 -f n8n
```

5. Create the n8n owner account through the HTTPS URL, enable available MFA, add credentials in the editor, import one workflow, test, and keep public webhook URLs HTTPS.
6. Back up PostgreSQL and any binary/object data to an **off-server** encrypted location; routinely restore into staging. A VPS snapshot on the same account is not a sufficient backup.
7. Update with a pinned new release only after release notes and a staging test. Do not use `latest` in production. For Queue Mode, n8n requires Redis and matching encryption configuration across main/workers; external runners isolate Code execution and need sidecars. Consult [official Queue Mode](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode/), [task runners](https://docs.n8n.io/deploy/host-n8n/configure-n8n/set-up-task-runners/) and [Docker Compose docs](https://docs.n8n.io/hosting/installation/server-setups/docker-compose/).

**Billing/scale caution:** The Community edition software is free under n8n's Sustainable Use License for supported internal uses; VPS, domain, storage, backups, email, AI API tokens and engineering time are not free. Hosting n8n itself for unrelated customers or exposing its editor/workflow builder may require a commercial agreement. Read [n8n License FAQ](https://docs.n8n.io/n8n-community-license/community-license/license-faq/).

## Baseline security checklist

- Only expose HTTPS through the reverse proxy. Do not publish Postgres, Redis, Qdrant, task-runner broker or n8n internal ports.
- Set strong unique secrets; keep `.env` out of Git; use a password manager/secret manager; rotate if shared accidentally.
- Restrict who can edit workflows: a workflow editor can potentially run code or access configured credentials/data. Separate test and production credentials.
- Protect webhooks with provider signature verification (raw body), authorization/nonce, idempotency and throttling; a hard-to-guess URL alone is not auth.
- Use external task runners in production; treat `Execute Command` as privileged and disable it if unnecessary.
- Do not store complete card details; minimize customer name/address/email in executions and redact logs.
- Prune executions, set retention, monitor failed runs/queue size and API spend, and maintain a tested rollback/kill switch.

## Known limitations of examples

The JSON files were authored as importable skeletons; they have not been exercised with any real vendor credential or store. Some APIs—particularly product research scraping, HeyGen rendering, CJ fulfillment, Etsy APIs, WhatsApp, TikTok Shop and GraphQL mutations—have vendor-specific required fields, versions, approvals or market restrictions. A node sequence is not equivalent to a live integration. Validate before enabling side effects.
