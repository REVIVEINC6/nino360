import { describe, it, expect, beforeEach } from "vitest"
import { RateLimiter } from "@/lib/auth/security/rate-limiter"

describe("RateLimiter", () => {
  let rateLimiter: RateLimiter

  beforeEach(() => {
    rateLimiter = new RateLimiter()
  })

  it("should allow requests within limit", async () => {
    const result = await rateLimiter.checkLimit("test-key", 5, 60)
    expect(result.allowed).toBe(true)
  })

  it("should block requests exceeding limit", async () => {
    const key = "test-key-2"

    // Make requests up to limit
    for (let i = 0; i < 5; i++) {
      await rateLimiter.checkLimit(key, 5, 60)
    }

    // Next request should be blocked
    const result = await rateLimiter.checkLimit(key, 5, 60)
    expect(result.allowed).toBe(false)
  })
})
