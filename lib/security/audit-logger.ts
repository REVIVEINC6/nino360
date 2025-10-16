import { createClient } from "@/lib/supabase/server"

export type AuditAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "export"
  | "import"
  | "approve"
  | "reject"

export interface AuditLogEntry {
  tenant_id: string
  user_id: string
  action: AuditAction
  resource_type: string
  resource_id?: string
  metadata?: Record<string, any>
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
        metadata: entry.metadata,
        ip_address: entry.ip_address,
        user_agent: entry.user_agent,
        created_at: new Date().toISOString(),
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
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      tenant_id: tenantId,
      user_id: userId,
      action: "create",
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
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
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      tenant_id: tenantId,
      user_id: userId,
      action: "update",
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
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
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      tenant_id: tenantId,
      user_id: userId,
      action: "delete",
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
    })
  },

  /**
   * Log an export action
   */
  async logExport(
    tenantId: string,
    userId: string,
    resourceType: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      tenant_id: tenantId,
      user_id: userId,
      action: "export",
      resource_type: resourceType,
      metadata,
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
    getMetadata?: (...args: Parameters<T>) => Record<string, any> | undefined
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
          metadata: options.getMetadata?.(...args),
        })
      }
    } catch (error) {
      console.error("[Audit] Decorator error:", error)
    }

    return result
  }) as T
}
