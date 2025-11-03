// Supabase-backed cache replacement for Redis (with in-memory fallback)

import { logger } from "@/lib/logger"

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  tags?: string[] // Cache tags for invalidation
}

type CacheEntry = { value: any; expiresAt: number | null }

// In-memory fallback store (used when Supabase isn't available, e.g., in unit tests)
const store = new Map<string, CacheEntry>()
const tagIndex = new Map<string, Set<string>>()

function isExpired(entry: CacheEntry | undefined) {
  if (!entry) return true
  if (entry.expiresAt === null) return false
  return Date.now() > entry.expiresAt
}

/**
 * Internal helper: attempt to get a Supabase server client. If unavailable or any
 * error occurs, callers should fall back to the in-memory implementation.
 */
async function tryGetSupabase() {
  try {
    // dynamic import so tests (or environments without server-only module) don't fail
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = await import("@/lib/supabase/server")
    if (mod?.createServerClient) {
      // createServerClient may throw if env not configured; let caller handle errors
      const supabase = await mod.createServerClient()
      return supabase
    }
  } catch (err) {
    // Not running in a server environment or supabase not configured.
    return null
  }
  return null
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const supabase = await tryGetSupabase()
      if (supabase) {
        const { data, error } = await supabase.from("cache").select("value, expires_at").eq("key", key).limit(1).maybeSingle()
        if (error) {
          logger.warn("[Cache] Supabase get failed, falling back to memory", { key, error })
        } else if (data) {
          const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : null
          if (expiresAt !== null && Date.now() > expiresAt) {
            // expired
            await supabase.from("cache").delete().eq("key", key)
            return null
          }
          return data.value as T
        }
      }

      // Fallback to in-memory
      const entry = store.get(key)
      if (!entry || isExpired(entry)) {
        if (entry && isExpired(entry)) store.delete(key)
        return null
      }
      return entry.value as T
    } catch (error) {
      logger.error("[Cache] Get error:", error)
      return null
    }
  },

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const expiresAt = options?.ttl ? Date.now() + options.ttl * 1000 : null
      const supabase = await tryGetSupabase()
      if (supabase) {
        try {
          // upsert into a `cache` table: { key: string (PK), value: jsonb, expires_at: timestamptz, tags: text[] }
          await supabase.from("cache").upsert({ key, value, expires_at: expiresAt ? new Date(expiresAt).toISOString() : null, tags: options?.tags || [] })
          return
        } catch (err) {
          logger.warn("[Cache] Supabase set failed, falling back to memory", { key, err })
        }
      }

      // Fallback to in-memory
      store.set(key, { value, expiresAt })
      if (options?.tags) {
        for (const tag of options.tags) {
          const set = tagIndex.get(tag) || new Set<string>()
          set.add(key)
          tagIndex.set(tag, set)
        }
      }
    } catch (error) {
      logger.error("[Cache] Set error:", error)
    }
  },

  async delete(key: string): Promise<void> {
    try {
      const supabase = await tryGetSupabase()
      if (supabase) {
        try {
          await supabase.from("cache").delete().eq("key", key)
          return
        } catch (err) {
          logger.warn("[Cache] Supabase delete failed, falling back to memory", { key, err })
        }
      }

      store.delete(key)
      for (const set of tagIndex.values()) set.delete(key)
    } catch (error) {
      logger.error("[Cache] Delete error:", error)
    }
  },

  async invalidateTag(tag: string): Promise<void> {
    try {
      const supabase = await tryGetSupabase()
      if (supabase) {
        try {
          // delete entries whose tags array contains the tag
          await supabase.from("cache").delete().contains("tags", [tag])
          return
        } catch (err) {
          logger.warn("[Cache] Supabase invalidateTag failed, falling back to memory", { tag, err })
        }
      }

      const keys = tagIndex.get(tag)
      if (keys && keys.size) {
        for (const key of keys) store.delete(key)
        tagIndex.delete(tag)
      }
    } catch (error) {
      logger.error("[Cache] Invalidate tag error:", error)
    }
  },

  async invalidateTags(tags: string[]): Promise<void> {
    await Promise.all(tags.map((tag) => this.invalidateTag(tag)))
  },

  async getOrSet<T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) return cached
    const value = await fetcher()
    await this.set(key, value, options)
    return value
  },
}

export function getCacheKey(tenantId: string, resource: string, id?: string): string {
  return id ? `tenant:${tenantId}:${resource}:${id}` : `tenant:${tenantId}:${resource}`
}

export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: { keyGenerator: (...args: Parameters<T>) => string; ttl?: number; tags?: string[] },
): T {
  return (async (...args: Parameters<T>) => {
    const key = options.keyGenerator(...args)
    const cached = await cache.get(key)
    if (cached !== null) return cached
    const result = await fn(...args)
    await cache.set(key, result, { ttl: options.ttl, tags: options.tags })
    return result
  }) as T
}
