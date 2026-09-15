---
name: conversion-psychology
description: Evidence-based behavioral science for turning restaurant website visitors into orders — cognitive biases, choice architecture, menu engineering (Star/Plowhorse/Puzzle/Dog), price anchoring, sensory description language, social proof, friction removal, and CRO with measured effect sizes. Use when designing menus, CTAs, pricing displays, ordering flows, or any surface whose job is to increase average order value and order completion.
metadata:
  origin: project-synthesis
  layer: 4
  evidence: Cornell Food & Brand Lab, Illinois cafeteria study, Parsa & Njite, Chowly/Toast 2026 industry data
---

# Conversion Psychology

Every number in this file is a **measured effect size** from published research or
large-scale industry data. Do not use persuasion folklore. Do not invent urgency.
Do not use dark patterns — they convert once and destroy repeat business, which
is the entire economics of a restaurant.

## The economics first (why this matters more than design)

| Lever | Measured effect |
| --- | --- |
| Direct ordering vs third-party marketplace | **saves 15–30% per order** in commission |
| Adding online ordering at all | **+18%** average restaurant sales |
| Online ordering link surfaced on Google | **2.5×** more orders |
| Online reservations added to site | **+19%** website conversion |
| PDF menu → searchable HTML menu | **+58%** completed orders, **+47%** organic traffic |
| Each extra second of mobile load time | **+7%** order abandonment |
| Each extra click between landing and checkout | **−20%** conversion |
| Mobile-optimised "Order Now" button | **+34%** conversion |
| Strategic CTA placement vs unclear path | up to **+83%** conversion |
| CTA as a button vs a text link | **+28%** conversion |
| Menu item with a photo vs text-only | **+25–30%** orders (poor photo: **−15%**) |
| Descriptive item name vs plain name | **+27%** sales of that item |
| Price anchoring (premium item placed first) | **+6.8%** average check |
| "Most Popular" / "Guest Favorite" label | **+13–20%** selection of labelled item |
| Removing currency symbols from prices | **+8.15%** spend |
| Items in first/last position of a category | **+20–30%** vs middle positions |
| Top-right placement (LTR menus) | **+35%** more visual attention |
| Staff/algorithmic recommendation on an item | **+15–25%** sales of that item |
| Digital/mobile ordering vs in-person | **+35%** average order value |
| Digital menu done well | **+20–40%** sales (some report >60%) |

The single highest-leverage fact: **70% of customers prefer ordering directly
from a restaurant's own website when possible.** The job of the site is to make
that the easiest path — not to funnel people to a marketplace that takes 30%.

---

## 1. The five friction gates

A hungry visitor passes five gates. Conversion dies at whichever one is slowest.

1. **"Are you open right now?"** — If they must hunt for hours, they leave.
   Surface a live *Open now / Closes at 2 AM* indicator in the header, computed
   from real hours in the visitor's local timezone. Late-night hours are a
   competitive weapon; never bury them.
2. **"Can I get it my way?"** — Pickup / Delivery / Dine-in must be a visible
   three-way choice above the fold, not a decision discovered at checkout.
3. **"What does it actually look like?"** — Photos reduce uncertainty.
   Uncertainty is the real competitor, not the other pizza place.
4. **"How much will this be?"** — No surprise fees, no "price on request",
   no cart that only reveals totals at the end.
5. **"How many taps?"** — Count them. Landing → item → cart → checkout → done.
   Every tap over four is measurable lost revenue.

Audit each gate separately. Fix the worst one first; do not redesign everything.

---

## 2. Menu engineering — the Star / Plowhorse / Puzzle / Dog matrix

Classify every item on two axes: **popularity** (units sold) vs **margin**
(contribution profit). This is the standard Cornell framework and repositioning
alone yields **+10–15% profitability** with no recipe or price change.

| | High margin | Low margin |
| --- | --- | --- |
| **High popularity** | ⭐ **Star** — protect it, give it the best photo, top placement, never rename | 🐴 **Plowhorse** — raise price slightly, shrink portion imperceptibly, add a premium upsell |
| **Low popularity** | 🧩 **Puzzle** — reposition: better name, better photo, better placement, staff/AI recommendation | 🐕 **Dog** — remove, or bundle into a deal so it stops taking menu real estate |

Website implementation:

- Stars get the hero slot and the first position in their category.
- Puzzles get rewritten descriptions + real photography before you give up on them.
- Dogs get deleted from the digital menu (they can stay in-store).
- Recompute quarterly from POS data. Menus drift.

---

## 3. Anchoring and price architecture

