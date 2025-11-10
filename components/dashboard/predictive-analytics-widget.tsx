"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Activity, RefreshCw, AlertCircle } from "lucide-react"
const PREDICTIVE_API = "/api/dashboard/predictive"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface Prediction {
  id: string
  metric_name: string
  predicted_value: number
  confidence: number
  prediction_date: string
  actual_value: number | null
  metadata: any
}

export function PredictiveAnalyticsWidget() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPredictions = async () => {
    setLoading(true)
    setError(null)
    try {
      try {
        const res = await fetch(`${PREDICTIVE_API}?type=finance&horizon=90d`, { next: { revalidate: 60 } })
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          setError(json.error || "Failed to load predictions")
        } else {
          const json = await res.json()
          if (json.success && json.data) setPredictions(json.data)
          else setError(json.error || "Failed to load predictions")
        }
      } catch (err) {
        setError("Network error while loading predictive analytics")
        console.error("[v0] fetch predictive error:", err)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("[v0] Error loading predictive analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPredictions()
  }, [])

  // Group predictions by metric for chart
  const chartData = predictions.reduce((acc: any[], pred) => {
    const existing = acc.find((item) => item.date === pred.prediction_date)
    if (existing) {
      existing[pred.metric_name] = pred.predicted_value
    } else {
      acc.push({
        date: new Date(pred.prediction_date).toLocaleDateString(),
        [pred.metric_name]: pred.predicted_value,
      })
    }
    return acc
  }, [])

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  return (
    <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Predictive Analytics</CardTitle>
              <CardDescription>ML-powered forecasts for key metrics</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadPredictions}
            disabled={loading}
            className="hover:bg-white/50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            <div className="h-48 rounded-lg bg-linear-to-r from-gray-200/50 to-gray-100/50 animate-pulse" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-lg bg-linear-to-r from-gray-200/50 to-gray-100/50 animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50/50 border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && predictions.length === 0 && (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">No predictions available yet</p>
          </div>
        )}

        {!loading && !error && predictions.length > 0 && (
          <div className="space-y-4">
            {/* Chart */}
            <div className="h-48 rounded-lg backdrop-blur-sm bg-linear-to-br from-white/80 to-white/40 border border-white/30 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(229, 231, 235, 0.5)",
                      borderRadius: "8px",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Legend />
                  {Array.from(new Set(predictions.map((p) => p.metric_name))).map((metric, index) => (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={`hsl(${index * 60}, 70%, 50%)`}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Prediction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {predictions.slice(0, 3).map((pred) => (
                <div
                  key={pred.id}
                  className="p-4 rounded-lg backdrop-blur-sm bg-linear-to-br from-white/80 to-white/40 border border-white/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600 uppercase">{pred.metric_name}</span>
                    {getTrendIcon(pred.predicted_value)}
                  </div>
                  <div className="text-2xl font-bold mb-1">{pred.predicted_value.toFixed(1)}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {Math.round(pred.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
