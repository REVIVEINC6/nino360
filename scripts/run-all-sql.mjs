#!/usr/bin/env node
/*
 Run all SQL files under the scripts/ directory against Supabase.

 Usage:
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/run-all-sql.mjs

 This script will:
 - find all .sql files under ./scripts (recursively)
 - sort them by path/name
 - execute their statements via the `exec_sql` RPC (same approach as existing setup.ts)
 - skip "already exists" / duplicate-key errors
 - print a summary and exit with non-zero on failures
*/

import { createClient } from '@supabase/supabase-js'
import { readdir, readFile } from 'fs/promises'
import { statSync } from 'fs'
import { join, extname } from 'path'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  console.error('   Example: SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxxxx node scripts/run-all-sql.mjs')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function collectSqlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      files.push(...(await collectSqlFiles(full)))
    } else if (e.isFile() && extname(e.name).toLowerCase() === '.sql') {
      files.push(full)
    }
  }

  return files
}

async function runFile(path) {
  const sql = await readFile(path, 'utf8')
  // naive split by semicolon - mirrors existing setup scripts
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'))

  let failures = 0

  for (const stmt of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: stmt })
      if (error) {
        const msg = error.message || String(error)
        if (msg.includes('already exists') || msg.includes('duplicate key')) {
          console.log(`   ⚠️  Skipping (already exists): ${msg.split('\n')[0]}`)
          continue
        }
        console.error(`   ❌ Error executing statement: ${msg.split('\n')[0]}`)
        failures++
        // continue to next statement
      }
    } catch (err) {
      console.error('   ❌ Exception while executing statement:', err)
      failures++
    }
  }

  return failures
}

async function main() {
  const SCRIPTS_DIR = join(process.cwd(), 'scripts')
  const args = process.argv.slice(2)
  // Support: --script=path or --script path
  let specificScript
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a.startsWith('--script=')) specificScript = a.split('=')[1]
    if (a === '--script' && args[i + 1]) specificScript = args[i + 1]
  }
  const dryRun = args.includes('--dry-run')
  try {
    const s = statSync(SCRIPTS_DIR)
    if (!s.isDirectory()) {
      console.error('❌ scripts directory not found')
      process.exit(1)
    }
  } catch (e) {
    console.error('❌ scripts directory not found')
    process.exit(1)
  }

  console.log('\n🚀 Running SQL files in:', SCRIPTS_DIR)

  let files = (await collectSqlFiles(SCRIPTS_DIR)).sort()
  if (specificScript) {
    // Normalize path relative to scripts dir
    const candidate = specificScript.startsWith('scripts/') ? specificScript : join('scripts', specificScript)
    // Accept either absolute or relative
    const absCandidate = candidate.startsWith('/') || candidate.match(/^[A-Za-z]:\\/) ? candidate : join(process.cwd(), candidate)
    files = files.filter((f) => f === absCandidate || f.endsWith(specificScript) || f.endsWith(candidate))
    if (!files.length) {
      console.error(`❌ Specified script not found: ${specificScript}`)
      process.exit(1)
    }
  }
  if (!files.length) {
    console.log('No .sql files found under scripts/')
    process.exit(0)
  }

  let totalFailures = 0
  for (const file of files) {
    console.log(`\n📄 Processing ${file} ...`)
    if (dryRun) {
      console.log('   (dry-run) Printing statements only...')
      const sql = await readFile(file, 'utf8')
      const statements = sql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('--'))
      statements.forEach((st, idx) => console.log(`   [${idx + 1}] ${st.slice(0, 200).replace(/\n/g, ' ')}${st.length > 200 ? '...' : ''}`))
      continue
    }

    console.log('   Executing...')
    const f = await runFile(file)
    if (f > 0) {
      console.log(`   ❌ ${f} failed statements in ${file}`)
      totalFailures += f
    } else {
      console.log('   ✅ Completed')
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\nSummary: total files: ${files.length}, total failed statements: ${totalFailures}`)
  if (totalFailures > 0) process.exit(1)
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
