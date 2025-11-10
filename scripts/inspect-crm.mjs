#!/usr/bin/env node
import pg from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'
const { Client } = pg
process.env.NODE_TLS_REJECT_UNAUTHORIZED = process.env.NODE_TLS_REJECT_UNAUTHORIZED || '0'

// Load .env.local similar to run-migrations-with-env
try {
  const envPath = join(process.cwd(), '.env.local')
  const content = readFileSync(envPath, 'utf8')
  content.split(/\r?\n/).forEach((l) => {
    const m = l.match(/^\s*([^=]+)=\s*"?(.*)"?$/)
    if (m) process.env[m[1]] = m[2]
  })
} catch {}

const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
if (!url) { console.error('Missing POSTGRES_URL'); process.exit(1) }
const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await client.connect()
async function exists(schema, table) {
  const { rows } = await client.query(
    `select exists (select 1 from information_schema.tables where table_schema=$1 and table_name=$2) as e`,
    [schema, table]
  )
  return rows[0]?.e
}
async function main(){
  const checks = [
    ['crm','accounts'],
    ['crm','contacts'],
    ['crm','opportunities'],
    ['crm','opportunity_stages'],
    ['crm','documents'],
    ['crm','activities'],
    ['crm','quotes'],
    ['crm','quote_lines'],
    ['cportal','accounts'],
    ['cportal','users'],
    ['cportal','shares'],
  ]
  const results = []
  for (const [s,t] of checks) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await exists(s,t)
    results.push({ schema: s, table: t, exists: ok })
  }
  console.table(results)
  await client.end()
}
main().catch(err=>{ console.error(err); process.exit(1) })
