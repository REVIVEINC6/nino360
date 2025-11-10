import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { POST } from "@/app/api/auth/register/route"
import {
  TestDatabase,
  MockRequest,
  ResponseHelpers,
  mockRateLimiter,
  mockAuditLogger,
} from "@/__tests__/helpers/test-helpers"
import { UserFactory, TenantFactory } from "@/__tests__/helpers/factories"

describe("POST /api/auth/register", () => {
  let testUserId: string | null = null
  let testTenant: any

  beforeEach(async () => {
    mockRateLimiter(true)
    mockAuditLogger()

    testTenant = await TestDatabase.createTestTenant(TenantFactory.build())
  })

  afterEach(async () => {
    if (testUserId) {
      await TestDatabase.cleanupTestData(testUserId)
    }
  })

  it("should successfully register a new user", async () => {
    const userData = UserFactory.build({ tenantId: testTenant.id })
    const request = MockRequest.create({ body: userData })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    ResponseHelpers.expectSuccess(data)
    expect(data.userId).toBeDefined()
    expect(data.message).toContain("check your email")

    testUserId = data.userId
  })

  it("should reject registration with duplicate email", async () => {
    const userData = UserFactory.build()

    // Create first user
    const firstUser = await TestDatabase.createTestUser(userData)
    testUserId = firstUser.user.id

    // Try to register with same email
    const request = MockRequest.create({ body: userData })
    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    expect(response.status).toBe(400)
    ResponseHelpers.expectError(data)
  })

  it("should reject registration with invalid email", async () => {
    const userData = UserFactory.build({ email: "invalid-email" })
    const request = MockRequest.create({ body: userData })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    expect(response.status).toBe(400)
    ResponseHelpers.expectError(data)
  })

  it("should reject registration with weak password", async () => {
    const userData = UserFactory.build({ password: "123" })
    const request = MockRequest.create({ body: userData })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    expect(response.status).toBe(400)
    ResponseHelpers.expectError(data)
  })

  it("should reject registration when rate limited", async () => {
    mockRateLimiter(false)

    const userData = UserFactory.build()
    const request = MockRequest.create({ body: userData })

    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    expect(response.status).toBe(429)
    ResponseHelpers.expectError(data, "Too many registration attempts")
  })

  it("should register user without tenant", async () => {
    const userData = UserFactory.build()
    delete userData.tenantId

    const request = MockRequest.create({ body: userData })
    const response = await POST(request as any)
    const data = await ResponseHelpers.parseJSON(response)

    ResponseHelpers.expectSuccess(data)
    expect(data.userId).toBeDefined()

    testUserId = data.userId
  })
})
