"use client"

import { motion } from "framer-motion"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Insight {
  id: string
  insight_type: string
  title: string
  description: string
  confidence: number
  impact_score: number
  status: string
  created_at: string
}

interface MlInsightsPanelProps {
  insights: Insight[]
}

const insightIcons = {
  performance: TrendingUp,
  usage_pattern: Brain,
  optimization: Lightbulb,
  anomaly: AlertTriangle,
  recommendation: CheckCircle2,
}

const insightColors = {
  performance: "text-blue-600",
  usage_pattern: "text-purple-600",
  optimization: "text-green-600",
  anomaly: "text-red-600",
  recommendation: "text-indigo-600",
}

export function MlInsightsPanel({ insights }: MlInsightsPanelProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass border-white/20 bg-white/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                <Brain className="h-5 w-5 text-indigo-600" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>Machine learning recommendations and system intelligence</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              {insights.length} New
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insightIcons[insight.insight_type as keyof typeof insightIcons] || Brain
              const colorClass = insightColors[insight.insight_type as keyof typeof insightColors] || "text-gray-600"

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group rounded-lg border border-white/20 bg-white/60 p-4 backdrop-blur-sm transition-all hover:border-indigo-300 hover:bg-white/80 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`rounded-lg bg-white/80 p-2 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(insight.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">Impact:</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-2 w-1 rounded-full ${
                                    i < insight.impact_score ? "bg-indigo-600" : "bg-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(insight.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <X className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
