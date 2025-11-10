import { vi, expect } from "vitest"
import { createServerClient } from "@/lib/supabase/server"

/**
 * Test Database Helpers
 */
export class TestDatabase {
  static async cleanupTestData(userId?: string) {
    try {
      const supabase = await createServerClient()

      if (userId) {
        // Clean up specific user data
        await supabase.from("user_sessions").delete().eq("user_id", userId)
        await supabase.from("user_mfa_methods").delete().eq("user_id", userId)
        await supabase.from("user_devices").delete().eq("user_id", userId)
        await supabase.from("password_reset_tokens").delete().eq("user_id", userId)
        await supabase.from("user_profiles").delete().eq("id", userId)
        await supabase.auth.admin.deleteUser(userId)
      }
    } catch (error) {
      console.warn("[v0] Test cleanup warning:", error)
    }
  }

  static async createTestTenant(data?: Partial<any>) {
    const supabase = await createServerClient()
    const { data: tenant, error } = await supabase
      .from("tenants")
      .insert({
        name: data?.name || "Test Tenant",
        slug: data?.slug || `test-tenant-${Date.now()}`,
        settings: data?.settings || {},
        ...data,
      })
      .select()
      .single()

    if (error) throw error
    return tenant
  }

  static async createTestUser(data?: Partial<any>) {
    const supabase = await createServerClient()
    const email = data?.email || `test-${Date.now()}@example.com`
    const password = data?.password || "TestPassword123!"

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) throw authError

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        tenant_id: data?.tenant_id || null,
        first_name: data?.first_name || "Test",
        last_name: data?.last_name || "User",
        role: data?.role || "user",
      })
      .select()
      .single()

    if (profileError) throw profileError

    return {
      user: authData.user,
      profile,
      email,
      password,
    }
  }
}

/**
 * Mock Request Helpers
 */
export class MockRequest {
  static create(options: {
    method?: string
    body?: any
    headers?: Record<string, string>
    cookies?: Record<string, string>
  }): Request {
    const { method = "POST", body, headers = {}, cookies = {} } = options

    const defaultHeaders = {
      "content-type": "application/json",
      "x-forwarded-for": "127.0.0.1",
      "user-agent": "Test Agent",
      ...headers,
    }

    // Add cookies to headers
    if (Object.keys(cookies).length > 0) {
      defaultHeaders["cookie"] = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join("; ")
    }

    return new Request("http://localhost:3000/api/test", {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    }) as any
  }
}

/**
 * Response Helpers
 */
export class ResponseHelpers {
  static async parseJSON(response: Response) {
    return await response.json()
  }

  static expectSuccess(data: any) {
    expect(data.success).toBe(true)
    expect(data.error).toBeUndefined()
  }

  static expectError(data: any, message?: string) {
    expect(data.error).toBeDefined()
    if (message) {
      expect(data.error).toContain(message)
    }
  }
}

/**
 * Auth Helpers
 */
export class AuthHelpers {
  static async createAuthenticatedSession(userId: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("user_sessions")
      .insert({
        user_id: userId,
        session_token: `test-token-${Date.now()}`,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        device_fingerprint: "test-device",
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async cleanupSessions(userId: string) {
    const supabase = await createServerClient()
    await supabase.from("user_sessions").delete().eq("user_id", userId)
  }
}

/**
 * Rate Limiter Mock
 */
export function mockRateLimiter(allowed = true) {
  vi.mock("@/lib/auth/security/rate-limiter", () => ({
    RateLimiterService: {
      checkRateLimit: vi.fn().mockResolvedValue({ allowed }),
    },
  }))
}

/**
 * Audit Logger Mock
 */
export function mockAuditLogger() {
  vi.mock("@/lib/auth/security/audit-logger", () => ({
    auditLog: vi.fn().mockResolvedValue(undefined),
  }))
}
