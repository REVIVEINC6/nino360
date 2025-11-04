import { describe, it, expect, beforeEach } from "vitest"
import { RateLimiter } from "../../../lib/auth/security/rate-limiter"

describe("RateLimiter", () => {
  beforeEach(async () => {
    // clear any in-memory state used by the RateLimiter for the test keys
    await RateLimiter.clearRateLimit("test-key", "login")
    await RateLimiter.clearRateLimit("test-key-2", "login")
  })

  it("should allow requests within limit", async () => {
    const result = await RateLimiter.checkRateLimit("test-key", "login")
    expect(result.allowed).toBe(true)
  })

  it("should block requests exceeding limit", async () => {
    const key = "test-key-2"

    // Make requests up to the configured limit for 'login' (5 attempts)
    for (let i = 0; i < 5; i++) {
      await RateLimiter.checkRateLimit(key, "login")
    }

    // Next request should be blocked
    const result = await RateLimiter.checkRateLimit(key, "login")
    expect(result.allowed).toBe(false)
  })
})
