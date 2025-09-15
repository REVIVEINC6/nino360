import { type NextRequest, NextResponse } from "next/server"
import { aiCopilot } from "@/lib/ai/copilot"
import { validateJWT } from "@/lib/auth/jwt"
import { hasPermission } from "@/lib/auth/rbac"

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateJWT(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult

    if (!hasPermission(user.role, "VIEW_AI_INSIGHTS")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { tenantId } = await request.json()
    const targetTenantId = tenantId || user.tenant_id

    const insights = await aiCopilot.generateInsights(targetTenantId)

    return NextResponse.json({
      success: true,
      data: insights,
      count: insights.length,
    })
  } catch (error) {
    console.error("Generate insights error:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
