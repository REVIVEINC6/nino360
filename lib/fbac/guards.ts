"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

/**
 * Check if a feature is enabled for a tenant
 */
export async function hasFeature(tenantId: string, featureKey: string): Promise<boolean> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("feature_flags")
    .select("enabled")
    .eq("tenant_id", tenantId)
    .eq("key", featureKey)
    .single()

  return data?.enabled || false
}

/**
 * Check if tenant has any of the specified features
 */
export async function hasAnyFeature(tenantId: string, featureKeys: string[]): Promise<boolean> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("feature_flags")
    .select("key, enabled")
    .eq("tenant_id", tenantId)
    .in("key", featureKeys)

  if (!data || data.length === 0) return false

  return data.some((f) => f.enabled)
}

/**
 * Require tenant to have a specific feature, redirect if not
 */
export async function requireFeature(tenantId: string, featureKey: string, redirectTo = "/dashboard") {
  const hasRequiredFeature = await hasFeature(tenantId, featureKey)

  if (!hasRequiredFeature) {
    redirect(redirectTo)
  }
}

/**
 * Require tenant to have any of the specified features, redirect if not
 */
export async function requireAnyFeature(tenantId: string, featureKeys: string[], redirectTo = "/dashboard") {
  const hasRequiredFeature = await hasAnyFeature(tenantId, featureKeys)

  if (!hasRequiredFeature) {
    redirect(redirectTo)
  }
}

/**
 * Get all enabled features for a tenant
 */
export async function getEnabledFeatures(tenantId: string): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await supabase.from("feature_flags").select("key").eq("tenant_id", tenantId).eq("enabled", true)

  return data?.map((f) => f.key) || []
}

/**
 * Check if tenant has reached a usage limit
 */
export async function checkLimit(tenantId: string, limitKey: string, currentUsage: number): Promise<boolean> {
  const supabase = await createClient()

  // Get plan limits from subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan:plans(limits)")
    .eq("tenant_id", tenantId)
    .single()

  if (!subscription?.plan?.limits) return true // No limits defined, allow

  const limits = subscription.plan.limits as Record<string, number>
  const limit = limits[limitKey]

  if (limit === undefined || limit === -1) return true // No limit or unlimited

  return currentUsage < limit
}

/**
 * Get usage limit for a specific resource
 */
export async function getLimit(tenantId: string, limitKey: string): Promise<number> {
  const supabase = await createClient()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan:plans(limits)")
    .eq("tenant_id", tenantId)
    .single()

  if (!subscription?.plan?.limits) return -1 // Unlimited

  const limits = subscription.plan.limits as Record<string, number>
  return limits[limitKey] ?? -1
}
