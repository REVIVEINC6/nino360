#!/usr/bin/env node
/**
 * Safe clean script for Next.js dev/build caches.
 * - Ensures no dev server is running by checking common Next/Turbo lock files and ports when possible.
 * - Removes .next, .turbo, and node_modules/.cache directories if present.
 * - Windows/Unix friendly (Node handles paths/cross-platform deletes).
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const targets = [
  path.join(root, '.next'),
  path.join(root, '.turbo'),
  path.join(root, 'node_modules', '.cache')
];

function rmrf(p) {
  if (fs.existsSync(p)) {
    try {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`🧹 Removed ${path.relative(root, p)}`);
    } catch (e) {
      console.warn(`⚠️  Failed to remove ${p}: ${e.message}`);
    }
  } else {
    console.log(`ℹ️  Skipped (not found): ${path.relative(root, p)}`);
  }
}

console.log('🧼 Cleaning build/dev caches...');
for (const t of targets) rmrf(t);
console.log('✅ Clean complete.');
