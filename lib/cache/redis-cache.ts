import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  tags?: string[] // Cache tags for invalidation
}

/**
 * Cache utility for Redis operations
 * Provides get, set, delete, and invalidation methods
 */
export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get<T>(key)
      return value
    } catch (error) {
      console.error("[Cache] Get error:", error)
      return null
    }
  },

  /**
   * Set value in cache with optional TTL
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      if (options?.ttl) {
        await redis.setex(key, options.ttl, JSON.stringify(value))
      } else {
        await redis.set(key, JSON.stringify(value))
      }

      // Store tags for invalidation
      if (options?.tags) {
        for (const tag of options.tags) {
          await redis.sadd(`tag:${tag}`, key)
        }
      }
    } catch (error) {
      console.error("[Cache] Set error:", error)
    }
  },

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error("[Cache] Delete error:", error)
    }
  },

  /**
   * Invalidate all keys with a specific tag
   */
  async invalidateTag(tag: string): Promise<void> {
    try {
      const keys = await redis.smembers(`tag:${tag}`)
      if (keys.length > 0) {
        await redis.del(...keys)
        await redis.del(`tag:${tag}`)
      }
    } catch (error) {
      console.error("[Cache] Invalidate tag error:", error)
    }
  },

  /**
   * Invalidate multiple tags
   */
  async invalidateTags(tags: string[]): Promise<void> {
    await Promise.all(tags.map((tag) => this.invalidateTag(tag)))
  },

  /**
   * Get or set pattern - fetch from cache or compute and cache
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const value = await fetcher()
    await this.set(key, value, options)
    return value
  },
}

/**
 * Generate cache key with tenant isolation
 */
export function getCacheKey(tenantId: string, resource: string, id?: string): string {
  return id ? `tenant:${tenantId}:${resource}:${id}` : `tenant:${tenantId}:${resource}`
}

/**
 * Cache decorator for server actions
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyGenerator: (...args: Parameters<T>) => string
    ttl?: number
    tags?: string[]
  },
): T {
  return (async (...args: Parameters<T>) => {
    const key = options.keyGenerator(...args)
    const cached = await cache.get(key)

    if (cached !== null) {
      return cached
    }

    const result = await fn(...args)
    await cache.set(key, result, { ttl: options.ttl, tags: options.tags })
    return result
  }) as T
}
