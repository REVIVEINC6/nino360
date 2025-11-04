"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight, RefreshCw, AlertCircle, Lightbulb } from "lucide-react"
import { getPersonalizedInsights } from "@/app/(dashboard)/dashboard/actions"
import { motion } from "framer-motion"

interface Recommendation {
  id: string
  title: string
  description: string
  action: string
  priority: string
  category: string
  confidence: number
}

export function SmartRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRecommendations = async () => {
    setLoading(true)
    setError(null)
    try {
      // Reuse personalized insights as recommendations
      const result = await getPersonalizedInsights()
      if (result.success && result.data) {
        // Transform insights into recommendations
        const recs = result.data.map((insight: any) => ({
          id: insight.id,
          title: insight.title,
          description: insight.description,
          action: "View Details",
          priority: insight.priority,
          category: insight.category,
          confidence: insight.confidence,
        }))
        setRecommendations(recs)
      } else {
        setError(result.error || "Failed to load recommendations")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("[v0] Error loading recommendations:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-linear-to-r from-red-500 to-orange-500"
      case "medium":
        return "bg-linear-to-r from-yellow-500 to-amber-500"
      case "low":
        return "bg-linear-to-r from-blue-500 to-cyan-500"
      default:
        return "bg-linear-to-r from-gray-500 to-slate-500"
    }
  }

  return (
    <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-pink-500 to-rose-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Smart Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions to optimize your workflow</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadRecommendations}
            disabled={loading}
            className="hover:bg-white/50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-lg bg-linear-to-r from-gray-200/50 to-gray-100/50 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50/50 border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">No recommendations available yet</p>
          </div>
        )}

        {!loading && !error && recommendations.length > 0 && (
          <div className="space-y-3">
            {recommendations.slice(0, 4).map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg backdrop-blur-sm bg-linear-to-br from-white/80 to-white/40 border border-white/30 hover:shadow-xl transition-all"
              >
                {/* Priority indicator */}
                <div className={`absolute top-0 left-0 w-1 h-full ${getPriorityColor(rec.priority)}`} />

                <div className="p-4 pl-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {rec.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{Math.round(rec.confidence * 100)}% match</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-white/50 group-hover:translate-x-1 transition-transform"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
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
