export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user before logout
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Fetch user profile for audit logging
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("tenant_id, role, email")
        .eq("id", user.id)
        .single()

      // Log logout event
      await supabase.from("audit_logs").insert({
        table_name: "auth_attempts",
        record_id: user.id,
        action: "LOGOUT",
        old_values: {},
        new_values: {
          email: profile?.email || user.email,
          role: profile?.role,
          tenant_id: profile?.tenant_id,
          ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
          user_agent: request.headers.get("user-agent") || "unknown",
          logout_time: new Date().toISOString(),
        },
        user_id: user.id,
        tenant_id: profile?.tenant_id,
        created_at: new Date().toISOString(),
      })
    }

    // Sign out user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Logout error:", error)
      return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
    }

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
