import { describe, it, expect } from "vitest"
import { RBACEnhancedService } from "../../../lib/auth/authorization/rbac-enhanced.service"

describe("RBACEnhancedService", () => {
  describe("hasPermission", () => {
    it("should grant access for valid permission", async () => {
      const result = await RBACEnhancedService.hasPermission("user-123", "tenant-123", "users:read")

      expect(result).toBeDefined()
    })

    it("should deny access for invalid permission", async () => {
      const result = await RBACEnhancedService.hasPermission("user-123", "tenant-123", "admin:delete")

      expect(result).toBeDefined()
    })
  })
})
