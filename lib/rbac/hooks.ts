"use client"

import { useEffect, useState } from "react"
import type { Permission, Role } from "./permissions"
import { getUserPermissions, type UserPermissions } from "./server"

/**
 * Hook to get user permissions
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions>({
    permissions: [],
    roles: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserPermissions()
      .then(setPermissions)
      .finally(() => setLoading(false))
  }, [])

  return { ...permissions, loading }
}

/**
 * Hook to check if user has a specific permission
 */
export function useHasPermission(permission: Permission) {
  const { permissions, loading } = usePermissions()
  return {
    hasPermission: permissions.includes(permission),
    loading,
  }
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useHasAnyPermission(perms: Permission[]) {
  const { permissions, loading } = usePermissions()
  return {
    hasPermission: perms.some((p) => permissions.includes(p)),
    loading,
  }
}

/**
 * Hook to check if user has all of the specified permissions
 */
export function useHasAllPermissions(perms: Permission[]) {
  const { permissions, loading } = usePermissions()
  return {
    hasPermission: perms.every((p) => permissions.includes(p)),
    loading,
  }
}

/**
 * Hook to check if user has a specific role
 */
export function useHasRole(role: Role) {
  const { roles, loading } = usePermissions()
  return {
    hasRole: roles.some((r) => r.key === role),
    loading,
  }
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useHasAnyRole(roleList: Role[]) {
  const { roles, loading } = usePermissions()
  return {
    hasRole: roleList.some((r) => roles.some((ur) => ur.key === r)),
    loading,
  }
}
