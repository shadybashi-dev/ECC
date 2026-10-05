---
name: topical-authority-map
description: Build a topical authority map (core pages, supporting articles, linking map, buyer journey, publishing order) from a seed topic. Use for content strategy, site architecture, topic clusters, or content roadmaps.
metadata:
  origin: ECC
---

# Topical Authority Map

Turn one seed topic into a deliberate site architecture: the pages that earn money, the supporting pages that earn relevance, the links between them, and the order to publish.

This is not a keyword list. A keyword list produces scattered pages competing for the same query. A topical map produces a site that a search engine or AI engine can recognize as the specialist on one subject.

## When to Activate

- the user wants a content plan, topic cluster, content roadmap, or site architecture
- a blog or resource section has grown without a plan and cannibalizes itself
- the user asks "what should we write about" for a defined business
- AI visibility is weak because the site has no coherent entity coverage
- a new site needs a structure before the first post ships

## Why Maps Work

Five mechanics, not vibes:

1. **Evidence accumulates on one topic.** Crawlers and AI engines build confidence in a domain's expertise from repeated, consistent coverage. Coverage spread across unrelated topics builds no confidence anywhere.
2. **Entities match what engines already model.** Engines hold entities with attributes and relationships. A map configures the site to mirror that structure, which makes retrieval cheaper and more confident.
3. **Cheap retrieval wins.** A page that maps cleanly to a real query is easier to retrieve than one that must be inferred. Cost of retrieval is a competitive axis.
4. **Satisfaction transfers.** A supporting page that fully satisfies a user signals quality that carries to the pages it links to.
5. **Depth beats breadth for authority.** Being the answer for a topic is worth more than being present for many topics.

**Hard warning:** a map filled with thin pages damages the whole site. Never publish to fill a slot. If a page cannot be written well, leave it out and say so.

## Workflow

Run in three phases with a checkpoint at each decision. **Pause at every checkpoint and confirm with the user** — a wrong central entity invalidates the entire map.

### Phase 1 — Research and classification

1. **Define the central entity.** The one thing the site is about, stated as a single noun phrase. Not a keyword; an entity with attributes. *Checkpoint 1.*
2. **Define source context and persona.** Who publishes, with what authority, and who is being served. *Checkpoint 2.*
3. **Research the entity's attributes.** What the engine already knows, what competitors cover, what the actual domain experts would list. *Checkpoint 3.*
4. **Classify each attribute as core or supporting.** Core attributes map to pages that sell or convert; supporting attributes map to pages that inform.
5. **Merge and split, then calibrate depth.** Combine attributes too thin for their own page; split attributes that hide several intents. *Checkpoint 4.*

### Phase 2 — Architecture and keywords

6. **Define folder structure.** URL paths that express the hierarchy and stay stable for years.
7. **Tag every page by journey stage** — awareness, consideration, decision. *Checkpoint 5.*
8. **Expand queries per page and score cost of retrieval.** Which queries can this page actually win?
9. **Select the query that titles each page.** One primary query per page.
10. **Define the linking architecture.** Which page links to which, with what anchor text.

### Phase 3 — Execution and output

11. **Central entity presence sitewide** — consistent naming in titles, navigation, schema, and footer.
12. **Alignment check** — category vocabulary matches how the engine models the topic.
13. **Write the briefs and the publishing order.** Twelve weeks is a good default horizon: enough to build a cluster, short enough to review.
14. **Define the review loop** — after each cluster ships, measure coverage and citations, then adjust the map.

## Deliverables

1. **The map** — a table (or spreadsheet) with one row per page:

| Column | Meaning |
| --- | --- |
| Page | Working title |
| Type | Core / supporting |
| Primary query | The one query it targets |
| Intent | Awareness / consideration / decision |
| Parent | Folder or hub it belongs to |
| Links to | Pages it must link to |
| Links from | Pages that must link to it |
| Priority | Publish order position |

2. **A strategy document** — central entity, source context, persona, folder structure, linking rules, vocabulary, quality bar.
3. **Briefs for the first cluster** — enough to start writing without re-deciding.

Use `.xlsx` only if the user needs a spreadsheet; a Markdown table is usually enough and stays diffable.

## Quality Rules

- One primary query per page; if two pages target the same query, merge or re-target.
- Every supporting page must link to at least one core page, and every core page must be linked from at least two supporting pages.
- No orphan pages: every page is reachable from the hub.
- No page exists only to host a link.
- Depth calibration: a page that cannot support 800+ words of genuine substance belongs inside another page.
- Cannibalization check before publishing: search the site for the target query first.

## Anti-Patterns

| Anti-pattern | Why it fails |
| --- | --- |
| Publishing every attribute as its own thin page | Dilutes the cluster and drags the domain down |
| Targeting the same query with three pages | Internal cannibalization; none ranks |
| Skipping the checkpoints | The map encodes the wrong entity and everything downstream is wrong |
| Designing for search volume only | High-volume queries outside the entity add no authority |
| Building the map and never revisiting it | Intent and competition shift; the map must too |
| Fanning out across four unrelated topics | Cancels the concentration the map exists to create |

## Related Skills

- `geo` — how entity consistency and coverage affect AI citation
- `seo` — on-page execution of each mapped page
- `geo-citability` — making the published pages quotable
- `market-research` — category and competitor research inputs
- `article-writing` — drafting the pages

## Provenance

Adapted and rewritten for ECC from `claude-seo-skills` by StudioHawk / Hawk Academy (MIT) — the topical-authority-map skill that ranked second on the public seo-skill-bench fixture. See `research/seo-geo-skills-landscape-2026-10.md`.
