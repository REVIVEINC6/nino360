import { type NextRequest, NextResponse } from "next/server"
import { SessionService } from "@/lib/auth/services/session.service"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("tenant_id").eq("id", user.id).single()

    const newSession = await SessionService.createSession({
      userId: user.id,
      tenantId: profile?.tenant_id || null,
    })

    return NextResponse.json({
      success: true,
      session: newSession,
    })
  } catch (error: any) {
    console.error("[v0] Session refresh error:", error)

    return NextResponse.json({ error: error.message || "Session refresh failed" }, { status: 500 })
  }
}

export const runtime = "nodejs"
