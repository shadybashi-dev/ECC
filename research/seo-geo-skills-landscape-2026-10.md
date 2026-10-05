# SEO and GEO Agent Skills — Landscape Research (October 2026)

Deep survey of the public agent-skill ecosystem for traditional SEO and Generative Engine Optimization (GEO / AEO / AI search), the benchmark evidence available, the licensing constraints, and the ECC decisions that follow from them.

Status: research complete, implementation landed in this repository.
Date: 2026-10-05.

---

## 1. Executive Summary

The category is large, noisy, and dominated by star count rather than evidence. A small number of sources are genuinely strong, and one of them (a public benchmark) provides the only real quality signal in the field.

**What we found:**

- The single most-starred artifact (10.9k stars) is GEO-first and MIT-licensed, and is the best source of practical AI-citability material.
- The only public, methodologically serious benchmark (`seo-skill-bench`) shows that most popular SEO skills barely beat doing nothing, and that two light-footprint skills beat the field.
- Roughly half the promising repositories cannot be vendored into an MIT repository: one is AGPL-3.0, another ships no license at all.
- Prose-only skills have a measurable hallucination problem: the benchmark scores "trap avoidance" by planting things that are *already correct* and penalizing skills that recommend "fixing" them.

**What we did:**

- Built an ECC-native SEO + GEO suite (seven skills) adapted from the best MIT/Apache sources, with an independently implemented, dependency-free deterministic audit engine.
- Kept the ideas and the evidence; dropped the vendor branding, external dependencies, and install scripts.
- Recorded full provenance and license compliance for every source (section 7).

**Headline recommendation for users:** install the suite as a unit, run `aeo-audit` first to get a reproducible baseline, and treat every content change as an experiment against a frozen query panel.

---

## 2. Methodology

1. **Discovery** — GitHub repository search across five query families (SEO skills, GEO/AEO, agent skills, `llms.txt`, curated lists), sorted by stars, plus code-level searches for `SKILL.md` skill packs.
2. **Collection** — 17 candidate repositories shallow-cloned and inventoried.
3. **License screening** — each repository's license identified before any content was reused; unlicensed and copyleft sources were excluded from vendoring.
4. **Evidence review** — the `seo-skill-bench` results and rubric were read in full, including the conflict-of-interest disclosure.
5. **Content review** — read the actual `SKILL.md` files and, where present, the scripts, rubrics, and references of the strongest candidates.
6. **Adaptation** — material was re-derived into ECC conventions: original prose, ECC naming, no third-party runtime dependencies, no upstream install scripts.

Searches were run on 2026-10-05; star counts and benchmark positions are as of that date and will drift.

---

## 3. The Evidence Base

### 3.1 The benchmark that matters

`aleclindz/seo-skill-bench` (MIT) is the only public attempt to score SEO skills by execution rather than by marketing. Method:

- Fixture sites with a machine-readable manifest of **planted defects** and **traps**.
- Skills run for real in headless agent sessions (`claude -p`), not role-played from their README.
- Composite = 40% defect detection + 25% trap avoidance + 25% blind judgment + 10% execution.
- Plugins' context cost is measured separately, because every installed skill's description occupies the system prompt of every message.

The "trap avoidance" component is the most valuable idea in the whole field: fixtures include things that are *already present and correct* (existing Organization JSON-LD, complete Open Graph tags, a permissive robots.txt). Recommending a "fix" for one of those is an objectively scored hallucination.

**Leaderboard (fixture `pivot-saas`, rubric v1.0.0, median of 3 runs):**

