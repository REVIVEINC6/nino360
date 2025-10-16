"use server"

import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const accountSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(100),
  avatar_url: z.string().url().optional().nullable(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
})

export async function getAccount() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Get user profile from public.users or auth.users metadata
  const { data: profile } = await supabase
    .from("users")
    .select("full_name, avatar_url, locale, timezone")
    .eq("id", user.id)
    .single()

  return {
    email: user.email,
    full_name: profile?.full_name || user.user_metadata?.full_name || "",
    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    locale: profile?.locale || "en-US",
    timezone: profile?.timezone || "America/New_York",
  }
}

export async function updateAccount(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const rawData = {
    full_name: formData.get("full_name"),
    avatar_url: formData.get("avatar_url"),
    locale: formData.get("locale"),
    timezone: formData.get("timezone"),
  }

  const validated = accountSchema.parse(rawData)

  // Update user profile
  const { error: updateError } = await supabase.from("users").upsert({
    id: user.id,
    ...validated,
    updated_at: new Date().toISOString(),
  })

  if (updateError) {
    throw new Error(`Failed to update account: ${updateError.message}`)
  }

  // Audit log
  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:account:update",
    entity: "user_settings",
    entityId: user.id,
    diff: validated,
  })

  revalidatePath("/settings/account")

  return { success: true }
}

export async function listConnectedAccounts() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Get linked identities from Supabase Auth
  const identities = user.identities || []

  return identities.map((identity) => ({
    provider: identity.provider,
    email: identity.identity_data?.email || "",
    created_at: identity.created_at,
  }))
}
