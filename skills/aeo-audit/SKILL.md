---
name: aeo-audit
description: Run a scored AEO/GEO audit of a live site with deterministic checks plus content-quality scoring. Use for an AI-visibility baseline, a pre/post measurement, or a prioritized fix list before GEO work.
metadata:
  origin: ECC
---

# AEO Audit

Produce a defensible, reproducible score for how discoverable and citable a site is to AI answer engines, then hand off a prioritized fix list.

The audit is deliberately split in two so the reproducible half can never be argued with:

- **Foundational (50%)** — 16 pass/fail checks run by a bundled script. Deterministic and re-runnable.
- **Intelligence (50%)** — six content-quality dimensions scored by reading the pages against a fixed rubric.

Final score = `0.5 × foundational + 0.5 × intelligence`, mapped to a letter grade. Report both halves, always.

## When to Activate

- the user wants an AI-visibility baseline, an AEO/GEO audit, or a "how are we doing for AI search" answer
- a GEO engagement needs a starting score or a post-change comparison
- the user wants to know which specific fixes matter most
- an audit is being repeated and must be comparable to the previous run

For a single-URL quick look, still run the script — it is faster than manual inspection and produces evidence.

## Workflow

Follow the sequence. Do not skip step 1 or step 4.

### Step 1 — Establish inputs and scope

Confirm:

1. the URL
2. crawl depth (default 10 pages, maximum 30 — more pages is slower and rarely changes the headline score)
3. whether a previous report exists to compare against

### Step 2 — Run the deterministic pass

```bash
node <skill-dir>/scripts/aeo-audit.mjs https://example.com --max-pages=10 --out=aeo-audit.json
```

Requirements: Node 18+, no `npm install`. The script crawls `robots.txt`, `sitemap.xml`, `llms.txt`, and up to `--max-pages` URLs, then writes a JSON report and prints a summary.

Useful flags:

```text
--max-pages=N     pages to crawl (default 10)
--out=path.json   write the full report
--json            print JSON instead of the summary
--html-file=...   audit a local HTML file (offline / pre-deploy)
```

The script only scores pages it actually fetched. If it cannot reach the site it exits non-zero rather than inventing a score. **Never** hand-write a foundational score; if the script fails, report the failure.

### Step 3 — Read the report, do not skim it

Key fields:

- `scoring.foundationalScore` — the deterministic score. **Final. Do not adjust it.**
- `siteChecks` — the three site-wide checks (llms.txt, AI bot access, feed).
- `pages[]` — per-page metrics and the 13 per-page checks.
- `heuristicSignals` — a deterministic prior only, a sanity check for step 4.
- `prioritizedFixes` — defects ordered by point value.

### Step 4 — Score the six intelligence dimensions

Read `pages[].text` equivalents through the `pagesForReview` you select — the home page plus the richest content pages. You are an AI agent that just landed here from a search result. Decide: **would you cite this page?**

Score each dimension 0–5, writing the rationale *before* the number, and citing the observed evidence. Anchors are in `references/checks.md`.

| Dimension | Question it answers |
| --- | --- |
| Answer readiness | Could you find a direct answer to a user's question here? |
| Quotability | Can you extract a clean, self-contained passage to quote? |
| Evidence density | Are there statistics, dates, and named sources you can verify? |
| Content depth | Is there enough substance to fully answer the topic? |
| Freshness | Is the page current enough to cite confidently? |
| Structural clarity | Does the content parse into readable, typed blocks? |

Sanity-check your scores against `heuristicSignals`. A divergence of more than ~25 points on any dimension means either the prior is wrong or your score is not grounded in the observed content — re-read the page and decide which.

### Step 5 — Compute and report

```text
intelligence = average(6 dimension scores) × 20
final        = round(0.5 × foundational + 0.5 × intelligence)
```

Grades: A+ 95–100, A 90–94, A- 85–89, B+ 80–84, B 75–79, B- 70–74, C+ 65–69, C 60–64, C- 55–59, D 40–54, F below 40.

Report shape:

```text
URL: https://example.com   Date: 2026-10-05   Pages crawled: 10
Foundational: 72/100 (deterministic)
Intelligence: 58/100 (6 dimensions, rationale below)
Final: 65/100  →  C+

Weakest dimensions:
  Quotability 2/5 — pricing sections are prose; no extractable comparison table
  Freshness 2/5 — no visible update date; two stats dated 2023

Top fixes (by point value):
  12 pts — robots.txt blocks OAI-SearchBot   (verified)
  10 pts — no llms.txt                        (verified)
  ...
```

### Step 6 — Hand off

Fixes split cleanly:

- access and structure defects → `geo` (crawler policy) and `seo-technical-audit`
- passage-level weakness → `geo-citability`
- missing or wrong structured data → `schema-markup`
- architecture-level gaps → `topical-authority-map`

## Verification Rules

These keep the audit honest. Every one exists because a real audit class failed without it.

1. **Verify before recommending.** Check the live output before claiming something is missing. Recommending an already-present fix is the most damaging error in an audit.
2. **Never edit the foundational score.** It is deterministic; if it looks wrong, the check is wrong — fix the check or report the anomaly.
3. **Do not score pages you could not fetch.** Report coverage, not guesses.
4. **Label evidence.** `verified` (observed), `inferred` (derived), `unverified` (assumed).
5. **Re-audits must use the same crawl depth and the same rubric version**, or the comparison is meaningless.

## Anti-Patterns

| Anti-pattern | Why it fails |
| --- | --- |
| Reporting a composite score with no sub-scores | Not actionable; hides what to fix |
| Scoring from a cached memory of the site | Pages change; the audit becomes fiction |
| Padding findings to look thorough | False positives destroy trust in the true ones |
| Treating the heuristic prior as the intelligence score | It measures structure, not citation-worthiness |
| Comparing runs with different crawl depths | The delta is noise |
| Skipping the access check because content is "more interesting" | A blocked site cannot be cited at any content quality |

## Related Skills

- `geo` — crawler policy, platform playbooks, measurement
- `geo-citability` — the rewrite work behind a low quotability score
- `seo-technical-audit` — crawl, index, rendering, Core Web Vitals
- `schema-markup` — structured data that matches visible content
- `topical-authority-map` — content architecture

## Provenance

The two-half audit model (deterministic foundational checks plus a scored content rubric) adapts `audit-website-aeo` from `gtm-engineer-skills` (MIT, OnVoyage AI). The script here is an independent ECC implementation with no third-party dependencies. See `research/seo-geo-skills-landscape-2026-10.md`.
