import { NextResponse } from 'next/server'
import serverClient from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body?.question) return NextResponse.json({ error: 'missing_question' }, { status: 400 })
  const tenantId = req.headers.get('x-tenant-id')
  if (!tenantId) return NextResponse.json({ error: 'missing_tenant' }, { status: 400 })

  // simple insert for now
  const { error } = await serverClient.from('ai_insights').insert({ tenant_id: tenantId, prompt: body.question, answer: 'stub', meta: {} })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
