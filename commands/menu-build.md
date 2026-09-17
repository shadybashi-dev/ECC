---
description: Scaffold or run a complete bilingual restaurant menu system (customer menu + admin dashboard + dish photo pipeline) based on examples/menu-studio
---

Build or operate a professional restaurant menu with the Menu Studio reference implementation.

## Phases

### 1. Intake

- Confirm cuisine, brand name, languages, currency, and category list with the user.
- Decide price model per category: single price or size tiers (M/L).

### 2. Data

- Author or edit `examples/menu-studio/data/menu.json` following the schema in
  `skills/restaurant-menu-dashboard/SKILL.md`.
- Keep ids as stable slugs; write real bilingual copy for every dish (names + descriptions).

### 3. Photography

- Generate dish images with the recipe and QA checklist in `skills/food-photo-realism/SKILL.md`.
- Save to `examples/menu-studio/public/img/{item-id}.jpg`; batch within per-turn caps and queue the rest.

### 4. Run

- `cd examples/menu-studio && node server.mjs` (set `PORT` if needed; binds 0.0.0.0).
- Menu: `/` · Dashboard: `/dashboard.html` · API: `GET|PUT /api/menu`.

### 5. Verify

- Dashboard KPI "missing image" must read 0 before shipping.
- Toggle AR/EN on the menu; print-preview the menu (A4, two columns).
- Edit a price in the dashboard, Save, reload the menu, confirm the change.
