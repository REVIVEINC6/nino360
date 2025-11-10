// In-memory rate limiting for auth services (replaces Upstash Redis)
const buckets = new Map<string, { count: number; resetAt: number }>()

/**
 * Check rate limit for a given key
 * @param key - Unique identifier for the rate limit
 * @param maxAttempts - Maximum number of attempts allowed
 * @param windowSeconds - Time window in seconds
 * @returns true if allowed, false if rate limit exceeded
 */
export async function checkRateLimit(key: string, maxAttempts: number, windowSeconds: number): Promise<boolean> {
  const now = Date.now()
  const rec = buckets.get(key)
  if (!rec || rec.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return true
  }
  if (rec.count >= maxAttempts) return false
  rec.count++
  return true
}

/**
 * Get remaining attempts for a rate limit key
 */
export async function getRemainingAttempts(key: string, maxAttempts: number): Promise<number> {
  const rec = buckets.get(key)
  if (!rec) return maxAttempts
  return Math.max(0, maxAttempts - rec.count)
}

/**
 * Reset rate limit for a key
 */
export async function resetRateLimit(key: string): Promise<void> {
  buckets.delete(key)
}
