const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const exts = new Set(['.tsx', '.ts', '.jsx', '.js']);
const changed = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'dist' || ent.name === 'build') continue;
      walk(full);
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (!exts.has(ext)) continue;
      try {
        let s = fs.readFileSync(full, 'utf8');
        const orig = s;
        // Replace bg-gradient-to-XXX -> bg-linear-to-XXX
        s = s.replace(/bg-gradient-to-([trbl]{1,2})/g, 'bg-linear-to-$1');
        // data-[state=active]:bg-linear-to-r etc
        s = s.replace(/bg-gradient-to-([a-z0-9-]+)/g, 'bg-linear-to-$1');
        // Replace shrink-0 -> shrink-0
        s = s.replace(/\bflex-shrink-0\b/g, 'shrink-0');
        if (s !== orig) {
          fs.writeFileSync(full, s, 'utf8');
          changed.push(path.relative(root, full));
        }
      } catch (err) {
        console.error('err reading', full, err.message);
      }
    }
  }
}

walk(root);

if (changed.length === 0) {
  console.log('No files changed');
} else {
  console.log('Files changed:');
  for (const f of changed) console.log(f);
}
