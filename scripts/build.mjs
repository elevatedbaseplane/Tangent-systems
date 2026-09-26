import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.resolve(process.argv[2] || path.join(root, 'dist'));

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });
fs.cpSync(path.join(root, 'src'), destination, { recursive: true });
fs.cpSync(path.join(root, 'vendor'), path.join(destination, 'vendor'), { recursive: true });
console.log(`Built ${destination}`);
