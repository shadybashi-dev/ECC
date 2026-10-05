---
name: schema-markup
description: Design, generate, and validate JSON-LD structured data that matches visible content. Use for schema markup, rich results, entity data, or when structured data causes Search or AI misrepresentation.
metadata:
  origin: ECC
---

# Schema Markup

Structured data is a claim about what a page contains. Its value comes from being **accurate**, not from being present. A mismatched schema is worse than no schema: it misrepresents the entity to both search engines and AI systems.

## When to Activate

- the user wants rich results, entity clarity, or schema coverage
- an existing schema is invalid, incomplete, or contradicts the page
- AI systems describe the brand incorrectly (wrong pricing, wrong type, wrong entity)
- a new page type (product, article, FAQ, event, local business) needs markup
- a migration changed templates and schema needs re-validation

## Core Rules

1. **Markup must match visible content.** Never mark up a rating, price, availability, or answer that a user cannot see on the page.
2. **Prefer JSON-LD.** Google's recommended format; parseable without touching the DOM structure.
3. **Model the entity, not the keyword.** Schema describes what a thing is; stuffing keywords into fields is a spam signal.
4. **Use the most specific valid type.** `Article` over `CreativeWork`; `Product` over `Thing`.
5. **One primary entity per page.** Multiple unrelated top-level entities without `@graph` links create ambiguity.
6. **Identifiers should be stable.** Keep `@id` values and organization identifiers consistent sitewide.

## Page Type to Schema Map

| Page type | Required types | Commonly useful |
| --- | --- | --- |
| Homepage | `Organization` (or `LocalBusiness`), `WebSite` | `WebSite` with `potentialAction: SearchAction` |
| Article / blog post | `Article` or `BlogPosting` | `Person` (author), `BreadcrumbList` |
| Product page | `Product` + `Offer` | `AggregateRating` (only with real reviews), `Brand` |
| Category / listing | `CollectionPage`, `BreadcrumbList` | `ItemList` |
| FAQ page | `FAQPage` (only with real Q&A) | `Question` / `Answer` pairs |
| How-to | `HowTo` | `HowToStep`, `HowToSupply` |
| Local business | `LocalBusiness` subtype | `OpeningHoursSpecification`, `GeoCoordinates` |
| Event | `Event` | `Place`, `Offer`, `Performer` |
| Video page | `VideoObject` | `Clip`, `Transcript` |
| Documentation | `TechArticle` | `BreadcrumbList`, `SoftwareApplication` |
| Software / SaaS | `SoftwareApplication` | `Offer`, `AggregateRating` |

Full field catalogs and required properties: `references/schema-catalog.md`.

## Workflow

### 1. Inventory

List the site's templates and the page type each renders. You are designing schema per template, not per URL.

### 2. Read the page, then choose the type

Read the rendered page. Choose types whose required properties you can actually populate from visible content. If a required property is not visible (for example, no real reviews), omit the type rather than inventing values.

### 3. Generate JSON-LD

Use `@graph` on pages with multiple entities so they can reference each other:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Acme",
      "url": "https://example.com",
      "logo": "https://example.com/logo.png",
      "sameAs": ["https://www.linkedin.com/company/acme"]
    },
    {
      "@type": "Product",
      "@id": "https://example.com/widget#product",
      "name": "Widget",
      "brand": { "@id": "https://example.com/#organization" },
      "offers": {
        "@type": "Offer",
        "price": "49.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://example.com/widget"
      }
    }
  ]
}
```

### 4. Validate

- Parse check: the block must be valid JSON (a single syntax error voids the whole block).
- Required-property check against the type's spec.
- Visible-content check: every value traceable to the page.
- Cross-page check: `@id` references resolve, entity names are identical everywhere, `sameAs` URLs are live.

```bash
# Extract every JSON-LD block from a live page and validate JSON syntax
node -e "
fetch(process.argv[1]).then(r=>r.text()).then(html=>{
  const re=/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;let m,i=0;
  while((m=re.exec(html))){i++;try{JSON.parse(m[1]);console.log('block '+i+': valid JSON')}
  catch(e){console.log('block '+i+': INVALID — '+e.message)}}
  if(!i)console.log('no JSON-LD found');
});" https://example.com
```

### 5. Report

```text
Template: /products/[slug]
Current: Product without Offer (2 of 6 properties populated)
Issues:
  - [HIGH] price and availability visible on page but absent from markup
  - [HIGH] AggregateRating present with no visible reviews (policy violation)
  - [MED] brand not linked to the Organization entity
Fix: regenerate Product + Offer and link brand via @id; remove AggregateRating
```

## Common Defects

| Defect | Consequence |
| --- | --- |
| Schema describes content not on the page | Manual action risk; entity misrepresentation |
| `FAQPage` on content that is not real Q&A | Ineligible and misleading |
| `AggregateRating` without visible reviews | Policy violation |
| Missing `price`/`priceCurrency`/`availability` on `Offer` | Offer ineligible |
| `Article` missing `author` or `datePublished` | Weakens freshness and authorship signals |
| Relative URLs in fields expecting URLs | Invalid; ignored |
| Multiple conflicting `Organization` blocks sitewide | Entity confusion |
| Markup rendered only after client-side JavaScript | Often not seen by crawlers |
| Dates in an ambiguous format | Use ISO 8601 (`2026-10-05`) |

## Anti-Patterns

- Adding schema as a checkbox without reading the page.
- Copying a competitor's JSON-LD wholesale; their entity is not yours.
- Marking up every page with `FAQPage` because it once helped.
- Duplicating data inconsistently between schema, Open Graph, and visible text.
- Using `@type: Thing` or an unrelated type to avoid picking a real one.

## Related Skills

- `seo-technical-audit` — indexability and rendering
- `geo` — how AI engines use structured data for entity resolution
- `aeo-audit` — scores schema presence and type recognition
- `seo` — on-page optimization

## Provenance

Adapted and consolidated for ECC from MIT-licensed community schema skills (`claude-seo-skills`, `geo-seo-claude`) and schema.org/Google's published specifications. See `research/seo-geo-skills-landscape-2026-10.md`.
