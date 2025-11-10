import { NextResponse } from 'next/server'
import { getContext } from '@/app/(dashboard)/crm/contacts/actions'
import { PERMISSIONS } from '@/lib/rbac/permissions'
import { hasPermission } from '@/lib/rbac/server'

export async function POST(req: Request) {
  try {
  if (!(await hasPermission(PERMISSIONS.CRM_CLIENTS_EXPORT))) {
      return NextResponse.json({ success: false, error: 'Permission denied' }, { status: 403 })
    }
    const { ids } = await req.json()
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const { data: rows, error } = await supabase.from('crm_contacts').select('id, first_name, last_name, email, phone, company, title').in('id', ids || []).eq('tenant_id', tenantId)
    if (error) throw error
    const header = ['id','first_name','last_name','email','phone','company','title']
    const csv = [header.join(',')].concat((rows||[]).map((r: any)=>header.map(h=>`"${String(r[h] ?? '')}"`).join(','))).join('\n')
    return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="contacts.csv"' } })
  } catch (err) {
    console.error('[api/contacts/export] error:', err)
    return NextResponse.json({ success: false, error: (err as any)?.message || String(err) }, { status: 500 })
  }
}
