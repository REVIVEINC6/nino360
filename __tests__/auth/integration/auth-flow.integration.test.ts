import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { createServerClient } from "@/lib/supabase/server"

describe("Authentication Flow Integration Tests", () => {
  let testEmail: string
  let testPassword: string
  let userId: string

  beforeAll(() => {
    testEmail = `test-${Date.now()}@example.com`
    testPassword = "SecureTestPass123!"
  })

  afterAll(async () => {
    // Cleanup test user
    if (userId) {
      const supabase = await createServerClient()
      await supabase.auth.admin.deleteUser(userId)
    }
  })

  it("should complete full registration flow", async () => {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        fullName: "Test User",
        tenantId: "test-tenant",
      }),
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.user).toBeDefined()
    userId = data.user.id
  })

  it("should verify email", async () => {
    // Get verification token from database
    const supabase = await createServerClient()
    const { data: token } = await supabase
      .from("email_verification_tokens")
      .select("token")
      .eq("user_id", userId)
      .single()

    expect(token).toBeDefined()

    const response = await fetch(`http://localhost:3000/api/auth/verify-email?token=${token.token}`)

    expect(response.ok).toBe(true)
  })

  it("should login with verified account", async () => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        deviceFingerprint: "test-device",
      }),
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.session).toBeDefined()
  })

  it("should setup MFA", async () => {
    // Login first to get session
    const loginResponse = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        deviceFingerprint: "test-device",
      }),
    })

    const { session } = await loginResponse.json()

    const mfaResponse = await fetch("http://localhost:3000/api/auth/mfa/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        method: "totp",
      }),
    })

    expect(mfaResponse.ok).toBe(true)
    const mfaData = await mfaResponse.json()
    expect(mfaData.secret).toBeDefined()
    expect(mfaData.qrCode).toBeDefined()
  })

  it("should handle password reset flow", async () => {
    const resetResponse = await fetch("http://localhost:3000/api/auth/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    })

    expect(resetResponse.ok).toBe(true)

    // Get reset token from database
    const supabase = await createServerClient()
    const { data: token } = await supabase.from("password_reset_tokens").select("token").eq("user_id", userId).single()

    expect(token).toBeDefined()

    const confirmResponse = await fetch("http://localhost:3000/api/auth/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token.token,
        newPassword: "NewSecurePass123!",
      }),
    })

    expect(confirmResponse.ok).toBe(true)
  })
})
