import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { POST } from "@/app/api/auth/session/refresh/route"
import { TestDatabase, MockRequest, ResponseHelpers, AuthHelpers } from "@/__tests__/helpers/test-helpers"
import { UserFactory } from "@/__tests__/helpers/factories"

describe("POST /api/auth/session/refresh", () => {
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

  it("should refresh session for authenticated user", async () => {
    const request = MockRequest.create({
      cookies: {
        "nino360-auth": session.session_token,
      },
    })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    ResponseHelpers.expectSuccess(data)
    expect(data.session).toBeDefined()
    expect(data.session.user_id).toBe(testUser.user.id)
  })

  it("should reject unauthenticated request", async () => {
    const request = MockRequest.create({})

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    expect(response.status).toBe(401)
    ResponseHelpers.expectError(data, "Unauthorized")
  })
})
