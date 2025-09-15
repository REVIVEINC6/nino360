"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Cpu, HardDrive, Wifi, Database, Zap, TrendingUp, AlertCircle } from "lucide-react"

interface SystemStatus {
  cpu: number
  memory: number
  storage: number
  network: number
  uptime: string
  lastBackup: string
  activeConnections: number
  queueSize: number
}

interface PerformanceMetricsProps {
  data?: SystemStatus
  onOptimize: () => void
}

export function PerformanceMetrics({ data, onOptimize }: PerformanceMetricsProps) {
  const defaultData: SystemStatus = {
    cpu: 68,
    memory: 45,
    storage: 72,
    network: 34,
    uptime: "99.9%",
    lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    activeConnections: 1247,
    queueSize: 23,
  }

  const systemData = data || defaultData

  const getStatusColor = (value: number, thresholds = { warning: 70, critical: 90 }) => {
    if (value >= thresholds.critical) return "text-red-600"
    if (value >= thresholds.warning) return "text-yellow-600"
    return "text-green-600"
  }

  const getProgressColor = (value: number, thresholds = { warning: 70, critical: 90 }) => {
    if (value >= thresholds.critical) return "bg-red-500"
    if (value >= thresholds.warning) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Performance
        </CardTitle>
        <CardDescription>Real-time system metrics and performance indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resource Usage */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span>CPU Usage</span>
              </div>
              <span className={`font-medium ${getStatusColor(systemData.cpu)}`}>{systemData.cpu}%</span>
            </div>
            <Progress value={systemData.cpu} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Memory Usage</span>
              </div>
              <span className={`font-medium ${getStatusColor(systemData.memory)}`}>{systemData.memory}%</span>
            </div>
            <Progress value={systemData.memory} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span>Storage Usage</span>
              </div>
              <span className={`font-medium ${getStatusColor(systemData.storage)}`}>{systemData.storage}%</span>
            </div>
            <Progress value={systemData.storage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                <span>Network I/O</span>
              </div>
              <span className={`font-medium ${getStatusColor(systemData.network)}`}>{systemData.network}%</span>
            </div>
            <Progress value={systemData.network} className="h-2" />
          </div>
        </div>

        {/* System Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-green-600">{systemData.uptime}</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-blue-600">{systemData.activeConnections}</div>
            <div className="text-sm text-muted-foreground">Active Connections</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-purple-600">{systemData.queueSize}</div>
            <div className="text-sm text-muted-foreground">Queue Size</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-orange-600">
              {Math.floor((Date.now() - new Date(systemData.lastBackup).getTime()) / (1000 * 60 * 60))}h
            </div>
            <div className="text-sm text-muted-foreground">Last Backup</div>
          </div>
        </div>

        {/* Performance Alerts */}
        {(systemData.cpu > 80 || systemData.memory > 80 || systemData.storage > 80) && (
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Performance Alert</span>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              High resource usage detected. Consider optimizing system performance.
            </p>
            <Button size="sm" onClick={onOptimize}>
              <Zap className="h-4 w-4 mr-2" />
              Optimize Now
            </Button>
          </div>
        )}

        {/* Performance Trends */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Trends (24h)
          </h4>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Response Time", value: "245ms", trend: "-8ms", positive: true },
              { label: "Throughput", value: "15.2K/min", trend: "+5%", positive: true },
              { label: "Error Rate", value: "0.02%", trend: "-0.01%", positive: true },
            ].map((metric, index) => (
              <div key={index} className="p-3 rounded-lg border">
                <div className="text-lg font-bold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <Badge variant={metric.positive ? "default" : "destructive"} className="mt-1 text-xs">
                  {metric.trend}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div className="space-y-3">
          <h4 className="font-medium">💡 Optimization Suggestions</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Enable database query caching to reduce CPU usage by ~15%</p>
            <p>• Implement CDN for static assets to improve response times</p>
            <p>• Schedule automated cleanup of temporary files to free storage space</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
