# Schema Catalog — Properties and Patterns

Type-by-type required and recommended properties. Required properties are the minimum for eligibility; recommended properties improve entity resolution.

---

## Organization

Required: `name`, `url`
Recommended: `logo`, `sameAs[]`, `description`, `foundingDate`, `address`, `contactPoint`, `identifier`

```json
{
  "@type": "Organization",
  "@id": "https://example.com/#organization",
  "name": "Acme",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/acme",
    "https://en.wikipedia.org/wiki/Acme"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@example.com",
    "availableLanguage": ["en", "ar"]
  }
}
```

Use one Organization node sitewide and reference it by `@id` from other nodes. Multiple conflicting Organization blocks are the most common entity-consistency defect.

## WebSite

Required: `name`, `url`
Recommended: `potentialAction` (SearchAction), `publisher`

```json
{
  "@type": "WebSite",
  "@id": "https://example.com/#website",
  "url": "https://example.com",
  "name": "Acme",
  "publisher": { "@id": "https://example.com/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## Article / BlogPosting

Required: `headline`, `image`, `datePublished`
Recommended: `author`, `dateModified`, `publisher`, `mainEntityOfPage`, `description`

```json
{
  "@type": "BlogPosting",
  "headline": "How invoice automation works",
  "description": "A one-sentence summary of the article.",
  "image": ["https://example.com/cover.jpg"],
  "datePublished": "2026-03-04",
  "dateModified": "2026-09-28",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/authors/name",
    "jobTitle": "Head of Product"
  },
  "publisher": { "@id": "https://example.com/#organization" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://example.com/blog/post" }
}
```

Use `Article` for generic editorial, `NewsArticle` for news, `TechArticle` for technical documentation, `BlogPosting` for blog posts.

## Product + Offer

Required: `name` (Product); `price` + `priceCurrency` (Offer)
Recommended: `image`, `description`, `sku`, `brand`, `availability`, `url`, `priceValidUntil`, `shippingDetails`, `hasMerchantReturnPolicy`

```json
{
  "@type": "Product",
  "@id": "https://example.com/widget#product",
  "name": "Widget",
  "description": "A widget that does the thing.",
  "image": ["https://example.com/widget.jpg"],
  "sku": "WID-001",
  "brand": { "@id": "https://example.com/#organization" },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/widget",
    "price": "49.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31"
  }
}
```

`AggregateRating` requires real, visible reviews. Do not add it from a scraped or invented rating.

## FAQPage

Required: `mainEntity[]` of `Question` with `acceptedAnswer`
Rule: only markup content that is genuinely displayed as Q&A on the page.

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does setup take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Setup takes about 10 minutes for a single workspace."
      }
    }
  ]
}
```

## HowTo

Required: `name`, `step[]`
Recommended: `totalTime`, `estimatedCost`, `tool[]`, `supply[]`, `image`

## BreadcrumbList

Required: `itemListElement[]` with `position` and `name`
Recommended: `item` (absolute URL) for every item except the last

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://example.com/guides" },
    { "@type": "ListItem", "position": 3, "name": "Invoicing" }
  ]
}
```

## LocalBusiness

Required: `name`, `address`
Recommended: `telephone`, `openingHoursSpecification`, `geo`, `priceRange`, `image`, `url`, `sameAs`

Use the most specific subtype: `Restaurant`, `Dentist`, `LegalService`, `Store`, and so on. Generic `LocalBusiness` where a subtype exists is a missed signal.

## Event

Required: `name`, `startDate`, `location`
Recommended: `endDate`, `eventStatus`, `eventAttendanceMode`, `offers`, `performer`, `image`

## VideoObject

Required: `name`, `thumbnailUrl`, `uploadDate`
Recommended: `description`, `contentUrl`, `embedUrl`, `duration` (ISO 8601, e.g. `PT4M13S`), `transcript`

A transcript is both an accessibility win and a text representation AI engines can extract.

## SoftwareApplication

Required: `name`, `offers` (for paid apps)
Recommended: `applicationCategory`, `operatingSystem`, `aggregateRating` (with real ratings), `softwareVersion`, `featureList`

## CollectionPage / ItemList

```json
{
  "@type": "CollectionPage",
  "name": "Invoicing guides",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "url": "https://example.com/guides/a" },
      { "@type": "ListItem", "position": 2, "url": "https://example.com/guides/b" }
    ]
  }
}
```

---

## Validation Checklist

- [ ] Valid JSON (a single syntax error voids the block)
- [ ] `@context` present (`https://schema.org`)
- [ ] Required properties for the chosen type
- [ ] Every value traceable to visible page content
- [ ] Absolute URLs where URLs are expected
- [ ] Dates in ISO 8601
- [ ] `@id` references resolve within the document
- [ ] Entity name identical across site, schema, and profiles
- [ ] Rendered server-side, not injected only after JavaScript
- [ ] Validated against Google's Rich Results Test and schema.org's validator

## Deprecated or Risky Markup

| Markup | Status |
| --- | --- |
| `HowTo` rich results | Deprecated as a rich result; still useful as entity data |
| `FAQPage` rich results | Restricted to authoritative sites; keep only for genuine Q&A |
| `SpecialAnnouncement` | Retired |
| `CourseInfo`, `EstimatedSalary`, `LearningVideo`, `VehicleListing`, `PracticeProblem` | Retired rich results |
| `ClaimReview` | Restricted |
| `SitelinksSearchBox` | Deprecated as a rich result |

Check current documentation before promising a rich result — eligibility changes often.
