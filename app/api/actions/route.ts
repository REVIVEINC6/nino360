import { NextResponse } from 'next/server'
import { canPerform } from '@/lib/rbac'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const op = body?.op
  const role = req.headers.get('x-user-role')
  if (!op) return NextResponse.json({ error: 'missing_op' }, { status: 400 })
  if (!canPerform(role, op)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  // stub behavior
  if (op === 'clear_cache') {
    return NextResponse.json({ ok: true })
  }
  if (op === 'reindex') return NextResponse.json({ ok: true })
  if (op === 'recompute_ai') return NextResponse.json({ ok: true })
  return NextResponse.json({ error: 'unknown_op' }, { status: 400 })
}
