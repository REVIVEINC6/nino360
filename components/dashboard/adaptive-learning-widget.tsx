"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Activity, RefreshCw, AlertCircle, Zap } from "lucide-react"
import { getMLModelPerformance } from "@/app/(dashboard)/dashboard/actions"
import { Progress } from "@/components/ui/progress"

interface ModelPerformance {
  model_name: string
  accuracy: number
  mae: number
  rmse: number
  last_trained: string
  training_samples: number
  status: string
}

export function AdaptiveLearningWidget() {
  const [models, setModels] = useState<ModelPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadModels = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getMLModelPerformance()
      if (result.success && result.data) {
        setModels(result.data)
      } else {
        setError(result.error || "Failed to load model performance")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("[v0] Error loading ML model performance:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadModels()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 border-green-200"
      case "training":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      case "needs_retraining":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.9) return "text-green-600"
    if (accuracy >= 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Adaptive Learning</CardTitle>
              <CardDescription>Self-aware AI models continuously improving</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={loadModels} disabled={loading} className="hover:bg-white/50">
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

        {!loading && !error && models.length === 0 && (
          <div className="text-center py-8">
            <Zap className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">No ML models active yet</p>
          </div>
        )}

        {!loading && !error && models.length > 0 && (
          <div className="space-y-3">
            {models.map((model) => (
              <div
                key={model.model_name}
                className="p-4 rounded-lg backdrop-blur-sm bg-gradient-to-br from-white/80 to-white/40 border border-white/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{model.model_name}</h4>
                      <Badge variant="outline" className={getStatusColor(model.status)}>
                        {model.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Last trained: {new Date(model.last_trained).toLocaleDateString()} •{" "}
                      {model.training_samples.toLocaleString()} samples
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Accuracy */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Accuracy</span>
                      <span className={`text-xs font-bold ${getAccuracyColor(model.accuracy)}`}>
                        {(model.accuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={model.accuracy * 100} className="h-2" />
                  </div>

                  {/* Error Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Activity className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">MAE</span>
                      </div>
                      <div className="text-sm font-bold text-blue-900">{model.mae.toFixed(3)}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-50/50 border border-purple-100">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="h-3 w-3 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">RMSE</span>
                      </div>
                      <div className="text-sm font-bold text-purple-900">{model.rmse.toFixed(3)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
