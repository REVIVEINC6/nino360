"use server"

import { createClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"

export async function getAIPreferences() {
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
    .select("ai_preferences")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    return { error: error.message }
  }

  return {
    data: data?.ai_preferences || {
      copilot_enabled: true,
      auto_suggestions: true,
      context_awareness: "full",
      preferred_model: "gpt-4",
      temperature: 0.7,
      max_tokens: 2000,
      enable_code_completion: true,
      enable_email_drafts: true,
      enable_document_summary: true,
      enable_meeting_notes: true,
      data_retention_days: 30,
      allow_training: false,
    },
  }
}

export async function updateAIPreferences(preferences: any) {
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
    ai_preferences: preferences,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { error: error.message }
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "update_ai_preferences",
    entity: "user_preferences",
    entityId: user.id,
    diff: { preferences },
  })

  return { success: true }
}
