import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getMetrics } from '@/lib/metrics'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const range = url.searchParams.get('range') || '30d'
  const k = url.searchParams.get('k') || undefined
  // tenant id expected in header x-tenant-id for this scaffold
  const tenantId = req.headers.get('x-tenant-id')
  if (!tenantId) return NextResponse.json({ error: 'missing_tenant' }, { status: 400 })
  const data = await getMetrics(tenantId, { range: range as any, k })
  return NextResponse.json(data)
}
