#!/usr/bin/env node
/*
  verify-create-user-session.mjs

  Usage (PowerShell):
    $env:DATABASE_URL = 'postgresql://user:pass@host:5432/dbname'
    node .\scripts\verify-create-user-session.mjs

  This script connects to the DB via DATABASE_URL and queries pg_proc to
  list any functions named create_user_session. It prints detected signatures.
*/
import pg from 'pg'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set. Export DATABASE_URL to run this verifier.')
  process.exit(2)
}

const client = new pg.Client({ connectionString: DATABASE_URL })

async function run() {
  try {
    await client.connect()
    const sql = `SELECT n.nspname AS schema, p.proname AS function_name, pg_get_function_arguments(p.oid) AS args, pg_get_function_identity_arguments(p.oid) AS identity_args FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE p.proname = 'create_user_session' ORDER BY n.nspname, p.proname;`
    const res = await client.query(sql)

    if (!res.rows || res.rows.length === 0) {
      console.log('No create_user_session functions found in the database schema.')
      process.exit(1)
    }

    console.log('Found create_user_session functions:')
    for (const row of res.rows) {
      console.log(`- schema: ${row.schema}  name: ${row.function_name}  args: ${row.args}  identity: ${row.identity_args}`)
    }

    process.exit(0)
  } catch (err) {
    console.error('Error querying database:', err)
    process.exit(3)
  } finally {
    try { await client.end() } catch {}
  }
}

run()
