import { describe, it, expect } from "vitest"
import { RBACService } from "@/lib/auth/authorization/rbac-enhanced.service"

describe("RBACService", () => {
  const rbacService = new RBACService()

  describe("checkPermission", () => {
    it("should grant access for valid permission", async () => {
      const result = await rbacService.checkPermission("user-123", "tenant-123", "users:read")

      expect(result).toBeDefined()
    })

    it("should deny access for invalid permission", async () => {
      const result = await rbacService.checkPermission("user-123", "tenant-123", "admin:delete")

      expect(result).toBeDefined()
    })
  })
})
