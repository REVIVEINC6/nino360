import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await rateLimit(request, "tenant-read")

    const supabase = createClient()
    const { id } = params

    const { data: tenant, error } = await supabase
      .from("tenants")
      .select(`
        *,
        tenant_users(count),
        tenant_subscriptions(plan, status, created_at, trial_ends_at)
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error("Error fetching tenant:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await rateLimit(request, "tenant-write")

    const supabase = createClient()
    const { id } = params
    const body = await request.json()

    const { name, domain, status, location, contact_info } = body

    // Update tenant
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .update({
        name,
        domain,
        status,
        location,
        contact_info,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (tenantError) {
      return NextResponse.json({ error: tenantError.message }, { status: 500 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error("Error updating tenant:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await rateLimit(request, "tenant-write")

    const supabase = createClient()
    const { id } = params

    // Delete related records first
    await supabase.from("tenant_subscriptions").delete().eq("tenant_id", id)
    await supabase.from("tenant_users").delete().eq("tenant_id", id)

    // Delete tenant
    const { error } = await supabase.from("tenants").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Tenant deleted successfully" })
  } catch (error) {
    console.error("Error deleting tenant:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
