/**
 * Server-side cache helpers for common operations
 */

import { revalidateTag, revalidatePath } from "next/cache"
import { cached, CACHE_CONFIG, CACHE_TAGS } from "./cache"
import { createServerClient } from "./supabase/server"
import { logger } from "./logger"

/**
 * Cached data fetchers
 */

export const getCachedUsers = cached(
  async (tenantId: string) => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("users").select("*").eq("tenant_id", tenantId)

    if (error) {
      logger.error("Failed to fetch users", error, { tenantId })
      throw error
    }

    return data
  },
  ["users"],
  { revalidate: CACHE_CONFIG.MEDIUM, tags: [CACHE_TAGS.users] },
)

export const getCachedTenants = cached(
  async () => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("tenants").select("*")

    if (error) {
      logger.error("Failed to fetch tenants", error)
      throw error
    }

    return data
  },
  ["tenants"],
  { revalidate: CACHE_CONFIG.LONG, tags: [CACHE_TAGS.tenants] },
)

export const getCachedClients = cached(
  async (tenantId: string) => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("clients").select("*").eq("tenant_id", tenantId)

    if (error) {
      logger.error("Failed to fetch clients", error, { tenantId })
      throw error
    }

    return data
  },
  ["clients"],
  { revalidate: CACHE_CONFIG.MEDIUM, tags: [CACHE_TAGS.clients] },
)

/**
 * Cache invalidation helpers
 */

export async function invalidateUsers(tenantId?: string) {
  logger.info("Invalidating users cache", { tenantId })
  revalidateTag(CACHE_TAGS.users)
  if (tenantId) {
    revalidatePath(`/dashboard/users`)
  }
}

export async function invalidateTenants() {
  logger.info("Invalidating tenants cache")
  revalidateTag(CACHE_TAGS.tenants)
  revalidatePath("/admin/tenants")
}

export async function invalidateClients(tenantId?: string) {
  logger.info("Invalidating clients cache", { tenantId })
  revalidateTag(CACHE_TAGS.clients)
  if (tenantId) {
    revalidatePath("/dashboard/clients")
  }
}

export async function invalidateCandidates(tenantId?: string) {
  logger.info("Invalidating candidates cache", { tenantId })
  revalidateTag(CACHE_TAGS.candidates)
  if (tenantId) {
    revalidatePath("/dashboard/talent/candidates")
  }
}

export async function invalidateJobs(tenantId?: string) {
  logger.info("Invalidating jobs cache", { tenantId })
  revalidateTag(CACHE_TAGS.jobs)
  if (tenantId) {
    revalidatePath("/dashboard/talent/jobs")
  }
}

export async function invalidateProjects(tenantId?: string) {
  logger.info("Invalidating projects cache", { tenantId })
  revalidateTag(CACHE_TAGS.projects)
  if (tenantId) {
    revalidatePath("/dashboard/projects")
  }
}

export async function invalidateInvoices(tenantId?: string) {
  logger.info("Invalidating invoices cache", { tenantId })
  revalidateTag(CACHE_TAGS.invoices)
  if (tenantId) {
    revalidatePath("/dashboard/finance/invoices")
  }
}

export async function invalidateDashboard(tenantId?: string) {
  logger.info("Invalidating dashboard cache", { tenantId })
  revalidatePath("/dashboard")
}
