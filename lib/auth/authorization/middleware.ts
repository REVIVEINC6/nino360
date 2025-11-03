import { type NextRequest, NextResponse } from "next/server"
import type { Permission } from "@/lib/rbac/permissions"

export interface AuthorizationContext {
  userId: string
  tenantId: string
  permissions: string[]
  roles: string[]
  ipAddress?: string
  userAgent?: string
  location?: string
  deviceId?: string
}

/**
 * Authorization middleware for API routes
 * Simplified version for edge runtime compatibility
 */
export async function withAuthorization(
  request: NextRequest,
  requiredPermissions: Permission[],
  options?: {
    requireAll?: boolean
  },
): Promise<NextResponse | null> {
  try {
    // Extract user context from request
    const context = await extractAuthContext(request)

    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check permissions
    const hasAccess = options?.requireAll
      ? requiredPermissions.every((p) => context.permissions.includes(p))
      : requiredPermissions.some((p) => context.permissions.includes(p))

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden", required: requiredPermissions }, { status: 403 })
    }

    // Authorization successful
    return null
  } catch (error) {
    console.error("[v0] Authorization error:", error)
    return NextResponse.json({ error: "Authorization failed" }, { status: 500 })
  }
}

/**
 * Extract authentication context from request
 */
async function extractAuthContext(request: NextRequest): Promise<AuthorizationContext | null> {
  const userId = request.headers.get("x-user-id")
  const tenantId = request.headers.get("x-tenant-id")

  if (!userId || !tenantId) return null

  return {
    userId,
    tenantId,
    permissions: [],
    roles: [],
    ipAddress: request.headers.get("x-forwarded-for") || request.ip,
    userAgent: request.headers.get("user-agent") || undefined,
    deviceId: request.headers.get("x-device-id") || undefined,
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthorizationContext | NextResponse> {
  const context = await extractAuthContext(request)

  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return context
}

export async function requirePermissions(
  request: NextRequest,
  permissions: Permission[],
  requireAll = false,
): Promise<NextResponse | null> {
  return withAuthorization(request, permissions, { requireAll })
}
