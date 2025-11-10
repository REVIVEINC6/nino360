import { promises as fs } from 'fs'
import path from 'path'
import { spawn } from 'child_process'

// Simple migration runner for local Postgres/Supabase
// Expects DATABASE_URL env var

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  const migrationsDir = path.resolve(process.cwd(), 'db', 'migrations')
  const files = (await fs.readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort()

  for (const file of files) {
    const full = path.join(migrationsDir, file)
    console.log('Applying', full)
    const sql = await fs.readFile(full, 'utf8')

    // Use psql to execute SQL
    await execPsql(dbUrl, sql)
  }
  console.log('Migrations complete')
}

function execPsql(dbUrl, sql) {
  return new Promise((resolve, reject) => {
    const p = spawn('psql', [dbUrl], { stdio: ['pipe', 'inherit', 'inherit'] })
    p.on('error', (err) => reject(err))
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error('psql exited ' + code))))
    p.stdin.write(sql)
    p.stdin.end()
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
