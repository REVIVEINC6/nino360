"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Permission, Role } from "@/lib/rbac/permissions"
import { useHasPermission, useHasAnyPermission, useHasRole, useHasAnyRole } from "@/lib/rbac/hooks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProtectedRouteProps {
  children: React.ReactNode
  permission?: Permission
  anyPermission?: Permission[]
  role?: Role
  anyRole?: Role[]
  redirectTo?: string
}

/**
 * Component to protect routes based on permissions or roles
 */
export function ProtectedRoute({
  children,
  permission,
  anyPermission,
  role,
  anyRole,
  redirectTo = "/dashboard",
}: ProtectedRouteProps) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  const { hasPermission: hasSinglePerm, loading: loadingPerm } = useHasPermission(permission!)
  const { hasPermission: hasAnyPerm, loading: loadingAnyPerm } = useHasAnyPermission(anyPermission || [])
  const { hasRole: hasSingleRole, loading: loadingRole } = useHasRole(role!)
  const { hasRole: hasAnyRoleCheck, loading: loadingAnyRole } = useHasAnyRole(anyRole || [])

  const loading = loadingPerm || loadingAnyPerm || loadingRole || loadingAnyRole

  useEffect(() => {
    if (!loading) {
      setChecked(true)
    }
  }, [loading])

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  let allowed = false

  if (permission && hasSinglePerm) allowed = true
  if (anyPermission && hasAnyPerm) allowed = true
  if (role && hasSingleRole) allowed = true
  if (anyRole && hasAnyRoleCheck) allowed = true

  if (!allowed) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="mt-2">You don't have permission to access this page.</AlertDescription>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => router.push(redirectTo)}>
            Go to Dashboard
          </Button>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
