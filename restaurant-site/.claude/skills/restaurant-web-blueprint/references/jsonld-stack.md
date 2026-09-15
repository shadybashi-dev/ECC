# Restaurant JSON-LD Stack — copy-paste reference

Google's preferred format is JSON-LD in `<head>`. Use one `@graph` per page so
entities cross-reference by `@id`. Every value below must correspond to content
**actually visible on the page**.

Replace the `{{...}}` placeholders from a single typed data source
(`src/data/restaurant.ts`) — never hard-code them in templates twice.

---

## 1. Home page — full `@graph`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "{{siteUrl}}/#website",
      "url": "{{siteUrl}}/",
      "name": "{{restaurantName}}",
      "inLanguage": ["ar", "en"],
      "publisher": { "@id": "{{siteUrl}}/#restaurant" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "{{siteUrl}}/menu?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Restaurant",
      "@id": "{{siteUrl}}/#restaurant",
      "name": "{{restaurantName}}",
      "alternateName": "{{restaurantNameLatin}}",
      "description": "{{oneSentenceDescription}}",
      "url": "{{siteUrl}}/",
      "telephone": "{{phoneE164}}",
      "email": "{{email}}",
      "priceRange": "{{$$}}",
      "servesCuisine": ["{{Levantine}}", "{{Grill}}"],
      "currenciesAccepted": "{{SAR}}",
      "paymentAccepted": "Cash, Credit Card, Apple Pay, Mada",
      "acceptsReservations": "True",
      "image": [
        "{{siteUrl}}/og/hero-1x1.jpg",
        "{{siteUrl}}/og/hero-4x3.jpg",
        "{{siteUrl}}/og/hero-16x9.jpg"
      ],
      "logo": "{{siteUrl}}/logo.svg",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "{{street}}",
        "addressLocality": "{{city}}",
        "addressRegion": "{{region}}",
        "postalCode": "{{postal}}",
        "addressCountry": "{{SA}}"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": {{lat}},
        "longitude": {{lng}}
      },
      "hasMap": "{{googleMapsPlaceUrl}}",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          "opens": "12:00",
          "closes": "23:30"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Friday", "Saturday"],
          "opens": "13:00",
          "closes": "01:00"
        }
      ],
      "specialOpeningHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "opens": "19:00",
          "closes": "02:00",
          "validFrom": "{{ramadanStart}}",
          "validThrough": "{{ramadanEnd}}",
          "description": "Ramadan hours"
        }
      ],
      "amenityFeature": [
        { "@type": "LocationFeatureSpecification", "name": "Halal", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Outdoor seating", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Wheelchair accessible", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Free Wi-Fi", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Family section", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Delivery", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Takeaway", "value": true }
      ],
      "hasMenu": { "@id": "{{siteUrl}}/menu#menu" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "{{4.7}}",
        "reviewCount": "{{218}}",
        "bestRating": 5,
        "worstRating": 1
      },
      "review": [
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "{{reviewerName}}" },
          "datePublished": "{{2026-08-14}}",
          "reviewRating": { "@type": "Rating", "ratingValue": 5, "bestRating": 5 },
          "reviewBody": "{{actualReviewTextVisibleOnPage}}"
        }
      ],
      "sameAs": [
        "{{instagramUrl}}",
        "{{facebookUrl}}",
        "{{tiktokUrl}}",
        "{{googleBusinessProfileUrl}}",
        "{{tripadvisorUrl}}",
        "{{talabatUrl}}"
      ],
      "potentialAction": [
        {
          "@type": "ReserveAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "{{siteUrl}}/reserve"
          },
          "result": {
            "@type": "FoodEstablishmentReservation",
            "name": "Table reservation"
          }
        },
        {
          "@type": "OrderAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "{{deliveryPartnerUrl}}"
          },
          "deliveryMethod": ["http://purl.org/goodrelations/v1#DeliveryModeOwnFleet"]
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "{{siteUrl}}/#webpage",
      "url": "{{siteUrl}}/",
      "name": "{{restaurantName}} — {{cuisine}} مطعم في {{city}}",
      "isPartOf": { "@id": "{{siteUrl}}/#website" },
      "about": { "@id": "{{siteUrl}}/#restaurant" },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "{{siteUrl}}/og/hero-16x9.jpg",
        "width": 1200,
        "height": 675
      },
      "inLanguage": "ar",
      "dateModified": "{{lastUpdatedISO}}"
    },
    {
      "@type": "FAQPage",
      "@id": "{{siteUrl}}/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "هل المطعم يقدم خدمة التوصيل؟",
          "acceptedAnswer": { "@type": "Answer", "text": "{{answer}}" }
        },
        {
          "@type": "Question",
          "name": "هل يوجد قسم للعائلات؟",
          "acceptedAnswer": { "@type": "Answer", "text": "{{answer}}" }
        },
        {
          "@type": "Question",
          "name": "ما هي أوقات العمل؟",
          "acceptedAnswer": { "@type": "Answer", "text": "{{answer}}" }
        },
        {
          "@type": "Question",
          "name": "هل يمكن حجز طاولة مسبقًا؟",
          "acceptedAnswer": { "@type": "Answer", "text": "{{answer}}" }
        }
      ]
    }
  ]
}
```

---

## 2. Menu page — `Menu` → `MenuSection` → `MenuItem`

Keep the menu in HTML for accessibility and SEO; the JSON-LD describes the same
items. Generate both from one data file so they can never drift.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Menu",
      "@id": "{{siteUrl}}/menu#menu",
      "name": "{{restaurantName}} — قائمة الطعام",
      "description": "{{menuDescription}}",
      "inLanguage": "ar",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "@id": "{{siteUrl}}/menu#mezze",
          "name": "المقبلات",
          "description": "Mezze and starters",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "@id": "{{siteUrl}}/menu#hummus-beef",
              "name": "حمص باللحم",
              "description": "حمص بلدي مع لحم الغنم المفروم والصنوبر والزيت البلدي",
              "inLanguage": "ar",
              "suitableForDiet": [
                "https://schema.org/HalalDiet"
              ],
              "offers": {
                "@type": "Offer",
                "price": "28.00",
                "priceCurrency": "SAR",
                "availability": "https://schema.org/InStock"
              }
            },
            {
              "@type": "MenuItem",
              "@id": "{{siteUrl}}/menu#fattoush",
              "name": "فتوش",
              "description": "خضار موسمية مع دبس الرمان والسماق وخبز محمص",
              "suitableForDiet": [
                "https://schema.org/VeganDiet",
                "https://schema.org/VegetarianDiet",
                "https://schema.org/GlutenFreeDiet"
              ],
              "offers": {
                "@type": "Offer",
                "price": "24.00",
                "priceCurrency": "SAR",
                "availability": "https://schema.org/InStock"
              }
            }
          ]
        },
        {
          "@type": "MenuSection",
          "@id": "{{siteUrl}}/menu#grills",
          "name": "المشاوي",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "@id": "{{siteUrl}}/menu#mixed-grill",
              "name": "مشاوي مشكّلة",
              "description": "كباب، شيش طاووق، كفتة، مع الأرز والسلطة والمقبلات",
              "image": "{{siteUrl}}/img/dishes/mixed-grill-4x3.avif",
              "suitableForDiet": ["https://schema.org/HalalDiet"],
              "offers": {
                "@type": "Offer",
                "price": "89.00",
                "priceCurrency": "SAR",
                "availability": "https://schema.org/InStock"
              }
            }
          ]
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "{{siteUrl}}/" },
        { "@type": "ListItem", "position": 2, "name": "قائمة الطعام", "item": "{{siteUrl}}/menu" }
      ]
    }
  ]
}
```

