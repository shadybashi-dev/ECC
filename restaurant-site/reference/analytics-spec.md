# Analytics Spec — Antonia's Pizza
Privacy-first, vanilla JS, no tracking until owner approves — 2026-09-14

## Current State
- `privacy.html` says no tracking currently. Owner to decide: Plausible (privacy-friendly, recommended) or GA4 with consent.
- No GA ID in repo. No secrets. No cookies.
- Site is marketing front-end ONLY — orders on Toast (external). We can track clicks to Toast, not purchases (unless Toast provides post-purchase pixel).

## Recommended: Plausible (privacy-first)
- Self-hosted or cloud, no cookies, GDPR compliant, lightweight <1KB.
- Add script: `<script defer data-domain="antoniaspizza.com" src="https://plausible.io/js/script.js"></script>` only after owner provides domain and approves.
- Events via `plausible('eventName', {props: {}})` .

## Alternative: GA4 (if owner wants)
- Need GA4 Measurement ID (G-XXXXXXXX) from owner, never hardcode without owner.
- Add gtag.js with consent mode, anonymize IP, no PII.
- Events via `gtag('event', 'name', {params})`.

## Event Spec (vanilla JS, null-safe, behind flag)

| Event | When | Params | Code snippet (vanilla) |
|-------|------|--------|------------------------|
| view_menu | enter /menu | page | `document.addEventListener('DOMContentLoaded',()=>{if(location.pathname.includes('menu')) plausible('view_menu')})` |
| view_item | scroll menu item into view 50% | item_name, category | IntersectionObserver on `.menu-item` → `plausible('view_item',{props:{item: el.dataset.name}})` |
| click_order | any CTA Toast | location, cta_text, page | `$$('a[href*=\"toast.site\"]').forEach(a=>a.addEventListener('click',()=>plausible('click_order',{props:{loc: a.dataset.loc||'unknown', text: a.textContent.trim().slice(0,30)}})))` |
| start_order | click_order same as above (alias) | same | same as click_order, or distinct if intermediate /order page |
| add_to_cart | if Toast URL params for item (future) | item_name | parse Toast URL ?item= |
| begin_checkout | if Toast checkout start detectable | - | - |
| purchase | if Toast post-purchase redirect back with ?purchase (owner to setup with Toast) | value, items | Toast dashboard owns AOV, we can only track if Toast provides pixel |
| click_phone | tel: link | location, number | `$$('a[href^=\"tel:\"]').forEach(a=>a.addEventListener('click',()=>plausible('click_phone',{props:{loc: a.dataset.loc}})))` |
| click_directions | maps link | location | `$$('a[href*=\"maps\"]').forEach(a=>a.addEventListener('click',()=>plausible('click_directions',{props:{loc}})))` |
| click_location | tab locations | location | tab click |
| click_catering | catering CTA | page | `$$('[data-catering]').forEach...` |
| submit_catering_form | catering form submit (future) | - | form submit |

## Implementation Plan (when owner approves)

1. Owner provides Plausible domain or GA4 ID + privacy approval.
2. Update `privacy.html` to mention tracking (Plausible no cookies, or GA4 with consent).
3. In `js/main.js`, add behind flag:
```js
const ANALYTICS_ENABLED = false; // owner sets true + ID
function track(name, props){
  if(!ANALYTICS_ENABLED) return;
  if(window.plausible) plausible(name, {props});
  if(window.gtag) gtag('event', name, props);
}
```
4. Add listeners null-safe (every querySelector guarded).
5. Test in preview, no console errors, no PII.

## Dashboard (proposed)

- SEO: organic clicks, impressions, CTR, avg position, top keywords, local pack visibility (GSC)
- GEO: AI mentions, citations, entity consistency, indexed pages (manual check ChatGPT/Gemini/Perplexity)
- Sales: order clicks, conversion rate, AOV (Toast dashboard), click_order by page/location
- Local: calls (click_phone), direction requests (click_directions), website visits, reviews/rating (GBP)
- Catering: leads (click_catering, submit_catering_form), quote requests, revenue (owner)

## Privacy
- No PII in events, no email, no phone, no address in props.
- IP anonymized, no fingerprinting.
- Respect DNT? Plausible does by default.

## Acceptance
- Spec exists (this file), no tracking injected without owner ID, events documented, dashboard mock, privacy.html updated only after approval.

## KPIs
- Order clicks ↑, AOV ↑, calls ↑, directions ↑, catering leads ↑.