| # | Skill | Composite | Detection | Trap avoidance | Footprint | Resident tokens |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | SEOAgent (maintainer's own — COI disclosed) | 84.9 | 81% | 100% | light | 257 |
| 2 | **claude-seo-skills (lhitches)** | 76.0 | 52% | 100% | light | 131 |
| 3 | **Agentic SEO Skill (Bhanunamikaze)** | 75.4 | 71% | 73% | light | 106 |
| 4 | *Vanilla baseline (no skill)* | 73.0 | 71% | 100% | — | — |
| 5 | claude-seo-skill (mangollc) | 70.4 | 67% | 73% | heavy | 1315 |
| 6 | claude-seo (AgriciDaniel) | 67.7 | 38% | 100% | heavy | 2687 |
| 7 | claude-seo-skills (lionkiii) | 66.6 | 52% | 73% | heavy | 4848 |
| 8 | Marketing Skills (Corey Haines) | 66.6 | 52% | 73% | heavy | 8770 |
| 9 | SEO/GEO Claude Skills (aaron-he-zhu) | 66.0 | 57% | 100% | light | 20 |
| 10 | Distribb Skill | 65.9 | 43% | 100% | medium | 347 |

Reported fleet-to-fleet variance is roughly ±8 points, so gaps inside that band should be treated as ties.

**What this tells us:**

1. **Most popular SEO skills do not beat the baseline.** Half the field scored below or within noise of a vanilla agent.
2. **Context footprint is inversely correlated with quality here.** The four heaviest skills occupy 1,300–8,800 resident tokens and none ranked first. Light skills (under ~280 tokens) dominated.
3. **Hallucination is the differentiator.** Detection rates of 38–81% separate skills far less than trap avoidance (73% vs 100%).
4. **Prose-only skills are cheap to build and easy to get wrong.** Deterministic tooling and explicit verification rules are what move the score.

### 3.2 Peer-reviewed GEO research

- **Princeton / Georgia Tech / IIT Delhi, KDD 2024** — the founding GEO study (~10,000 queries). Ranked methods: cite sources, add statistics, add quotations, authoritative tone, fluency, simplified language, technical terminology, vocabulary variety; keyword stuffing was neutral-to-negative. Effect sizes are directional and predate the current engine lineup.
- **AutoGEO (ICLR 2026)** — learns engine preferences automatically; evidence that preferences are learnable but engine-specific.
- **MAGEO (ACL 2026)** — reusable strategy learning across engines; reinforces that no single recipe transfers universally.

### 3.3 Industry (large-sample but vendor-run)

Useful directionally, not as proof: Ahrefs' brand-mention correlation study, SE Ranking's content-length analysis, and the various AI-referral traffic reports. These should always be labelled as vendor-reported when quoted.

### 3.4 Where the field is weak

- Most public numbers are vendor marketing with undisclosed methods.
- Citation is not traffic and not revenue; conflating them is the most common reporting error.
- Nearly all published work uses English, Western queries. Other markets are largely unmeasured.

---

## 4. Source Landscape

Seventeen repositories were collected. Ratings below are our assessment after reading the content, not star counts.

### Tier 1 — strong, MIT/Apache, mined for this suite

| Source | License | Stars | Strengths | Weaknesses |
| --- | --- | --- | --- | --- |
| `zubair-trabzada/geo-seo-claude` | MIT | ~10.9k | Best citability rubric in the ecosystem (5 weighted categories, worked examples); exhaustive AI crawler reference with per-bot impact; llms.txt spec and generation; platform-specific playbooks | Heavy install footprint; 16 sub-skills plus subagents; PM/sales surfaces (proposal, prospecting) beyond scope; some statistics unverifiable |
| `onvoyage-ai/gtm-engineer-skills` | MIT | ~1.3k | The two-half audit model (16 deterministic checks + 6 agent-scored dimensions, A–F grade); a real 1,020-line dependency-free Node audit script; strict CSV output contracts; eval harness | Many skills are GTM/marketing, not SEO; audit script is a script, not an ECC-validated surface |
| `Bhanunamikaze/Agentic-SEO-Skill` | MIT | ~760 | Benchmark #3; strict trigger mapping; clean AI crawler distinction table; conditional blocking patterns; "do not reference FID" correctness detail | 89 scripts and 10 agents is a large surface; some GitHub-repo-SEO scope that ECC does not need |
| `Auriti-Labs/geo-optimizer-skill` | MIT | ~990 | The Princeton method priority table with measured impact; score bands; `llms.txt` and schema CLI workflow; public scoring rubric with version history | CLI/Python package install is against ECC dependency policy; vendoring the method, not the tool |
| `lhitches/claude-seo-skills` | MIT | — | Benchmark #2 (76.0 composite, 100% trap avoidance); 54 genuinely practical single-file skills; topical-authority-map with three deep references; agency-tested | Many skills are audit-shaped and overlap; no deterministic tooling |
| `AgriciDaniel/claude-seo` | MIT | — | Broad; benchmark #6 | Heavy resident footprint (2,687 tokens); middling detection |
| `aaron-he-zhu/seo-geo-claude-skills` | Apache-2.0 | — | Extremely light footprint (20 resident tokens); now a signpost to a renamed bundle | Content moved; standalone copies frozen |

