interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export async function checkRateLimit(key: string, config: RateLimitConfig): Promise<boolean> {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    })
    return true
  }

  if (record.count >= config.maxRequests) {
    return false
  }

  record.count++
  return true
}

export function getRateLimitKey(userId: string, action: string): string {
  return `${userId}:${action}`
}

// Preset rate limit configurations
export const RATE_LIMITS = {
  INVITE_USER: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
  BULK_ACTION: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
  EXPORT_DATA: { maxRequests: 3, windowMs: 60 * 1000 }, // 3 per minute
  UPDATE_PERMISSIONS: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 per minute
}

export async function rateLimit(action: string, maxRequests: number, windowMs: number): Promise<void> {
  // This would need user ID from auth context in a real implementation
  // For now, using a placeholder key
  const key = `rate_limit:${action}`

  const allowed = await checkRateLimit(key, { maxRequests, windowMs })

  if (!allowed) {
    throw new Error(`Rate limit exceeded for ${action}. Please try again later.`)
  }
}
