import { NextResponse } from 'next/server'
import { getPersonalizedInsights } from '@/app/(dashboard)/dashboard/actions'
import { getUser } from '@/lib/supabase/server'
import { hasPermission } from '@/lib/rbac/server'
import { PERMISSIONS } from '@/lib/rbac/permissions'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Basic RBAC check with dev bypass
    const devBypass = process.env.ADMIN_BYPASS === '1' || process.env.DEV_BYPASS === '1'
    if (!(await hasPermission(PERMISSIONS.TENANT_DASHBOARD_VIEW)) && !devBypass)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const result = await getPersonalizedInsights(user.id)
    return NextResponse.json(result)
  } catch (err) {
    logger.error('Error in /api/dashboard/insights', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
