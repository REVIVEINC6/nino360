"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

const webhookSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Valid URL is required"),
  secret: z.string().optional(),
  is_active: z.boolean().default(true),
})

export async function upsertWebhook(input: unknown) {
  const supabase = await createServerClient()
  const body = webhookSchema.parse(input)

  // Generate secret if not provided
  if (!body.secret && !body.id) {
    body.secret = crypto.randomBytes(32).toString("hex")
  }

  const { data, error } = await supabase.from("auto.webhooks").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/automation/webhooks")
  return data
}

export async function listWebhooks() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("auto.webhooks").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function deleteWebhook(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("auto.webhooks").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/automation/webhooks")
  return { success: true }
}

export async function testWebhook(id: string) {
  const supabase = await createServerClient()

  // Get webhook details
  const { data: webhook, error } = await supabase.from("auto.webhooks").select("*").eq("id", id).single()

  if (error) throw new Error(error.message)

  // Create test payload
  const payload = {
    event: "webhook.test",
    timestamp: new Date().toISOString(),
    data: {
      message: "This is a test webhook from Nino360",
    },
  }

  // Sign payload
  const signature = crypto
    .createHmac("sha256", webhook.secret || "")
    .update(JSON.stringify(payload))
    .digest("hex")

  // Send webhook
  try {
    const response = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Nino-Signature": `sha256=${signature}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Webhook test failed: ${response.statusText}`)
    }

    return { success: true, status: response.status }
  } catch (error) {
    throw new Error(`Webhook test failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
