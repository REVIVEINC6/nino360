import { NextResponse } from 'next/server'
import { createAdminServerClient } from '@/lib/supabase/server'

// Temporary protected endpoint to smoke-test create_user_session RPC via admin client.
// Protect by setting DEV_API_TEST_SECRET in your environment and sending the same
// value in the `x-dev-secret` header. Remove this route after you've verified RPCs.

export async function POST(request: Request) {
  const secret = process.env.DEV_API_TEST_SECRET
  const header = request.headers.get('x-dev-secret')

  if (!secret || header !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const admin = createAdminServerClient()

    const body = await request.json().catch(() => ({}))

    // Minimal payload with required fields. Override via request body.
    const payload = {
      p_user_id: body.p_user_id || body.userId || null,
      p_tenant_id: body.p_tenant_id || body.tenantId || null,
      p_session_token: body.p_session_token || body.sessionToken || `dev-${Date.now()}`,
      p_device_fingerprint: body.p_device_fingerprint || body.deviceFingerprint || null,
      p_ip_address: body.p_ip_address || body.ipAddress || null,
      p_user_agent: body.p_user_agent || body.userAgent || 'dev-test-client',
      p_last_activity_at: body.p_last_activity_at || new Date().toISOString(),
      p_expires_at: body.p_expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }

    const { data, error } = await admin.rpc('create_user_session', { payload })

    if (error) {
      return NextResponse.json({ error: error.message || error }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
