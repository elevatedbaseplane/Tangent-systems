import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'tangent-dist-'));

function listFiles(dir) {
  const files = [];
  const walk = current => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) files.push(path.relative(dir, full).split(path.sep).join('/'));
    }
  };
  walk(dir);
  return files.sort();
}

try {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts', 'build.mjs'), temp], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
  const dist = path.join(root, 'dist');
  const expected = listFiles(temp);
  const actual = fs.existsSync(dist) ? listFiles(dist) : [];
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  const problems = [];
  for (const file of expected) {
    if (!actualSet.has(file)) {
      problems.push(`missing ${file}`);
      continue;
    }
    const committed = fs.readFileSync(path.join(dist, ...file.split('/')));
    const fresh = fs.readFileSync(path.join(temp, ...file.split('/')));
    if (!committed.equals(fresh)) problems.push(`differs ${file}`);
  }
  for (const file of actual) if (!expectedSet.has(file)) problems.push(`extra ${file}`);
  if (problems.length) {
    console.error('dist/ does not match a fresh build from src/ and vendor/.');
    for (const problem of problems) console.error(problem);
    process.exit(1);
  }
  console.log('PASS: dist/ matches src/ and vendor/.');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
