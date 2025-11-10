import { createServerClient } from "@/lib/supabase/server"
import { auditLog } from "../security/audit-logger"
import type { MaskType } from "@/lib/fbac/server"

export interface FieldPolicy {
  id: string
  tenant_id: string
  table_name: string
  field_name: string
  role_id: string
  can_read: boolean
  can_write: boolean
  mask_type: MaskType
  condition?: Record<string, any>
}

export interface DataClassification {
  level: "public" | "internal" | "confidential" | "restricted"
  categories: string[]
  retention_period?: number
  encryption_required: boolean
}

/**
 * Enhanced Field-Level Access Control Service
 */
export class FLACEnhancedService {
  /**
   * Create field-level policy
   */
  static async createFieldPolicy(
    tenantId: string,
    policy: {
      table_name: string
      field_name: string
      role_id: string
      can_read: boolean
      can_write: boolean
      mask_type?: MaskType
      condition?: Record<string, any>
    },
  ): Promise<FieldPolicy> {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase
      .from("field_level_policies")
      .insert({
        tenant_id: tenantId,
        ...policy,
      })
      .select()
      .single()

    if (error) throw error

    await auditLog({
      // auditLog expects camelCase keys; older call-sites used snake_case. Normalize here.
      userId: user.id,
      tenantId: tenantId,
      action: "field_policy.create",
      resourceType: "field_policy",
      resourceId: data.id,
      metadata: { policy },
    })

    return data
  }

  /**
   * Get field access with context evaluation
   */
  static async getFieldAccessWithContext(
    userId: string,
    tenantId: string,
    tableName: string,
    fieldName: string,
    context?: Record<string, any>,
  ): Promise<{ canRead: boolean; canWrite: boolean; maskType: MaskType }> {
    const supabase = await createServerClient()

    const { data } = await supabase.rpc("evaluate_field_access", {
      _user_id: userId,
      _tenant_id: tenantId,
      _table_name: tableName,
      _field_name: fieldName,
      _context: context || {},
    })

    return data || { canRead: false, canWrite: false, maskType: "full" }
  }

  /**
   * Classify data field
   */
  static async classifyField(
    tenantId: string,
    tableName: string,
    fieldName: string,
    classification: DataClassification,
  ): Promise<void> {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase.from("data_classifications").upsert({
      tenant_id: tenantId,
      table_name: tableName,
      field_name: fieldName,
      ...classification,
    })

    if (error) throw error

    await auditLog({
      userId: user.id,
      tenantId: tenantId,
      action: "data.classify",
      resourceType: "data_classification",
      resourceId: `${tableName}.${fieldName}`,
      metadata: { classification },
    })
  }

  /**
   * Mask sensitive data based on policy
   */
  static maskValue(value: any, maskType: MaskType): any {
    if (!maskType || maskType === null || value === null || value === undefined) {
      return value
    }

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
   * Filter object fields based on FLAC policies
   */
  static async filterObject<T extends Record<string, any>>(
    userId: string,
    tenantId: string,
    tableName: string,
    data: T,
    context?: Record<string, any>,
  ): Promise<Partial<T>> {
    const filtered: Partial<T> = {}

    for (const [key, value] of Object.entries(data)) {
      const access = await this.getFieldAccessWithContext(userId, tenantId, tableName, key, context)

      if (access.canRead) {
        filtered[key as keyof T] = access.maskType ? this.maskValue(value, access.maskType) : value
      }
    }

    return filtered
  }

  /**
   * Bulk filter array of objects
   */
  static async filterArray<T extends Record<string, any>>(
    userId: string,
    tenantId: string,
    tableName: string,
    data: T[],
    context?: Record<string, any>,
  ): Promise<Partial<T>[]> {
    return Promise.all(data.map((item) => this.filterObject(userId, tenantId, tableName, item, context)))
  }

  /**
   * Get data classification for field
   */
  static async getFieldClassification(
    tenantId: string,
    tableName: string,
    fieldName: string,
  ): Promise<DataClassification | null> {
    const supabase = await createServerClient()

    const { data } = await supabase
      .from("data_classifications")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("table_name", tableName)
      .eq("field_name", fieldName)
      .single()

    return data
  }
}
