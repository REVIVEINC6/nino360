import type { NextRequest } from "next/server"
// Simple in-memory rate limiter using LRU cache
class SimpleLRUCache<K, V> {
  private cache = new Map<K, V>()
  private maxSize: number

  constructor(maxSize = 1000) {
    this.maxSize = maxSize
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key)
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, value)
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

interface RateLimitStoreEntry {
  count: number
  resetTime: number
}

// Use a Map to store rate limit entries for predictable get/set/delete semantics
const store: Map<string, RateLimitStoreEntry> = new Map()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // 100 requests per minute

// Global rate limit cache
const rateLimitCache = new SimpleLRUCache<string, RateLimitEntry>(10000)

// Rate limit configurations
const RATE_LIMITS = {
  "settings-read": { requests: 100, windowMs: 60 * 1000 }, // 100 per minute
  "settings-write": { requests: 20, windowMs: 60 * 1000 }, // 20 per minute
  "settings-export": { requests: 5, windowMs: 5 * 60 * 1000 }, // 5 per 5 minutes
  "settings-import": { requests: 3, windowMs: 5 * 60 * 1000 }, // 3 per 5 minutes
  default: { requests: 50, windowMs: 60 * 1000 }, // 50 per minute
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

export async function rateLimit(
  request: NextRequest,
  identifier: string = "default",
  customLimit?: number,
  customWindowMs?: number,
): Promise<RateLimitResult> {
  try {
    // Get client IP
    const ip =
      request.ip ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown"

    // Create unique key
    const key = `${identifier}:${ip}`

    // Get rate limit config
    const config = RATE_LIMITS[identifier as keyof typeof RATE_LIMITS] || RATE_LIMITS.default
    const limit = customLimit || config.requests
    const windowMs = customWindowMs ? customWindowMs * 1000 : config.windowMs

    const now = Date.now()
    const resetTime = now + windowMs

    // Get current entry
    let entry = rateLimitCache.get(key)

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      entry = {
        count: 1,
        resetTime,
      }
      rateLimitCache.set(key, entry)

      return {
        success: true,
        limit,
        remaining: limit - 1,
        resetTime,
      }
    }

    // Check if limit exceeded
    if (entry.count >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      }
    }

    // Increment count
    entry.count++
    rateLimitCache.set(key, entry)

    return {
      success: true,
      limit,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
    }
  } catch (error) {
    console.error("Rate limiting error:", error)
    // On error, allow the request to proceed
    return {
      success: true,
      limit: 0,
      remaining: 0,
      resetTime: Date.now(),
    }
  }
}

export async function rateLimitSimple(
  request: NextRequest,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 100 },
): Promise<void> {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()
  const key = `${ip}:${request.nextUrl.pathname}`

  const current = store.get(key)

  if (!current || now > current.resetTime) {
    store.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return
  }

  if (current.count >= config.maxRequests) {
    throw new Error("Rate limit exceeded")
  }

  // Increment and update
  current.count++
  store.set(key, current)
}

// Cleanup function to remove expired entries
export function cleanupRateLimit(): void {
  const now = Date.now()
  const keysToDelete: string[] = []

  // Note: This is a simplified cleanup. In production, you might want to use a more efficient approach
  for (const [key, entry] of (rateLimitCache as any).cache.entries()) {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  }

  keysToDelete.forEach((key) => rateLimitCache.delete(key))
}

// Alternative rate limiting function for simpler use cases
export function createRateLimit(config: RateLimitConfig) {
  return {
    check: async (identifier: string, limit: number): Promise<{ success: boolean; retryAfter?: number }> => {
      const now = Date.now()
      const key = identifier
      const windowStart = Math.floor(now / config.windowMs) * config.windowMs
      const resetTime = windowStart + config.windowMs

      const current = rateLimitCache.get(key)

      if (!current || current.resetTime <= now) {
        rateLimitCache.set(key, { count: 1, resetTime })
        return { success: true }
      }

      if (current.count >= limit) {
        return {
          success: false,
          retryAfter: Math.ceil((resetTime - now) / 1000),
        }
      }

      current.count++
      return { success: true }
    },
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimit, 5 * 60 * 1000)
}

export async function rateLimitUpdated(request: NextRequest): Promise<void> {
  const ip = request.ip || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous"
  const now = Date.now()
  const key = `rate_limit:${ip}`

  // Clean up expired entries
  if (store.has(key) && now > (store.get(key) as RateLimitStoreEntry).resetTime) {
    store.delete(key)
  }

  // Initialize or increment counter
  if (!store.has(key)) {
    store.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
  } else {
    const entry = store.get(key) as RateLimitStoreEntry
    entry.count++
    store.set(key, entry)
  }

  // Check if rate limit exceeded
  if ((store.get(key) as RateLimitStoreEntry).count > RATE_LIMIT_MAX_REQUESTS) {
    throw new Error("Rate limit exceeded")
  }
}

export function getRateLimitStatus(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const key = `rate_limit:${ip}`
  const now = Date.now()

  if (!store.has(key) || now > (store.get(key) as RateLimitStoreEntry).resetTime) {
    return {
      limit: RATE_LIMIT_MAX_REQUESTS,
      remaining: RATE_LIMIT_MAX_REQUESTS,
      reset: now + RATE_LIMIT_WINDOW,
    }
  }

  const entry = store.get(key) as RateLimitStoreEntry
  return {
    limit: RATE_LIMIT_MAX_REQUESTS,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count),
    reset: entry.resetTime,
  }
}
