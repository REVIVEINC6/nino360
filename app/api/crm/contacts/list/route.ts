import { NextResponse } from 'next/server'
import { listContacts } from '@/app/(dashboard)/crm/contacts/actions'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const resp = await listContacts(body || {})
    return NextResponse.json(resp)
  } catch (err: any) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
