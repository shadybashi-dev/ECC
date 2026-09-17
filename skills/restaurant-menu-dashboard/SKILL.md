---
name: restaurant-menu-dashboard
description: Build and operate professional restaurant menu systems — bilingual RTL/LTR customer menu, admin dashboard with CRUD over categories/items/prices/availability, size-based pricing, print/PDF stylesheet, and image pipeline integration. Use when building, extending, or reviewing any restaurant menu, QR menu, or menu management dashboard.
metadata:
  origin: ECC
---

# Restaurant Menu Dashboard

Patterns for a production-grade digital menu: a customer-facing bilingual menu plus an admin dashboard that owns the same data.

## When to Activate

- Building a QR/digital menu, menu board, or menu management console.
- Adding i18n (especially Arabic RTL) to a food ordering or menu surface.
- Wiring dish photography into menu data.

## Data Contract (single source of truth)

```jsonc
{
  "restaurant": { "name_ar": "", "name_en": "", "tagline_ar": "", "tagline_en": "",
                  "hotline": "", "hours_ar": "", "hours_en": "", "currency": "SAR" },
  "settings": { "default_lang": "ar", "show_unavailable": false },
  "categories": [{
    "id": "pizza", "icon": "🍕", "name_ar": "", "name_en": "",
    "items": [{
      "id": "margherita", "img": "img/pizza-margherita.jpg",
      "name_ar": "", "name_en": "", "desc_ar": "", "desc_en": "",
      "tags": ["veg", "popular", "spicy", "chef"],
      "prices": { "m": 32, "l": 45 },   // or single "price": 24
      "available": true
    }]
  }]
}
```

Rules: ids are stable slugs; `img` paths bind 1:1 to item ids; never delete ids that orders reference — flip `available` instead.

## Architecture

- **One JSON document** served by `GET /api/menu`, edited by `PUT /api/menu` (validate shape server-side; atomic write via tmp+rename).
- **Zero-dependency static server** is enough for a single venue; swap the API layer for a DB later without touching the UI.
- **Immutable edits** in the dashboard: every field change produces a new state object; Save is explicit with dirty indicator and Revert.
- **Image probe**: dashboard checks each `item.img` loads (`Image()` onerror) and surfaces "missing image" KPI so the menu never ships broken slots.

## Bilingual RTL/LTR

- Store copy as paired fields (`name_ar`/`name_en`), never as one string with slashes.
- Toggle flips `document.dir` + `lang`; use logical CSS (`margin-inline-start`, `inset-inline`) so one stylesheet serves both directions.
- Prices: numeric value + currency code in `restaurant.currency`; format through one helper (`fmtPrice`) used by menu and dashboard.

## Menu UX Checklist

- Sticky category nav with scroll-spy; smooth scroll with `scroll-margin-top`.
- Lazy-load images (`loading="lazy"`), graceful `onerror` fallback to an icon tile.
- Size pricing as chips (M/L); tags as colored pills (popular/spicy/veg/chef).
- Unavailable items stay visible but dimmed with a "sold out today" band (honesty sells trust).
- Search filters across both languages and descriptions.
- `@media print` stylesheet → clean two-column A4 menu for PDF/print without a second codebase.

## Dashboard UX Checklist

- KPI row: item count, available, hidden, missing images, average price.
- Category sidebar with counts; inline table editing (names AR+EN, prices, image path).
- Two-step delete (arm → confirm) so one misclick never wipes a dish.
- Row reorder (▲/▼) controls menu order; Export JSON for backups; Save shows server result.

## Reference Implementation

`examples/menu-studio/` — runnable zero-dependency app: `node server.mjs` (PORT env), menu at `/`, dashboard at `/dashboard.html`. Pair with the `food-photo-realism` skill for the image pipeline.
