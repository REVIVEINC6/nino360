import { type NextRequest, NextResponse } from "next/server"
import { rpaEngine } from "@/lib/rpa/automation-engine"
import { validateJWT } from "@/lib/auth/jwt"
import { hasPermission } from "@/lib/auth/rbac"
import { supabaseAdmin } from "@/lib/supabaseAdmin" // Declare the supabaseAdmin variable

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateJWT(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult

    if (!hasPermission(user.role, "SYSTEM_ADMIN")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const automationRule = await request.json()
    automationRule.tenantId = user.tenant_id

    const ruleId = await rpaEngine.createAutomation(automationRule)

    return NextResponse.json({
      success: true,
      data: { ruleId },
      message: "Automation rule created successfully",
    })
  } catch (error) {
    console.error("Create automation error:", error)
    return NextResponse.json({ error: "Failed to create automation rule" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateJWT(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId") || user.tenant_id

    // Fetch automation rules for tenant
    const { data: rules, error } = await supabaseAdmin
      .from("automation_rules")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: rules || [],
    })
  } catch (error) {
    console.error("Get automation rules error:", error)
    return NextResponse.json({ error: "Failed to fetch automation rules" }, { status: 500 })
  }
}
