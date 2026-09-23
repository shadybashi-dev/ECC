// Runs axe-core (WCAG 2.2 AA) against a URL with the portable Chromium and prints JSON violations.
import puppeteer from 'puppeteer-core';
import { AxePuppeteer } from '@axe-core/puppeteer';
const url = process.argv[2];
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: 'shell' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  const r = await new AxePuppeteer(page).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
  console.log(JSON.stringify(r.violations.map(v => ({
    id: v.id, impact: v.impact, help: v.help, count: v.nodes.length,
    targets: v.nodes.slice(0, 5).map(n => n.target.join(' ')),
  })), null, 2));
} finally { await browser.close(); }
