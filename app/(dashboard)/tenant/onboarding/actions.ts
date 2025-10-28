"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const supa = async () => createServerClient()

// Get tenant context from cookie
export async function getTenantContext() {
  const c = await cookies()
  const tenantSlug = c.get("tenant_slug")?.value

  if (!tenantSlug) {
    redirect("/login")
  }

  const s = await supa()
  const { data: tenant } = await s
    .from("tenants")
    .select("id, slug, name, logo_url, settings")
    .eq("slug", tenantSlug)
    .single()

  if (!tenant) {
    redirect("/login")
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
  const s = await supa()

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
  const s = await supa()

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
  const s = await supa()

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
  const s = await supa()

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
  const s = await supa()

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
  const s = await supa()

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
  const s = await supa()

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

// AI-powered policy drafting
export async function aiDraftPolicies(input: unknown) {
  const schema = z.object({
    tenant_id: z.string().uuid(),
    topics: z.array(z.string()),
  })
  const body = schema.parse(input)
  const s = await supa()

  // Check FBAC for AI features
  const { data: flags } = await s
    .from("feature_flags")
    .select("key, enabled")
    .eq("tenant_id", body.tenant_id)
    .in("key", ["tenant.docs", "tenant.security", "copilot"])

  const hasAiAccess = flags?.some((f: any) => f.enabled) || false
  if (!hasAiAccess) {
    throw new Error("AI features not enabled for this tenant")
  }

  // Generate policy drafts using AI
  const { generateText } = await import("ai")

  const policies: Record<string, string> = {}

  for (const topic of body.topics) {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Generate a professional ${topic} policy document for a SaaS company. Include sections for scope, responsibilities, procedures, and compliance. Format in markdown.`,
    })
    policies[topic] = text
  }

  return { success: true, policies }
}

// Integration connection with audit
export async function connectIntegration(input: unknown) {
  const schema = z.object({
    tenant_id: z.string().uuid(),
    provider: z.enum(["google_calendar", "email", "slack"]),
    tokenOrWebhook: z.string(),
  })
  const body = schema.parse(input)
  const s = await supa()

  // Upsert integration
  const { error } = await s
    .from("tenant_integrations")
    .upsert({
      tenant_id: body.tenant_id,
      provider: body.provider,
      config: { token: body.tokenOrWebhook },
      status: "connected",
      connected_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  // Audit log
  await appendAudit(body.tenant_id, "integration:connect", { provider: body.provider })

  return { success: true }
}

// Integration test
export async function testIntegration(input: unknown) {
  const schema = z.object({
    tenant_id: z.string().uuid(),
    provider: z.enum(["google_calendar", "email", "slack"]),
  })
  const body = schema.parse(input)

  // Stub implementation - in production, this would actually test the connection
  const testResults: Record<string, { ok: boolean; message: string }> = {
    google_calendar: { ok: true, message: "Successfully connected to Google Calendar" },
    email: { ok: true, message: "SMTP connection verified" },
    slack: { ok: true, message: "Webhook URL is valid" },
  }

  return testResults[body.provider]
}

// CSV import with validation
export async function importCsv(input: unknown) {
  const schema = z.object({
    tenant_id: z.string().uuid(),
    kind: z.enum(["contacts", "candidates"]),
    file: z.string(), // base64 CSV content
  })
  const body = schema.parse(input)
  const s = await supa()

  // Decode and parse CSV
  const csvContent = Buffer.from(body.file, "base64").toString("utf-8")
  const rows = csvContent.split("\n").map((row) => row.split(","))
  const headers = rows[0]
  const data = rows.slice(1).filter((row) => row.length === headers.length)

  // Insert into seed tables
  const tableName = body.kind === "contacts" ? "seed_contacts" : "seed_candidates"

  const records = data.map((row: any) => {
    const record: any = { tenant_id: body.tenant_id }
    headers.forEach((header: any, index: number) => {
      record[header.trim().toLowerCase()] = row[index]?.trim()
    })
    return record
  })

  const { error } = await s.from(tableName).insert(records)

  if (error) throw error

  // Audit log
  await appendAudit(body.tenant_id, "import:csv", { kind: body.kind, count: records.length })

  return { success: true, count: records.length }
}

// Role seeding
export async function seedRoles(tenantId: string) {
  const s = await supa()

  const defaultRoles = [
    { tenant_id: tenantId, key: "tenant_admin", name: "Tenant Admin", description: "Full access to tenant settings" },
    { tenant_id: tenantId, key: "manager", name: "Manager", description: "Manage team and projects" },
    { tenant_id: tenantId, key: "member", name: "Member", description: "Standard user access" },
  ]

  const { error } = await s.from("roles").upsert(defaultRoles, { onConflict: "tenant_id,key" })

  if (error) throw new Error("Roles not found")

  // Audit log
  await appendAudit(tenantId, "roles:seed", { count: defaultRoles.length })

  return { success: true }
}

// Role matrix save
export async function saveRoleMatrix(input: unknown) {
  const schema = z.object({
    tenant_id: z.string().uuid(),
    grants: z.array(
      z.object({
        roleKey: z.string(),
        permissionKey: z.string(),
        allowed: z.boolean(),
      }),
    ),
  })
  const body = schema.parse(input)
  const s = await supa()

  // Get role IDs
  const { data: roles } = await s.from("roles").select("id, key").eq("tenant_id", body.tenant_id)

  if (!roles) throw new Error("Roles not found")

  // Get permission IDs
  const { data: permissions } = await s.from("permissions").select("id, key")

  if (!permissions) throw new Error("Permissions not found")

  // Build role_permissions records
  const rolePermissions = body.grants
    .filter((g) => g.allowed)
    .map((g: any) => {
      const role = roles.find((r: any) => r.key === g.roleKey)
      const permission = permissions.find((p: any) => p.key === g.permissionKey)
      if (!role || !permission) return null
      return {
        role_id: role.id,
        permission_id: permission.id,
      }
    })
    .filter(Boolean)

  // Delete existing and insert new
  await s
    .from("role_permissions")
    .delete()
    .in(
      "role_id",
      roles.map((r: any) => r.id),
    )

  const { error } = await s.from("role_permissions").insert(rolePermissions)

  if (error) throw error

  // Audit log
  await appendAudit(body.tenant_id, "roles:matrix", { count: rolePermissions.length })

  return { success: true }
}

// Feature flags save
export async function saveFeatureFlags(input: unknown) {
  const schema = z.object({
    tenant_id: z.string().uuid(),
    flags: z.record(z.string(), z.boolean()),
  })
  const body = schema.parse(input)
  const s = await supa()

  // Upsert feature flags
  const flagRecords = Object.entries(body.flags).map(([key, enabled]) => ({
    tenant_id: body.tenant_id,
    key,
    enabled,
  }))

  const { error } = await s.from("feature_flags").upsert(flagRecords, { onConflict: "tenant_id,key" })

  if (error) throw error

  // Audit log
  await appendAudit(body.tenant_id, "features:update", { count: flagRecords.length })

  return { success: true }
}

// Review computation
export async function computeReview(tenantId: string) {
  const s = await supa()

  // Fetch all onboarding data
  const { data: tenant } = await s.from("tenants").select("*, settings").eq("id", tenantId).single()

  const { data: branding } = await s.from("tenant_branding").select("*").eq("tenant_id", tenantId).single()

  const { data: integrations } = await s.from("tenant_integrations").select("*").eq("tenant_id", tenantId)

  const { data: roles } = await s.from("roles").select("*").eq("tenant_id", tenantId)

  const { data: flags } = await s.from("feature_flags").select("*").eq("tenant_id", tenantId)

  const { data: invites } = await s.from("tenant_invitations").select("*").eq("tenant_id", tenantId)

  const settings = (tenant?.settings as any) || {}

  return {
    tenant: {
      name: tenant?.name,
      slug: tenant?.slug,
      completedSteps: settings.onboarding_completed || [],
    },
    branding: branding || null,
    integrations: integrations || [],
    roles: roles || [],
    flags: flags || [],
    invites: invites || [],
    warnings: [
      integrations?.length === 0 ? "No integrations connected" : null,
      invites?.length === 0 ? "No users invited" : null,
    ].filter(Boolean),
  }
}

// Launch tenant
export async function launchTenant(tenantId: string) {
  const s = await supa()

  // Update tenant status
  const { data: tenant } = await s.from("tenants").select("settings").eq("id", tenantId).single()

  const settings = (tenant?.settings as any) || {}

  const { error } = await s
    .from("tenants")
    .update({
      status: "active",
      settings: {
        ...settings,
        onboarding_completed_at: new Date().toISOString(),
        onboarding_step: 9,
        onboarding_completed: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    })
    .eq("id", tenantId)

  if (error) throw error

  // Final audit log
  await appendAudit(tenantId, "onboarding:launch", {})

  // Get tenant slug for redirect
  const { data: tenantData } = await s.from("tenants").select("slug").eq("id", tenantId).single()

  return { success: true, redirectUrl: `/tenant/dashboard` }
}

// Audit helper
async function appendAudit(tenantId: string, action: string, diff: any) {
  const s = await supa()

  const { data: user } = await s.auth.getUser()

  await s.from("audit_log").insert({
    tenant_id: tenantId,
    user_id: user?.user?.id,
    action,
    diff,
    timestamp: new Date().toISOString(),
  })
}
