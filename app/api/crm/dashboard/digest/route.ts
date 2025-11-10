import { NextResponse } from 'next/server'
import { aiDigest } from '@/app/(dashboard)/crm/dashboard/actions'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { from, to } = body
    const result = await aiDigest({ from, to })
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
