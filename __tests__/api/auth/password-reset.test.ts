import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { POST as RequestReset } from "@/app/api/auth/password-reset/request/route"
import { TestDatabase, MockRequest, ResponseHelpers, mockRateLimiter } from "@/__tests__/helpers/test-helpers"
import { UserFactory } from "@/__tests__/helpers/factories"

describe("Password Reset APIs", () => {
  let testUser: any

  beforeEach(async () => {
    mockRateLimiter(true)
    const userData = UserFactory.build()
    testUser = await TestDatabase.createTestUser(userData)
  })

  afterEach(async () => {
    if (testUser) {
      await TestDatabase.cleanupTestData(testUser.user.id)
    }
  })

  describe("POST /api/auth/password-reset/request", () => {
    it("should accept valid email and return success", async () => {
      const request = MockRequest.create({
        body: { email: testUser.email },
      })

      const response = await RequestReset(request as any)
      const data = await ResponseHelpers.parseJSON(response)

      ResponseHelpers.expectSuccess(data)
      expect(data.message).toContain("If an account exists")
    })

    it("should return success for non-existent email (prevent enumeration)", async () => {
      const request = MockRequest.create({
        body: { email: "nonexistent@example.com" },
      })

      const response = await RequestReset(request as any)
      const data = await ResponseHelpers.parseJSON(response)

      ResponseHelpers.expectSuccess(data)
      expect(data.message).toContain("If an account exists")
    })

    it("should reject invalid email format", async () => {
      const request = MockRequest.create({
        body: { email: "invalid-email" },
      })

      const response = await RequestReset(request as any)

      expect(response.status).toBe(500)
    })

    it("should reject when rate limited", async () => {
      mockRateLimiter(false)

      const request = MockRequest.create({
        body: { email: testUser.email },
      })

      const response = await RequestReset(request as any)
      const data = await ResponseHelpers.parseJSON(response)

      expect(response.status).toBe(429)
      ResponseHelpers.expectError(data, "Too many password reset attempts")
    })
  })
})
