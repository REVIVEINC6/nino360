"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function logAuthAttempt(data: {
  email: string
  success: boolean
  ipAddress?: string
  userAgent?: string
}) {
  try {
    const supabase = await createServerClient()
    const { data: authData } = await supabase.auth.getUser()

    // Only log if we have a valid user session
    if (!authData?.user) {
      return { success: false }
    }

    const tenantId = authData.user.user_metadata?.tenant_id || null
    const userId = authData.user.id

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: userId,
      action: data.success ? "user.login.success" : "user.login.failed",
      resource_type: "auth",
      resource_id: userId,
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Auth logging failed:", error)
    return { success: false }
  }
}
