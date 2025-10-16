"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"

const supa = () => {
  const c = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (k) => c.get(k)?.value,
    },
  })
}

// Get tenant context from cookie
export async function getTenantContext() {
  const c = cookies()
  const tenantSlug = c.get("tenant_slug")?.value

  if (!tenantSlug) {
    redirect("/signin")
  }

  const s = supa()
  const { data: tenant } = await s
    .from("tenants")
    .select("id, slug, name, logo_url, settings")
    .eq("slug", tenantSlug)
    .single()

  if (!tenant) {
    redirect("/signin")
  }

  const settings = (tenant.settings as any) || {}

  return {
    tenantId: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    logoUrl: tenant.logo_url,
    currentStep: settings.onboarding_step || 1,
    completedSteps: settings.onboarding_completed || [],
    features: settings.features || {},
  }
}

// Save onboarding progress
const progressSchema = z.object({
  tenant_id: z.string().uuid(),
  current_step: z.number().int().min(1).max(9),
  completed_steps: z.array(z.number()),
})

export async function saveOnboardingProgress(input: unknown) {
  const body = progressSchema.parse(input)
  const s = supa()

  const { data: tenant } = await s.from("tenants").select("settings").eq("id", body.tenant_id).single()

  const settings = (tenant?.settings as any) || {}

  const { error } = await s
    .from("tenants")
    .update({
      settings: {
        ...settings,
        onboarding_step: body.current_step,
        onboarding_completed: body.completed_steps,
      },
    })
    .eq("id", body.tenant_id)

  if (error) throw error
  return { success: true }
}

// Complete onboarding
export async function completeOnboarding(tenantId: string) {
  const s = supa()

  const { data: tenant } = await s.from("tenants").select("settings").eq("id", tenantId).single()

  const settings = (tenant?.settings as any) || {}

  const { error } = await s
    .from("tenants")
    .update({
      settings: {
        ...settings,
        onboarding_completed_at: new Date().toISOString(),
        onboarding_step: 9,
        onboarding_completed: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    })
    .eq("id", tenantId)

  if (error) throw error
  return { success: true }
}

// Save company profile
const profileSchema = z.object({
  tenant_id: z.string().uuid(),
  legal_name: z.string().min(2),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  address_line1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipcode: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().default("UTC"),
  locale: z.string().default("en-US"),
  currency: z.string().default("USD"),
  fiscal_year_start: z.number().int().min(1).max(12).default(1),
})

export async function saveCompanyProfile(input: unknown) {
  const body = profileSchema.parse(input)
  const s = supa()

  // Update tenant name
  await s.from("tenants").update({ name: body.legal_name }).eq("id", body.tenant_id)

  // Upsert tenant settings
  const { error } = await s.from("tenant_settings").upsert(body).select().single()

  if (error) throw error
  return { success: true }
}

// Save branding
const brandingSchema = z.object({
  tenant_id: z.string().uuid(),
  logo_url: z.string().url().optional().or(z.literal("")),
  favicon_url: z.string().url().optional().or(z.literal("")),
  primary_color: z.string(),
  secondary_color: z.string(),
  accent_color: z.string(),
  dark_mode: z.boolean(),
})

export async function saveBrandingSettings(input: unknown) {
  const body = brandingSchema.parse(input)
  const s = supa()

  const { error } = await s.from("tenant_branding").upsert(body).select().single()

  if (error) throw error
  return { success: true }
}

// Save policies
const policiesSchema = z.object({
  tenant_id: z.string().uuid(),
  terms_url: z.string().url().optional().or(z.literal("")),
  privacy_url: z.string().url().optional().or(z.literal("")),
  data_retention_days: z.number().int().min(30).default(365),
  require_2fa: z.boolean().default(false),
  password_min_length: z.number().int().min(8).default(12),
  session_timeout_minutes: z.number().int().min(15).default(480),
})

export async function savePolicies(input: unknown) {
  const body = policiesSchema.parse(input)
  const s = supa()

  const { data: tenant } = await s.from("tenants").select("settings").eq("id", body.tenant_id).single()

  const settings = (tenant?.settings as any) || {}

  const { error } = await s
    .from("tenants")
    .update({
      settings: {
        ...settings,
        policies: body,
      },
    })
    .eq("id", body.tenant_id)

  if (error) throw error
  return { success: true }
}

// Enable modules
const modulesSchema = z.object({
  tenant_id: z.string().uuid(),
  modules: z.object({
    crm: z.boolean(),
    talent: z.boolean(),
    bench: z.boolean(),
    vms: z.boolean(),
    projects: z.boolean(),
    finance: z.boolean(),
    hrms: z.boolean(),
    automation: z.boolean(),
    reports: z.boolean(),
    copilot: z.boolean(),
  }),
})

export async function saveModules(input: unknown) {
  const body = modulesSchema.parse(input)
  const s = supa()

  const { data: tenant } = await s.from("tenants").select("settings").eq("id", body.tenant_id).single()

  const settings = (tenant?.settings as any) || {}

  const { error } = await s
    .from("tenants")
    .update({
      settings: {
        ...settings,
        modules: body.modules,
      },
    })
    .eq("id", body.tenant_id)

  if (error) throw error
  return { success: true }
}

// Send invitations
const inviteSchema = z.object({
  tenant_id: z.string().uuid(),
  invites: z.array(
    z.object({
      email: z.string().email(),
      role: z.string(),
      full_name: z.string().optional(),
    }),
  ),
})

export async function sendInvitations(input: unknown) {
  const body = inviteSchema.parse(input)
  const s = supa()

  // Insert invitations
  const invitations = body.invites.map((invite) => ({
    tenant_id: body.tenant_id,
    email: invite.email,
    role: invite.role,
    full_name: invite.full_name,
    status: "pending",
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  const { error } = await s.from("tenant_invitations").insert(invitations)

  if (error) throw error
  return { success: true, count: invitations.length }
}
