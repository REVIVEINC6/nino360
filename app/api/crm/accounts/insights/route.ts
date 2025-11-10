import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { appendAudit } from '@/lib/hash'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { filters } = body || {}

    const supabase = await createServerClient()

    // Basic tenant scoping: get tenant from profile
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    let tenantId: string | null = null
    if (userId) {
      const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', userId).single()
      tenantId = profile?.tenant_id || null
    }

    // Fetch a lightweight set of accounts (names + status + industry)
    let query = supabase.from('crm.accounts').select('id, name, status, industry').order('created_at', { ascending: false }).limit(50)
    if (tenantId) query = query.eq('tenant_id', tenantId)
    if (filters?.status) query = query.eq('status', filters.status)

    const { data: accounts, error } = await query
    if (error) throw error

    const sample = (accounts || []).slice(0, 20).map((a: any) => `- ${a.name} (${a.status}${a.industry ? ' / ' + a.industry : ''})`).join('\n')

    const prompt = `You are a CRM analyst. Provide a brief (3-5 bullet) summary and 3 recommended actions for the following accounts:\n\n${sample}\n\nSummary:`

    const { text, usage } = await generateText({ model: 'openai/gpt-4o-mini', prompt, maxTokens: 400 })

    // Audit AI usage
    try {
      await appendAudit({ tenantId, actorUserId: userId || null, action: 'crm.accounts:ai_insights', entity: 'ai_usage', entityId: null, diff: { tokens: usage?.totalTokens || 0, model: 'gpt-4o-mini' } })
    } catch (e) {
      console.warn('[accounts][ai] audit failed', e)
    }

    return NextResponse.json({ text, tokens: usage?.totalTokens || 0 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
