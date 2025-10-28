import { createServerClient } from "@/lib/supabase/server"
import { auditLog } from "../security/audit-logger"
import type { Permission } from "@/lib/rbac/permissions"

export interface RoleDefinition {
  id: string
  tenant_id: string
  key: string
  label: string
  description: string
  permissions: string[]
  is_system: boolean
  priority: number
  created_at: string
  updated_at: string
}

export interface DynamicPolicy {
  id: string
  tenant_id: string
  name: string
  description: string
  condition: Record<string, any>
  permissions: string[]
  enabled: boolean
  priority: number
}

export interface AccessRecommendation {
  permission: string
  confidence: number
  reason: string
  similar_users: string[]
  usage_pattern: string
}

/**
 * Enhanced RBAC Service with AI recommendations and dynamic policies
 */
export class RBACEnhancedService {
  /**
   * Get user's effective permissions including dynamic policies
   */
  static async getEffectivePermissions(userId: string, tenantId: string): Promise<string[]> {
    const supabase = await createServerClient()

    // Get base permissions from roles
    const { data: basePermissions } = await supabase.rpc("get_user_permissions", {
      _user_id: userId,
      _tenant_id: tenantId,
    })

    // Get dynamic policy permissions
    const { data: dynamicPermissions } = await supabase.rpc("evaluate_dynamic_policies", {
      _user_id: userId,
      _tenant_id: tenantId,
    })

    const allPermissions = new Set([
      ...(basePermissions?.map((p: any) => p.permission_key) || []),
      ...(dynamicPermissions || []),
    ])

    return Array.from(allPermissions)
  }

  /**
   * Create a new role with permissions
   */
  static async createRole(
    tenantId: string,
    roleData: {
      key: string
      label: string
      description: string
      permissions: string[]
      priority?: number
    },
  ): Promise<RoleDefinition> {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase
      .from("roles")
      .insert({
        tenant_id: tenantId,
        key: roleData.key,
        label: roleData.label,
        description: roleData.description,
        is_system: false,
        priority: roleData.priority || 100,
      })
      .select()
      .single()

    if (error) throw error

    // Assign permissions to role
    if (roleData.permissions.length > 0) {
      await this.assignPermissionsToRole(data.id, roleData.permissions)
    }

    await auditLog({
      user_id: user.id,
      tenant_id: tenantId,
      action: "role.create",
      resource_type: "role",
      resource_id: data.id,
      details: { role: roleData },
    })

    return data
  }

  /**
   * Assign permissions to a role
   */
  static async assignPermissionsToRole(roleId: string, permissions: string[]): Promise<void> {
    const supabase = await createServerClient()

    const rolePermissions = permissions.map((permission) => ({
      role_id: roleId,
      permission_key: permission,
    }))

    const { error } = await supabase.from("role_permissions").insert(rolePermissions)

    if (error) throw error
  }

  /**
   * Assign role to user
   */
  static async assignRoleToUser(userId: string, tenantId: string, roleId: string): Promise<void> {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      tenant_id: tenantId,
      role_id: roleId,
    })

    if (error) throw error

    await auditLog({
      user_id: user.id,
      tenant_id: tenantId,
      action: "role.assign",
      resource_type: "user_role",
      resource_id: userId,
      details: { target_user: userId, role_id: roleId },
    })
  }

  /**
   * Create dynamic policy
   */
  static async createDynamicPolicy(
    tenantId: string,
    policy: {
      name: string
      description: string
      condition: Record<string, any>
      permissions: string[]
      priority?: number
    },
  ): Promise<DynamicPolicy> {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase
      .from("dynamic_policies")
      .insert({
        tenant_id: tenantId,
        name: policy.name,
        description: policy.description,
        condition: policy.condition,
        permissions: policy.permissions,
        enabled: true,
        priority: policy.priority || 100,
      })
      .select()
      .single()

    if (error) throw error

    await auditLog({
      user_id: user.id,
      tenant_id: tenantId,
      action: "policy.create",
      resource_type: "dynamic_policy",
      resource_id: data.id,
      details: { policy },
    })

    return data
  }

  /**
   * Get AI-powered access recommendations for a user
   */
  static async getAccessRecommendations(userId: string, tenantId: string): Promise<AccessRecommendation[]> {
    const supabase = await createServerClient()

    // Get user's current permissions
    const currentPermissions = await this.getEffectivePermissions(userId, tenantId)

    // Get user's role and department
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("role, department, job_title")
      .eq("user_id", userId)
      .eq("tenant_id", tenantId)
      .single()

    if (!userProfile) return []

    // Find similar users
    const { data: similarUsers } = await supabase
      .from("user_profiles")
      .select("user_id, role, department")
      .eq("tenant_id", tenantId)
      .or(`role.eq.${userProfile.role},department.eq.${userProfile.department}`)
      .neq("user_id", userId)
      .limit(10)

    if (!similarUsers || similarUsers.length === 0) return []

    // Get permissions of similar users
    const similarUserPermissions = await Promise.all(
      similarUsers.map((u) => this.getEffectivePermissions(u.user_id, tenantId)),
    )

    // Find common permissions that current user doesn't have
    const permissionCounts = new Map<string, number>()
    similarUserPermissions.forEach((perms) => {
      perms.forEach((perm) => {
        if (!currentPermissions.includes(perm)) {
          permissionCounts.set(perm, (permissionCounts.get(perm) || 0) + 1)
        }
      })
    })

    // Generate recommendations
    const recommendations: AccessRecommendation[] = []
    for (const [permission, count] of permissionCounts.entries()) {
      const confidence = count / similarUsers.length
      if (confidence >= 0.3) {
        // At least 30% of similar users have this permission
        recommendations.push({
          permission,
          confidence,
          reason: `${Math.round(confidence * 100)}% of users with similar role/department have this permission`,
          similar_users: similarUsers.slice(0, 3).map((u) => u.user_id),
          usage_pattern: "common_in_role",
        })
      }
    }

    // Sort by confidence
    recommendations.sort((a, b) => b.confidence - a.confidence)

    return recommendations.slice(0, 10) // Top 10 recommendations
  }

  /**
   * Check if user has permission with dynamic policy evaluation
   */
  static async hasPermission(userId: string, tenantId: string, permission: Permission): Promise<boolean> {
    const permissions = await this.getEffectivePermissions(userId, tenantId)
    return permissions.includes(permission)
  }

  /**
   * Bulk permission check
   */
  static async hasPermissions(
    userId: string,
    tenantId: string,
    permissions: Permission[],
  ): Promise<Record<Permission, boolean>> {
    const userPermissions = await this.getEffectivePermissions(userId, tenantId)

    const result: Record<string, boolean> = {}
    permissions.forEach((perm) => {
      result[perm] = userPermissions.includes(perm)
    })

    return result as Record<Permission, boolean>
  }

  /**
   * Get permission usage analytics
   */
  static async getPermissionAnalytics(tenantId: string): Promise<any> {
    const supabase = await createServerClient()

    const { data } = await supabase
      .from("permission_usage_logs")
      .select("permission_key, count")
      .eq("tenant_id", tenantId)
      .order("count", { ascending: false })
      .limit(50)

    return data
  }
}
