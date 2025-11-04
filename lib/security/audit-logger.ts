import { createClient } from "@/lib/supabase/server"

// Allow any string action to avoid tight literal mismatches across the codebase.
// Individual callers should use stable literals; widen here to reduce cascading errors.
export type AuditAction = string

export interface AuditLogEntry {
  tenant_id: string
  user_id: string
  action: AuditAction
  resource_type: string
  resource_id?: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
}

/**
 * Audit logging service for compliance and security
 */
export const auditLogger = {
  /**
   * Log an audit event
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      const supabase = await createClient()

      await supabase.from("audit_logs").insert({
        tenant_id: entry.tenant_id,
        user_id: entry.user_id,
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id,
        details: entry.details,
      })
    } catch (error) {
      console.error("[Audit] Log error:", error)
      // Don't throw - audit logging should not break the main flow
    }
  },

  /**
   * Log a create action
   */
  async logCreate(
    tenantId: string,
    userId: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      tenant_id: tenantId,
      user_id: userId,
      action: "create",
      resource_type: resourceType,
      resource_id: resourceId,
      details,
    })
  },

  /**
   * Log an update action
   */
  async logUpdate(
    tenantId: string,
    userId: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      tenant_id: tenantId,
      user_id: userId,
      action: "update",
      resource_type: resourceType,
      resource_id: resourceId,
      details,
    })
  },

  /**
   * Log a delete action
   */
  async logDelete(
    tenantId: string,
    userId: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      tenant_id: tenantId,
      user_id: userId,
      action: "delete",
      resource_type: resourceType,
      resource_id: resourceId,
      details,
    })
  },

  /**
   * Log an export action
   */
  async logExport(
    tenantId: string,
    userId: string,
    resourceType: string,
    details?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      tenant_id: tenantId,
      user_id: userId,
      action: "export",
      resource_type: resourceType,
      details,
    })
  },
}

/**
 * Audit decorator for server actions
 */
export function withAudit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    action: AuditAction
    resourceType: string
    getResourceId?: (...args: Parameters<T>) => string | undefined
    getDetails?: (...args: Parameters<T>) => Record<string, any> | undefined
  },
): T {
  return (async (...args: Parameters<T>) => {
    const result = await fn(...args)

    // Log after successful execution
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await auditLogger.log({
          tenant_id: user.user_metadata.tenant_id,
          user_id: user.id,
          action: options.action,
          resource_type: options.resourceType,
          resource_id: options.getResourceId?.(...args),
          details: options.getDetails?.(...args),
        })
      }
    } catch (error) {
      console.error("[Audit] Decorator error:", error)
    }

    return result
  }) as T
}
