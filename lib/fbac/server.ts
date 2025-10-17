"use server"

import { createServerClient } from "@/lib/supabase/server"

export type MaskType = "full" | "partial" | "hash" | null

export interface FieldAccess {
  canRead: boolean
  canWrite: boolean
  maskType: MaskType
}

/**
 * Check if user can access a specific field
 */
export async function canAccessField(
  tableName: string,
  fieldName: string,
  accessType: "read" | "write",
): Promise<boolean> {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  // Get tenant_id from JWT claims
  const tenantId = user.user_metadata?.tenant_id

  if (!tenantId) return false

  const { data } = await supabase.rpc("can_access_field", {
    _user_id: user.id,
    _tenant_id: tenantId,
    _table_name: tableName,
    _field_name: fieldName,
    _access_type: accessType,
  })

  return data || false
}

/**
 * Get field mask type for a specific field
 */
export async function getFieldMaskType(tableName: string, fieldName: string): Promise<MaskType> {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return "full"

  // Get tenant_id from JWT claims
  const tenantId = user.user_metadata?.tenant_id

  if (!tenantId) return "full"

  const { data } = await supabase.rpc("get_field_mask_type", {
    _user_id: user.id,
    _tenant_id: tenantId,
    _table_name: tableName,
    _field_name: fieldName,
  })

  return data as MaskType
}

/**
 * Get field access information
 */
export async function getFieldAccess(tableName: string, fieldName: string): Promise<FieldAccess> {
  const [canRead, canWrite, maskType] = await Promise.all([
    canAccessField(tableName, fieldName, "read"),
    canAccessField(tableName, fieldName, "write"),
    getFieldMaskType(tableName, fieldName),
  ])

  return { canRead, canWrite, maskType }
}

/**
 * Mask a field value based on mask type
 */
export async function maskFieldValue(value: any, maskType: MaskType): Promise<any> {
  if (!maskType || maskType === null) return value

  if (value === null || value === undefined) return value

  const strValue = String(value)

  switch (maskType) {
    case "full":
      return "***"
    case "partial":
      if (strValue.length <= 4) return "***"
      return strValue.slice(0, 2) + "***" + strValue.slice(-2)
    case "hash":
      return "####"
    default:
      return value
  }
}

/**
 * Filter object fields based on user permissions
 */
export async function filterFields<T extends Record<string, any>>(tableName: string, data: T): Promise<Partial<T>> {
  const filtered: Partial<T> = {}

  for (const [key, value] of Object.entries(data)) {
    const access = await getFieldAccess(tableName, key)

    if (access.canRead) {
      filtered[key as keyof T] = access.maskType ? await maskFieldValue(value, access.maskType) : value
    }
  }

  return filtered
}