Anchoring is the strongest single pricing effect available on a website.

1. **Put one premium item at the top of each category.** A $42 item makes the
   $28 item below it read as reasonable. Effect: +5–8% on mid-range items,
   +6.8% on average check.
2. **Never sort by price ascending.** That makes your cheapest item the anchor
   and trains the visitor downward. Sort by margin × popularity instead.
3. **Remove the currency symbol** where it reads naturally: `28` not `$28.00`.
   Measured +8.15% spend. Keep the symbol on the cart/checkout total for clarity
   and trust — do not obscure the final number.
4. **Decoy sizing.** Three sizes where the medium is priced close to the large
   pushes people up. The 28" XL is your natural decoy — feature it deliberately.
5. **Bundle, don't discount.** "Two XL two-topping for $39.99" beats
   "20% off" because it raises basket size instead of cutting margin, and it
   reads as a *deal discovered* rather than *food devalued*.
6. **Anchor add-ons at the moment of intent**, not at checkout: wings and drinks
   appear next to the pizza, not in a generic "extras" page.

---

## 4. Description language (the +27% lever)

The Illinois cafeteria study: identical food, descriptive labels → **+27% sales**,
perceived quality 6.9 vs 6.2, perceived value 7.1 vs 6.3 (9-point scale).

The mechanism is **sensory specificity**. Concrete sensory language activates
appetite responses; vague adjectives do not.

| ❌ Weak | ✅ Strong |
| --- | --- |
| Delicious grilled chicken with vegetables | Herb-crusted chicken, charred over open flame, with lemon-garlic butter |
| Cheese pizza | Hand-stretched dough, 24-hour cold ferment, house tomato sauce, whole-milk mozzarella |
| Bread appetizer | Warm bread boat, pulled from the oven, with molten mozzarella, feta, and a cracked egg yolk |
| Good wings | Crispy twice-fried wings, tossed to order, blue cheese on the side |

Formula: **[cooking method] + [specific ingredient origin/quality] + [sensory
texture or temperature] + [one distinguishing detail]**.

Rules:

- One named ingredient beats three adjectives.
- Never write "delicious", "amazing", "mouth-watering", "best in town" —
  the visitor discounts self-praise automatically.
- Describe **process** (24-hour ferment, hand-stretched, made in-house) —
  effort signals quality more credibly than claims.
- Keep it to one or two lines on mobile. Truncation destroys the effect.

---

## 5. Social proof — sequencing matters

Order of credibility, highest first:

1. **Specific, detailed review quotes** naming a dish and a moment
   ("my nephew from Texas who NEVER eats the crust cleaned his entire plate")
2. **Volume + rating together** (4.8 ★ from 1,240 reviews) — never rating alone
3. **Third-party platform proof** (Google, Yelp) — more trusted than on-site testimonials
4. **User-generated photos** — beats professional photography for trust
5. **Local identity proof** ("SLO exclusive", "downtown since …") — a
   differentiator chains cannot copy
6. **Expert/press mention** if any

Implementation rules:

- Put proof **adjacent to the decision**, not on a separate testimonials page.
  A review next to the item it describes converts; a testimonials page does not.
- Show real first name + last initial + neighbourhood. Anonymity kills it.
- Never fabricate. Fabricated `aggregateRating` is a Google structured-data
  policy violation with manual-action risk.
- Answer negative reviews publicly and calmly — visitors read the responses,
  and a good response raises trust more than a perfect score.

---

## 6. Choice architecture

- **Category size:** 6–8 items per category. Beyond that, decision fatigue
  triggers deferral ("I'll decide later") — and later means never.
- **Defaults:** whatever is pre-selected wins. Pre-select pickup (highest margin,
  fastest), make delivery an explicit opt-in.
- **The "Most Popular" badge:** mark 2–3 items per category. +13–20% on those
  items. Only badge items that genuinely are — a lie here is discovered.
- **Dietary filters are a conversion tool, not an accessibility nice-to-have:**
  vegan, vegetarian, gluten-free, halal, spicy. Adding menu keywords like
  "vegan" improves organic visibility 15–40% *and* unblocks a whole segment.
- **Scarcity, honestly:** "8 left tonight" only when the POS actually tracks it.
  Fake scarcity is a dark pattern and, in most jurisdictions, an
  enforceable consumer-protection problem.
- **Loss framing for real deadlines:** "Kitchen closes at 2 AM · order by 1:30"
  is a fact, not a pressure tactic. Use facts.

---

## 7. Cognitive biases that apply — and the ones to refuse

Use these:

