export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { z } from "zod"

const updateProfileSchema = z.object({
  full_name: z.string().min(1, "Full name is required").optional(),
  avatar_url: z.string().url("Invalid avatar URL").optional(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  notification_preferences: z.record(z.string(), z.boolean()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch complete user profile with tenant and role information
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
          subscription_status,
          settings
        ),
        role_assignments:user_role_assignments(
          role:roles(
            id,
            name,
            description,
            permissions:role_permissions(
              permission:permissions(
                id,
                name,
                description,
                resource_type
              )
            )
          )
        )
      `,
      )
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Fetch user preferences
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("category, key, value")
      .eq("user_id", user.id)

    // Format preferences as nested object
    type Pref = { category: string; key: string; value: any }
    const formattedPreferences = preferences?.reduce(
      (acc: Record<string, Record<string, any>>, pref: Pref) => {
        if (!acc[pref.category]) {
          acc[pref.category] = {}
        }
        acc[pref.category][pref.key] = pref.value
        return acc
      },
      {} as Record<string, Record<string, any>>,
    )

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      profile: {
        ...profile,
        preferences: formattedPreferences || {},
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = updateProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 },
      )
    }

    const updateData = validationResult.data

    // Get current profile for audit logging
    const { data: currentProfile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from("user_profiles")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (updateError) {
      console.error("Profile update error:", updateError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    // Log profile update
    await supabase.from("audit_logs").insert({
      table_name: "user_profiles",
      record_id: user.id,
      action: "UPDATE",
      old_values: currentProfile || {},
      new_values: updateData,
      user_id: user.id,
      tenant_id: currentProfile?.tenant_id,
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
