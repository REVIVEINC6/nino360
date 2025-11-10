import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { hasPermission } from '@/lib/rbac/server'
import { PERMISSIONS } from '@/lib/rbac/permissions'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const devBypass = process.env.ADMIN_BYPASS === '1' || process.env.DEV_BYPASS === '1'
    if (!devBypass) {
      const allowed = await hasPermission(PERMISSIONS.TENANT_DASHBOARD_VIEW)
      if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { id, status } = body || {}
    if (!id || !status) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

    const { data: session } = await supabase.auth.getSession()
    const tenantId = session?.session?.user?.user_metadata?.tenant_id || null

    const { error } = await supabase.from('rpa_status').update({ status, last_run_at: new Date().toISOString() }).eq('id', id).eq('tenant_id', tenantId)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[rpa.toggle] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
