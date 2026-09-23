// Builds a Markdown summary from an audit output folder.
import fs from 'node:fs'; import path from 'node:path';
const dir = process.argv[2]; const L = [];
const read = f => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } };
L.push('# Audit summary', '', '## Lighthouse', '', '| Page | Form | Perf | A11y | BP | SEO | LCP | CLS | TBT |', '|---|---|---|---|---|---|---|---|---|');
const opps = {};
for (const f of fs.readdirSync(dir).filter(f => /^lh-.*\.report\.json$/.test(f)).sort()) {
  const r = read(f); if (!r) continue;
  const c = k => r.categories[k] ? Math.round(r.categories[k].score * 100) : '-';
  const a = k => r.audits[k]?.displayValue ?? '-';
  const [, page, ff] = f.match(/^lh-(.*)-(mobile|desktop)\.report\.json$/) || [];
  L.push(`| ${page} | ${ff} | ${c('performance')} | ${c('accessibility')} | ${c('best-practices')} | ${c('seo')} | ${a('largest-contentful-paint')} | ${a('cumulative-layout-shift')} | ${a('total-blocking-time')} |`);
  for (const [id, au] of Object.entries(r.audits)) {
    if (au.score !== null && au.score < 0.9 && ['metricSavings', 'numeric'].some(() => true) && au.scoreDisplayMode !== 'informative' && au.scoreDisplayMode !== 'notApplicable' && au.scoreDisplayMode !== 'manual') {
      (opps[id] ||= { title: au.title, pages: new Set(), sample: au.displayValue || '' }).pages.add(`${page}/${ff}`);
    }
  }
}
L.push('', '## Failing Lighthouse audits', '');
for (const [id, o] of Object.entries(opps).sort((a, b) => b[1].pages.size - a[1].pages.size))
  L.push(`- **${o.title}** (\`${id}\`) ${o.sample ? '— ' + o.sample : ''} — ${o.pages.size} runs`);
L.push('', '## Accessibility (axe-core, WCAG 2.2 AA)', '');
for (const f of fs.readdirSync(dir).filter(f => f.startsWith('axe-'))) {
  const v = read(f) || []; L.push(`### ${f.replace(/^axe-|\.json$/g, '')} — ${v.length} rule(s)`);
  for (const x of v) L.push(`- [${x.impact}] ${x.help} (\`${x.id}\`, ${x.count}×) e.g. \`${x.targets[0]}\``);
}
const links = read('links.json');
if (links) { const bad = links.links.filter(l => l.state === 'BROKEN'); L.push('', `## Links — ${links.links.length} checked, ${bad.length} broken`); for (const b of bad.slice(0, 30)) L.push(`- ${b.status} ${b.url} (from ${b.parent})`); }
const hv = read('html-validate.json');
if (hv) { const n = hv.reduce((s, f) => s + f.errorCount, 0); const rules = {}; hv.forEach(f => f.messages.forEach(m => rules[m.ruleId] = (rules[m.ruleId] || 0) + 1));
  L.push('', `## HTML validation — ${n} errors`); for (const [r, c] of Object.entries(rules).sort((a, b) => b[1] - a[1]).slice(0, 15)) L.push(`- \`${r}\`: ${c}`); }
const im = read('images.json');
if (im) { const tot = im.reduce((s, i) => s + i.kb, 0), av = im.reduce((s, i) => s + i.avifKb, 0);
  L.push('', `## Images — ${im.length} raster files, ${tot} KB total → ~${av} KB as AVIF`); for (const i of im.slice(0, 12)) L.push(`- ${i.file}: ${i.kb} KB (${i.w}×${i.h}) → WebP ${i.webpKb} KB / AVIF ${i.avifKb} KB`); }
console.log(L.join('\n'));
