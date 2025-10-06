const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const OUT_FILE = path.join(__dirname, '..', 'build_large_files.json')

function walk(dir) {
  const files = []
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      files.push(...walk(full))
    } else {
      files.push({ path: full, size: stat.size })
    }
  }
  return files
}

const publicFiles = walk(PUBLIC_DIR)
  .sort((a, b) => b.size - a.size)
  .slice(0, 100)
  .map((f) => ({ path: f.path.replace(path.join(__dirname, '..') + path.sep, ''), size: f.size }))

fs.writeFileSync(OUT_FILE, JSON.stringify(publicFiles, null, 2))
console.log(`Wrote ${OUT_FILE} with ${publicFiles.length} entries.`)
console.log('Top large files:')
publicFiles.slice(0, 10).forEach((f) => console.log(`${(f.size / 1024).toFixed(1)} KB - ${f.path}`))
