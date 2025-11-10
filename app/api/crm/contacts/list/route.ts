import { NextResponse } from 'next/server'
import { listContacts } from '@/app/(dashboard)/crm/contacts/actions'

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const res = await listContacts(payload)
    return NextResponse.json(res)
  } catch (err) {
    console.error('[api/contacts/list] error:', err)
    return NextResponse.json({ success: false, error: (err as any)?.message || String(err) }, { status: 500 })
  }
}