Dietary URIs that Google recognises:
`HalalDiet`, `KosherDiet`, `VeganDiet`, `VegetarianDiet`, `GlutenFreeDiet`,
`LowFatDiet`, `LowSaltDiet`, `SugarFreeDiet`, `UnspecifiedDiet`.

Allergen note: schema.org has no first-class allergen field. Put allergens in
the visible HTML description text and in `nutrition`:

```json
"nutrition": {
  "@type": "NutritionInformation",
  "calories": "420 kcal",
  "fatContent": "18 g",
  "carbohydrateContent": "34 g",
  "proteinContent": "29 g",
  "servingSize": "1 plate"
}
```

---

## 3. Events page — `Event`

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "ليلة مشاوي مفتوحة",
  "startDate": "2026-10-03T20:00:00+03:00",
  "endDate": "2026-10-03T23:59:00+03:00",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": { "@id": "{{siteUrl}}/#restaurant" },
  "image": "{{siteUrl}}/img/events/grill-night-16x9.avif",
  "description": "{{description}}",
  "organizer": { "@id": "{{siteUrl}}/#restaurant" },
  "offers": {
    "@type": "Offer",
    "url": "{{siteUrl}}/events/grill-night",
    "price": "0",
    "priceCurrency": "SAR",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-09-01T00:00:00+03:00"
  }
}
```

---

## 4. Multi-location — one page per branch

Each `/locations/{slug}` page carries its **own** `Restaurant` node with a
unique `@id`, its own NAP, geo, hours, and menu link. Add the branch to the
parent's `department` / `subOrganization` and list every branch in the
parent's `sameAs`. Never place two location schemas on one page.

```json
{
  "@type": "Restaurant",
  "@id": "{{siteUrl}}/locations/north-riyadh#restaurant",
  "name": "{{restaurantName}} — فرع شمال الرياض",
  "branchOf": { "@id": "{{siteUrl}}/#restaurant" },
  "address": { "@type": "PostalAddress", "...": "..." },
  "geo": { "@type": "GeoCoordinates", "...": "..." },
  "openingHoursSpecification": ["..."],
  "hasMenu": "{{siteUrl}}/locations/north-riyadh/menu"
}
```

---

## 5. Bilingual (ar / en) — hreflang

In `<head>` of every page, in addition to the JSON-LD:

```html
<link rel="alternate" hreflang="ar" href="https://{{domain}}/ar/" />
<link rel="alternate" hreflang="en" href="https://{{domain}}/en/" />
<link rel="alternate" hreflang="x-default" href="https://{{domain}}/ar/" />
<link rel="canonical" href="https://{{domain}}/ar/" />
```

The Arabic `WebPage` node gets `"inLanguage": "ar"`; the English mirror gets
`"en"`. Keep both pointing at the same `Restaurant` `@id` if it is one
physical venue — one entity, two language views.

---

## 6. Validation workflow

1. Build → open the rendered HTML (view-source, not devtools DOM after JS).
2. Paste into <https://search.google.com/test/rich-results> — target **0 errors,
   0 warnings**.
3. Cross-check with <https://validator.schema.org/> for types Google does not
   surface (amenityFeature, nutrition).
4. Confirm JSON parses: a single syntax error silently kills the whole block.
5. After deploy: Search Console → Enhancements → watch for 7 days.
6. Re-validate whenever hours, menu prices, or the address change. Stale schema
   creates trust conflicts that suppress local ranking.

### Common failures

| Failure | Fix |
| --- | --- |
| `aggregateRating` on your own site ignored | Expected for local businesses — keep it, but do not rely on stars |
| Menu schema on home page while menu is not on home | Move it to `/menu`; schema must match visible content |
| Two `Restaurant` blocks on one page | One per location page, unique `@id` |
| Price without `priceCurrency` | Always pair `price` + `priceCurrency` (ISO 4217) |
| Hours crossing midnight (`01:00` close) | Valid — `closes` may be next-day; document it visibly too |
| PDF-only menu | Rebuild as HTML; PDF as `sameAs` fallback link only |
| Rating invented | Remove. Manual-action risk. |
