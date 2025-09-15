import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { rateLimit } from "@/lib/rate-limit"
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await rateLimit(request, "tenant-export")

    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"

    const { data: tenants, error } = await supabase
      .from("tenants")
      .select(`
        *,
        tenant_users(count),
        tenant_subscriptions(plan, status, created_at)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (format === "csv") {
      const csvHeaders = ["ID", "Name", "Domain", "Status", "Plan", "Users", "Location", "Created At", "Last Active"]

      const csvRows = tenants.map((tenant) => [
        tenant.id,
        tenant.name,
        tenant.domain,
        tenant.status,
        tenant.tenant_subscriptions?.[0]?.plan || "N/A",
        tenant.tenant_users?.[0]?.count || 0,
        tenant.location || "",
        tenant.created_at,
        tenant.updated_at,
      ])

      const csvContent = [csvHeaders, ...csvRows].map((row) => row.join(",")).join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="tenants-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    if (format === "json") {
      const jsonContent = JSON.stringify(tenants, null, 2)

      return new NextResponse(jsonContent, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="tenants-${new Date().toISOString().split("T")[0]}.json"`,
        },
      })
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
  } catch (error) {
    console.error("Error exporting tenants:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
