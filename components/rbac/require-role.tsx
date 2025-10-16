import type { ReactNode } from "react"
import { hasRole, hasAnyRole } from "@/lib/rbac/guards"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

interface RequireRoleProps {
  tenantId: string
  role?: string
  anyOf?: string[]
  children: ReactNode
  fallback?: ReactNode
}

export async function RequireRole({ tenantId, role, anyOf, children, fallback }: RequireRoleProps) {
  let hasAccess = false

  if (role) {
    hasAccess = await hasRole(tenantId, role)
  } else if (anyOf) {
    hasAccess = await hasAnyRole(tenantId, anyOf)
  }

  if (!hasAccess) {
    return (
      fallback || (
        <Alert variant="destructive" className="glass-card border-red-500">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>You don't have permission to access this resource.</AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