| Bias | Application |
| --- | --- |
| Anchoring | Premium item first (§3) |
| Social proof | Reviews adjacent to items (§5) |
| Default effect | Pre-selected pickup (§6) |
| Framing | "Feeds 4" beats "Large" |
| Peak–end rule | The last screen must be warm — order confirmation with a real thank-you, photo of the kitchen, and an honest ETA |
| Zeigarnik effect | Saved cart that persists across sessions; "finish your order" nudge |
| Mere exposure | Repeat the signature item (the dough boat) across home, menu, and confirmation |
| Authority | Named chef, named supplier, dough ferment time |
| Reciprocity | A genuine free extra (garlic sauce, dipping sauce) mentioned up front |
| Goal gradient | Loyalty stamp progress — people accelerate near the reward |
| Decoy effect | Three sizes, medium priced close to large |

Refuse these (dark patterns — they convert once, then churn):

- Fake countdown timers not tied to a real deadline
- Fake "12 people are viewing this" counters
- Fabricated reviews or ratings
- Roach-motel subscriptions (easy in, hard out)
- Hidden fees revealed only at the final step
- Forced continuity, confirmshaming ("No thanks, I hate saving money")
- Pre-ticked paid add-ons

A restaurant lives on repeat customers. Any pattern that trades a first order
for trust is a net loss.

---

## 8. Mobile is the product

- **68%** of restaurant website visits are mobile. **46%** of restaurant sites
  fail mobile usability. **36%** abandon a non-mobile-friendly site.
- **75%** of guests abandon a poor ordering experience.
- Thumb zone: primary CTA in the bottom third, sticky. Right edge for RTL,
  bottom-centre for LTR.
- Tap targets ≥ 48×48 px (WCAG minimum is 44; ordering under time pressure
  needs more).
- Never require account creation before checkout. Guest checkout, always.
  Account creation is an *offer after* the first successful order.
- Autofill-friendly: `autocomplete` on every field, `tel`/`email` input types,
  address lookup.
- Form field count is the strongest predictor of checkout abandonment.
  Target ≤ 5 fields before payment.

---

## 9. CTA craft

- One primary CTA per screen. Two competing primaries halve both.
- Verb + outcome, first person: **"Order Pickup"** / **"Start My Order"** beat
  "Submit" or "Click here".
- Separate CTAs for pickup vs delivery beat one ambiguous "Order Online" —
  it removes a decision from checkout.
- Contrast: the CTA must be the highest-contrast element on screen. Test it
  against the actual food photography behind it, not a white mockup.
- Persistent/sticky on scroll. Floating order buttons measured **+25%**
  (Mr. Jim's Pizza) and prominent buttons **+30%** in two months
  (Smokin' Oak Wood Fired Pizza).
- Microcopy under the CTA removes risk: "Free delivery over $25 · Ready in 20 min".
- Never place a CTA before answering the four questions a hungry visitor has:
  what kind of food, how much, how fast, how do I get it.

---

## 10. Retention — where the money actually is

Acquiring a diner costs more than keeping one. Repeat rate is the metric.

- Capture email/SMS at checkout with a **real** reason ("text me when it's
  ready" beats "join our newsletter").
- Loyalty with visible progress toward a concrete reward.
- Post-order follow-up at the moment of peak satisfaction, not 30 days later.
- Win-back for lapsed regulars with a specific dish mention, not a generic discount.
- Every order should leave you with a permissioned contact. That database is
  worth more than any ad budget.

---

## 11. Measurement — instrument before you optimise

You cannot improve what you do not log. Minimum event set:

```
view_menu_section   { section, position }
view_item           { item_id, price, has_photo, badge }
add_to_cart         { item_id, modifiers[], qty, source }
remove_from_cart    { item_id }
checkout_start      { mode: pickup|delivery, cart_value, item_count }
checkout_step       { step, field_dropped }
order_complete      { order_id, value, items, mode, first_order }
cta_click           { cta_id, position, label }
call_click          { location }
directions_click    { location }
abandon             { step, cart_value, dwell_ms }
```

KPIs that matter, in order: **order completion rate**, **average order value**,
**repeat-customer share**, **first-party order share vs marketplace**,
**checkout step drop-off**, **time-to-order from landing**.

A/B test one variable at a time with enough traffic to reach significance.
A restaurant site rarely has the volume for weekly tests — batch changes and
measure monthly, or run qualitative session reviews instead.

> Related: `neuromarketing-priming` (visual/sensory layer),
> `restaurant-web-blueprint` (schema + performance),
> `frontend-design` (aesthetic direction),
> `click-path-audit` (verify every CTA path actually works end to end).
