"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import crypto from "crypto"
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
  const devBypass = process.env.DEV_BYPASS === "1" || process.env.ADMIN_BYPASS === "1"
  if (!user && !devBypass) return []

  // Helper: fetch memberships from any available source
  const loadMemberships = async () => {
    // Try core.user_tenants first
    try {
      const { data, error } = await s
        .from("core.user_tenants")
        .select("tenant_id, created_at, user_id")
        .or(devBypass ? undefined : `user_id.eq.${user!.id}`)
      if (!error && data && data.length > 0) return data
    } catch {}
    // Then public.user_tenants (compat view)
    try {
      const { data, error } = await s
        .from("user_tenants")
        .select("tenant_id, created_at, user_id")
        .or(devBypass ? undefined : `user_id.eq.${user!.id}`)
      if (!error && data && data.length > 0) return data
    } catch {}
    // Finally, public.tenant_members
    try {
      const { data, error } = await s
        .from("tenant_members")
        .select("tenant_id, created_at, user_id")
        .or(devBypass ? undefined : `user_id.eq.${user!.id}`)
      if (!error && data) return data
    } catch {}
    return [] as any[]
  }

  const memberships = await loadMemberships()
  if (!memberships || memberships.length === 0) {
    // Optional dev fallback: list a few tenants if bypassing auth
    if (devBypass) {
      const { data: allTenants } = await s.from("tenants").select("id, name, slug, status, settings").limit(5)
      return (
        allTenants || []
      ).map((tenant: any) => ({
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        region: tenant.settings?.region,
        timezone: tenant.settings?.timezone,
        status: tenant.status,
        role: "Member",
        inviteStatus: "active" as const,
        features: [],
      }))
    }
    return []
  }

  // Fetch tenant metadata in a separate query to avoid reliance on FK-based joins
  const tenantIds = memberships.map((m: any) => m.tenant_id)
  const { data: tenantRows } = await s
    .from("tenants")
    .select("id, name, slug, status, settings")
    .in("id", tenantIds)

  const tenantsById = new Map<string, any>((tenantRows || []).map((t: any) => [t.id, t]))

  // Get roles for each tenant (prefer core.user_roles if present)
  let roles: any[] | null = null
  try {
    const { data, error } = await s
      .from("core.user_roles")
      .select("tenant_id, roles:role_id ( key, label )")
      .or(devBypass ? undefined : `user_id.eq.${user!.id}`)
      .in("tenant_id", tenantIds)
    if (!error) roles = data || []
  } catch {
    try {
      const { data } = await s
        .from("user_roles")
        .select("tenant_id, roles:role_id ( key, label )")
        .or(devBypass ? undefined : `user_id.eq.${user!.id}`)
        .in("tenant_id", tenantIds)
      roles = data || []
    } catch {
      roles = []
    }
  }

  // Get feature flags for each tenant (best-effort)
  let features: any = null
  try {
    const _features = await s.rpc("list_tenant_features", { _tenant_ids: tenantIds })
    features = _features.data
  } catch {
    features = null
  }

  // Get last audit action for each tenant (prefer app.audit_log, fallback none)
  let audits: any[] | null = null
  try {
    const { data } = await s
      .from("app.audit_log")
      .select("tenant_id, action, created_at, hash")
      .in("tenant_id", tenantIds)
      .order("created_at", { ascending: false })
      .limit(tenantIds.length)
    audits = data || []
  } catch {
    audits = []
  }

  // Build tenant list
  const result: TenantListItem[] = (memberships as any[])
    .map((m: any) => {
      const tenant = tenantsById.get(m.tenant_id)
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
  let filtered = result

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

  // Verify user has access to this tenant (skip in dev bypass)
  const devBypass = process.env.DEV_BYPASS === "1" || process.env.ADMIN_BYPASS === "1"
  const { data: membership } = await s
    .from("user_tenants")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("tenant_id", tenantId)
    .single()

  if (!membership && !devBypass) {
    return { ok: false, error: "Access denied" }
  }

  // Set active tenant cookie
  const c = await cookies()
  c.set("tenant_id", tenantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  // Audit log
  // Blockchain-style audit chain: link to previous hash
  const { data: lastAudit } = await s
    .from("sec.audit_logs")
    .select("hash")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const payload = { tenant_id: tenantId, action: "tenant:switch" }
  const prevHash = lastAudit?.hash || null
  const hash = crypto.createHash("sha256").update(JSON.stringify({ ...payload, prev_hash: prevHash })).digest("hex")

  await s.from("sec.audit_logs").insert({
    tenant_id: tenantId,
    user_id: user.id,
    action: "tenant:switch",
    resource: "tenant",
    payload: { tenant_id: tenantId },
    prev_hash: prevHash,
    hash,
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

  // Update membership status to active if tenant_members table exists; fall back to user_tenants
  try {
    await s.from("tenant_members").update({ status: "active" }).eq("tenant_id", tenantId).eq("user_id", user.id)
  } catch {}
  try {
    // Ensure membership exists in user_tenants
    await s.from("user_tenants").upsert({ user_id: user.id, tenant_id: tenantId, is_primary: false }, { onConflict: "user_id,tenant_id" })
  } catch {}

  // Audit accept with chain
  const { data: lastAudit } = await s
    .from("sec.audit_logs")
    .select("hash")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  const payload = { tenant_id: tenantId, user_id: user.id }
  const prevHash = lastAudit?.hash || null
  const hash = crypto.createHash("sha256").update(JSON.stringify({ action: "invite:accept", ...payload, prev_hash: prevHash })).digest("hex")
  await s.from("sec.audit_logs").insert({ tenant_id: tenantId, user_id: user.id, action: "invite:accept", resource: "tenant_member", payload, prev_hash: prevHash, hash })

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

  // Mark as declined if tenant_members exists; otherwise delete from user_tenants
  let handled = false
  try {
    const { error } = await s
      .from("tenant_members")
      .update({ status: "declined" })
      .eq("user_id", user.id)
      .eq("tenant_id", tenantId)
    if (!error) handled = true
  } catch {}
  if (!handled) {
    await s.from("user_tenants").delete().eq("user_id", user.id).eq("tenant_id", tenantId)
  }

  // Audit decline with chain
  const { data: lastAudit } = await s
    .from("sec.audit_logs")
    .select("hash")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  const payload = { tenant_id: tenantId, user_id: user.id }
  const prevHash = lastAudit?.hash || null
  const hash = crypto.createHash("sha256").update(JSON.stringify({ action: "invite:decline", ...payload, prev_hash: prevHash })).digest("hex")
  await s.from("sec.audit_logs").insert({ tenant_id: tenantId, user_id: user.id, action: "invite:decline", resource: "tenant_member", payload, prev_hash: prevHash, hash })

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
  const { data: existing } = await s.from("tenants").select("id").eq("slug", slug).maybeSingle()

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
  // Chain audit for tenant creation
  const { data: lastAudit } = await s
    .from("sec.audit_logs")
    .select("hash")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  const payload = { name, slug }
  const prevHash = lastAudit?.hash || null
  const hash = crypto.createHash("sha256").update(JSON.stringify({ action: "tenant:create", tenant_id: tenant.id, payload, prev_hash: prevHash })).digest("hex")
  await s
    .from("sec.audit_logs")
    .insert({ tenant_id: tenant.id, user_id: user.id, action: "tenant:create", resource: "tenant", payload, prev_hash: prevHash, hash })

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
  const { data: tenant } = await s.from("tenants").select("id").eq("slug", input.tenantSlug).maybeSingle()

  if (!tenant) {
    return { ok: false, error: "Tenant not found" }
  }

  // Create access request (stored in audit log for now)
  const { data: lastAudit } = await s
    .from("sec.audit_logs")
    .select("hash")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  const payload = { message: input.message }
  const prevHash = lastAudit?.hash || null
  const hash = crypto.createHash("sha256").update(JSON.stringify({ action: "tenant:access_request", tenant_id: tenant.id, payload, prev_hash: prevHash })).digest("hex")
  await s.from("sec.audit_logs").insert({ tenant_id: tenant.id, user_id: user.id, action: "tenant:access_request", resource: "tenant", payload, prev_hash: prevHash, hash })

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
