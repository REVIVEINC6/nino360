import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getUserPermissions } from '@/lib/rbac/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data } = await supabase.auth.getUser()

    if (!data?.user) return NextResponse.json({ roles: [] })

    const perms = await getUserPermissions()
    // Ensure a consistent shape
    const out = {
      permissions: Array.isArray(perms.permissions) ? perms.permissions : [],
      roles: Array.isArray(perms.roles) ? perms.roles : [],
    }
    return NextResponse.json(out)
  } catch (err: any) {
    // Log the error server-side and return a conservative response
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { logger } = await import('@/lib/logger')
      logger.error('post-login GET failed', err)
    } catch {
      // ignore logger errors
    }
    return NextResponse.json({ permissions: [], roles: [], error: String(err) }, { status: 500 })
  }
}
