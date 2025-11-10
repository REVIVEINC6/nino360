import { createServerClient } from "@/lib/supabase/server"

export interface PolicyCondition {
  type: "time" | "location" | "device" | "attribute" | "custom"
  operator: "eq" | "ne" | "gt" | "lt" | "in" | "contains" | "between"
  field: string
  value: any
}

export interface Policy {
  id: string
  name: string
  description: string
  conditions: PolicyCondition[]
  permissions: string[]
  effect: "allow" | "deny"
  priority: number
}

/**
 * Policy Engine for dynamic access control
 */
export class PolicyEngine {
  /**
   * Evaluate a single condition
   */
  static evaluateCondition(condition: PolicyCondition, context: Record<string, any>): boolean {
    const fieldValue = context[condition.field]

    switch (condition.operator) {
      case "eq":
        return fieldValue === condition.value
      case "ne":
        return fieldValue !== condition.value
      case "gt":
        return fieldValue > condition.value
      case "lt":
        return fieldValue < condition.value
      case "in":
        return Array.isArray(condition.value) && condition.value.includes(fieldValue)
      case "contains":
        return String(fieldValue).includes(String(condition.value))
      case "between":
        return fieldValue >= condition.value[0] && fieldValue <= condition.value[1]
      default:
        return false
    }
  }

  /**
   * Evaluate all conditions in a policy
   */
  static evaluatePolicy(policy: Policy, context: Record<string, any>): boolean {
    // All conditions must be true (AND logic)
    return policy.conditions.every((condition) => this.evaluateCondition(condition, context))
  }

  /**
   * Get applicable policies for user
   */
  static async getApplicablePolicies(
    userId: string,
    tenantId: string,
    context: Record<string, any>,
  ): Promise<Policy[]> {
    const supabase = await createServerClient()

    const { data: policies } = await supabase
      .from("dynamic_policies")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("enabled", true)
      .order("priority", { ascending: false })

    if (!policies) return []

    // Evaluate each policy
    return policies.filter((policy) => this.evaluatePolicy(policy as Policy, context)) as Policy[]
  }

  /**
   * Get effective permissions from policies
   */
  static async getEffectivePermissionsFromPolicies(
    userId: string,
    tenantId: string,
    context: Record<string, any>,
  ): Promise<string[]> {
    const policies = await this.getApplicablePolicies(userId, tenantId, context)

    const allowedPermissions = new Set<string>()
    const deniedPermissions = new Set<string>()

    // Process policies in priority order
    for (const policy of policies) {
      if (policy.effect === "allow") {
        policy.permissions.forEach((p) => allowedPermissions.add(p))
      } else if (policy.effect === "deny") {
        policy.permissions.forEach((p) => deniedPermissions.add(p))
      }
    }

    // Deny takes precedence
    return Array.from(allowedPermissions).filter((p) => !deniedPermissions.has(p))
  }

  /**
   * Create time-based policy
   */
  static createTimeBasedPolicy(
    name: string,
    permissions: string[],
    startTime: string,
    endTime: string,
  ): Omit<Policy, "id"> {
    return {
      name,
      description: `Time-based access: ${startTime} - ${endTime}`,
      conditions: [
        {
          type: "time",
          operator: "between",
          field: "current_time",
          value: [startTime, endTime],
        },
      ],
      permissions,
      effect: "allow",
      priority: 100,
    }
  }

  /**
   * Create location-based policy
   */
  static createLocationBasedPolicy(
    name: string,
    permissions: string[],
    allowedLocations: string[],
  ): Omit<Policy, "id"> {
    return {
      name,
      description: `Location-based access: ${allowedLocations.join(", ")}`,
      conditions: [
        {
          type: "location",
          operator: "in",
          field: "user_location",
          value: allowedLocations,
        },
      ],
      permissions,
      effect: "allow",
      priority: 100,
    }
  }

  /**
   * Create attribute-based policy
   */
  static createAttributeBasedPolicy(
    name: string,
    permissions: string[],
    attribute: string,
    value: any,
  ): Omit<Policy, "id"> {
    return {
      name,
      description: `Attribute-based access: ${attribute} = ${value}`,
      conditions: [
        {
          type: "attribute",
          operator: "eq",
          field: attribute,
          value,
        },
      ],
      permissions,
      effect: "allow",
      priority: 100,
    }
  }
}
