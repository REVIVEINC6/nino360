#!/usr/bin/env node
import { promises as fs } from 'node:fs'
import path from 'node:path'

async function fileExists(p) {
  try {
    await fs.stat(p)
    return true
  } catch {
    return false
  }
}

async function copyIfMissing(src, dest) {
  const exists = await fileExists(dest)
  if (exists) return false
  await fs.mkdir(path.dirname(dest), { recursive: true })
  await fs.copyFile(src, dest)
  return true
}

async function main() {
  const root = process.cwd()
  const serverAppDir = path.join(root, '.next', 'server', 'app')
  const rootClientManifest = path.join(serverAppDir, 'page_client-reference-manifest.js')

  const hasRoot = await fileExists(rootClientManifest)
  if (!hasRoot) {
    console.log('[fix-client-manifests] Root client manifest not found, skipping.')
    return
  }

  // candidate app subdirs that often miss the per-page client-reference manifest
  const targets = [
    '(marketing)',
    '(public)',
    '(app)',
  ]

  let copied = 0
  for (const t of targets) {
    const dir = path.join(serverAppDir, t)
    const dest = path.join(dir, 'page_client-reference-manifest.js')
    try {
      const didCopy = await copyIfMissing(rootClientManifest, dest)
      if (didCopy) {
        copied++
        console.log(`[fix-client-manifests] Copied manifest to ${path.relative(root, dest)}`)
      }
    } catch (e) {
      console.log(`[fix-client-manifests] Skipped ${t}:`, e?.message || e)
    }
  }

  if (copied === 0) {
    console.log('[fix-client-manifests] No copies were necessary.')
  } else {
    console.log(`[fix-client-manifests] Completed. Files copied: ${copied}`)
  }
}

main().catch((e) => {
  console.error('[fix-client-manifests] Error:', e)
  process.exitCode = 1
})
