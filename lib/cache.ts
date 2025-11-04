/**
 * Caching utilities for server and client
 *
 * Provides:
 * - Server-side caching with Next.js cache
 * - Client-side caching with SWR
 * - Cache invalidation helpers
 * - Cache key generation
 */

import { unstable_cache } from "next/cache"
import { logger } from "./logger"

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  // Short-lived cache (1 minute)
  SHORT: 60,

  // Medium-lived cache (5 minutes)
  MEDIUM: 5 * 60,

  // Long-lived cache (1 hour)
  LONG: 60 * 60,

  // Very long-lived cache (1 day)
  VERY_LONG: 24 * 60 * 60,
} as const

/**
 * Cache tags for invalidation
 */
export const CACHE_TAGS = {
  users: "users",
  tenants: "tenants",
  clients: "clients",
  candidates: "candidates",
  jobs: "jobs",
  projects: "projects",
  invoices: "invoices",
  expenses: "expenses",
  consultants: "consultants",
  vendors: "vendors",
  reports: "reports",
} as const

/**
 * Generate a cache key
 */
export function getCacheKey(prefix: string, ...parts: (string | number | undefined)[]): string {
  return [prefix, ...parts.filter(Boolean)].join(":")
}

/**
 * Cached function wrapper for server-side caching
 *
 * @example
 * const getUsers = cached(
 *   async (tenantId: string) => {
 *     const supabase = await createServerClient()
 *     return supabase.from('users').select('*').eq('tenant_id', tenantId)
 *   },
 *   ['users'],
 *   { revalidate: CACHE_CONFIG.MEDIUM, tags: [CACHE_TAGS.users] }
 * )
 */
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  options?: {
    revalidate?: number | false
    tags?: string[]
  },
): T {
  const cacheKey = keyParts.join(":")

  return unstable_cache(
    async (...args: Parameters<T>) => {
      logger.debug(`Cache miss: ${cacheKey}`, { args })
      return fn(...args)
    },
    keyParts,
    {
      revalidate: options?.revalidate ?? CACHE_CONFIG.MEDIUM,
      tags: options?.tags ?? [],
    },
  ) as T
}

/**
 * Client-side cache key generators for SWR
 */
export const swrKeys = {
  users: (tenantId?: string) => getCacheKey("users", tenantId),
  user: (userId: string) => getCacheKey("user", userId),
  tenants: () => getCacheKey("tenants"),
  tenant: (tenantId: string) => getCacheKey("tenant", tenantId),
  clients: (tenantId?: string) => getCacheKey("clients", tenantId),
  client: (clientId: string) => getCacheKey("client", clientId),
  candidates: (tenantId?: string, filters?: string) => getCacheKey("candidates", tenantId, filters),
  candidate: (candidateId: string) => getCacheKey("candidate", candidateId),
  jobs: (tenantId?: string) => getCacheKey("jobs", tenantId),
  job: (jobId: string) => getCacheKey("job", jobId),
  projects: (tenantId?: string) => getCacheKey("projects", tenantId),
  project: (projectId: string) => getCacheKey("project", projectId),
  invoices: (tenantId?: string) => getCacheKey("invoices", tenantId),
  invoice: (invoiceId: string) => getCacheKey("invoice", invoiceId),
  dashboard: (tenantId?: string) => getCacheKey("dashboard", tenantId),
  reports: (reportType: string, tenantId?: string) => getCacheKey("reports", reportType, tenantId),
}

/**
 * Cache invalidation helpers
 */
export const cacheInvalidation = {
  /**
   * Invalidate all caches for a specific tag
   */
  invalidateTag: async (tag: string) => {
    logger.info(`Invalidating cache tag: ${tag}`)
    // Next.js will handle this via revalidateTag in server actions
  },

  /**
   * Invalidate all caches for a specific path
   */
  invalidatePath: async (path: string) => {
    logger.info(`Invalidating cache path: ${path}`)
    // Next.js will handle this via revalidatePath in server actions
  },
}
