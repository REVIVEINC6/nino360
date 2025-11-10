import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { POST } from "@/app/api/auth/login/route"
import {
  TestDatabase,
  MockRequest,
  ResponseHelpers,
  mockRateLimiter,
  mockAuditLogger,
} from "@/__tests__/helpers/test-helpers"
import { UserFactory } from "@/__tests__/helpers/factories"

describe("POST /api/auth/login", () => {
  let testUser: any

  beforeEach(async () => {
    mockRateLimiter(true)
    mockAuditLogger()

    // Create test user
    const userData = UserFactory.build()
    testUser = await TestDatabase.createTestUser(userData)
  })

  afterEach(async () => {
    if (testUser) {
      await TestDatabase.cleanupTestData(testUser.user.id)
    }
  })

  it("should successfully login with valid credentials", async () => {
    const request = MockRequest.create({
      body: {
        email: testUser.email,
        password: testUser.password,
      },
    })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    ResponseHelpers.expectSuccess(data)
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe(testUser.email)
    expect(data.session).toBeDefined()
    expect(data.requiresMFA).toBe(false)
  })

  it("should reject login with invalid password", async () => {
    const request = MockRequest.create({
      body: {
        email: testUser.email,
        password: "WrongPassword123!",
      },
    })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    expect(response.status).toBe(401)
    ResponseHelpers.expectError(data)
  })

  it("should reject login with non-existent email", async () => {
    const request = MockRequest.create({
      body: {
        email: "nonexistent@example.com",
        password: "TestPassword123!",
      },
    })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    expect(response.status).toBe(401)
    ResponseHelpers.expectError(data)
  })

  it("should reject login with invalid email format", async () => {
    const request = MockRequest.create({
      body: {
        email: "invalid-email",
        password: "TestPassword123!",
      },
    })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    expect(response.status).toBe(401)
    ResponseHelpers.expectError(data)
  })

  it("should reject login when rate limited", async () => {
    mockRateLimiter(false)

    const request = MockRequest.create({
      body: {
        email: testUser.email,
        password: testUser.password,
      },
    })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    expect(response.status).toBe(429)
    ResponseHelpers.expectError(data, "Too many login attempts")
  })

  it("should handle MFA requirement", async () => {
    // Enable MFA for test user
    const supabase = await import("@/lib/supabase/server").then((m) => m.createServerClient())
    await (await supabase).from("user_mfa_methods").insert({
      user_id: testUser.user.id,
      method: "totp",
      secret: "test-secret",
      is_verified: true,
    })

    const request = MockRequest.create({
      body: {
        email: testUser.email,
        password: testUser.password,
      },
    })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    ResponseHelpers.expectSuccess(data)
    expect(data.requiresMFA).toBe(true)
    expect(data.userId).toBe(testUser.user.id)
    expect(data.user).toBeUndefined()
    expect(data.session).toBeUndefined()
  })
})
