"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "./use-api"

interface DashboardMetrics {
  totalUsers: number
  activeTenants: number
  revenue: number
  growthRate: number
  systemHealth: number
}

interface SystemStatus {
  cpu: number
  memory: number
  storage: number
  network: number
  uptime: string
  lastBackup: string
  activeConnections: number
}

interface ModuleStats {
  id: string
  name: string
  version: string
  usage: number
  performance: number
  users: number
  status: string
}

interface AIInsight {
  id: string
  type: string
  title: string
  description: string
  priority: string
  impact: string
  recommendation: string
  estimatedSavings: string
  confidence: number
  createdAt: string
}

interface RecentActivity {
  id: string
  title: string
  description: string
  user: string
  module: string
  timestamp: string
}

interface DashboardData {
  metrics: DashboardMetrics
  systemStatus: SystemStatus
  moduleStats: ModuleStats[]
  aiInsights: AIInsight[]
  recentActivity: RecentActivity[]
}

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { get, post } = useApi()

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await get("/api/dashboard")

      if (response.success && response.data) {
        setDashboardData(response.data)
      } else {
        throw new Error(response.error || "Failed to fetch dashboard data")
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error occurred")
      setError(error)
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [get])

  const refreshData = useCallback(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const exportData = useCallback(
    async (format: "csv" | "json" | "pdf") => {
      try {
        const response = await post("/api/dashboard/export", { format })

        if (response.success && response.data) {
          // Open download URL in new tab
          const downloadUrl = `${response.data.downloadUrl}?format=${format}`
          window.open(downloadUrl, "_blank")
          return response.data
        } else {
          throw new Error(response.error || "Failed to export dashboard data")
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Export failed")
        console.error("Error exporting dashboard data:", error)
        throw error
      }
    },
    [post],
  )

  const implementAIRecommendation = useCallback(
    async (recommendationId: string, actions?: string[]) => {
      try {
        const response = await post(`/api/ai/recommendations/${recommendationId}/implement`, { actions })

        if (response.success) {
          // Refresh dashboard data to reflect changes
          await fetchDashboardData()
          return response.data
        } else {
          throw new Error(response.error || "Failed to implement recommendation")
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Implementation failed")
        console.error("Error implementing AI recommendation:", error)
        throw error
      }
    },
    [post, fetchDashboardData],
  )

  const dismissAIRecommendation = useCallback(
    async (recommendationId: string) => {
      try {
        // In a real app, this would call an API to dismiss the recommendation
        if (dashboardData) {
          const updatedInsights = dashboardData.aiInsights.filter((insight) => insight.id !== recommendationId)
          setDashboardData({
            ...dashboardData,
            aiInsights: updatedInsights,
          })
        }
      } catch (err) {
        console.error("Error dismissing AI recommendation:", err)
      }
    },
    [dashboardData],
  )

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    dashboardData,
    loading,
    error,
    refreshData,
    exportData,
    implementAIRecommendation,
    dismissAIRecommendation,
  }
}
