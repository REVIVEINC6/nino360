import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search") || ""
    const industry = searchParams.get("industry") || ""
    const revenue = searchParams.get("revenue") || ""
    const status = searchParams.get("status") || ""
    const owner = searchParams.get("owner") || ""
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    const offset = (page - 1) * limit

    // Build main companies query
    let query = supabase.from("companies").select("*")

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,website.ilike.%${search}%,phone.ilike.%${search}%`)
    }
    if (industry && industry !== "all") {
      query = query.eq("industry", industry)
    }
    if (revenue && revenue !== "all") {
      query = query.eq("revenue_range", revenue)
    }
    if (status && status !== "all") {
      query = query.eq("status", status)
    }
    if (owner && owner !== "all") {
      query = query.eq("owner_name", owner)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: companies, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase.from("companies").select("*", { count: "exact", head: true })

    // Fetch related data for each company
    const companiesWithRelations = await Promise.all(
      companies?.map(async (company) => {
        try {
          // Get primary location
          const { data: locations } = await supabase
            .from("company_locations")
            .select("*")
            .eq("company_id", company.id)
            .eq("is_primary", true)
            .limit(1)

          // Get contact count
          const { count: contactCount } = await supabase
            .from("company_contacts")
            .select("*", { count: "exact", head: true })
            .eq("company_id", company.id)

          // Get opportunity count and total value
          const { data: opportunities } = await supabase
            .from("company_opportunities")
            .select("value, stage")
            .eq("company_id", company.id)
            .not("stage", "eq", "closed_lost")

          const totalValue = opportunities?.reduce((sum, opp) => sum + (opp.value || 0), 0) || 0
          const dealCount = opportunities?.length || 0

          return {
            ...company,
            contact_count: contactCount || 0,
            deal_count: dealCount,
            total_value: totalValue,
            primary_location: locations?.[0] || null,
          }
        } catch (error) {
          console.error(`Failed to fetch relations for company ${company.id}:`, error)
          return {
            ...company,
            primary_location: null,
          }
        }
      }) || [],
    )

    return NextResponse.json({
      success: true,
      data: companiesWithRelations,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Prepare company data with only the fields that exist in the schema
    const companyData = {
      name: body.name,
      industry: body.industry || null,
      revenue_range: body.revenue_range || null,
      employee_count: body.employee_count || null,
      ownership_type: body.ownership_type || null,
      hq_city: body.hq_city || null,
      hq_country: body.hq_country || null,
      website: body.website || null,
      phone: body.phone || null,
      email: body.email || null,
      linkedin_url: body.linkedin_url || null,
      description: body.description || null,
      founded_year: body.founded_year || null,
      ticker_symbol: body.ticker_symbol || null,
      ceo_name: body.ceo_name || null,
      headquarters_address: body.headquarters_address || null,
      status: body.status || "prospect",
      owner_name: body.owner_name || null,
      logo_url: body.logo_url || null,
      tenant_id: body.tenant_id || "550e8400-e29b-41d4-a716-446655440000",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Create company
    const { data: company, error } = await supabase.from("companies").insert([companyData]).select().single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create company" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: company,
      message: "Company created successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
