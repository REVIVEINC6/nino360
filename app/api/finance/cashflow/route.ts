import { NextResponse } from 'next/server'
import serverClient from '@/lib/supabaseServer'

export async function GET(req: Request) {
  const tenantId = req.headers.get('x-tenant-id')
  if (!tenantId) return NextResponse.json({ error: 'missing_tenant' }, { status: 400 })
  const inv = await serverClient.from('fin_invoices').select('status, amount_cents').eq('tenant_id', tenantId)
  const ap = await serverClient.from('fin_payables').select('status, amount_cents').eq('tenant_id', tenantId)
  if (inv.error || ap.error) return NextResponse.json({ error: inv.error?.message || ap.error?.message }, { status: 500 })
  return NextResponse.json({ ar: inv.data, ap: ap.data })
}
