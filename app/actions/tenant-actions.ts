"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTenant(data: {
  companyName: string
  domain: string
  region: string
  timezone: string
  slug: string
  adminName: string
  adminEmail: string
  planCode: string
  interval: string
  leadId?: string
}) {
  const supabase = await createClient()

  try {
    // Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        name: data.companyName,
        slug: data.slug,
        region: data.region,
        timezone: data.timezone,
        status: "trial",
      })
      .select()
      .single()

    if (tenantError) throw tenantError

    // TODO: Create admin user and membership
    // TODO: Seed roles and permissions
    // TODO: Create subscription record
    // TODO: Log to audit chain

    revalidatePath("/t/[slug]", "layout")

    return {
      success: true,
      tenantId: tenant.id,
      slug: tenant.slug,
    }
  } catch (error) {
    console.error("Failed to create tenant:", error)
    return {
      success: false,
      error: "Failed to create workspace",
    }
  }
}
