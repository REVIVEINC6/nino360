"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { z } from "zod"

const supa = async (): Promise<any> => {
  const c = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    // Supabase's CookieMethodsServer type differs slightly depending on version; cast to any to keep this adapter thin
    cookies: (
      {
        get: (k: string) => c.get(k)?.value,
        set: (k: string, v: string, opts: any) => c.set(k, v, opts),
        remove: (k: string, opts: any) => c.set(k, "", { ...opts, maxAge: 0 }),
      } as unknown
    ) as any,
  })
}

export interface TenantListItem {
  id: string
  name: string
  slug: string
  region?: string
  timezone?: string
  status: string
  role?: string
  inviteStatus?: "active" | "invited" | "declined"
  features: string[]
  lastAction?: {
    ts: string
    action: string
    hash?: string
  }
}

// List all tenants the user belongs to or is invited to
export async function listTenants(params?: {
  q?: string
  region?: string
  role?: string
  status?: "active" | "invited"
}): Promise<TenantListItem[]> {
  const s = await supa()

  const {
    data: { user },
  } = await s.auth.getUser()
  if (!user) return []

  // Get user's tenant memberships with roles
  const { data: memberships, error } = await s
    .from("user_tenants")
    .select(
      `
      tenant_id,
      created_at,
      tenants:tenant_id (
        id,
        name,
        slug,
        status,
        settings
      )
    `,
    )
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error fetching tenants:", error)
    return []
  }

  if (!memberships) return []

  // Get roles for each tenant
  const tenantIds = memberships.map((m: any) => m.tenant_id)
  const { data: roles } = await s
    .from("user_roles")
    .select(
      `
      tenant_id,
      roles:role_id (
        key,
        label
      )
    `,
    )
    .eq("user_id", user.id)
    .in("tenant_id", tenantIds)

  // Get feature flags for each tenant
  let features: any = null
  try {
    const _features = await s.rpc("list_tenant_features", {
      _tenant_ids: tenantIds,
    })
    features = _features.data
  } catch (err) {
    features = null
  }

  // Get last audit action for each tenant
  const { data: audits } = await s
    .from("audit_logs")
    .select("tenant_id, action, created_at, hash")
    .in("tenant_id", tenantIds)
    .order("created_at", { ascending: false })
    .limit(tenantIds.length)

  // Build tenant list
  const tenants: TenantListItem[] = memberships
    .map((m: any) => {
      const tenant = m.tenants as any
      if (!tenant) return null

  const tenantRoles = roles?.filter((r: any) => r.tenant_id === m.tenant_id) || []
      const primaryRole = tenantRoles[0]?.roles as any
  const tenantFeatures = features?.filter((f: any) => f.tenant_id === m.tenant_id) || []
  const lastAudit = audits?.find((a: any) => a.tenant_id === m.tenant_id)

      const settings = tenant.settings || {}

      return {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        region: settings.region,
        timezone: settings.timezone,
        status: tenant.status,
        role: primaryRole?.label || "Member",
        inviteStatus: "active" as const,
        features: tenantFeatures.map((f: any) => f.key || f.feature_key).slice(0, 5),
        lastAction: lastAudit
          ? {
              ts: lastAudit.created_at,
              action: lastAudit.action,
              hash: lastAudit.hash,
            }
          : undefined,
      }
    })
  .filter(Boolean) as TenantListItem[]

  // Apply filters
  let filtered = tenants

  if (params?.q) {
    const query = params.q.toLowerCase()
    filtered = filtered.filter((t) => t.name.toLowerCase().includes(query) || t.slug.toLowerCase().includes(query))
  }

  if (params?.region) {
    filtered = filtered.filter((t) => t.region === params.region)
  }

  if (params?.role) {
    filtered = filtered.filter((t) => t.role?.toLowerCase().includes(params.role!.toLowerCase()))
  }

  if (params?.status) {
    filtered = filtered.filter((t) => t.inviteStatus === params.status)
  }

    return filtered
}

