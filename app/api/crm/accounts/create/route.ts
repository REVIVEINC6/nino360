import { NextResponse } from 'next/server'
import { createClient as createClientAction } from '@/app/(dashboard)/crm/actions/accounts'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await createClientAction(body)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
