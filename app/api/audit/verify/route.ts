import { type NextRequest, NextResponse } from "next/server"
import { verifyAuditChain } from "@/lib/audit/hash-chain"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tenant_id } = await request.json()

    if (!tenant_id) {
      return NextResponse.json({ error: "tenant_id is required" }, { status: 400 })
    }

    // Check if user is an admin of the tenant
    const { data: member } = await supabase
      .from("tenant_members")
      .select("role")
      .eq("tenant_id", tenant_id)
      .eq("user_id", user.id)
      .single()

    if (!member || member.role !== "tenant_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const result = await verifyAuditChain(tenant_id)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("[v0] Error in audit verify API:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
