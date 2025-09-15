"use server"

import { createServerClient } from "@/lib/supabase/server"

interface InitializeResult {
  success: boolean
  tenantId?: string
  error?: string
}

export async function initializeUserAndTenant(
  userId: string,
  email: string,
  metadata: any = {},
): Promise<InitializeResult> {
  try {
    console.log("Starting user initialization for:", userId, email)

    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError && userError.code !== "PGRST116") {
      console.error("Error checking existing user:", userError)
      return { success: false, error: `Database error: ${userError.message}` }
    }

    let user = existingUser

    // Create user if doesn't exist
    if (!user) {
      console.log("Creating new user profile")
      const { data: newUser, error: createUserError } = await supabase
        .from("users")
        .insert({
          id: userId,
          email: email,
          first_name: metadata.first_name || metadata.name?.split(" ")[0] || "",
          last_name: metadata.last_name || metadata.name?.split(" ").slice(1).join(" ") || "",
          role: "employee",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (createUserError) {
        console.error("Error creating user:", createUserError)
        return { success: false, error: `Failed to create user profile: ${createUserError.message}` }
      }

      user = newUser
      console.log("User created successfully:", user.id)
    }

    // Check for existing tenant membership
    const { data: membership, error: membershipError } = await supabase
      .from("tenant_memberships")
      .select("tenant_id, tenants(*)")
      .eq("user_id", userId)
      .single()

    if (membershipError && membershipError.code !== "PGRST116") {
      console.error("Error checking membership:", membershipError)
    }

    let tenantId = membership?.tenant_id

    // Create default tenant if no membership exists
    if (!tenantId) {
      console.log("Creating default tenant for user")

      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          name: `${user.first_name || "User"}'s Organization`,
          slug: `org-${userId.slice(0, 8)}`,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (tenantError) {
        console.error("Error creating tenant:", tenantError)
        return { success: false, error: `Failed to create tenant: ${tenantError.message}` }
      }

      tenantId = tenant.id
      console.log("Tenant created:", tenantId)

      // Create tenant membership
      const { error: membershipCreateError } = await supabase.from("tenant_memberships").insert({
        user_id: userId,
        tenant_id: tenantId,
        role: "admin",
        status: "active",
        created_at: new Date().toISOString(),
      })

      if (membershipCreateError) {
        console.error("Error creating membership:", membershipCreateError)
        return { success: false, error: `Failed to create membership: ${membershipCreateError.message}` }
      }

      console.log("Membership created successfully")
    }

    return { success: true, tenantId }
  } catch (error) {
    console.error("Unexpected error in initializeUserAndTenant:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
