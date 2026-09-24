#!/usr/bin/env node
// Antonia's Pizza release optimizer — idempotent, run from tools/site-audit:
//   node examples/antonias-optimize.mjs <siteDir> [imgWidths.json]
// imgWidths.json = rendered widths per image at 390/820/1440px (from measure step);
// images without measurements get a generic srcset.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { transform as lcss } from 'lightningcss';
import { minify } from 'terser';
import crypto from 'node:crypto';

const SITE = path.resolve(process.argv[2] || '.');
const WIDTHS = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : {};
const read = (p) => fs.readFileSync(path.join(SITE, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(SITE, p), s);
const log = (...a) => console.log('•', ...a);

// Root pages are the source of truth; the folder copies (menu/index.html …) are regenerated.
const ROOT_PAGES = ['index', 'menu', 'san-luis-obispo', 'paso-robles', 'our-story', 'catering', 'order',
  'faq', 'privacy', 'deals', 'ajarski', '404'];
const BLOG_PAGES = ['blog/index', 'blog/late-night-slo', 'blog/paso-wine-pairing'];
const CLEAN = { index: '/', 'blog/index': '/blog' };
const cleanUrl = (name) => CLEAN[name] ?? '/' + name;

// ---------------------------------------------------------------- 1. images
const variantCache = new Map();
async function variants(srcPath) {
  if (variantCache.has(srcPath)) return variantCache.get(srcPath);
  const abs = path.join(SITE, srcPath);
  if (!fs.existsSync(abs)) return null;
  const meta = await sharp(abs).metadata();
  const W = meta.width;
  const m = WIDTHS['/' + srcPath];
  let targets;
  if (m) {
    const big = Math.max(m.t || 0, m.d || 0, m.m || 0);
    targets = [m.m * 2, big, big * 2];
  } else targets = [480, 960];
  targets = [...new Set(targets.map((w) => Math.min(W, Math.ceil(w / 40) * 40)).filter((w) => w > 0))].sort((a, b) => a - b);
  targets = targets.filter((w, i, arr) => i === arr.length - 1 || arr[i + 1] / w > 1.2);
  const base = srcPath.replace(/\.(jpe?g|png|webp)$/i, '');
  const out = { W, H: meta.height, sizes: sizesAttr(m), avif: [], webp: [] };
  for (const w of targets) {
    for (const [fmt, opts] of [['avif', { quality: 52, effort: 6 }], ['webp', { quality: 76, effort: 6 }]]) {
      const file = `${base}-${w}w.${fmt}`;
      const fabs = path.join(SITE, file);
      if (!fs.existsSync(fabs)) await sharp(abs).resize({ width: w, withoutEnlargement: true })[fmt](opts).toFile(fabs);
      out[fmt].push(`/${file} ${w}w`);
    }
  }
  variantCache.set(srcPath, out);
  return out;
}
function sizesAttr(m) {
  if (!m) return '(max-width: 600px) 92vw, 50vw';
  const vw = (px, vp) => Math.min(100, Math.max(1, Math.round((px / vp) * 100)));
  if (m.d <= 200 && m.m <= 200) return `${Math.max(m.m, m.t, m.d)}px`;
  return `(max-width: 600px) ${vw(m.m, 390)}vw, (max-width: 1000px) ${vw(m.t, 820)}vw, ${m.d}px`;
}

const lcpHints = [];
async function rewriteImages(html) {
  // Locate existing <picture> blocks so we only add AVIF there instead of re-wrapping.
  const pictures = [];
  html.replace(/<picture\b[\s\S]*?<\/picture>/g, (m, off) => { pictures.push([off, off + m.length]); return m; });
  const inPicture = (i) => pictures.some(([a, b]) => i > a && i < b);
  const jobs = [];
  html.replace(/<img\b[^>]*>/g, (tag, off) => { jobs.push({ tag, off }); return tag; });
  let out = ''; let last = 0;
  for (const { tag, off } of jobs) {
    const src = (tag.match(/\ssrc="([^"]+)"/) || [])[1];
    if (!src || /^(https?:|data:)/.test(src) || !/\.(jpe?g|png|webp)$/i.test(src) || inPicture(off)) continue;
    const v = await variants(src.replace(/^\//, ''));
    if (!v) continue;
    let img = tag;
    if (!/\sdecoding=/.test(img)) img = img.replace(/<img\b/, '<img decoding="async"');
    const pic = `<picture><source type="image/avif" srcset="${v.avif.join(', ')}" sizes="${v.sizes}">` +
      `<source type="image/webp" srcset="${v.webp.join(', ')}" sizes="${v.sizes}">${img}</picture>`;
    out += html.slice(last, off) + pic; last = off + tag.length;
  }
  out += html.slice(last);
  // Existing <picture>: add an AVIF source when only WebP is offered.
  const blocks = [];
  out.replace(/<picture\b[\s\S]*?<\/picture>/g, (m, off) => { blocks.push({ m, off }); return m; });
  let res = ''; last = 0;
  for (const { m, off } of blocks) {
    if (/\d+w"/.test(m)) continue;                     // already responsive
    const src = (m.match(/<img\b[^>]*\ssrc="([^"]+)"/) || [])[1];
    if (!src || !/\.(jpe?g|png|webp)$/i.test(src)) continue;
    const v = await variants(src.replace(/^\//, ''));
    if (!v) continue;
    // Replace single-file sources with responsive AVIF + WebP sets.
    const srcs = `<source type="image/avif" srcset="${v.avif.join(', ')}" sizes="${v.sizes}">` +
      `<source type="image/webp" srcset="${v.webp.join(', ')}" sizes="${v.sizes}">`;
    const nm = m.replace(/\s*<source\b[^>]*>/g, '').replace(/<picture\b[^>]*>/, (p) => p + srcs);
    res += out.slice(last, off) + nm; last = off + m.length;
    if (/fetchpriority="high"/.test(m)) lcpHints.push({ src, v });
  }
  return res + out.slice(last);
}

// ---------------------------------------------------------------- 2. html
const SPECULATION = `  <script type="speculationrules">
  {"prefetch":[{"source":"document","where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":"/assets/*"}},{"not":{"href_matches":"https://antoniaspizza.toast.site/*"}}]},"eagerness":"moderate"}]}
  </script>
`;
function absolutize(html) {
  // Every internal reference becomes root-absolute so the page works at any URL depth.
  return html.replace(/\b(href|src|srcset|action|data-src)="(?!\/|#|[a-z][a-z0-9+.-]*:|$)([^"]*)"/gi, (m, a, v) =>
    a === 'srcset' ? `${a}="${v.split(',').map((s) => '/' + s.trim()).join(', ')}"` : `${a}="/${v}"`);
}
function cleanLinks(html) {
  const names = [...ROOT_PAGES.filter((n) => n !== '404'), ...BLOG_PAGES];
  return html.replace(/href="\/?((?:blog\/)?[a-z-]+)\.html(#[^"]*)?"/g, (m, name, hash = '') => {
    if (!names.includes(name)) return m;
    const u = cleanUrl(name);
    return `href="${u}${hash}"`;
  });
}
function a11y(html) {
  html = html.replace(/<button\b(?![^>]*\btype=)/g, '<button type="button"');
  // Footer column titles: h4 after h2 skipped levels.
  html = html.replace(/(<div class="footer-grid"[\s\S]*?<\/footer>)/, (f) => f.replace(/<h4>([\s\S]*?)<\/h4>/g, '<h2 class="footer-title">$1</h2>'));
  // Location info cards sit directly under the h1.
  html = html.replace(/(<div class="info-card[^"]*">\s*)<h3>([\s\S]*?)<\/h3>/g, '$1<h2 class="info-card-title">$2</h2>');
  return html;
}
function headTweaks(html, name) {
  const $ = (re) => re.test(html);
  if (!$(/type="speculationrules"/)) html = html.replace('</head>', SPECULATION + '</head>');
  if (!$(/baloo-2-latin-800-normal\.woff2" crossorigin/) && !/preload[^>]*800-normal/.test(html))
    html = html.replace(/(<link rel="stylesheet")/, '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/baloo-2-latin-800-normal.woff2" crossorigin>\n  $1');
  if (!/preload[^>]*400-normal/.test(html))
    html = html.replace(/(<link rel="stylesheet")/, '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/baloo-2-latin-400-normal.woff2" crossorigin>\n  $1');
  html = html.replace(/href="\/css\/style(?:\.min)?\.css(?:\?v=\w+)?"/g, `href="/css/style.min.css?v=${BUILD}"`)
    .replace(/src="\/js\/main(?:\.min)?\.js(?:\?v=\w+)?"/g, `src="/js/main.min.js?v=${BUILD}"`);
  if (name === '404') {
    html = html.replace(/\s*<link rel="canonical"[^>]*>/, '');
    if (!/name="robots"/.test(html)) html = html.replace(/(<meta name="viewport"[^>]*>)/, '$1\n  <meta name="robots" content="noindex, follow">');
    else html = html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, follow">');
  }
  if (name === 'index') {
    html = html.replace(/(property="og:image" content=")[^"]*"/, '$1https://antoniaspizza.com/assets/img/og/home.jpg"')
      .replace(/(name="twitter:image" content=")[^"]*"/, '$1https://antoniaspizza.com/assets/img/og/home.jpg"')
      .replace(/(og:image:width" content=")\d+/, '$11200').replace(/(og:image:height" content=")\d+/, '$1630');
  }
  return html;
}

// ---------------------------------------------------------------- 3. css / js
const CSS_PATCH = `
/* ===== optimize.mjs patch: a11y contrast + heading-level renames ===== */
:root{--red-ink:#b3301b}
picture{display:contents}
picture>source{display:none}
.deal-note{opacity:.9}
.section--dark#reviews .eyebrow,.section--dark#locations .eyebrow{color:var(--navy) !important}
.loc-tabs button.active{background:var(--red-ink);color:var(--paper)}
.loc-rows .row b{color:var(--red-ink)}
.footer-grid .footer-title{font-size:.8rem;letter-spacing:.26em;text-transform:uppercase;color:var(--sun);margin-bottom:1.1rem;font-weight:700;line-height:1.6}
.info-card .info-card-title{font-family:var(--font-display);text-transform:uppercase;font-size:1.25rem;margin-bottom:.7rem;line-height:1.6}
.preloader{animation-delay:1.6s}
[aria-label="Photo gallery"] .eyebrow{color:var(--navy) !important}
`;
function patchMainJs(js) {
  // Preloader: time-boxed (no longer waits for every image) and shown once per session.
  if (js.includes('sessionStorage.getItem("ap-pl")')) return js;   // already patched
  js = js.replace(/const MIN_MS = prefersReduced \? 400 : 1200;[^\n]*/, 'const MIN_MS = prefersReduced ? 150 : 650;   // short brand beat; never gates the hero')
    .replace('let pageLoaded = document.readyState === "complete";', 'let pageLoaded = true;   // do not wait for window.load (slow images kept LCP hostage)')
    .replace('if (count) count.textContent = "1%";\n    requestAnimationFrame(frame);',
      'let seen = false; try { seen = sessionStorage.getItem("ap-pl") === "1"; sessionStorage.setItem("ap-pl", "1"); } catch (_) {}\n    if (seen) { preloader.remove(); document.body.classList.add("loaded"); } else {\n    if (count) count.textContent = "1%";\n    requestAnimationFrame(frame); }')
    .replace('setTimeout(finish, 8000);', 'setTimeout(finish, 2500);');
  // Bottom nav: clean URLs + fix "" matching every page.
  js = js.replace(/const path = \(location\.pathname\.split\("\/"\)\.pop\(\) \|\| "index\.html"\)\.toLowerCase\(\);/,
    'const path = (location.pathname.replace(/\\/+$/, "").split("/").pop() || "index").replace(/\\.html$/, "").toLowerCase();')
    .replace('home: ["index.html", ""],', 'home: ["index"],')
    .replace('menu: ["menu.html"],', 'menu: ["menu"],')
    .replace('locations: ["san-luis-obispo.html", "paso-robles.html", "locations"]', 'locations: ["san-luis-obispo", "paso-robles", "locations"]')
    .replace('if ((map[key] || []).some((p) => path.includes(p))) {', 'if ((map[key] || []).includes(path)) {');
  return js;
}

// ---------------------------------------------------------------- run
let BUILD = '';   // content hash of the minified CSS+JS, set below
const htmlOf = (n) => `${n}.html`;

log('CSS');
let css = read('css/style.css');
css = css.replace(/\n\/\* ===== optimize\.mjs patch[\s\S]*$/, '') + CSS_PATCH; write('css/style.css', css);
write('css/style.min.css', Buffer.from(lcss({ filename: 'style.css', code: Buffer.from(css), minify: true,
  targets: { safari: 14 << 16, chrome: 90 << 16, firefox: 90 << 16 } }).code).toString());

log('JS');
let js = read('js/main.js'); const pjs = patchMainJs(js);
if (pjs !== js) write('js/main.js', pjs);
write('js/main.min.js', (await minify(pjs, { compress: { passes: 2 }, mangle: true, format: { comments: false } })).code);
BUILD = crypto.createHash('sha256').update(read('css/style.min.css') + read('js/main.min.js')).digest('hex').slice(0, 8);

for (const name of [...ROOT_PAGES, ...BLOG_PAGES]) {
  const f = htmlOf(name);
  if (!fs.existsSync(path.join(SITE, f))) continue;
  let html = read(f);
  html = absolutize(html);
  html = cleanLinks(html);
  html = headTweaks(html, name);
  html = a11y(html);
  lcpHints.length = 0;
  html = await rewriteImages(html);
  // Hero preload must request the same candidate the <picture> will pick (AVIF, responsive).
  const main = html.slice(Math.max(0, html.indexOf('<main')));
  const heroTag = (main.match(/<img\b[^>]*fetchpriority="high"[^>]*>/) || main.match(/<img\b[^>]*loading="eager"[^>]*>/) || [''])[0];
  const heroSrc = heroTag.match(/\ssrc="([^"]+)"/)?.[1];
  const hv = heroSrc && /\.(jpe?g|png|webp)$/i.test(heroSrc) ? await variants(heroSrc.replace(/^\//, '')) : null;
  html = html.replace(/\s*<link rel="preload" as="image"[^>]*>/g, (tag) => {
    const h = tag.match(/\shref="([^"]+)"/)?.[1]; const body = html.slice(html.indexOf('<body'));
    return hv || (h && !body.includes(h.replace(/\.\w+$/, ''))) ? '' : tag;
  });
  if (hv) html = html.replace(/(\s*<link rel="preload" as="font")/, `\n  <link rel="preload" as="image" type="image/avif" imagesrcset="${hv.avif.join(', ')}" imagesizes="${hv.sizes}" fetchpriority="high">$1`);
  write(f, html);
  // Regenerate the folder copy (menu/index.html …) so the two can never drift again.
  const dir = name === 'blog/index' || name === 'index' || name === '404' ? null : name;
  if (dir && fs.existsSync(path.join(SITE, dir, 'index.html'))) write(path.join(dir, 'index.html'), html);
  log('page', f);
}

log('headers / misc');
let headers = read('_headers');
if (!headers.includes("'inline-speculation-rules'")) headers = headers.replace(/script-src 'self'/, "script-src 'self' 'inline-speculation-rules'");
headers = headers.replace(/(\/assets\/\*\n\s+Cache-Control: public, max-age=)86400/, '$1604800');
headers = headers.replace(/\n\s*Link: <\/assets\/fonts\/baloo-2-latin-800-normal\.woff2>[^\n]*/, '');
write('_headers', headers);
let llms = read('llms.txt');
llms = llms.replace(/(^|[\s(])(https:\/\/[^\s)<]+?)([.,;]?)(?=\s|$)/gm, (m, p, u, t) => (p.endsWith('(') ? m : `${p}[${u}](${u})${t}`));
write('llms.txt', llms);
for (const junk of ['assets/fonts/baloo2-var.ttf', 'css/style.ultra.min.css']) {
  if (fs.existsSync(path.join(SITE, junk))) { fs.rmSync(path.join(SITE, junk)); log('removed unused', junk); }
}
log(`done — ${variantCache.size} images got AVIF/WebP variants`);
