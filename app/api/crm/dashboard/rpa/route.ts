import { NextResponse } from 'next/server'
import { evaluateRulesForEvent } from '@/lib/automation/rule-engine'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { module = 'crm', event, entity, record } = body
    const result = await evaluateRulesForEvent(module, event, entity, record)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
