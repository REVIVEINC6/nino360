import { type NextRequest, NextResponse } from "next/server"
// Ensure this route runs in the Node.js runtime and is treated as dynamic
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const companyIds = searchParams.get("ids")?.split(",") || []

    let query = supabase.from("companies").select(`
        *,
        company_locations!inner(address, city, country),
        company_contacts(count),
        company_opportunities(count)
      `)

    // Filter by specific company IDs if provided
    if (companyIds.length > 0) {
      query = query.in("id", companyIds)
    }

    const { data: companies, error } = await query

    if (error) {
      return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
    }

    if (format === "csv") {
      // Generate CSV
      const csvHeaders = [
        "ID",
        "Name",
        "Industry",
        "Revenue Range",
        "Employee Count",
        "Status",
        "Owner",
        "Engagement Score",
        "Total Value",
        "Deal Count",
        "Contact Count",
        "Last Engagement",
        "Website",
        "Phone",
        "HQ Location",
      ]

      const csvRows =
        companies?.map((company) => [
          company.id,
          company.name,
          company.industry,
          company.revenue_range,
          company.employee_count,
          company.status,
          company.owner_name,
          company.engagement_score,
          company.total_value,
          company.deal_count,
          company.contact_count,
          company.last_engagement_date,
          company.website,
          company.phone,
          `${company.hq_city}, ${company.hq_country}`,
        ]) || []

      const csvContent = [csvHeaders, ...csvRows]
        .map((row) => row.map((field) => `"${field || ""}"`).join(","))
        .join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="companies-export-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    // Return JSON format
    return NextResponse.json({
      success: true,
      data: companies,
      exportedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
