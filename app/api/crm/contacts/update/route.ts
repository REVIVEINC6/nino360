import { NextResponse } from 'next/server'
import { updateContact } from '@/app/(dashboard)/crm/contacts/actions'

export async function POST(req: Request) {
  try {
    const { id, payload } = await req.json()
    const res = await updateContact(id, payload)
    return NextResponse.json(res)
  } catch (err) {
    console.error('[api/contacts/update] error:', err)
    return NextResponse.json({ success: false, error: (err as any)?.message || String(err) }, { status: 500 })
  }
}
