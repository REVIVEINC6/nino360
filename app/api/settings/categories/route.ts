import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

// GET /api/settings/categories - Get all setting categories
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, "settings-categories", 50, 60)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: rateLimitResult.retryAfter },
        { status: 429 },
      )
    }

    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's tenant
    const { data: userProfile } = await supabase.from("user_profiles").select("tenant_id").eq("id", user.id).single()

    if (!userProfile?.tenant_id) {
      return NextResponse.json({ error: "No tenant associated" }, { status: 403 })
    }

    // Get distinct categories
    const { data: categories, error } = await supabase
      .from("application_settings")
      .select("category")
      .eq("tenant_id", userProfile.tenant_id)
      .eq("is_active", true)
      .is("deleted_at", null)

    if (error) {
      console.error("Categories fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    // Get unique categories with counts
    const categoryMap = new Map()
    categories?.forEach((item) => {
      const count = categoryMap.get(item.category) || 0
      categoryMap.set(item.category, count + 1)
    })

    const result = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }))

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Settings categories API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
