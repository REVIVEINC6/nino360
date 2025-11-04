import { NextResponse } from 'next/server'
import { aiEnrichContact } from '@/app/(dashboard)/crm/contacts/actions'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const resp = await aiEnrichContact(id)
    return NextResponse.json(resp)
  } catch (err: any) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
