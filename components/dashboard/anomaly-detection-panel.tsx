"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, RefreshCw, AlertCircle, Shield } from "lucide-react"
import { detectAnomalies } from "@/app/(dashboard)/dashboard/actions"
import { motion } from "framer-motion"

interface Anomaly {
  metric: string
  expected: number
  actual: number
  deviation: number
  severity: string
  timestamp: string
}

export function AnomalyDetectionPanel() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAnomalies = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await detectAnomalies()
      if (result.success && result.data) {
        setAnomalies(result.data)
      } else {
        setError(result.error || "Failed to detect anomalies")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("[v0] Error detecting anomalies:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnomalies()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-700 border-red-200"
      case "high":
        return "bg-orange-500/10 text-orange-700 border-orange-200"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Anomaly Detection</CardTitle>
              <CardDescription>ML-powered detection of unusual patterns</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={loadAnomalies} disabled={loading} className="hover:bg-white/50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-gradient-to-r from-gray-200/50 to-gray-100/50 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50/50 border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && anomalies.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">All Systems Normal</p>
            <p className="text-xs text-gray-600">No anomalies detected in your data</p>
          </div>
        )}

        {!loading && !error && anomalies.length > 0 && (
          <div className="space-y-3">
            {anomalies.map((anomaly, index) => (
              <motion.div
                key={`${anomaly.metric}-${anomaly.timestamp}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg backdrop-blur-sm bg-gradient-to-br from-white/80 to-white/40 border border-white/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getSeverityColor(anomaly.severity)}`}>
                      {getSeverityIcon(anomaly.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{anomaly.metric}</h4>
                        <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs mb-2">
                        <div>
                          <span className="text-gray-500">Expected:</span>
                          <span className="ml-1 font-medium">{anomaly.expected.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Actual:</span>
                          <span className="ml-1 font-medium">{anomaly.actual.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Deviation:</span>
                          <span className="ml-1 font-medium text-red-600">{anomaly.deviation.toFixed(1)}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(anomaly.timestamp).toLocaleString()}</p>
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
