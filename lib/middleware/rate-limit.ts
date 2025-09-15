import type { NextRequest } from "next/server"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(request: NextRequest, options: { maxRequests?: number; windowMs?: number } = {}) {
  const { maxRequests = 100, windowMs = 60000 } = options

  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()
  const windowStart = now - windowMs

  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }

  const current = rateLimitMap.get(ip)

  if (!current || current.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return { success: true }
  }

  if (current.count >= maxRequests) {
    return { success: false, resetTime: current.resetTime }
  }

  current.count++
  return { success: true }
}
