import { NextResponse } from 'next/server'
import { deleteContact } from '@/app/(dashboard)/crm/contacts/actions'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    const res = await deleteContact(id)
    return NextResponse.json(res)
  } catch (err) {
    console.error('[api/contacts/delete] error:', err)
    return NextResponse.json({ success: false, error: (err as any)?.message || String(err) }, { status: 500 })
  }
}
