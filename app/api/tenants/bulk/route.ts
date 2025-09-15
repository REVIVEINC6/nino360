import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    await rateLimit(request, "tenant-bulk")

    const supabase = createClient()
    const body = await request.json()
    const { action, tenantIds } = body

    if (!action || !tenantIds || !Array.isArray(tenantIds)) {
      return NextResponse.json({ error: "Action and tenant IDs are required" }, { status: 400 })
    }

    let result
    let message = ""

    switch (action) {
      case "activate":
        result = await supabase
          .from("tenants")
          .update({ status: "active", updated_at: new Date().toISOString() })
          .in("id", tenantIds)
        message = `${tenantIds.length} tenants activated successfully`
        break

      case "suspend":
        result = await supabase
          .from("tenants")
          .update({ status: "suspended", updated_at: new Date().toISOString() })
          .in("id", tenantIds)
        message = `${tenantIds.length} tenants suspended successfully`
        break

      case "delete":
        // Delete related records first
        await supabase.from("tenant_subscriptions").delete().in("tenant_id", tenantIds)
        await supabase.from("tenant_users").delete().in("tenant_id", tenantIds)

        // Delete tenants
        result = await supabase.from("tenants").delete().in("id", tenantIds)
        message = `${tenantIds.length} tenants deleted successfully`
        break

      case "trial":
        result = await supabase
          .from("tenants")
          .update({ status: "trial", updated_at: new Date().toISOString() })
          .in("id", tenantIds)
        message = `${tenantIds.length} tenants moved to trial successfully`
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (result?.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error performing bulk action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
