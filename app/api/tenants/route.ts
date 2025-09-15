import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    await rateLimit(request)

    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const plan = searchParams.get("plan")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let query = supabase.from("tenants").select(`
        *,
        tenant_users(count),
        tenant_subscriptions(plan, status)
      `)

    if (search) {
      query = query.or(`name.ilike.%${search}%,domain.ilike.%${search}%`)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (plan && plan !== "all") {
      query = query.eq("tenant_subscriptions.plan", plan)
    }

    const {
      data: tenants,
      error,
      count,
    } = await query.range((page - 1) * limit, page * limit - 1).order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      tenants,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await rateLimit(request)

    const supabase = createClient()
    const body = await request.json()

    const { name, domain, plan, contact, location } = body

    if (!name || !domain || !plan) {
      return NextResponse.json({ error: "Name, domain, and plan are required" }, { status: 400 })
    }

    // Check if domain already exists
    const { data: existingTenant } = await supabase.from("tenants").select("id").eq("domain", domain).single()

    if (existingTenant) {
      return NextResponse.json({ error: "Domain already exists" }, { status: 400 })
    }

    // Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        name,
        domain,
        status: "trial",
        contact_info: contact,
        location,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (tenantError) {
      return NextResponse.json({ error: tenantError.message }, { status: 500 })
    }

    // Create subscription
    const { error: subscriptionError } = await supabase.from("tenant_subscriptions").insert({
      tenant_id: tenant.id,
      plan,
      status: "trial",
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    })

    if (subscriptionError) {
      return NextResponse.json({ error: subscriptionError.message }, { status: 500 })
    }

    return NextResponse.json(tenant, { status: 201 })
  } catch (error) {
    console.error("Error creating tenant:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
