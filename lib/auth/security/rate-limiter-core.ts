// Edge-safe, server-agnostic rate limiter core (no Supabase, no Node-only APIs)
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

const store = new Map<string, { count: number; resetAt: number }>()
const blocked = new Map<string, number>() // key -> blockUntil (ms)

export const RATE_LIMIT_CONFIGS: Record<RateLimitAction, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  registration: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
  passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
  mfaVerify: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  api: { maxAttempts: 100, windowMs: 60 * 1000 },
  oauth: { maxAttempts: 10, windowMs: 60 * 60 * 1000 },
}

export async function checkRateLimit(
  identifier: string,
  action: RateLimitAction,
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }>
{
  const config = RATE_LIMIT_CONFIGS[action]
  const key = `ratelimit:${action}:${identifier}`
  const blockKey = `ratelimit:block:${action}:${identifier}`
  const now = Date.now()

  const blockUntil = blocked.get(blockKey)
  if (blockUntil && blockUntil > now) {
    return { allowed: false, remaining: 0, resetAt: new Date(blockUntil) }
  } else if (blockUntil && blockUntil <= now) {
    blocked.delete(blockKey)
  }

  const found = store.get(key)
  if (found && found.resetAt < now) store.delete(key)

  const current = found && found.resetAt > now ? found : { count: 0, resetAt: now + config.windowMs }

  if (current.count >= config.maxAttempts) {
    if (config.blockDurationMs) {
      const until = now + config.blockDurationMs
      blocked.set(blockKey, until)
      return { allowed: false, remaining: 0, resetAt: new Date(until) }
    }
    return { allowed: false, remaining: 0, resetAt: new Date(current.resetAt) }
  }

  current.count++
  store.set(key, current)

  return { allowed: true, remaining: config.maxAttempts - current.count, resetAt: new Date(current.resetAt) }
}

export async function getRateLimitStatus(identifier: string, action: RateLimitAction) {
  const key = `ratelimit:${action}:${identifier}`
  const config = RATE_LIMIT_CONFIGS[action]
  const found = store.get(key)
  const now = Date.now()
  if (!found || found.resetAt < now) {
    return { current: 0, limit: config.maxAttempts, remaining: config.maxAttempts, resetAt: null as Date | null }
  }
  return {
    current: found.count,
    limit: config.maxAttempts,
    remaining: Math.max(0, config.maxAttempts - found.count),
    resetAt: new Date(found.resetAt),
  }
}

export async function clearRateLimit(identifier: string, action: RateLimitAction) {
  const key = `ratelimit:${action}:${identifier}`
  const blockKey = `ratelimit:block:${action}:${identifier}`
  store.delete(key)
  blocked.delete(blockKey)
}

export const RateLimiterCore = {
  checkRateLimit,
  getRateLimitStatus,
  clearRateLimit,
}
