import "server-only"
import { createServerClient } from "@/lib/supabase/server"

export type FeatureFlag = string

/**
 * Check if a feature flag is enabled for the current tenant
 */
export async function hasFeature(flag: FeatureFlag): Promise<boolean> {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("feature_flags").select("enabled").eq("key", flag).maybeSingle()

  if (error || !data) return false
  return data.enabled === true
}

/**
 * Check multiple feature flags at once
 */
export async function hasFeatures(flags: FeatureFlag[]): Promise<Record<string, boolean>> {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("feature_flags").select("key, enabled").in("key", flags)

  if (error || !data) {
    return Object.fromEntries(flags.map((f) => [f, false]))
  }

  const result: Record<string, boolean> = {}
  for (const flag of flags) {
    const found = data.find((d) => d.key === flag)
    result[flag] = found?.enabled === true
  }
  return result
}

/**
 * Mask sensitive fields based on FBAC permissions
 */
export function maskFields<T extends Record<string, any>>(
  data: T,
  permissions: Record<string, boolean>,
  fieldMap: Record<string, string>, // field -> required permission
): T {
  const masked = { ...data }

  for (const [field, requiredPermission] of Object.entries(fieldMap)) {
    if (!permissions[requiredPermission] && field in masked) {
      masked[field] = "[REDACTED]"
    }
  }

  return masked
}

/**
 * Mask array of objects
 */
export function maskFieldsArray<T extends Record<string, any>>(
  data: T[],
  permissions: Record<string, boolean>,
  fieldMap: Record<string, string>,
): T[] {
  return data.map((item) => maskFields(item, permissions, fieldMap))
}
