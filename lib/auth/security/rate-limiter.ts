import { headers } from "next/headers"

// In-memory stores (runtime only). For multi-instance deployments, consider
// swapping for a persistent store or Supabase table if you need strict global limits.
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()
const inMemoryBlockStore = new Map<string, number>() // key -> blockUntil (ms)

export interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  blockDurationMs?: number
}
export type RateLimitAction =
  | "login"
  | "registration"
  | "passwordReset"
  | "mfaVerify"
  | "api"
  | "oauth"

export const RATE_LIMIT_CONFIGS: Record<RateLimitAction, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 }, // 5 attempts per 15 min
  registration: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  mfaVerify: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 }, // 5 attempts per 15 min
  api: { maxAttempts: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  oauth: { maxAttempts: 10, windowMs: 60 * 60 * 1000 }, // 10 attempts per hour
}

export async function checkRateLimit(
  identifier: string,
  action: RateLimitAction,
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const config = RATE_LIMIT_CONFIGS[action]
  const key = `ratelimit:${action}:${identifier}`
  const blockKey = `ratelimit:block:${action}:${identifier}`
  const now = Date.now()

  // Check in-memory block
  const blockUntil = inMemoryBlockStore.get(blockKey)
  if (blockUntil && blockUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(blockUntil),
    }
  } else if (blockUntil && blockUntil <= now) {
    inMemoryBlockStore.delete(blockKey)
  }

  // Window counter
  const stored = inMemoryStore.get(key)
  if (stored && stored.resetAt < now) {
    // Window expired, reset
    inMemoryStore.delete(key)
  }

  const current = stored && stored.resetAt > now ? stored : { count: 0, resetAt: now + config.windowMs }

  if (current.count >= config.maxAttempts) {
    if (config.blockDurationMs) {
      const until = now + config.blockDurationMs
      inMemoryBlockStore.set(blockKey, until)
      return { allowed: false, remaining: 0, resetAt: new Date(until) }
    }
    return { allowed: false, remaining: 0, resetAt: new Date(current.resetAt) }
  }

  current.count++
  inMemoryStore.set(key, current)

  return {
    allowed: true,
    remaining: config.maxAttempts - current.count,
    resetAt: new Date(current.resetAt),
  }
}

export async function recordRateLimitAttempt(
  identifier: string,
  action: RateLimitAction,
  success: boolean,
) {
  try {
    // Dynamic import to avoid bundling server-only Supabase client in Edge (e.g., middleware)
    const { createServerClient } = await import("@/lib/supabase/server")
    const supabase = await createServerClient()

    await supabase.from("rate_limit_logs").insert({
      identifier,
      action,
      success,
      ip_address: (await headers()).get("x-forwarded-for") || "unknown",
      user_agent: (await headers()).get("user-agent") || "unknown",
    })
  } catch (error) {
    console.error("[v0] Failed to record rate limit attempt:", error)
  }
}

export async function getRateLimitStatus(identifier: string, action: RateLimitAction) {
  const key = `ratelimit:${action}:${identifier}`
  const config = RATE_LIMIT_CONFIGS[action]
  const stored = inMemoryStore.get(key)
  const now = Date.now()

  if (!stored || stored.resetAt < now) {
    return {
      current: 0,
      limit: config.maxAttempts,
      remaining: config.maxAttempts,
      resetAt: null,
    }
  }

  return {
    current: stored.count,
    limit: config.maxAttempts,
    remaining: Math.max(0, config.maxAttempts - stored.count),
    resetAt: new Date(stored.resetAt),
  }
}

export async function clearRateLimit(identifier: string, action: RateLimitAction) {
  const key = `ratelimit:${action}:${identifier}`
  const blockKey = `ratelimit:block:${action}:${identifier}`
  inMemoryStore.delete(key)
  inMemoryBlockStore.delete(blockKey)
}

export const RateLimiter = {
  checkRateLimit,
  recordRateLimitAttempt,
  getRateLimitStatus,
  clearRateLimit,
}

export const RateLimiterService = RateLimiter
