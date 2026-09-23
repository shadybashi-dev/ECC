// Lists raster images with size, dimensions and estimated AVIF/WebP savings (via sharp).
import sharp from 'sharp';
import fs from 'node:fs'; import path from 'node:path';
const root = process.argv[2];
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
  const p = path.join(d, e.name);
  if (e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.')) walk(p);
  else if (/\.(jpe?g|png)$/i.test(e.name)) files.push(p);
} })(root);
const out = [];
for (const f of files) {
  const buf = fs.readFileSync(f); const m = await sharp(buf).metadata();
  const webp = (await sharp(buf).webp({ quality: 78 }).toBuffer()).length;
  const avif = (await sharp(buf).avif({ quality: 55 }).toBuffer()).length;
  out.push({ file: path.relative(root, f), kb: Math.round(buf.length / 1024), w: m.width, h: m.height,
    webpKb: Math.round(webp / 1024), avifKb: Math.round(avif / 1024) });
}
out.sort((a, b) => b.kb - a.kb);
console.log(JSON.stringify(out, null, 2));
