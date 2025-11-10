import { NextResponse } from 'next/server'
import { getUserPermissions } from '@/lib/rbac/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const tenant_id = url.searchParams.get('tenant_id') || undefined

    const perms = await getUserPermissions()

    // Basic FLAC: fetch tenant settings.field_permissions if tenant_id provided
    let field_permissions: Record<string, any> | null = null
    if (tenant_id) {
      const supabase = await createServerClient()
      const { data } = await supabase.from('tenants').select('settings').eq('id', tenant_id).maybeSingle()
      field_permissions = data?.settings?.field_permissions || null
    }

    return NextResponse.json({ ok: true, permissions: perms, field_permissions })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
