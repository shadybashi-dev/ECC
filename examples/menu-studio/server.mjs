// Menu Studio — zero-dependency static + JSON API server.
// Serves ./public and exposes GET/PUT /api/menu backed by ./data/menu.json.
import { createServer } from 'node:http';
import { readFile, writeFile, rename } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC_DIR = join(ROOT, 'public');
const DATA_FILE = join(ROOT, 'data', 'menu.json');
const PORT = Number(process.env.PORT ?? 8080);
const MAX_BODY = 2 * 1024 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const send = (res, code, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });

// Minimal shape validation: never trust client payloads.
const validateMenu = (data) => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return 'menu must be an object';
  if (typeof data.restaurant !== 'object' || data.restaurant === null) return 'restaurant block missing';
  if (!Array.isArray(data.categories)) return 'categories must be an array';
  for (const cat of data.categories) {
    if (typeof cat?.id !== 'string' || !Array.isArray(cat?.items)) return 'malformed category';
    for (const item of cat.items) {
      if (typeof item?.id !== 'string') return 'malformed item id';
      if (item.prices !== undefined && typeof item.prices !== 'object') return 'malformed prices';
      if (item.price !== undefined && typeof item.price !== 'number') return 'malformed price';
    }
  }
  return null;
};

const safePath = (urlPath) => {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const full = normalize(join(PUBLIC_DIR, decoded === '/' ? 'index.html' : decoded));
  if (!full.startsWith(PUBLIC_DIR + sep) && full !== PUBLIC_DIR) return null;
  return full;
};

const server = createServer(async (req, res) => {
  const url = req.url ?? '/';
  try {
    if (url.startsWith('/api/menu')) {
      if (req.method === 'GET') {
        const raw = await readFile(DATA_FILE, 'utf8');
        return send(res, 200, raw);
      }
      if (req.method === 'PUT' || req.method === 'POST') {
        const raw = await readBody(req);
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          return send(res, 400, JSON.stringify({ error: 'invalid JSON' }));
        }
        const err = validateMenu(data);
        if (err) return send(res, 422, JSON.stringify({ error: err }));
        const tmp = `${DATA_FILE}.tmp`;
        await writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
        await rename(tmp, DATA_FILE);
        return send(res, 200, JSON.stringify({ ok: true, savedAt: new Date().toISOString() }));
      }
      return send(res, 405, JSON.stringify({ error: 'method not allowed' }));
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return send(res, 405, JSON.stringify({ error: 'method not allowed' }));
    }
    const filePath = safePath(url);
    if (!filePath) return send(res, 403, JSON.stringify({ error: 'forbidden' }));
    const body = await readFile(filePath);
    const type = MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': filePath.includes(`${sep}img${sep}`) ? 'public, max-age=3600' : 'no-store',
    });
    return res.end(req.method === 'HEAD' ? undefined : body);
  } catch (err) {
    if (err?.code === 'ENOENT') return send(res, 404, JSON.stringify({ error: 'not found' }));
    console.error('[menu-studio]', err.message);
    return send(res, 500, JSON.stringify({ error: 'internal error' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Menu Studio ready on http://0.0.0.0:${PORT}`);
});
