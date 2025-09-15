import { createServerSupabaseClient } from "./supabase-server"

export async function getUserWithTenant() {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

    // Get user data with tenant information
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select(`
        *,
        tenant:tenants(*)
      `)
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      return null
    }

    return {
      user,
      userData,
      tenant: userData.tenant,
    }
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export { createServerSupabaseClient }
