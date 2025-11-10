import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getContext } from '@/app/(dashboard)/crm/contacts/actions'
import { generateText } from 'ai'

export async function POST(req: Request) {
  try {
    const { contactIds } = await req.json()
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    // Fetch contacts
    const { data: contacts } = await supabase.from('crm_contacts').select('*').in('id', contactIds || []).eq('tenant_id', tenantId)
    // Create context for AI
    const short = (contacts || []).slice(0, 10).map((c: any) => `${c.first_name || ''} ${c.last_name || ''} <${c.email || ''}>`).join('\n')
    const prompt = `Provide a short synthesis and suggested next actions for these contacts:\n${short}`
    const { text } = await generateText({ model: 'openai/gpt-4o-mini', prompt, maxTokens: 300 })
    return NextResponse.json({ success: true, text })
  } catch (err) {
    console.error('[api/contacts/insights] error:', err)
    return NextResponse.json({ success: false, error: (err as any)?.message || String(err) }, { status: 500 })
  }
}
