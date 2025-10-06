import { NextResponse } from 'next/server'
import serverClient from '@/lib/supabaseServer'

export async function GET(req: Request) {
  const tenantId = req.headers.get('x-tenant-id')
  if (!tenantId) return NextResponse.json({ error: 'missing_tenant' }, { status: 400 })
  const { data, error } = await serverClient.from('feature_flags').select('*').eq('tenant_id', tenantId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ flags: data })
}
