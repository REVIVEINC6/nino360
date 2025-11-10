import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { POST as SetupMFA } from "@/app/api/auth/mfa/setup/route"
import { TestDatabase, MockRequest, ResponseHelpers, AuthHelpers } from "@/__tests__/helpers/test-helpers"
import { UserFactory } from "@/__tests__/helpers/factories"

describe("MFA APIs", () => {
  let testUser: any
  let session: any

  beforeEach(async () => {
    const userData = UserFactory.build()
    testUser = await TestDatabase.createTestUser(userData)
    session = await AuthHelpers.createAuthenticatedSession(testUser.user.id)
  })

  afterEach(async () => {
    if (testUser) {
      await AuthHelpers.cleanupSessions(testUser.user.id)
      await TestDatabase.cleanupTestData(testUser.user.id)
    }
  })

  describe("POST /api/auth/mfa/setup", () => {
    it("should setup TOTP MFA for authenticated user", async () => {
      const request = MockRequest.create({
        body: { method: "totp" },
        cookies: {
          "nino360-auth": session.session_token,
        },
      })

      const response = await SetupMFA(request as any)
      const data = await ResponseHelpers.parseJSON(response)

      ResponseHelpers.expectSuccess(data)
      expect(data.secret).toBeDefined()
    })

    it("should reject MFA setup for unauthenticated user", async () => {
      const request = MockRequest.create({
        body: { method: "totp" },
      })

      const response = await SetupMFA(request as any)
      const data = await ResponseHelpers.parseJSON(response)

      expect(response.status).toBe(401)
      ResponseHelpers.expectError(data, "Unauthorized")
    })

    it("should reject invalid MFA method", async () => {
      const request = MockRequest.create({
        body: { method: "invalid" },
        cookies: {
          "nino360-auth": session.session_token,
        },
      })

      const response = await SetupMFA(request as any)
      const data = await ResponseHelpers.parseJSON(response)

      expect(response.status).toBe(400)
      ResponseHelpers.expectError(data, "Invalid MFA method")
    })
  })
})
