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
