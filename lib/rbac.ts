export type Role = 'master_admin' | 'super_admin' | 'admin' | 'manager' | 'user'

export function canPerform(role: Role | string | undefined, action: string) {
  if (!role) return false
  const map: Record<string, Role[]> = {
    clear_cache: ['master_admin','super_admin','admin'],
    reindex: ['master_admin','super_admin','admin'],
    recompute_ai: ['master_admin','super_admin','admin','manager'],
  }
  const allowed = map[action] || []
  return allowed.includes(role as Role)
}
