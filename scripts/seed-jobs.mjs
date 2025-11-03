import { promises as fs } from 'fs'
import path from 'path'
import { spawn } from 'child_process'

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  const seedSql = `
INSERT INTO app.jobs (tenant_id, org_id, job_id, title, status, city, country, work_experience_years, primary_skills, no_of_positions, created_by, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'JOB-0001', 'Senior Java Developer', 'open', 'Dallas', 'USA', 5, ARRAY['Java','Spring Boot'], 2, '00000000-0000-0000-0000-000000000100', now(), now()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'JOB-0002', 'Frontend Engineer', 'open', 'Austin', 'USA', 3, ARRAY['React','TypeScript'], 1, '00000000-0000-0000-0000-000000000101', now(), now());
`;

  await execPsql(dbUrl, seedSql)
  console.log('Seed complete')
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
