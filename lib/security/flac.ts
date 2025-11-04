export type Permission = 'hidden' | 'masked' | 'read' | 'write'

export interface FieldPermissionRow {
  field_name: string
  permission: Permission
}

export interface PermissionProvider {
  getUserFieldPermissions(userId: string, tenantId: string, resource: string): Promise<FieldPermissionRow[]>
}

function mostRestrictive(a: Permission, b: Permission): Permission {
  const order: Permission[] = ['hidden', 'masked', 'read', 'write']
  return order[Math.min(order.indexOf(a), order.indexOf(b))]
}

export function maskValue(value: unknown): unknown {
  if (value == null) return value
  if (typeof value === 'string') return value.length <= 2 ? '*'.repeat(value.length) : value.slice(0, 2) + '***'
  if (typeof value === 'number') return 0
  if (Array.isArray(value)) return value.map(() => '***')
  if (typeof value === 'object') return '[masked]'
  return '***'
}

export async function applyFieldPermissions(
  provider: PermissionProvider,
  userId: string,
  tenantId: string,
  resource: string,
  jsonData: Record<string, unknown>
) {
  const rows = await provider.getUserFieldPermissions(userId, tenantId, resource)
  const lookup = new Map<string, Permission>()
  for (const r of rows) {
    const prev = lookup.get(r.field_name)
    lookup.set(r.field_name, prev ? mostRestrictive(prev, r.permission) : r.permission)
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(jsonData)) {
    const perm = lookup.get(key) || 'write'
    if (perm === 'hidden') continue
    if (perm === 'masked') {
      result[key] = maskValue(value)
      continue
    }
    result[key] = value
  }
  return result
}

export async function ensureWritePermissions(
  provider: PermissionProvider,
  userId: string,
  tenantId: string,
  resource: string,
  patch: Record<string, unknown>
) {
  const rows = await provider.getUserFieldPermissions(userId, tenantId, resource)
  const lookup = new Map<string, Permission>()
  for (const r of rows) {
    const prev = lookup.get(r.field_name)
    lookup.set(r.field_name, prev ? mostRestrictive(prev, r.permission) : r.permission)
  }
  const denied: string[] = []
  for (const key of Object.keys(patch)) {
    const perm = lookup.get(key) || 'write'
    if (perm !== 'write') denied.push(key)
  }
  if (denied.length) {
    const err = new Error(`Write permission denied for fields: ${denied.join(', ')}`)
    ;(err as any).code = 'FLAC_DENIED'
    throw err
  }
}
