"use client"

import type React from "react"

import type { ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import type { UserRole } from "@/lib/auth/rbac"
import type { Permission } from "@/lib/auth/rbac"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, Lock, UserX } from "lucide-react"

interface RoleBasedAccessProps {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: Permission | Permission[]
  requiredTenant?: string
  fallback?: ReactNode
  showMessage?: boolean
}

interface ConvenienceComponentProps {
  children: ReactNode
  fallback?: ReactNode
  showMessage?: boolean
}

// Main RoleBasedAccess component
export function RoleBasedAccess({
  children,
  requiredRole,
  requiredPermission,
  requiredTenant,
  fallback,
  showMessage = true,
}: RoleBasedAccessProps) {
  const { user, profile, hasPermission, canAccessTenant, loading } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Checking permissions...</span>
        </div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!user || !profile) {
    if (fallback) return <>{fallback}</>
    if (showMessage) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access this content</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => (window.location.href = "/login")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      )
    }
    return null
  }

  // Check role-based access
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(profile.role)) {
      if (fallback) return <>{fallback}</>
      if (showMessage) {
        return (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              You need {roles.join(" or ")} role to access this content.
            </AlertDescription>
          </Alert>
        )
      }
      return null
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]
    const hasRequiredPermission = permissions.some((permission) => hasPermission(permission))

    if (!hasRequiredPermission) {
      if (fallback) return <>{fallback}</>
      if (showMessage) {
        return (
          <Alert className="border-orange-200 bg-orange-50">
            <Shield className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700">
              You don't have the required permissions to access this content.
            </AlertDescription>
          </Alert>
        )
      }
      return null
    }
  }

  // Check tenant-based access
  if (requiredTenant) {
    if (!canAccessTenant(requiredTenant)) {
      if (fallback) return <>{fallback}</>
      if (showMessage) {
        return (
          <Alert className="border-purple-200 bg-purple-50">
            <UserX className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-700">
              You don't have access to this organization's content.
            </AlertDescription>
          </Alert>
        )
      }
      return null
    }
  }

  // Check if user account is active
  if (!profile.is_active) {
    if (fallback) return <>{fallback}</>
    if (showMessage) {
      return (
        <Alert className="border-gray-200 bg-gray-50">
          <UserX className="h-4 w-4 text-gray-600" />
          <AlertDescription className="text-gray-700">
            Your account is inactive. Please contact support for assistance.
          </AlertDescription>
        </Alert>
      )
    }
    return null
  }

  // All checks passed, render children
  return <>{children}</>
}

// Convenience components for common role checks
export function AdminOnly({ children, fallback, showMessage = true }: ConvenienceComponentProps) {
  return (
    <RoleBasedAccess
      requiredRole={["master_admin", "super_admin", "admin"]}
      fallback={fallback}
      showMessage={showMessage}
    >
      {children}
    </RoleBasedAccess>
  )
}

export function SuperAdminOnly({ children, fallback, showMessage = true }: ConvenienceComponentProps) {
  return (
    <RoleBasedAccess requiredRole={["master_admin", "super_admin"]} fallback={fallback} showMessage={showMessage}>
      {children}
    </RoleBasedAccess>
  )
}

export function MasterAdminOnly({ children, fallback, showMessage = true }: ConvenienceComponentProps) {
  return (
    <RoleBasedAccess requiredRole="master_admin" fallback={fallback} showMessage={showMessage}>
      {children}
    </RoleBasedAccess>
  )
}

export function ManagerOnly({ children, fallback, showMessage = true }: ConvenienceComponentProps) {
  return (
    <RoleBasedAccess
      requiredRole={["master_admin", "super_admin", "admin", "recruitment_manager", "hr_manager"]}
      fallback={fallback}
      showMessage={showMessage}
    >
      {children}
    </RoleBasedAccess>
  )
}

export function EmployeeOrAbove({ children, fallback, showMessage = true }: ConvenienceComponentProps) {
  return (
    <RoleBasedAccess
      requiredRole={[
        "master_admin",
        "super_admin",
        "admin",
        "recruitment_manager",
        "hr_manager",
        "business_development_manager",
        "account_manager",
        "recruiter",
        "hr_specialist",
        "employee",
      ]}
      fallback={fallback}
      showMessage={showMessage}
    >
      {children}
    </RoleBasedAccess>
  )
}

// Permission-based convenience components
export function WithPermission({
  children,
  permission,
  fallback,
  showMessage = true,
}: {
  children: ReactNode
  permission: Permission | Permission[]
  fallback?: ReactNode
  showMessage?: boolean
}) {
  return (
    <RoleBasedAccess requiredPermission={permission} fallback={fallback} showMessage={showMessage}>
      {children}
    </RoleBasedAccess>
  )
}

// Tenant-based convenience component
export function WithTenantAccess({
  children,
  tenantId,
  fallback,
  showMessage = true,
}: {
  children: ReactNode
  tenantId: string
  fallback?: ReactNode
  showMessage?: boolean
}) {
  return (
    <RoleBasedAccess requiredTenant={tenantId} fallback={fallback} showMessage={showMessage}>
      {children}
    </RoleBasedAccess>
  )
}

// Higher-order component for page-level protection
export function withRoleBasedAccess<P extends object>(
  Component: React.ComponentType<P>,
  accessConfig: Omit<RoleBasedAccessProps, "children">,
) {
  return function ProtectedComponent(props: P) {
    return (
      <RoleBasedAccess {...accessConfig}>
        <Component {...props} />
      </RoleBasedAccess>
    )
  }
}
