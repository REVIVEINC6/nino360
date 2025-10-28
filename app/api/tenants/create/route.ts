import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createAuditLog } from "@/lib/audit/hash-chain"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { company_name, domain, region, timezone, tenant_slug, admin_name, admin_email, plan_code, interval } = body

    // Validate required fields
    if (!company_name || !tenant_slug || !admin_email) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Validate slug format
    if (!/^[a-z0-9-]{3,}$/.test(tenant_slug)) {
      return NextResponse.json({ success: false, message: "Invalid tenant slug format" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Check if slug is available
    const { data: existing } = await supabase.from("tenants").select("id").eq("slug", tenant_slug).single()

    if (existing) {
      return NextResponse.json({ success: false, message: "Tenant slug already taken" }, { status: 409 })
    }

    // Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        name: company_name,
        slug: tenant_slug,
        region,
        timezone,
        status: plan_code === "free" ? "active" : "trial",
      })
      .select()
      .single()

    if (tenantError) {
      console.error("[v0] Tenant creation error:", tenantError)
      return NextResponse.json({ success: false, message: "Failed to create tenant" }, { status: 500 })
    }

    // Create or get admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: admin_email,
      email_confirm: true,
      user_metadata: {
        full_name: admin_name,
      },
    })

    let userId = authData?.user?.id

    // If user already exists, get their ID
    if (authError && authError.message.includes("already registered")) {
      const { data: existingUser } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("email", admin_email)
        .single()

      userId = existingUser?.user_id
    }

    if (!userId) {
      console.error("[v0] User creation error:", authError)
      return NextResponse.json({ success: false, message: "Failed to create admin user" }, { status: 500 })
    }

    // Create user profile
    await supabase.from("user_profiles").upsert({
      user_id: userId,
      full_name: admin_name,
    })

    // Add admin as tenant member
    await supabase.from("tenant_members").insert({
      tenant_id: tenant.id,
      user_id: userId,
      role: "tenant_admin",
      status: "active",
      joined_at: new Date().toISOString(),
    })

    // Seed default roles for tenant
    const defaultRoles = [
      { key: "tenant_admin", label: "Tenant Admin" },
      { key: "manager", label: "Manager" },
      { key: "member", label: "Member" },
      { key: "viewer", label: "Viewer" },
    ]

    for (const role of defaultRoles) {
      await supabase.from("roles").insert({
        tenant_id: tenant.id,
        key: role.key,
        label: role.label,
      })
    }

    // Seed feature flags based on plan
    const features =
      plan_code === "free" ? ["analytics-lite"] : ["crm", "talent", "hrms", "finance", "automation", "trust"]

    for (const feature of features) {
      await supabase.from("feature_flags").insert({
        tenant_id: tenant.id,
        key: feature,
        enabled: true,
      })
    }

    // Create audit log entry with hash chain
    await createAuditLog({
      tenantId: tenant.id,
      userId,
      action: "create",
      entity: "tenant",
      entityId: tenant.id,
      metadata: { company_name, slug: tenant_slug },
      diff: { plan_code, status: tenant.status },
    })

    console.log("[v0] Tenant created:", tenant.id)

    return NextResponse.json(
      {
        success: true,
        message: "Tenant created successfully",
        tenant_id: tenant.id,
        slug: tenant_slug,
        next:
          plan_code === "free"
            ? `/t/${tenant_slug}/getting-started`
            : `/billing/checkout?plan=${plan_code}&interval=${interval}`,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("[v0] Tenant creation error:", error)
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
