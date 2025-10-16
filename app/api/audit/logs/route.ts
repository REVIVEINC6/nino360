import { type NextRequest, NextResponse } from "next/server"
import { getAuditLogs } from "@/lib/audit/hash-chain"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenant_id")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const entity = searchParams.get("entity") || undefined
    const action = searchParams.get("action") || undefined

    if (!tenantId) {
      return NextResponse.json({ error: "tenant_id is required" }, { status: 400 })
    }

    // Check if user is a member of the tenant
    const { data: member } = await supabase
      .from("tenant_members")
      .select("role")
      .eq("tenant_id", tenantId)
      .eq("user_id", user.id)
      .single()

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const result = await getAuditLogs({
      tenantId,
      page,
      limit,
      entity,
      action,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("[v0] Error in audit logs API:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
