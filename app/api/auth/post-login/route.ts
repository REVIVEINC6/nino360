import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getUserPermissions } from '@/lib/rbac/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data } = await supabase.auth.getUser()

    if (!data?.user) return NextResponse.json({ roles: [] })

    const perms = await getUserPermissions()
    return NextResponse.json(perms)
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
