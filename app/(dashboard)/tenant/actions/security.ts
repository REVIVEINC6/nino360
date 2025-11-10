"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const securitySchema = z.object({
  mfa_required: z.boolean(),
  ip_allowlist: z.array(z.string()).optional(),
  session_timeout: z.number().int().min(5).max(1440).optional(),
})

export async function getSecuritySettings() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: membership } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!membership) throw new Error("No tenant found")

  const { data } = await supabase.from("org_profiles").select("policies").eq("tenant_id", membership.tenant_id).single()

  return {
    mfa_required: data?.policies?.mfa_required || false,
    ip_allowlist: data?.policies?.ip_allowlist || [],
    session_timeout: data?.policies?.session_timeout || 60,
  }
}

export async function updateSecuritySettings(input: z.infer<typeof securitySchema>) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check feature access
  const { data: hasFeature } = await supabase.rpc("has_feature", { p_feature_key: "tenant.security" })
  if (!hasFeature) throw new Error("Feature not enabled")

  const validated = securitySchema.parse(input)

  const { data: membership } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!membership) throw new Error("No tenant found")

  // Update policies in org_profiles
  const { data: profile } = await supabase
    .from("org_profiles")
    .select("policies")
    .eq("tenant_id", membership.tenant_id)
    .single()

  const updatedPolicies = {
    ...(profile?.policies || {}),
    ...validated,
  }

  const { error } = await supabase
    .from("org_profiles")
    .update({ policies: updatedPolicies })
    .eq("tenant_id", membership.tenant_id)

  if (error) throw error

  revalidatePath("/tenant/security")
  return validated
}
