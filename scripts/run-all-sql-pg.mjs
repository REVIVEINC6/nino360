#!/usr/bin/env node
/*
 Run all SQL files under the scripts/ directory using a direct Postgres connection (pg).

 Usage:
   node scripts/run-all-sql-pg.mjs [--script <relative-or-absolute-path>] [--dry-run]

 Env vars (loaded by run-migrations-with-env.mjs or your shell):
   - POSTGRES_URL_NON_POOLING or POSTGRES_URL (preferred)

 Behavior:
   - Attempts to execute each SQL file as a whole first (best for $$ blocks and functions)
   - If whole-file execution fails, falls back to statement-by-statement execution
     with a naive semicolon split and filters out common idempotent errors
*/

import { readdir, readFile } from 'fs/promises'
import { statSync } from 'fs'
import { join, extname } from 'path'
import pg from 'pg'

const { Client } = pg

// In some environments (Windows/corp proxies), TLS chain validation can fail for managed Postgres
// Explicitly disable strict validation for this process; we also set ssl.rejectUnauthorized=false below
process.env.NODE_TLS_REJECT_UNAUTHORIZED = process.env.NODE_TLS_REJECT_UNAUTHORIZED || '0'

const POSTGRES_URL = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL

if (!POSTGRES_URL) {
  console.error('❌ Missing POSTGRES_URL_NON_POOLING or POSTGRES_URL in environment')
  process.exit(1)
}

async function collectSqlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) files.push(...(await collectSqlFiles(full)))
    else if (e.isFile() && extname(e.name).toLowerCase() === '.sql') files.push(full)
  }
  return files
}

function splitStatementsSmart(sql) {
  // Split SQL into statements, respecting:
  // - Single quoted strings '...'
  // - Dollar-quoted strings/functions $$...$$ or $tag$...$tag$
  // - Line comments -- ... and block comments /* ... */
  const statements = []
  let buf = ''
  let i = 0
  let inSingle = false
  let inLineComment = false
  let inBlockComment = false
  let dollarTag = null // e.g., 'tag' for $tag$ ... $tag$

  const startsWithDollarTag = (s, pos) => {
    if (s[pos] !== '$') return null
    let j = pos + 1
    while (j < s.length && /[a-zA-Z0-9_]/.test(s[j])) j++
    if (j < s.length && s[j] === '$') {
      const tag = s.slice(pos + 1, j)
      return tag // empty string allowed for $$
    }
    return null
  }

  while (i < sql.length) {
    const ch = sql[i]
    const next = sql[i + 1]

    if (inLineComment) {
      buf += ch
      if (ch === '\n') inLineComment = false
      i++
      continue
    }

    if (inBlockComment) {
      buf += ch
      if (ch === '*' && next === '/') {
        buf += next
        i += 2
        inBlockComment = false
        continue
      }
      i++
      continue
    }

    // Handle start/end of dollar-quoted string
    if (!inSingle && !dollarTag) {
      const tag = startsWithDollarTag(sql, i)
      if (tag !== null) {
        // Enter dollar-quote mode
        dollarTag = tag
        const endPos = sql.indexOf(`$${tag}$`, i + (tag.length + 2))
        // If not found, we'll just copy and break (to avoid split); else consume until end
        buf += `$${tag}$`
        i += tag.length + 2
        continue
      }
    } else if (dollarTag) {
      // Inside dollar string; look for closing tag
      const endSeq = `$${dollarTag}$`
      const maybe = sql.slice(i, i + endSeq.length)
      buf += ch
      if (maybe === endSeq) {
        // Close dollar string
        // We already added first char, append the rest
        buf += sql.slice(i + 1, i + endSeq.length)
        i += endSeq.length
        dollarTag = null
        continue
      }
      i++
      continue
    }

    // Handle single-quoted strings
    if (!inSingle && ch === "'") {
      inSingle = true
      buf += ch
      i++
      continue
    } else if (inSingle) {
      buf += ch
      if (ch === "'" && sql[i - 1] !== '\\') {
        inSingle = false
      }
      i++
      continue
    }

    // Comments
    if (ch === '-' && next === '-') {
      inLineComment = true
      buf += ch + next
      i += 2
      continue
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true
      buf += ch + next
      i += 2
      continue
    }

    // Statement delimiter
    if (ch === ';' && !inSingle && !dollarTag && !inBlockComment && !inLineComment) {
      const stmt = buf.trim()
      if (stmt.length > 0 && !stmt.startsWith('--')) statements.push(stmt)
      buf = ''
      i++
      continue
    }

    buf += ch
    i++
  }
  const last = buf.trim()
  if (last.length > 0 && !last.startsWith('--')) statements.push(last)
  return statements
}

function isIgnorableErrorMessage(msg) {
  const m = msg.toLowerCase()
  return (
    m.includes('already exists') ||
    m.includes('duplicate key') ||
    m.includes('does not exist') || // in case drop-if-exists patterns
    m.includes('relation') && m.includes('already exists')
  )
}

async function runWholeFile(client, file) {
  const sql = await readFile(file, 'utf8')
  try {
    await client.query(sql)
    return { failures: 0 }
  } catch (err) {
    // Surface whole-file error to help diagnose $$ blocks and missing prereqs
    const msg = String(err?.message || err)
    console.error('   ❗ Whole-file error:', msg.split('\n')[0])
    return { failures: 1, error: err }
  }
}

async function runFileWithFallback(client, file) {
  // Try whole file first for proper $$ blocks handling
  const whole = await runWholeFile(client, file)
  if (whole.failures === 0) return 0

  console.log('   Whole-file execution failed, falling back to per-statement...')
  const sql = await readFile(file, 'utf8')
  const statements = splitStatementsSmart(sql)
  let failures = 0
  for (const stmt of statements) {
    try {
      await client.query(stmt)
    } catch (err) {
      const msg = String(err?.message || err)
      if (isIgnorableErrorMessage(msg)) {
        console.log(`   ⚠️  Skipping (idempotent): ${msg.split('\n')[0]}`)
        continue
      }
      console.error(`   ❌ Error executing statement: ${msg.split('\n')[0]}`)
      failures++
    }
  }
  return failures
}

async function main() {
  const SCRIPTS_DIR = join(process.cwd(), 'scripts')
  const args = process.argv.slice(2)
  let specificScript
  const dryRun = args.includes('--dry-run')
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a.startsWith('--script=')) specificScript = a.split('=')[1]
    else if (a === '--script' && args[i + 1]) specificScript = args[i + 1]
  }

  try {
    const s = statSync(SCRIPTS_DIR)
    if (!s.isDirectory()) throw new Error('scripts dir not found')
  } catch {
    console.error('❌ scripts directory not found')
    process.exit(1)
  }

  console.log('\n🚀 Running SQL files via Postgres in:', SCRIPTS_DIR)
  let files = (await collectSqlFiles(SCRIPTS_DIR)).sort()

  if (specificScript) {
    const candidate = specificScript.startsWith('scripts/') ? specificScript : join('scripts', specificScript)
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

  const client = new Client({ connectionString: POSTGRES_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()
  let totalFailures = 0

  try {
    for (const file of files) {
      console.log(`\n📄 Processing ${file} ...`)
      if (dryRun) {
        console.log('   (dry-run) Skipping execution')
        continue
      }
      console.log('   Executing...')
      const f = await runFileWithFallback(client, file)
      if (f > 0) {
        console.log(`   ❌ ${f} failed statements in ${file}`)
        totalFailures += f
      } else {
        console.log('   ✅ Completed')
      }
    }
  } finally {
    await client.end()
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
