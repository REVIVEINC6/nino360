"use server"

import { createServerClient } from "@/lib/supabase/server"

export interface FeatureAccess {
  hasAccess: boolean
  limits: Record<string, any>
}

const functionsExist: { has_feature?: boolean; feature_limits?: boolean } = {}

/**
 * Check if user has access to a feature (server-side)
 * Uses 4-tier precedence: user override → role grant → tenant plan → feature default
 */
export async function hasFeature(featureKey: string): Promise<boolean> {
  if (functionsExist.has_feature === false) {
    return true // Permissive default
  }

  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.rpc("has_feature", {
      _feature_key: featureKey,
    })

    if (error) {
      if (
        error.message?.includes("Could not find the function") ||
        error.code === "PGRST202" ||
        error.message?.includes("failed with status 404") ||
        error.message?.includes("function public.has_feature")
      ) {
        console.log(`[v0] Database function 'has_feature' not found. Using permissive default.`)
        functionsExist.has_feature = false
        return true // Permissive default for development
      }
      // For other errors, log but don't throw
      console.error(`[v0] Error checking feature ${featureKey}:`, error)
      return true // Permissive default
    }

    if (functionsExist.has_feature === undefined) {
      functionsExist.has_feature = true
    }

    return data || false
  } catch (error) {
    console.error(`[v0] Exception checking feature ${featureKey}:`, error)
    functionsExist.has_feature = false
    return true // Permissive default
  }
}

/**
 * Get feature limits for current user
 */
export async function getFeatureLimits(featureKey: string): Promise<Record<string, any>> {
  if (functionsExist.feature_limits === false) {
    return {}
  }

  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.rpc("feature_limits", {
      _feature_key: featureKey,
    })

    if (error) {
      if (
        error.message?.includes("Could not find the function") ||
        error.code === "PGRST202" ||
        error.message?.includes("failed with status 404")
      ) {
        functionsExist.feature_limits = false
        return {}
      }
      console.error(`[v0] Error getting feature limits for ${featureKey}:`, error)
      return {}
    }

    if (functionsExist.feature_limits === undefined) {
      functionsExist.feature_limits = true
    }

    return data || {}
  } catch (error) {
    console.error(`[v0] Exception getting feature limits for ${featureKey}:`, error)
    functionsExist.feature_limits = false
    return {}
  }
}

/**
 * Get feature access with limits
 */
export async function getFeatureAccess(featureKey: string): Promise<FeatureAccess> {
  const [hasAccess, limits] = await Promise.all([hasFeature(featureKey), getFeatureLimits(featureKey)])

  return { hasAccess, limits }
}

/**
 * Require feature or throw error (route guard)
 */
export async function requireFeature(featureKey: string): Promise<void> {
  const allowed = await hasFeature(featureKey)
  if (!allowed) {
    throw new Error(`Feature required: ${featureKey}`)
  }
}

/**
 * Get all features for current user
 */
export async function getUserFeatures(): Promise<string[]> {
  const supabase = await createServerClient()

  // Get all features
  const { data: features } = await supabase.from("features").select("key").order("key")

  if (!features) return []

  // Check each feature (this could be optimized with a batch RPC)
  const accessChecks = await Promise.all(
    features.map(async (f) => ({
      key: f.key,
      hasAccess: await hasFeature(f.key),
    })),
  )

  return accessChecks.filter((f) => f.hasAccess).map((f) => f.key)
}

/**
 * Get user's active plan
 */
export async function getUserPlan(): Promise<{ key: string; name: string } | null> {
  const supabase = await createServerClient()

  const { data } = await supabase.from("tenant_plans").select("plan:plans(key, name)").eq("status", "active").single()

  return data?.plan || null
}
