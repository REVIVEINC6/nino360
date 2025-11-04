#!/usr/bin/env node
import pg from 'pg'
import fs from 'fs'
import path from 'path'

const sqlPath = path.join(process.cwd(), 'scripts', 'backfill-core-users.sql')
if (!fs.existsSync(sqlPath)) {
  console.error('Backfill SQL not found:', sqlPath)
  process.exit(1)
}

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING
if (!DATABASE_URL) {
  console.error('Please set DATABASE_URL or POSTGRES_URL_NON_POOLING in the environment')
  process.exit(2)
}

const client = new pg.Client({ connectionString: DATABASE_URL })

async function run() {
  try {
    await client.connect()
    const sql = fs.readFileSync(sqlPath, 'utf8')
    console.log('Running backfill SQL...')
    const res = await client.query(sql)
    console.log('Backfill completed')
    process.exit(0)
  } catch (err) {
    console.error('Backfill failed:', err)
    process.exit(3)
  } finally {
    try { await client.end() } catch {}
  }
}

run()
