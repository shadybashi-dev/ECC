# Antonia's Pizza — workspace

The Astro site that lived here was **deleted at the owner's instruction**
(2026-09-14). Their own hand-built site is the one being developed. It is not
in this repo yet — see "Waiting on" below.

The previous build is recoverable from git history at commit `52e988e` if any
part of it is ever wanted back.

## What is still here, and why

| Path | What | Why it survived |
| --- | --- | --- |
| `reference/menu.ts` | The **complete verified menu**: 101 items, 20 sections, real prices | Captured from the live site over many fetches. `antoniaspizza.com` is **network-blocked in this sandbox**, so it cannot be re-fetched. This is the only copy. |
| `reference/restaurant.ts` | Both branches: NAP, hours, geo, place IDs, reviews, deals, service areas, `ordering` config | Same reason. |
| `reference/schema.ts` | JSON-LD generators with the canonical-entity policy | Encodes two hard-won bug fixes (see below). |
| `site-data/restaurant.json` | The same data as JSON with `verify: true` flags | Owner-facing confirmation checklist. |
| `.claude/skills/` | 58 skills | Explicitly requested. |
| `.claude/agents/` | 27 agents | Explicitly requested. |
| `docs/` | Arabic site audit + web build kit research | Explicitly requested. |

## Facts that must not be lost

**Pizza sizes — corrected against the live menu.** An earlier version of this
project claimed XL was 28 inches. It is not:

| Size | Diameter | Cheese price |
| --- | --- | --- |
| Small | 10" | 15.99 |
| Medium | 13" | 19.99 |
| Large | 16" | 22.99 |
| **XL** | **18"** | 28.99 |
| Party | 24" | 48.99 |
| **King** | **28"** | **55.99** |

So the $39.99 deal is **two 18-inch XL pies** — $19.99 each against $28.99
solo. "28-inch biggest pie in town" is a *true* claim, but it refers to the
King, not the XL.

**Ordering architecture.** The site is a front end only. No cart, no checkout,
no payment on this domain. Every order terminates at
`https://antoniaspizza.toast.site/`. Never send a `<form>` to that URL — an
unverified `?location=` param on a third-party ordering endpoint risks breaking
the only conversion the site exists to make.

**Two structured-data bugs found and fixed** (worth re-checking in any rebuild):

1. A dynamic `type={...}` on a JSON-LD `<script>` makes Astro's compiler treat
   it as a JS module and ship the payload **double-escaped** — literal `\n` and
   `\"` bytes, unparseable by Google. Use a static `type` plus `is:inline`.
2. Tailwind v4 auto-detects sources from the project root, so it read
   `.claude/skills/**.md` and generated a real production utility out of the
   prose string `[file:line]`. Scope with `@import 'tailwindcss' source(none)`
   plus an explicit `@source`.

## Waiting on

The owner's site lives in a Google Drive folder (`NEW/` containing `index.html`,
`menu.html`, `paso-robles.html`, `san-luis-obispo.html`). **Drive is unreachable
from this sandbox** — outbound network is allowlisted to `github.com`,
`api.github.com`, `codeload.github.com` and `registry.npmjs.org` only.

To hand the source over, push it to a public GitHub repo:

```bash
cd antonias-website
git remote add origin https://github.com/<username>/antonias.git
git push -u origin main
```

Then the repo URL is all that is needed — cloning is verified to work here.
