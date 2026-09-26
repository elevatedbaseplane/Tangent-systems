import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const vendor = path.join(root, 'vendor');
const port = Number(process.env.PORT) || 8080;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8'
};

function resolveRequest(urlPath) {
  let rel;
  try { rel = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, ''); }
  catch { return null; }
  if (rel === '') rel = 'index.html';
  const fromVendor = rel === 'vendor' || rel.startsWith('vendor/');
  const base = fromVendor ? vendor : src;
  const inside = fromVendor ? rel.slice('vendor/'.length) : rel;
  if (inside === '') return null;
  const full = path.resolve(base, ...inside.split('/'));
  if (full !== path.resolve(base) && !full.startsWith(path.resolve(base) + path.sep)) return null;
  return full;
}

const server = http.createServer((request, response) => {
  const file = resolveRequest(request.url || '/');
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  response.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Tangent Systems at http://127.0.0.1:${port}/`);
});
