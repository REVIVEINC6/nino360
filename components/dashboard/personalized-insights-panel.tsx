"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Users, Briefcase, AlertCircle, Sparkles, RefreshCw } from "lucide-react"
import { getPersonalizedInsights } from "@/app/(dashboard)/dashboard/actions"
import { motion } from "framer-motion"

interface Insight {
  id: string
  category: string
  title: string
  description: string
  confidence: number
  priority: string
  created_at: string
}

export function PersonalizedInsightsPanel() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadInsights = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPersonalizedInsights()
      if (result.success && result.data) {
        setInsights(result.data)
      } else {
        setError(result.error || "Failed to load insights")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("[v0] Error loading personalized insights:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInsights()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "recruitment":
        return <Users className="h-4 w-4" />
      case "performance":
        return <TrendingUp className="h-4 w-4" />
      case "engagement":
        return <Briefcase className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  return (
    <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Personalized Insights</CardTitle>
              <CardDescription>AI-powered recommendations based on your behavior</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={loadInsights} disabled={loading} className="hover:bg-white/50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-gradient-to-r from-gray-200/50 to-gray-100/50 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50/50 border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && insights.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">No insights available yet. Keep using the platform!</p>
          </div>
        )}

        {!loading && !error && insights.length > 0 && (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg backdrop-blur-sm bg-gradient-to-br from-white/80 to-white/40 border border-white/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                        <span>{new Date(insight.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
