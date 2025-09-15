export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await rateLimit(request, "auth-login")

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Authenticate user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      // Log failed login attempt
      await supabase.from("audit_logs").insert({
        table_name: "auth_attempts",
        action: "LOGIN_FAILED",
        old_values: {},
        new_values: {
          email,
          error: authError.message,
          ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
          user_agent: request.headers.get("user-agent") || "unknown",
        },
        created_at: new Date().toISOString(),
      })

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    // Fetch user profile with tenant information
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select(
        `
        *,
        tenant:tenants(
          id,
          name,
          domain,
          status,
          subscription_status
        )
      `,
      )
      .eq("id", authData.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Check if user account is active
    if (!profile.is_active) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 403 })
    }

    // Check if tenant is active
    if (profile.tenant?.status !== "active") {
      return NextResponse.json({ error: "Organization account is not active" }, { status: 403 })
    }

    // Log successful login
    await supabase.from("audit_logs").insert({
      table_name: "auth_attempts",
      record_id: authData.user.id,
      action: "LOGIN_SUCCESS",
      old_values: {},
      new_values: {
        email: profile.email,
        role: profile.role,
        tenant_id: profile.tenant_id,
        ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
      },
      user_id: authData.user.id,
      tenant_id: profile.tenant_id,
      created_at: new Date().toISOString(),
    })

    // Update last login timestamp
    await supabase
      .from("user_profiles")
      .update({
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", authData.user.id)

    // Return success response with user data
    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        profile: {
          ...profile,
          tenant: profile.tenant,
        },
      },
      session: authData.session,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
