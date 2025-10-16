"use client"

import type { ReactNode } from "react"
import type { Permission, Role } from "@/lib/rbac/permissions"
import {
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,
  useHasRole,
  useHasAnyRole,
} from "@/lib/rbac/hooks"

interface CanProps {
  children: ReactNode
  permission?: Permission
  anyPermission?: Permission[]
  allPermissions?: Permission[]
  role?: Role
  anyRole?: Role[]
  fallback?: ReactNode
}

/**
 * Component to conditionally render based on permissions or roles
 */
export function Can({ children, permission, anyPermission, allPermissions, role, anyRole, fallback = null }: CanProps) {
  const { hasPermission: hasSinglePerm, loading: loadingPerm } = useHasPermission(permission!)
  const { hasPermission: hasAnyPerm, loading: loadingAnyPerm } = useHasAnyPermission(anyPermission || [])
  const { hasPermission: hasAllPerms, loading: loadingAllPerms } = useHasAllPermissions(allPermissions || [])
  const { hasRole: hasSingleRole, loading: loadingRole } = useHasRole(role!)
  const { hasRole: hasAnyRoleCheck, loading: loadingAnyRole } = useHasAnyRole(anyRole || [])

  const loading = loadingPerm || loadingAnyPerm || loadingAllPerms || loadingRole || loadingAnyRole

  if (loading) {
    return <>{fallback}</>
  }

  let allowed = false

  if (permission && hasSinglePerm) allowed = true
  if (anyPermission && hasAnyPerm) allowed = true
  if (allPermissions && hasAllPerms) allowed = true
  if (role && hasSingleRole) allowed = true
  if (anyRole && hasAnyRoleCheck) allowed = true

  return allowed ? <>{children}</> : <>{fallback}</>
}
