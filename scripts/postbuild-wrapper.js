#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const root = process.cwd()
const script = path.join(root, 'scripts', 'postbuild.js')

if (!fs.existsSync(script)) {
  console.log('[postbuild] scripts/postbuild.js not found, skipping.')
  process.exit(0)
}

console.log('[postbuild] found scripts/postbuild.js, executing')
try {
  require(script)
} catch (err) {
  console.error('[postbuild] error executing scripts/postbuild.js', err)
  process.exit(1)
}
