import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

/**
 * Rate limiter configurations for different endpoints
 */
export const rateLimiters = {
  // API endpoints - 100 requests per 10 seconds
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "10 s"),
    analytics: true,
    prefix: "ratelimit:api",
  }),

  // Authentication - 5 attempts per minute
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "ratelimit:auth",
  }),

  // AI features - 20 requests per minute
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
    prefix: "ratelimit:ai",
  }),

  // Bulk operations - 10 requests per hour
  bulk: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "ratelimit:bulk",
  }),

  // Exports - 30 requests per hour
  export: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 h"),
    analytics: true,
    prefix: "ratelimit:export",
  }),
}

/**
 * Rate limit middleware for server actions
 */
export async function rateLimit(
  identifier: string,
  limiter: Ratelimit = rateLimiters.api,
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier)

  return {
    success,
    limit,
    remaining,
    reset,
  }
}

/**
 * Rate limit decorator for server actions
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    limiter?: Ratelimit
    identifierFn: (...args: Parameters<T>) => string
  },
): T {
  return (async (...args: Parameters<T>) => {
    const identifier = options.identifierFn(...args)
    const limiter = options.limiter || rateLimiters.api

    const { success, limit, remaining, reset } = await rateLimit(identifier, limiter)

    if (!success) {
      throw new Error(`Rate limit exceeded. Limit: ${limit}, Reset: ${new Date(reset).toISOString()}`)
    }

    return fn(...args)
  }) as T
}
