// usage: node measure-widths.mjs <baseUrl> <out.json> path...
// Records the largest rendered width of every <img> at 390 / 820 / 1440 px viewports.
// Feed the JSON to examples/antonias-optimize.mjs so srcset sizes match real layout.
/* global document, location */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const [base, out, ...paths] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: 'shell' });
const res = {};
for (const [key, width] of [['m', 390], ['t', 820], ['d', 1440]]) {
  for (const p of paths) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.goto(base + p, { waitUntil: 'networkidle0', timeout: 60000 });
    const imgs = await page.evaluate(() => {
      document.querySelector('.preloader')?.remove();
      return [...document.images].map((i) => ({
        src: new URL(i.getAttribute('src'), location.href).pathname,
        w: Math.round(i.getBoundingClientRect().width),
      }));
    });
    for (const { src, w } of imgs) {
      res[src] ||= { m: 0, t: 0, d: 0 };
      res[src][key] = Math.max(res[src][key], w);
    }
    await page.close();
  }
}
await browser.close();
fs.writeFileSync(out, JSON.stringify(res, null, 1));
console.log(`${Object.keys(res).length} images measured -> ${out}`);
