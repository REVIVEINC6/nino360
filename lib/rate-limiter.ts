interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  async checkLimit(request: Request): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const ip = this.getClientIP(request)
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // Clean up old entries
    this.cleanup(windowStart)

    const key = `${ip}:${Math.floor(now / this.config.windowMs)}`
    const current = this.store[key] || { count: 0, resetTime: now + this.config.windowMs }

    if (current.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
      }
    }

    current.count++
    this.store[key] = current

    return {
      allowed: true,
      remaining: this.config.maxRequests - current.count,
      resetTime: current.resetTime,
    }
  }

  private getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")

    if (forwarded) {
      return forwarded.split(",")[0].trim()
    }

    if (realIP) {
      return realIP
    }

    return "unknown"
  }

  private cleanup(windowStart: number) {
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < windowStart) {
        delete this.store[key]
      }
    })
  }
}

// Different rate limiters for different endpoint types
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
})

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes
})

export const uploadRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 20, // 20 uploads per hour
})
