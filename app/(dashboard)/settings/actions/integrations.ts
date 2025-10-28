"use server"

import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { revalidatePath } from "next/cache"

const PROVIDERS = [
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Sync your calendar events",
    icon: "📅",
  },
  {
    id: "slack_dm",
    name: "Slack",
    description: "Receive notifications via Slack DM",
    icon: "💬",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Connect your GitHub account",
    icon: "🐙",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync with Notion workspace",
    icon: "📝",
  },
]

export async function listProviders() {
  return PROVIDERS
}

export async function listConnectedIntegrations() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase.from("user_integrations").select("*").eq("user_id", user.id)

  if (error) {
    throw new Error(`Failed to fetch integrations: ${error.message}`)
  }

  return data || []
}

export async function connectProvider(provider: string, accessToken: string, refreshToken?: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // In production, encrypt the tokens before storing
  const { error: upsertError } = await supabase.from("user_integrations").upsert({
    user_id: user.id,
    provider,
    access_token: accessToken, // Should be encrypted
    refresh_token: refreshToken || null,
    token_expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour
    meta: {},
    updated_at: new Date().toISOString(),
  })

  if (upsertError) {
    throw new Error(`Failed to connect provider: ${upsertError.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:integrations:connect",
    entity: "user_settings",
    entityId: user.id,
    diff: { provider },
  })

  revalidatePath("/settings/integrations")

  return { success: true }
}

export async function disconnectProvider(provider: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { error: deleteError } = await supabase
    .from("user_integrations")
    .delete()
    .eq("user_id", user.id)
    .eq("provider", provider)

  if (deleteError) {
    throw new Error(`Failed to disconnect provider: ${deleteError.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:integrations:disconnect",
    entity: "user_settings",
    entityId: user.id,
    diff: { provider },
  })

  revalidatePath("/settings/integrations")

  return { success: true }
}
