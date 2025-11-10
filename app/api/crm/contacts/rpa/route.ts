import { NextResponse } from 'next/server'
import { getContext } from '@/app/(dashboard)/crm/contacts/actions'
import { evaluateRulesForEvent } from '@/lib/automation/rule-engine'

export async function POST(req: Request) {
  try {
    const { ruleName, payload } = await req.json()
    const ctx = await getContext()
    const { tenantId } = ctx
    // triggerRuleByName may enqueue or execute an RPA/automation defined elsewhere
  // Use evaluateRulesForEvent: treat ruleName as event for module 'crm' and entity 'contact'
  const res = await evaluateRulesForEvent('crm', ruleName, 'contact', payload || {})
  return NextResponse.json({ success: true, result: res })
  } catch (err) {
    console.error('[api/contacts/rpa] error:', err)
    return NextResponse.json({ success: false, error: (err as any)?.message || String(err) }, { status: 500 })
  }
}
