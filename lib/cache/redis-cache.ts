// In-memory cache replacement for Redis with simple TTL and tag support

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  tags?: string[] // Cache tags for invalidation
}

type CacheEntry = { value: any; expiresAt: number | null }

const store = new Map<string, CacheEntry>()
const tagIndex = new Map<string, Set<string>>()

function isExpired(entry: CacheEntry | undefined) {
  if (!entry) return true
  if (entry.expiresAt === null) return false
  return Date.now() > entry.expiresAt
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const entry = store.get(key)
      if (!entry || isExpired(entry)) {
        if (entry && isExpired(entry)) store.delete(key)
        return null
      }
      return entry.value as T
    } catch (error) {
      console.error("[Cache] Get error:", error)
      return null
    }
  },

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const expiresAt = options?.ttl ? Date.now() + options.ttl * 1000 : null
      store.set(key, { value, expiresAt })

      if (options?.tags) {
        for (const tag of options.tags) {
          const set = tagIndex.get(tag) || new Set<string>()
          set.add(key)
          tagIndex.set(tag, set)
        }
      }
    } catch (error) {
      console.error("[Cache] Set error:", error)
    }
  },

  async delete(key: string): Promise<void> {
    try {
      store.delete(key)
      // clean from tag index
      for (const set of tagIndex.values()) set.delete(key)
    } catch (error) {
      console.error("[Cache] Delete error:", error)
    }
  },

  async invalidateTag(tag: string): Promise<void> {
    try {
      const keys = tagIndex.get(tag)
      if (keys && keys.size) {
        for (const key of keys) store.delete(key)
        tagIndex.delete(tag)
      }
    } catch (error) {
      console.error("[Cache] Invalidate tag error:", error)
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
