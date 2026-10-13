/**
 * Smoke-test the restaurant TV menu in jsdom: boot the app, inspect the builder,
 * wait for automatic rotation, and exercise category/pause controls.
 *
 *   npm run smoke
 */
import { JSDOM } from 'jsdom';

const WAIT_MS = Number(process.env.SMOKE_WAIT_MS ?? 27000);

const dom = new JSDOM(
  '<!doctype html><html lang="en" dir="ltr"><body><div id="root"></div></body></html>',
  { url: 'http://localhost:5173/?intro=1', pretendToBeVisual: true },
);

const { window } = dom;

window.matchMedia =
  window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  }));

class Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = window.ResizeObserver || Observer;
window.IntersectionObserver = window.IntersectionObserver || Observer;
window.HTMLCanvasElement.prototype.getContext = () => null;
window.requestAnimationFrame =
  window.requestAnimationFrame || ((cb) => setTimeout(() => cb(Date.now()), 16));

const define = (key, value) =>
  Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });

globalThis.window = window;
globalThis.document = window.document;
define('navigator', window.navigator);

for (const key of Object.getOwnPropertyNames(window)) {
  if (key in globalThis) continue;
  try {
    const value = window[key];
    if (typeof value === 'function' || typeof value === 'object') define(key, value);
  } catch {
    /* Ignore browser properties not exposed by jsdom. */
  }
}

globalThis.HTMLElement = window.HTMLElement;
globalThis.SVGElement = window.SVGElement;
globalThis.customElements = window.customElements;
globalThis.requestAnimationFrame = window.requestAnimationFrame;
globalThis.cancelAnimationFrame = window.cancelAnimationFrame;
globalThis.ResizeObserver = window.ResizeObserver;
globalThis.IntersectionObserver = window.IntersectionObserver;

const problems = [];
window.addEventListener('error', (event) => problems.push(`window error: ${event.message}`));

const originalError = console.error;
console.error = (...args) => {
  problems.push(`console.error: ${args.map(String).join(' ').slice(0, 300)}`);
  originalError(...args);
};

const originalWarn = console.warn;
console.warn = (...args) => {
  const text = args.map(String).join(' ');
  if (!/failed layer|Not implemented|jsdom/i.test(text)) {
    problems.push(`console.warn: ${text.slice(0, 260)}`);
  }
  originalWarn(...args);
};

const { createServer } = await import('vite');
const React = (await import('react')).default;
const { createRoot } = await import('react-dom/client');

const server = await createServer({
  root: process.cwd(),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

const smooth = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const failures = [];
const check = (label, condition, detail = '') => {
  const ok = Boolean(condition);
  console.log(`${ok ? '✅' : '❌'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures.push(label);
};

try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const container = window.document.getElementById('root');
  createRoot(container).render(React.createElement(App));

  await sleep(1200);
  const title = () => smooth(container.querySelector('main h2')?.textContent);
  const firstCategory = title();
  const boardText = smooth(container.textContent);

  check('App boots into the build-your-own board', firstCategory.includes('Build Your Own Pizza'), firstCategory);
  check('Build-your-own choices and 7-size price matrix render', Boolean(container.querySelector('.pizza-builder-board')) && boardText.includes('Cauliflower') && boardText.includes('$75.99'));
  check('Seven category buttons', container.querySelectorAll('footer button').length === 7);
  check('Promotion ticker', container.querySelectorAll('.marquee span').length >= 10);
  check('No fictional QR target is shown', !boardText.includes('daralyasmin.example'));
  check('Menu icons render', container.querySelectorAll('svg').length > 10, `${container.querySelectorAll('svg').length} svg`);

  await sleep(2500);
  const progress = [...container.querySelectorAll('.prog-fill, .page-dot span')]
    .map((node) => node.style.transform)
    .filter(Boolean);
  check('Category/page progress advances', progress.some((value) => /scaleX\(0\.[1-9]/.test(value)), progress.join(' , '));

  await sleep(Math.max(0, WAIT_MS - 3700));
  const afterRotation = title();
  check('Automatic category rotation', afterRotation !== firstCategory && afterRotation.includes('Gourmet'), `${firstCategory} → ${afterRotation}`);

  window.dispatchEvent(new window.KeyboardEvent('keydown', { key: '5', code: 'Digit5', bubbles: true }));
  await sleep(600);
  const afterKey = title();
  check('Number key selects a category', afterKey.includes('Calzones'), afterKey);
  check('Screenshot menu prices are present', smooth(container.textContent).includes('$14.99'));

  window.dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
  await sleep(400);
  check('Space pauses the board', smooth(container.textContent).includes('Paused'));

  console.log('\nRendered DOM size:', container.innerHTML.length, 'characters');
  console.log('Console issues:', problems.length);
  problems.slice(0, 8).forEach((problem) => console.log('  ⚠️', problem));

  if (failures.length > 0 || problems.length > 0) process.exitCode = 1;
  console.log(process.exitCode ? '\n🚨 Smoke test failed' : '\n🎉 All smoke checks passed');
} catch (error) {
  console.log('Smoke test failed:', error);
  process.exitCode = 1;
} finally {
  await server.close();
  process.exit(process.exitCode ?? 0);
}
