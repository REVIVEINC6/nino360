"use server"

import { hasPermission } from "./server"
import type { Permission } from "./permissions"

/**
 * Check if the current user has a specific permission
 * This is an alias for hasPermission from lib/rbac/server
 */
export async function checkPermission(permission: Permission): Promise<boolean> {
  return hasPermission(permission)
}
