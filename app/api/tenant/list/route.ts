import { NextResponse } from 'next/server'
import { getUserTenants } from '@/app/(dashboard)/tenant/actions/tenant-context'

// This route reads cookies() via `getUserTenants()` so it must be treated as
// dynamic during static generation. Explicitly mark it to avoid build warnings
// and ensure Next does not attempt to prerender this API route.
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const tenants = await getUserTenants()
    return NextResponse.json(tenants || [])
  } catch (err: any) {
    console.error('GET /api/tenant/list error', err)
    return new NextResponse(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
