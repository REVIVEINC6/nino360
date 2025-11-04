import { NextResponse } from "next/server"
import { getSecuritySettings } from "@/app/(dashboard)/tenant/actions/security"
import { getContext as getTenantContext } from "@/app/(dashboard)/tenant/users/actions"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export async function GET() {
  try {
    const [securitySettings, tenantCtx] = await Promise.all([getSecuritySettings(), getTenantContext()])

    return NextResponse.json({ success: true, data: { security: securitySettings, ...tenantCtx } })
  } catch (err: any) {
    // Avoid leaking NEXT_REDIRECT and other framework errors to the client
    const message = err?.message || "Failed to load tenant security context"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
