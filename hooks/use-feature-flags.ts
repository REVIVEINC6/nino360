"use client"

import { useEffect, useState } from "react"
import { getFeatureFlags } from "@/app/(dashboard)/dashboard/actions"

export interface FeatureFlags {
  crm: boolean
  talent: boolean
  bench: boolean
  hotlist: boolean
  hrms: boolean
  finance: boolean
  vms: boolean
  projects: boolean
  analytics: boolean
  reports: boolean
  security: boolean
  // Added temporary flags referenced in admin pages
  ai_insights?: boolean
  audit_chain?: boolean
  rpa_automation?: boolean
}

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags>({
    crm: false,
    talent: false,
    bench: false,
    hotlist: false,
    hrms: false,
    finance: false,
    vms: false,
    projects: false,
    analytics: false,
    reports: false,
    security: false,
    ai_insights: false,
    audit_chain: false,
    rpa_automation: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadFlags() {
      try {
        setLoading(true)
        const data = await getFeatureFlags()
        if (mounted) {
          setFlags(data)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to load feature flags"))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadFlags()

    return () => {
      mounted = false
    }
  }, [])

  const hasFeature = (feature: keyof FeatureFlags): boolean => {
    return flags[feature] || false
  }

  const hasAllFeatures = (features: (keyof FeatureFlags)[]): boolean => {
    return features.every((feature) => flags[feature])
  }

  const hasAnyFeature = (features: (keyof FeatureFlags)[]): boolean => {
    return features.some((feature) => flags[feature])
  }

  return {
    flags,
    loading,
    error,
    hasFeature,
    hasAllFeatures,
    hasAnyFeature,
  }
}