### Tier 2 — useful reference, not vendored

| Source | License | Why not vendored |
| --- | --- | --- |
| `yaojingang/GEOHub` | **AGPL-3.0-only** | Copyleft; incompatible with vendoring into an MIT repo. Its evidence-bounded methodology (label unsupported claims, preserve conflicting facts, surface collection limitations) was genuinely instructive and is reflected as an independent ECC practice, not copied text. |
| `liangdabiao/GEO-Content-Optimizer-Skill` | **No license** | Unlicensed means all rights reserved. Read for orientation only; nothing reused. |
| `coreyhaines31/marketingskills` | MIT | Excellent marketing collection, but benchmark #8 with an 8,770-token footprint; SEO content is a subset of a much larger surface |
| `JeffLi1993/seo-audit-skill` | MIT | Solid audit checklists; superseded by the Tier 1 picks |
| `mangollc/claude-seo-skill`, `lionkiii/claude-seo-skills` | MIT | Both ranked below the baseline band / heavy footprint |
| `RankSpotAI/awesome-seo-agent-skills` | CC0-1.0 | A curated list, not a skill |
| `amplifying-ai/awesome-generative-engine-optimization` | — | Curated list; useful for ongoing tracking |

---

## 5. What Was Built

Seven ECC-native skills, adapted rather than copied. All content is original prose; scripts are independently implemented.

