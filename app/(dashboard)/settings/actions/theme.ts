"use server"

import { createClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"

export async function getThemePreferences() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .select("theme_preferences")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    return { error: error.message }
  }

  return {
    data: data?.theme_preferences || {
      mode: "system",
      primary_color: "blue",
      font_size: "medium",
      font_family: "inter",
      reduce_motion: false,
      high_contrast: false,
      keyboard_navigation: true,
      screen_reader_optimized: false,
      compact_mode: false,
      sidebar_position: "left",
    },
  }
}

export async function updateThemePreferences(preferences: any) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase.from("user_preferences").upsert({
    user_id: user.id,
    theme_preferences: preferences,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { error: error.message }
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "update_theme_preferences",
    entity: "user_preferences",
    entityId: user.id,
    diff: { preferences },
  })

  return { success: true }
}
