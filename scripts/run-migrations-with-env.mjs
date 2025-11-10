#!/usr/bin/env node
import { readFile } from 'fs/promises'
import { join } from 'path'

async function loadEnv(file) {
  const content = await readFile(file, 'utf8')
  const lines = content.split(/\r?\n/)
  for (const l of lines) {
    const m = l.match(/^\s*([^=]+)=\s*"?(.*)"?$/)
    if (m) {
      process.env[m[1]] = m[2]
    }
  }
}

async function main() {
  const envPath = join(process.cwd(), '.env.local')
  try {
    await loadEnv(envPath)
  } catch (e) {
    console.warn('Could not load .env.local, proceeding with existing env')
  }

  // Choose driver via flag: --driver=rpc (default) | --driver=pg
  const args = process.argv.slice(2)
  let driver = 'rpc'
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a.startsWith('--driver=')) driver = a.split('=')[1]
    else if (a === '--driver' && args[i + 1]) driver = args[i + 1]
  }

  const entry = driver === 'pg' ? './run-all-sql-pg.mjs' : './run-all-sql.mjs'

  // Delegate to the selected runner
  try {
    await import(entry)
  } catch (err) {
    console.error('Migration runner failed:', err)
    process.exit(1)
  }
}

main()
