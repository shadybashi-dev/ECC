// usage: node shots.mjs <baseUrl> <outDir> path...  — full-page mobile + desktop screenshots (preloader skipped)
/* global document, scrollTo */
import puppeteer from 'puppeteer-core'; import fs from 'node:fs';
const [base, out, ...paths] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: 'shell' });
for (const p of paths) for (const [n, vp] of [['m', { width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 }], ['d', { width: 1366, height: 900 }]]) {
  const pg = await b.newPage(); await pg.setViewport(vp);
  if (process.env.FIXED_TIME) await pg.evaluateOnNewDocument((t) => { const R = Date; const off = new R(t) - R.now(); globalThis.Date = class extends R { constructor(...a) { super(...(a.length ? a : [R.now() + off])); } static now() { return R.now() + off; } }; }, process.env.FIXED_TIME);
  await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await pg.goto(base + p, { waitUntil: 'networkidle0', timeout: 60000 });
  await pg.evaluate(async () => { document.querySelector('.preloader')?.remove(); for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); document.querySelectorAll('.reveal,.stagger').forEach(e => e.classList.add('in', 'is-in', 'visible')); });
  await new Promise(r => setTimeout(r, 800));
  await pg.screenshot({ path: `${out}/${(p.replace(/\//g, '_') || '_') }-${n}.png`, fullPage: n === 'm' ? false : false });
  await pg.close();
}
await b.close();
