import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'src';

// 1. Collect declared routes from App.jsx
const appSrc = fs.readFileSync(path.join(srcDir, 'App.jsx'), 'utf8');
const routes = new Set();
for (const m of appSrc.matchAll(/<Route\s+path="([^"]+)"/g)) {
  routes.add(m[1]);
}
// redirects / Navigate targets
const navigates = new Set();
for (const m of appSrc.matchAll(/<Navigate\s+to="([^"]+)"/g)) {
  navigates.add(m[1]);
}

console.log('DECLARED ROUTES:');
[...routes].sort().forEach(r => console.log('  ' + r));
console.log('\nApp-level Navigate targets:');
[...navigates].sort().forEach(r => console.log('  ' + r));

// 2. Walk all source files, collect link targets
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    // Skip this audit script's own directory; its regexes would self-match.
    if (e.isDirectory() && e.name === 'scripts') continue;
    if (e.isDirectory()) walk(p, out);
    else if (/\.(jsx?|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk(srcDir);
const refs = [];
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');

  // Map character offsets to line numbers for reporting
  const lineOf = (idx) => text.slice(0, idx).split(/\r?\n/).length;

  let m;
  // <Link ... to={...} or to="..."  — attributes may span multiple lines
  const linkRe = /<Link\b[\s\S]*?\bto\s*=\s*(?:\{)?['"`]([^'"`]+)['"`]/g;
  while ((m = linkRe.exec(text)) !== null) {
    refs.push({ file: f, line: lineOf(m.index), target: m[1] });
  }
  // to="/x" used on elements other than <Link> (e.g. plain <a to>)
  const anyToRe = /\bto\s*=\s*(?:\{)?['"`]\/([^'"`]*)['"`]/g;
  while ((m = anyToRe.exec(text)) !== null) {
    refs.push({ file: f, line: lineOf(m.index), target: '/' + m[1] });
  }
  // navigate('...')
  const navRe = /navigate\(\s*['"`]([^'"`]+)['"`]/g;
  while ((m = navRe.exec(text)) !== null) {
    refs.push({ file: f, line: lineOf(m.index), target: m[1] });
  }
  // path: '/x'  in nav config objects
  const cfgRe = /\bpath\s*:\s*['"`]([^'"`]+)['"`]/g;
  while ((m = cfgRe.exec(text)) !== null) {
    if (m[1].startsWith('/')) refs.push({ file: f, line: lineOf(m.index), target: m[1] });
  }
  // redirect + Navigate to=
  const redRe = /\bredirect\s*=\s*\{?\s*['"`]([^'"`]+)['"`]/g;
  while ((m = redRe.exec(text)) !== null) {
    refs.push({ file: f, line: lineOf(m.index), target: m[1] });
  }
}

// 3. Match a target against the route table
const PARAM = /:[^/]+/;
function matches(target, route) {
  if (target === route) return true;
  if (!PARAM.test(route)) return false;
  const r = route.split('/');
  const t = target.split('/');
  if (r.length !== t.length) return false;
  for (let i = 0; i < r.length; i++) {
    if (PARAM.test(r[i])) continue;
    if (r[i] !== t[i]) return false;
  }
  return true;
}
function resolve(target) {
  const clean = target.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return null; // external / hash / mailto
  return [...routes].some(r => matches(clean, r)) ? 'ok' : 'MISSING';
}

// 4. Verify in-page anchor targets exist somewhere in the codebase
const allSrc = files
  .map((f) => fs.readFileSync(f, 'utf8'))
  .join('\n');
const anchorIds = new Set();
for (const m of allSrc.matchAll(/\bid=["'`]([^"'`]+)["'`]/g)) {
  anchorIds.add(m[1]);
}
// Dynamic ids like id={pkg.id} resolve from data objects, e.g. PACKAGES
// entries with an `id` field. Collect those literal values too.
for (const m of allSrc.matchAll(/^\s*id:\s*['"`]([a-z][a-z0-9-]*)['"`]/gm)) {
  anchorIds.add(m[1]);
}

const anchorRefs = new Map();
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const lineOf = (i) => text.slice(0, i).split(/\r?\n/).length;
  // Anchors only. Match within a single line so a stray `href=` in one
  // element cannot greedily pair with a `#` many lines later.
  const re = /(?:to=|href=)\{?['"`]\/[^'"`\n]*#([a-z][a-z0-9-]*)['"`]/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const hash = m[1];
    if (!anchorIds.has(hash)) {
      if (!anchorRefs.has(hash)) anchorRefs.set(hash, []);
      anchorRefs.get(hash).push(`${f}:${lineOf(m.index)}`);
    }
  }
}

console.log('\n=== ANCHOR TARGETS (#fragment) ===');
const knownAnchors = [...anchorRefs.keys()].sort();
if (knownAnchors.length === 0) {
  console.log('All in-page anchors resolve.');
} else {
  for (const [hash, uses] of knownAnchors) {
    console.log(`  #${hash}  *** NO ELEMENT WITH THAT id ***  <- ${uses[0]} (+${uses.length - 1})`);
  }
}

// 5. Report unique targets summary
const unique = new Map();
for (const r of refs) {
  const k = r.target;
  if (!unique.has(k)) unique.set(k, { target: k, status: resolve(k), uses: [] });
  unique.get(k).uses.push(`${path.relative('.', r.file)}:${r.line}`);
}

console.log('\n=== UNIQUE INTERNAL LINK TARGETS ===');
for (const { target, status, uses } of [...unique.values()].sort((a, b) => a.target.localeCompare(b.target))) {
  const tag = status === null ? 'external' : status === 'ok' ? 'OK' : '*** MISSING ROUTE ***';
  console.log(`${String(target).padEnd(34)} ${tag.padEnd(22)} (${uses.length}) ${uses[0]}`);
}
