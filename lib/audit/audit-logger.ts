// Shim adapter to the auth security audit logger so code importing
// `@/lib/audit/audit-logger` keeps working.
import {
  auditLog as _auditLog,
  logAuditEvent as _logAuditEvent,
  logSecurityEvent as _logSecurityEvent,
  verifyAuditLogIntegrity as _verifyAuditLogIntegrity,
} from "@/lib/auth/security/audit-logger"

export async function createAuditLog(payload: any) {
  // Legacy callers used createAuditLog; forward to auditLog implementation
  return _auditLog({
    action: payload.action,
    userId: payload.userId,
    tenantId: payload.tenantId,
    resourceType: payload.resourceType,
    resourceId: payload.resourceId,
    metadata: payload.details || payload.metadata,
    ipAddress: payload.ipAddress || null,
    success: payload.success ?? true,
  } as any)
}

export const Audit = {
  auditLog: _auditLog,
  logAuditEvent: _logAuditEvent,
  logSecurityEvent: _logSecurityEvent,
  verifyAuditLogIntegrity: _verifyAuditLogIntegrity,
}

export default Audit
