"use client"

import { useEffect, useState } from "react"
import { hasFeature, getFeatureLimits, getUserFeatures } from "@/lib/features/server"

/**
 * Hook to check if user has access to a feature
 * First checks JWT cache (fast), falls back to server check
 */
export function useFeature(featureKey: string) {
  const [hasAccess, setHasAccess] = useState<boolean>(false)
  const [limits, setLimits] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkFeature() {
      try {
        // TODO: Check JWT app_metadata.features first for fast path
        // For now, always check server
        const [access, featureLimits] = await Promise.all([hasFeature(featureKey), getFeatureLimits(featureKey)])

        setHasAccess(access)
        setLimits(featureLimits)
      } catch (error) {
        console.error(`[v0] Error checking feature ${featureKey}:`, error)
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkFeature()
  }, [featureKey])

  return { hasAccess, limits, loading }
}

/**
 * Hook to get all user features
 */
export function useUserFeatures() {
  const [features, setFeatures] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserFeatures()
      .then(setFeatures)
      .finally(() => setLoading(false))
  }, [])

  return { features, loading }
}
