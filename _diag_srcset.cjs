const fs = require('fs');
const path = require('path');

const dir = 'dist/assets';
const js = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const distNames = new Set(fs.readdirSync(dir));

let total = 0;
const broken = new Set();

for (const f of js) {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  const re = /"[^"]*\/assets\/([^"]*-\d+w\.[a-z0-9]{3,4})":/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    total++;
    const ref = m[1];
    if (!distNames.has(ref)) broken.add(ref);
  }
}

console.log('variant URLs referenced:', total);
console.log('referenced but missing from dist:', broken.size);
[...broken].slice(0, 20).forEach(b => console.log('  MISSING:', b));