// Switch active tenant
export async function switchTenant(tenantId: string) {
  const s = await supa()

  const {
    data: { user },
  } = await s.auth.getUser()
  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  // Verify user has access to this tenant
  const { data: membership } = await s
    .from("user_tenants")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("tenant_id", tenantId)
    .single()

  if (!membership) {
    return { ok: false, error: "Access denied" }
  }

  // Set active tenant cookie
  const c = await cookies()
  c.set("x-active-tenant", tenantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  // Audit log
  await s.from("audit_logs").insert({
    tenant_id: tenantId,
    user_id: user.id,
    action: "tenant:switch",
    resource: "tenant",
    payload: { tenant_id: tenantId },
  })

  return { ok: true, redirect: "/dashboard" }
}

// Accept invite (placeholder - would update status in tenant_members table)
export async function acceptInvite(tenantId: string) {
  const s = await supa()

  const {
    data: { user },
  } = await s.auth.getUser()
  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  // In a real implementation, this would update tenant_members.status='active'
  // For now, we'll just audit the action
  await s.from("audit_logs").insert({
    tenant_id: tenantId,
    user_id: user.id,
    action: "invite:accept",
    resource: "tenant_member",
    payload: { tenant_id: tenantId },
  })

  return { ok: true }
}

// Decline invite
export async function declineInvite(tenantId: string) {
  const s = await supa()

  const {
    data: { user },
  } = await s.auth.getUser()
  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  // Delete membership or mark as declined
  await s.from("user_tenants").delete().eq("user_id", user.id).eq("tenant_id", tenantId)

  await s.from("audit_logs").insert({
    tenant_id: tenantId,
    user_id: user.id,
    action: "invite:decline",
    resource: "tenant_member",
    payload: { tenant_id: tenantId },
  })

  return { ok: true }
}

// Create tenant schema
const createTenantSchema = z.object({
  name: z.string().min(3).max(100),
  slug: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  region: z.string().optional(),
  timezone: z.string().optional(),
})

// Create new tenant
export async function createTenant(input: z.infer<typeof createTenantSchema>) {
  const s = await supa()

  const {
    data: { user },
  } = await s.auth.getUser()
  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  // Validate input
  const validated = createTenantSchema.safeParse(input)
  if (!validated.success) {
    return { ok: false, error: validated.error.errors[0].message }
  }

  const { name, slug, region, timezone } = validated.data

  // Check slug uniqueness
  const { data: existing } = await s.from("tenants").select("id").eq("slug", slug).single()

  if (existing) {
    // Suggest alternative
    const alt = `${slug}-${Math.floor(Math.random() * 1000)}`
    return { ok: false, error: `Slug already taken. Try: ${alt}` }
  }

  // Create tenant
  const { data: tenant, error: tenantError } = await s
    .from("tenants")
    .insert({
      name,
      slug,
      status: "active",
      settings: { region, timezone },
    })
    .select()
    .single()

  if (tenantError || !tenant) {
    console.error("[v0] Error creating tenant:", tenantError)
    return { ok: false, error: "Failed to create tenant" }
  }

  // Add creator as tenant_admin
  const { error: memberError } = await s.from("user_tenants").insert({
    user_id: user.id,
    tenant_id: tenant.id,
    is_primary: true,
  })

  if (memberError) {
    console.error("[v0] Error adding member:", memberError)
  }

  // Get admin role
  const { data: adminRole } = await s.from("roles").select("id").eq("key", "admin").single()

  if (adminRole) {
    await s.from("user_roles").insert({
      user_id: user.id,
      tenant_id: tenant.id,
      role_id: adminRole.id,
    })
  }

  // Seed minimal feature flags (placeholder)
  // In production, this would seed default features

  // Audit log
  await s.from("audit_logs").insert({
    tenant_id: tenant.id,
    user_id: user.id,
    action: "tenant:create",
    resource: "tenant",
    payload: { name, slug },
  })

  return {
    ok: true,
    tenantId: tenant.id,
    redirect: `/t/${slug}/getting-started`,
  }
}

// Request access to tenant
export async function requestAccess(input: { tenantSlug: string; message?: string }) {
  const s = await supa()

  const {
    data: { user },
  } = await s.auth.getUser()
  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }

  // Find tenant by slug
  const { data: tenant } = await s.from("tenants").select("id").eq("slug", input.tenantSlug).single()

  if (!tenant) {
    return { ok: false, error: "Tenant not found" }
  }

  // Create access request (stored in audit log for now)
  await s.from("audit_logs").insert({
    tenant_id: tenant.id,
    user_id: user.id,
    action: "tenant:access_request",
    resource: "tenant",
    payload: { message: input.message },
  })

  return { ok: true }
}

// Get quick links for tenant
export async function quickLinks(tenantId: string) {
  const s = await supa()

  const {
    data: { user },
  } = await s.auth.getUser()
  if (!user) return {}

  // Get user's role for this tenant
  const { data: roles } = await s
    .from("user_roles")
    .select(
      `
      roles:role_id (
        key
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("tenant_id", tenantId)

  const roleKeys = roles?.map((r: any) => r.roles?.key) || []
  const isAdmin = roleKeys.some((k: any) => k === "admin" || k === "super_admin" || k === "master_admin")
  const isManager = roleKeys.some((k: any) => k === "manager")

  // Get tenant slug
  const { data: tenant } = await s.from("tenants").select("slug").eq("id", tenantId).single()

  const links: Record<string, string> = {}

  if (tenant) {
    if (isAdmin) {
      links.admin = `/t/${tenant.slug}/admin`
    }
    if (isAdmin || isManager) {
      links.billing = `/tenant/billing?tenant=${tenantId}`
      links.settings = `/tenant/configuration`
    }
  }

  return links
}
