import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Create a FLAC provider compatible with applyFieldPermissions
 * This centralizes the RPC call and applies a safe dev fallback.
 */
export function createFlacProvider(supabase: SupabaseClient) {
  return {
    async getUserFieldPermissions(userId: string, tenantId: string, resource: string) {
      try {
        const { data } = await supabase.rpc('get_user_field_permissions', {
          _user_id: userId,
          _tenant_id: tenantId,
          _resource: resource,
        })

        return (data || []).map((p: any) => ({ field_name: p.field_name, permission: p.permission }))
      } catch (e) {
        // In development, return permissive fallback to avoid breaking local setups
        if (process.env.NODE_ENV !== 'production') return []
        throw e
      }
    },
  }
}

export type FlacProvider = ReturnType<typeof createFlacProvider>
