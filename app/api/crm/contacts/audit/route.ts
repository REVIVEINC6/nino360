import { NextResponse } from 'next/server'
import { getContext } from '@/app/(dashboard)/crm/contacts/actions'
import { appendAudit } from '@/lib/hash'

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const ctx = await getContext()
    const { tenantId } = ctx
    const { prev_hash, hash } = await appendAudit({ tenantId, actorUserId: null, action: payload.action || 'crm.contact.audit', entity: payload.entity || 'contact', entityId: payload.entityId || null, diff: payload.diff || {} })
    return NextResponse.json({ success: true, prev_hash, hash })
  } catch (err) {
    console.error('[api/contacts/audit] error:', err)
    return NextResponse.json({ success: false, error: (err as any)?.message || String(err) }, { status: 500 })
  }
}
