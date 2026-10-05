# AI Crawler Reference

User-agent tokens, operators, purposes, and the consequence of blocking each. Verify tokens against the operator's own documentation before making irreversible changes; tokens are added and renamed over time.

## Decision Frame

Separate three jobs that are often conflated:

- **Citation crawling** — the bot fetches pages so an engine can answer with sources *now*. Blocking removes the site from answers.
- **Index building** — the bot builds a retrieval index used for search-adjacent features. Blocking reduces long-term discoverability.
- **Model training** — the bot collects text for future model weights. Blocking is a legitimate policy choice and has no direct effect on citation today.

A site can allow citation and index crawlers while blocking training crawlers. That is the default recommendation unless the user states a different policy goal.

## Tier 1 — Citation-critical (recommend allow)

| Token | Operator | Purpose | Impact if blocked |
| --- | --- | --- | --- |
| `OAI-SearchBot` | OpenAI | ChatGPT search index; not used for training | Removed from ChatGPT search results |
| `ChatGPT-User` | OpenAI | Live fetch when a user asks ChatGPT to open a URL | ChatGPT cannot read the page on user request |
| `PerplexityBot` | Perplexity | Perplexity answer index | Removed from Perplexity answers (a high-referral surface) |
| `ClaudeBot` | Anthropic | Claude web fetch and citations | Claude cannot cite the page |
| `Claude-User` | Anthropic | Live fetch on behalf of a Claude user | Claude cannot open the page on request |
| `Google-Extended` | Google | Gemini training and AI feature improvement; **does not** control Google Search or AI Overviews eligibility | Reduced presence in Gemini features only |
| `Googlebot` | Google | Classic search index; AI Overviews draw on it | Removed from Search and AI Overviews entirely |

Key distinctions worth stating explicitly to users:

- Blocking `Google-Extended` does **not** remove a site from Google Search or AI Overviews. AI Overviews eligibility follows the normal search index.
- Blocking `GPTBot` (training) does **not** by itself prevent ChatGPT search citations, which use `OAI-SearchBot`.
- `ChatGPT-User` and `Claude-User` are user-initiated fetches. Blocking them blocks a human actively trying to read the content.

## Tier 2 — Ecosystem reach (usually allow)

| Token | Operator | Purpose | Notes |
| --- | --- | --- | --- |
| `GoogleOther` | Google | Non-search crawls, research, AI data collection | Minimal search impact either way |
| `Applebot` / `Applebot-Extended` | Apple | Siri, Spotlight, and Apple Intelligence surfaces | `Applebot-Extended` governs AI training use |
| `Amazonbot` | Amazon | Alexa and Amazon answer features | Low volume, low risk |
| `DuckAssistBot` | DuckDuckGo | DuckDuckGo AI assist answers | Appears alongside classic results |
| `MistralAI-User` | Mistral | Le Chat user-initiated fetch | User-initiated, like `ChatGPT-User` |
| `cohere-ai` | Cohere | Model and product crawls | Rarely a citation surface |
| `Meta-ExternalAgent` | Meta | Meta AI features | Distinct from `facebookexternalhit` |
| `YouBot` | You.com | You.com answer engine | Citation surface with source links |
| `AI2Bot` | Allen Institute for AI | Research crawls and datasets | Mostly research use |

## Tier 3 — Training and dataset collection (policy call)

| Token | Operator | Purpose |
| --- | --- | --- |
| `GPTBot` | OpenAI | Model training |
| `anthropic-ai` | Anthropic | Model training |
| `CCBot` | Common Crawl | Open dataset used by many downstream models |
| `Bytespider` | ByteDance | Model training |
| `Diffbot` | Diffbot | Knowledge graph and dataset products |
| `ImagesiftBot` | Imagesift | Image dataset collection |
| `Omgilibot` | Webz.io | Data licensing |
| `FacebookBot` | Meta | Dataset collection |
| `PetalBot` | Huawei | Search and model data |
| `Scrapy` / generic agents | various | Often an unmanaged scraper; treat separately from named vendors |

Never claim a training bot is "just training" without checking current documentation — several vendors have moved tokens between purposes.

## robots.txt Patterns

**Maximum AI visibility (default recommendation):**

```txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

**Allow citation, block training:**

```txt
# Citation and index crawlers
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

# Training-only crawlers
User-agent: GPTBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

**Verify the result, not the intention.** Long `robots.txt` files with wildcard groups are a common source of accidental blocks — a later `User-agent: *` group does not override an earlier bot-specific group. Parse the file as a crawler would: the most specific matching user-agent group wins.

## Verification Commands

```bash
# Fetch and read the live policy
curl -sS https://example.com/robots.txt

# Confirm the AI meta directives are absent on a key page
curl -sS https://example.com/ | grep -ioE '<meta[^>]*(noai|noimageai|nosnippet)[^>]*>|x-robots-tag[^>]*'

# Confirm primary content is present without JavaScript
curl -sS https://example.com/ | sed -e 's/<[^>]*>/ /g' | tr -s ' ' | head -c 2000
```

## Reporting Shape

Always report access as a table, then the exact diff to apply:

```text
Bot              | Status  | Consequence                     | Action
OAI-SearchBot    | blocked | absent from ChatGPT search      | remove Disallow
PerplexityBot    | allowed | --                              | keep
GPTBot           | blocked | no citation impact (training)   | keep if policy requires
```

Separate "blocks that cost citations" from "blocks that are a policy choice". Mixing them makes the audit look alarmist and gets the real blockers ignored.
