"use client"

import type { ReactNode } from "react"
import type { Permission, Role } from "@/lib/rbac/permissions"
import { useHasPermission, useHasAnyPermission, useHasRole, useHasAnyRole } from "@/lib/rbac/hooks"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProtectedActionProps {
  children: ReactNode
  permission?: Permission
  anyPermission?: Permission[]
  role?: Role
  anyRole?: Role[]
  disabledMessage?: string
}

/**
 * Component to disable actions based on permissions or roles
 */
export function ProtectedAction({
  children,
  permission,
  anyPermission,
  role,
  anyRole,
  disabledMessage = "You do not have permission to perform this action",
}: ProtectedActionProps) {
  const { hasPermission: hasSinglePerm } = useHasPermission(permission!)
  const { hasPermission: hasAnyPerm } = useHasAnyPermission(anyPermission || [])
  const { hasRole: hasSingleRole } = useHasRole(role!)
  const { hasRole: hasAnyRoleCheck } = useHasAnyRole(anyRole || [])

  let allowed = false

  if (permission && hasSinglePerm) allowed = true
  if (anyPermission && hasAnyPerm) allowed = true
  if (role && hasSingleRole) allowed = true
  if (anyRole && hasAnyRoleCheck) allowed = true

  if (!allowed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="opacity-50 cursor-not-allowed">{children}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{disabledMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return <>{children}</>
}
