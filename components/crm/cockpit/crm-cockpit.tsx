"use client"

import { useState, useEffect } from "react"
import { Gauge, Zap, AlertCircle, CheckCircle, Clock, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface CockpitMetric {
  id: string
  name: string
  value: number
  target: number
  unit: string
  status: "healthy" | "warning" | "critical"
  trend: "up" | "down" | "stable"
}

export function CRMCockpit() {
  const [metrics, setMetrics] = useState<CockpitMetric[]>([
    {
      id: "pipeline_health",
      name: "Pipeline Health",
      value: 87,
      target: 90,
      unit: "%",
      status: "healthy",
      trend: "up",
    },
    {
      id: "lead_response",
      name: "Lead Response Time",
      value: 2.3,
      target: 2.0,
      unit: "hrs",
      status: "warning",
      trend: "down",
    },
    {
      id: "quota_attainment",
      name: "Quota Attainment",
      value: 94,
      target: 100,
      unit: "%",
      status: "healthy",
      trend: "up",
    },
    {
      id: "deal_velocity",
      name: "Deal Velocity",
      value: 23,
      target: 25,
      unit: "days",
      status: "warning",
      trend: "stable",
    },
  ])

  const [systemStatus, setSystemStatus] = useState({
    overall: "operational",
    components: [
      { name: "Lead Scoring AI", status: "operational" },
      { name: "Email Automation", status: "operational" },
      { name: "Pipeline Sync", status: "operational" },
      { name: "Reporting Engine", status: "operational" },
    ],
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational":
        return "text-emerald-600 bg-emerald-100"
      case "warning":
        return "text-amber-600 bg-amber-100"
      case "critical":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  // Helpers to give explicit text / background classes so icons inherit correct color
  const getStatusTextClass = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational":
        return "text-emerald-600"
      case "warning":
        return "text-amber-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBgClass = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational":
        return "bg-emerald-100"
      case "warning":
        return "bg-amber-100"
      case "critical":
        return "bg-red-100"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational":
        return CheckCircle
      case "warning":
        return AlertCircle
      case "critical":
        return AlertCircle
      default:
        return Clock
    }
  }

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 2,
        status: metric.value >= metric.target * 0.9 ? "healthy" : 
                metric.value >= metric.target * 0.8 ? "warning" : "critical"
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-white/70 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-600" />
          CRM Cockpit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Status */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-3">System Status</h4>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-600">All Systems Operational</span>
          </div>
          <div className="space-y-1">
            {systemStatus.components.map((component, index) => {
              const StatusIcon = getStatusIcon(component.status)
              const textClass = getStatusTextClass(component.status)
              const bgClass = getStatusBgClass(component.status)

              return (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{component.name}</span>
                  <div className="flex items-center gap-1">
                    <StatusIcon className={`w-3 h-3 ${textClass}`} />
                    <span className={`${textClass}`}>OK</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-3">Key Metrics</h4>
          <div className="space-y-3">
            {metrics.map((metric) => {
              const StatusIcon = getStatusIcon(metric.status)
              const statusColor = getStatusColor(metric.status)
              const progress = (metric.value / metric.target) * 100

              return (
                <div key={metric.id} className="p-3 rounded-lg bg-white/50 border border-white/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                      <div className={`p-1 rounded ${getStatusTextClass(metric.status)} ${getStatusBgClass(metric.status)}`}>
                        <StatusIcon className={`w-3 h-3 ${getStatusTextClass(metric.status)}`} />
                      </div>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-bold text-gray-900">
                      {metric.value.toFixed(1)}{metric.unit}
                    </span>
                    <span className="text-xs text-gray-500">
                      Target: {metric.target}{metric.unit}
                    </span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <Target className="w-4 h-4 mx-auto mb-1" />
              Refresh Data
            </button>
            <button className="p-2 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <Zap className="w-4 h-4 mx-auto mb-1" />
              Run Analysis
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
