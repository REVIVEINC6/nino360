import { NextResponse } from 'next/server'
import { verifyHash } from '@/app/(dashboard)/crm/dashboard/actions'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { hash } = body
    const result = await verifyHash(hash)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
