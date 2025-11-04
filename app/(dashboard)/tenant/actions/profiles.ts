"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const orgProfileSchema = z.object({
  legal_name: z.string().optional(),
  brand_name: z.string().optional(),
  timezone: z.string().optional(),
  locale: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  contacts: z.array(z.any()).optional(),
  policies: z.record(z.any()).optional(),
  integrations: z.record(z.any()).optional(),
})

export async function upsertOrgProfile(input: z.infer<typeof orgProfileSchema>) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const validated = orgProfileSchema.parse(input)

  // Get current tenant
  const { data: membership } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!membership) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("org_profiles")
    .upsert(
      {
        tenant_id: membership.tenant_id,
        ...validated,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "tenant_id",
      },
    )
    .select()
    .single()

  if (error) throw error

  // Audit log
  await supabase.rpc("sec.log_action", {
    p_action: "tenant:profile:update",
    p_resource_type: "org_profile",
    p_resource_id: data.id,
    p_details: { updated_fields: Object.keys(validated) },
  })

  revalidatePath("/tenant")
  return data
}

export async function getOrgProfile() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: membership } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!membership) return null

  const { data } = await supabase.from("org_profiles").select("*").eq("tenant_id", membership.tenant_id).single()

  return data
}

export async function uploadBrandLogo(input: FormData | File | { file: string }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  let file: File | null = null
  let buffer: Buffer | null = null

  if (typeof (input as any)?.get === "function") {
    const fd = input as FormData
    file = fd.get("file") as File | null
  } else if (typeof (input as any)?.arrayBuffer === "function") {
    file = input as File
  } else if (typeof (input as any)?.file === "string") {
    buffer = Buffer.from((input as any).file, "base64")
  }

  if (!file && !buffer) throw new Error("No file provided")

  const { data: membership } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!membership) throw new Error("No tenant found")

  const filename = file?.name || `logo-${Date.now()}`
  const fileKey = `${membership.tenant_id}/${Date.now()}-${filename}`

  const uploadTarget: any = buffer ? buffer : file!
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("branding")
    .upload(fileKey, uploadTarget, { upsert: true })

  if (uploadError) throw uploadError

  const {
    data: { publicUrl },
  } = supabase.storage.from("branding").getPublicUrl(fileKey)

  // Update profile with logo URL
  await supabase.from("org_profiles").update({ logo_url: publicUrl }).eq("tenant_id", membership.tenant_id)

  revalidatePath("/tenant/configuration")
  return { url: publicUrl }
}
