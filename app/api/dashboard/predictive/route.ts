import { NextResponse } from 'next/server'
import { getPredictiveAnalytics } from '@/app/(dashboard)/dashboard/actions'
import { getUser } from '@/lib/supabase/server'
import { hasPermission } from '@/lib/rbac/server'
import { PERMISSIONS } from '@/lib/rbac/permissions'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const devBypass = process.env.ADMIN_BYPASS === '1' || process.env.DEV_BYPASS === '1'
    if (!(await hasPermission(PERMISSIONS.TENANT_DASHBOARD_VIEW)) && !devBypass)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const url = new URL(req.url)
    const type = url.searchParams.get('type') || 'finance'
    const horizon = url.searchParams.get('horizon') || '90d'

    const result = await getPredictiveAnalytics(type, horizon)
    return NextResponse.json(result)
  } catch (err) {
    logger.error('Error in /api/dashboard/predictive', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
