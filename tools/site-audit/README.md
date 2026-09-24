# Site Audit Toolkit

Runs a headless website audit with one command. It works in sandboxes where the
usual browser downloads (Playwright or Puppeteer CDNs) are blocked, because the
Chromium comes from npm (`@sparticuz/chromium`).

## Install

```bash
cd tools/site-audit && npm install
source env.sh          # puts the CLIs on PATH and sets CHROME_PATH
```

## Run

```bash
# Serve the site first, e.g.  npx serve -l tcp://0.0.0.0:4173 /path/to/site
SITE_DIR=/path/to/site ./audit.sh http://localhost:4173 / /menu /contact
```

Reports go to `~/audits/<timestamp>/`: HTML and JSON reports for each tool plus a `SUMMARY.md`.

## What it checks

| Tool | Checks |
| --- | --- |
| Lighthouse 13 (mobile and desktop) | Performance, LCP/CLS/TBT, SEO, best practices, accessibility |
| axe-core | WCAG 2.2 AA violations, tested at a mobile viewport |
| linkinator | Broken internal links, followed recursively |
| html-validate | HTML correctness and a11y lint (needs `SITE_DIR`) |
| sharp | Weight of every JPG/PNG and the estimated AVIF/WebP savings (needs `SITE_DIR`) |

Also installed for fixing issues: `pa11y`, `@lhci/cli`, `lightningcss-cli`,
`csso-cli`, `terser`, `purgecss`, `svgo`, `sharp`.

To use the same browser in your own Puppeteer scripts, pass
`executablePath: process.env.CHROME_PATH` with `headless: 'shell'`.

## Extras

- `measure-widths.mjs <baseUrl> <out.json> path...` records the rendered width of every image at
  390, 820, and 1440 px. The optimizer uses this JSON to size `srcset` from the real layout.
- `shots.mjs <baseUrl> <outDir> path...` saves mobile and desktop screenshots for visual
  before/after diffs. Set `FIXED_TIME=2026-09-23T19:00:00-07:00` so sites that change by
  time of day render the same way every run.
- `examples/antonias-optimize.mjs <siteDir> [widths.json]` is an idempotent optimizer for a real
  static site. It generates responsive AVIF/WebP, preloads the hero image, minifies CSS/JS,
  applies clean URLs, and adds a11y fixes, CSP updates, and SEO fixes. Use it as a template.
- `examples/antonias-order-links.mjs <siteDir>` points each "Order" button at the matching Toast
  location menu, skipping Toast's unreliable geolocation finder. Generic buttons open a small
  accessible `<dialog>` location picker that remembers the choice, and every link gets UTM
  tags. It is idempotent. Run it before `antonias-optimize.mjs` so `main.min.js` is rebuilt.
