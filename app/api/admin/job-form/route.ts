import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const SCHEMA_PATH = path.resolve(process.cwd(), 'lib/schemas/job-form.json')

function checkAdmin(req: Request) {
  const token = req.headers.get('x-admin-token') || req.headers.get('X-ADMIN-TOKEN')
  const ADMIN = process.env.ADMIN_TOKEN || process.env.NINO_ADMIN_TOKEN
  if (!ADMIN) return false
  return token === ADMIN
}

export async function GET(req: Request) {
  try {
    const raw = await fs.readFile(SCHEMA_PATH, 'utf8')
    return NextResponse.json(JSON.parse(raw))
  } catch (err) {
    return NextResponse.json({ error: 'Schema not found' }, { status: 404 })
  }
}

export async function POST(req: Request) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const schema = body.schema
    if (!schema) return NextResponse.json({ error: 'Missing schema' }, { status: 400 })

    await fs.writeFile(SCHEMA_PATH, JSON.stringify(schema, null, 2), 'utf8')
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
