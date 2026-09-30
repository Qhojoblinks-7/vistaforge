const fs = require('fs');
const path = require('path');

const publicDir = 'public';
const have = new Set(fs.readdirSync(publicDir));

// 1. Asset references in data files and components
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(jsx?|mjs)$/.test(e.name)) files.push(p);
  }
})('src');

const refs = new Map();
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const lineOf = (i) => text.slice(0, i).split(/\r?\n/).length;
  // static asset paths: '/foo.svg' but not '//' protocol-relative
  const re = /["'`](\/[A-Za-z0-9._-]+\.(?:svg|png|jpg|jpeg|webp|avif|gif|webm|mp4))["'`]/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const asset = m[1].slice(1);
    if (!refs.has(asset)) refs.set(asset, []);
    refs.get(asset).push(`${f}:${lineOf(m.index)}`);
  }
}

const missing = [];
for (const [asset, uses] of refs) {
  if (!have.has(asset)) missing.push({ asset, uses });
}

console.log('static asset refs found:', refs.size);
console.log('MISSING from public/:', missing.length);
missing.forEach(m => {
  console.log('  ' + m.asset + '  <- ' + m.uses[0] + (m.uses.length > 1 ? ` (+${m.uses.length - 1} more)` : ''));
});
