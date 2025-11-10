import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { RegistrationService } from "../../lib/auth/services/registration.service"
import { createServerClient } from "../../lib/supabase/server"

vi.mock("@/lib/supabase/server")
vi.mock("@/lib/auth/security/rate-limiter")
vi.mock("@/lib/auth/security/audit-logger")

describe("RegistrationService", () => {
  // The service is exported as an object with functions (no constructor)
  const registrationService = RegistrationService
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        signUp: vi.fn(),
      },
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    }

  vi.mocked(createServerClient).mockResolvedValue(mockSupabase)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("register", () => {
    it("should successfully register a new user", async () => {
      const userData = {
        email: "test@example.com",
        password: "SecurePass123!",
        firstName: "Test",
        lastName: "User",
        tenantId: "tenant-123",
      }

      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: { id: "user-123", email: userData.email },
          session: null,
        },
        error: null,
      })

      const result = await registrationService.registerUser(userData)

      expect(result.success).toBe(true)
      expect(result.userId).toBeDefined()
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        options: expect.objectContaining({
          data: expect.objectContaining({
            first_name: userData.firstName,
            last_name: userData.lastName,
            tenant_id: userData.tenantId,
          }),
        }),
      })
    })

    it("should reject weak passwords", async () => {
      const userData = {
        email: "test@example.com",
        password: "weak",
        firstName: "Test",
        lastName: "User",
        tenantId: "tenant-123",
      }

      await expect(registrationService.registerUser(userData)).rejects.toThrow()
    })

    it("should handle duplicate email registration", async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: "User already registered" },
      })

      const userData = {
        email: "existing@example.com",
        password: "SecurePass123!",
        firstName: "Test",
        lastName: "User",
        tenantId: "tenant-123",
      }

      await expect(registrationService.registerUser(userData)).rejects.toThrow()
    })
  })

  describe("verifyEmail", () => {
    it("should verify email with valid token", async () => {
      const token = "valid-token-123"

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { user_id: "user-123", expires_at: new Date(Date.now() + 3600000).toISOString() },
          error: null,
        }),
      })

      const result = await registrationService.verifyEmail(token)

      expect(result.success).toBe(true)
    })

    it("should reject expired verification token", async () => {
      const token = "expired-token-123"

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { user_id: "user-123", expires_at: new Date(Date.now() - 3600000).toISOString() },
          error: null,
        }),
      })

      await expect(registrationService.verifyEmail(token)).rejects.toThrow()
    })
  })
})
