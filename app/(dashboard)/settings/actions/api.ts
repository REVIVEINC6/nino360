"use server"

import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { sha256Hex } from "@/lib/hash"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import crypto from "crypto"

const apiKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.string()),
  expires_at: z.string().optional().nullable(),
})

const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
})

export async function listApiKeys() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("user_api_keys")
    .select("id, name, key_prefix, scopes, expires_at, last_used_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch API keys: ${error.message}`)
  }

  return data || []
}

export async function createApiKey(payload: z.infer<typeof apiKeySchema>) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const validated = apiKeySchema.parse(payload)

  // Generate API key: nino_<random_32_chars>
  const randomBytes = crypto.randomBytes(24).toString("hex")
  const fullKey = `nino_${randomBytes}`
  const keyPrefix = fullKey.substring(0, 12) // Show first 12 chars
  const keyHash = sha256Hex(fullKey)

  const { error: insertError } = await supabase.from("user_api_keys").insert({
    user_id: user.id,
    name: validated.name,
    key_prefix: keyPrefix,
    key_hash: keyHash,
    scopes: validated.scopes,
    expires_at: validated.expires_at || null,
  })

  if (insertError) {
    throw new Error(`Failed to create API key: ${insertError.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:api:create_key",
    entity: "user_settings",
    entityId: user.id,
    diff: { name: validated.name, scopes: validated.scopes },
  })

  revalidatePath("/settings/api")

  // Return full key ONCE - never stored or shown again
  return { fullKey, keyPrefix }
}

export async function revokeApiKey(keyId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { error: deleteError } = await supabase.from("user_api_keys").delete().eq("id", keyId).eq("user_id", user.id)

  if (deleteError) {
    throw new Error(`Failed to revoke API key: ${deleteError.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:api:revoke_key",
    entity: "user_settings",
    entityId: user.id,
    diff: { key_id: keyId },
  })

  revalidatePath("/settings/api")

  return { success: true }
}

export async function listWebhooks() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("user_webhooks")
    .select("id, url, events, is_active, last_triggered_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch webhooks: ${error.message}`)
  }

  return data || []
}

export async function createWebhook(payload: z.infer<typeof webhookSchema>) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const validated = webhookSchema.parse(payload)

  // Generate webhook secret
  const secret = `whsec_${crypto.randomBytes(32).toString("hex")}`

  const { error: insertError } = await supabase.from("user_webhooks").insert({
    user_id: user.id,
    url: validated.url,
    secret,
    events: validated.events,
    is_active: true,
  })

  if (insertError) {
    throw new Error(`Failed to create webhook: ${insertError.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:api:create_webhook",
    entity: "user_settings",
    entityId: user.id,
    diff: { url: validated.url, events: validated.events },
  })

  revalidatePath("/settings/api")

  return { secret }
}

export async function revokeWebhook(webhookId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { error: deleteError } = await supabase
    .from("user_webhooks")
    .delete()
    .eq("id", webhookId)
    .eq("user_id", user.id)

  if (deleteError) {
    throw new Error(`Failed to revoke webhook: ${deleteError.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:api:revoke_webhook",
    entity: "user_settings",
    entityId: user.id,
    diff: { webhook_id: webhookId },
  })

  revalidatePath("/settings/api")

  return { success: true }
}

export async function rotateWebhookSecret(webhookId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const newSecret = `whsec_${crypto.randomBytes(32).toString("hex")}`

  const { error: updateError } = await supabase
    .from("user_webhooks")
    .update({ secret: newSecret })
    .eq("id", webhookId)
    .eq("user_id", user.id)

  if (updateError) {
    throw new Error(`Failed to rotate secret: ${updateError.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:api:rotate_webhook_secret",
    entity: "user_settings",
    entityId: user.id,
    diff: { webhook_id: webhookId },
  })

  revalidatePath("/settings/api")

  return { secret: newSecret }
}