| Skill | Layer | Derived from |
| --- | --- | --- |
| `geo` | AI-search hub: crawler access, citability model, platform playbooks, entity signals, measurement | geo-seo-claude, gtm-engineer, Agentic-SEO-Skill, geo-optimizer-skill |
| `geo-citability` | Passage-level scoring (5 weighted dimensions) and rewriting | geo-seo-claude citability rubric, geo-optimizer-skill method ordering |
| `aeo-audit` | Scored live-site audit: 16 deterministic checks + 6 intelligence dimensions, A–F grade | gtm-engineer audit-website-aeo model, independent script |
| `seo-technical-audit` | 8-category technical audit (crawl, index, render, CWV, URLs, security, mobile, structured data) | Agentic-SEO-Skill technical checklist, ECC `seo` baseline |
| `schema-markup` | Structured data design, generation, validation, defect catalog | claude-seo-skills and geo-seo-claude schema material, schema.org specs |
| `topical-authority-map` | Content architecture with five checkpoints and publishing order | lhitches/claude-seo-skills (benchmark #2) |
| `seo` (upgraded) | Routing hub plus on-page work, with explicit verification discipline | ECC baseline plus the trap-avoidance lesson |

### Design decisions driven by the evidence

1. **Verify-before-recommend is a first-class rule in every skill.** The benchmark shows hallucinated "fixes" are the field's dominant failure mode.
2. **Evidence labels (`verified` / `inferred` / `unverified`) are required output.** GEOHub's evidence-bounding discipline, expressed as an ECC-native practice.
3. **Descriptions are short on purpose.** Resident context is a measured cost; the benchmark's winners were all light. Depth lives in `references/`, loaded only when needed.
4. **One dependency-free deterministic script rather than a toolchain.** `aeo-audit/scripts/aeo-audit.mjs` runs on Node 18+, needs no install, works offline against a local HTML file, and refuses to fabricate a score when nothing can be fetched.
5. **No third-party install steps.** Nothing in the suite requires `npx`, `pip`, or an API key.
6. **Uncertainty is stated, not hidden.** Vendor statistics are labelled; the measurement protocol reports confounders and control prompts.

### Test coverage

- `tests/skills/aeo-audit.test.js` — 15 tests over robots.txt parsing (including Allow-over-Disallow precedence), llms.txt validation, sitemap parsing, per-page checks, scoring, site checks, and the CLI's offline path.

---

## 6. Usage

```bash
# Score a live site (baseline before any change)
node skills/aeo-audit/scripts/aeo-audit.mjs https://example.com --max-pages=10 --out=baseline.json

# Audit a local file before deploy (no network)
node skills/aeo-audit/scripts/aeo-audit.mjs https://example.com --html-file=./dist/index.html --json

# Install just this suite into a harness
node scripts/install-apply.js --modules seo-geo
```

Then invoke the skills by their triggers: "AI visibility", "GEO audit", "technical SEO audit", "schema markup", "topical map", "citability", or plain "SEO".

Recommended sequence for a new engagement:

1. `aeo-audit` — reproducible baseline.
2. `seo-technical-audit` — remove blockers.
3. `geo` — crawler access, entity signals, platform fit.
4. `topical-authority-map` — decide what to build.
5. `geo-citability` + `schema-markup` + `seo` — execute per page.
6. Re-run the identical audit and the frozen query panel.

---

## 7. Provenance and License Compliance

All vendored sources are MIT or Apache-2.0. No text was copied verbatim: skills were re-derived into ECC structure and voice, and the audit script is an independent implementation with no third-party dependencies or copied code.

| Upstream | License | Copyright | Used for |
| --- | --- | --- | --- |
| `zubair-trabzada/geo-seo-claude` | MIT | © 2026 Zubair Trabzada | Citability model, crawler reference, llms.txt, platform playbooks |
| `onvoyage-ai/gtm-engineer-skills` | MIT | © 2025 OnVoyage AI | Two-half audit model and check design |
| `Bhanunamikaze/Agentic-SEO-Skill` | MIT | © Bhanunamikaze | GEO criteria, crawler distinctions, technical audit coverage |
| `Auriti-Labs/geo-optimizer-skill` | MIT | © 2026 Juan Camilo Auriti | Evidence-based method priority ordering |
| `lhitches/claude-seo-skills` | MIT | © StudioHawk / Hawk Academy | Topical authority map structure |
| `aleclindz/seo-skill-bench` | MIT | © 2026 SEOAgent | Benchmark evidence and rubric methodology |

Excluded on license grounds: `yaojingang/GEOHub` (AGPL-3.0-only), `liangdabiao/GEO-Content-Optimizer-Skill` (no license).

Each vendored skill carries a short provenance paragraph and `metadata.origin: ECC`.

---

## 8. Maintenance Notes

This field changes monthly. Re-run this survey when any of the following happen:

- a new seo-skill-bench fixture or rubric version ships (results across rubric versions are not comparable)
- an engine changes its crawler tokens or retrieval policy
- a vendor deprecates a schema type or rich result
- a Tier 1 source publishes a materially better rubric

Open questions worth tracking:

- Whether `llms.txt` acquires measurable citation impact or remains a clarifier.
- Whether engine-specific optimization persists as engines converge or diverge.
- Whether non-English GEO research appears; today the evidence base is almost entirely English.
- Whether any skill beats the vanilla baseline by more than the ±8 variance band on a second fixture.
