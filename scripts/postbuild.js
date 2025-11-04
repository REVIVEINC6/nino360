#!/usr/bin/env node
const fs = require('fs')
const { spawnSync } = require('child_process')
const path = require('path')

const root = process.cwd()
const script = path.join(root, 'scripts', 'fix-client-manifests.mjs')

if (!fs.existsSync(script)) {
  console.log('[postbuild] scripts/fix-client-manifests.mjs not found, skipping.')
  process.exit(0)
}

console.log('[postbuild] running fix-client-manifests.mjs')
const res = spawnSync(process.execPath, [script], { stdio: 'inherit' })
if (res.error) {
  console.error('[postbuild] error running fix-client-manifests.mjs', res.error)
  process.exit(1)
}
process.exit(res.status || 0)
