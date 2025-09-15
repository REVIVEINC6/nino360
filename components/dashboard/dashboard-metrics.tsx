"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Building2, TrendingUp, DollarSign, Shield, Activity, Brain, CheckCircle } from "lucide-react"

interface DashboardMetricsProps {
  data?: {
    totalUsers: number
    activeTenants: number
    revenue: number
    growthRate: number
    systemHealth: number
    securityScore: number
    complianceScore: number
    aiInsights: number
  }
  timeRange: string
  loading?: boolean
}

export function DashboardMetrics({ data, timeRange, loading }: DashboardMetricsProps) {
  if (loading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metrics = [
    {
      title: "Total Users",
      value: data.totalUsers.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      description: `vs last ${timeRange === "1d" ? "day" : timeRange === "7d" ? "week" : "month"}`,
      color: "text-blue-600",
    },
    {
      title: "Active Tenants",
      value: data.activeTenants.toString(),
      change: "+8%",
      trend: "up",
      icon: Building2,
      description: `vs last ${timeRange === "1d" ? "day" : timeRange === "7d" ? "week" : "month"}`,
      color: "text-green-600",
    },
    {
      title: "Revenue",
      value: `$${(data.revenue / 1000).toFixed(0)}K`,
      change: `+${data.growthRate.toFixed(1)}%`,
      trend: "up",
      icon: DollarSign,
      description: `vs last ${timeRange === "1d" ? "day" : timeRange === "7d" ? "week" : "month"}`,
      color: "text-emerald-600",
    },
    {
      title: "Growth Rate",
      value: `${data.growthRate.toFixed(1)}%`,
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      description: `vs last ${timeRange === "1d" ? "day" : timeRange === "7d" ? "week" : "month"}`,
      color: "text-purple-600",
    },
    {
      title: "System Health",
      value: `${data.systemHealth}%`,
      change: data.systemHealth >= 95 ? "Excellent" : data.systemHealth >= 85 ? "Good" : "Needs Attention",
      trend: data.systemHealth >= 85 ? "up" : "down",
      icon: Activity,
      description: "Overall system performance",
      color: data.systemHealth >= 95 ? "text-green-600" : data.systemHealth >= 85 ? "text-yellow-600" : "text-red-600",
    },
    {
      title: "Security Score",
      value: `${data.securityScore}%`,
      change: data.securityScore >= 90 ? "Secure" : "Review Required",
      trend: data.securityScore >= 90 ? "up" : "down",
      icon: Shield,
      description: "Security posture rating",
      color: data.securityScore >= 90 ? "text-green-600" : "text-orange-600",
    },
    {
      title: "Compliance",
      value: `${data.complianceScore}%`,
      change: data.complianceScore >= 95 ? "Compliant" : "Action Needed",
      trend: data.complianceScore >= 95 ? "up" : "down",
      icon: CheckCircle,
      description: "Regulatory compliance",
      color: data.complianceScore >= 95 ? "text-green-600" : "text-red-600",
    },
    {
      title: "AI Insights",
      value: data.aiInsights.toString(),
      change: "Active",
      trend: "up",
      icon: Brain,
      description: "Available recommendations",
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={`${
                    metric.trend === "up"
                      ? "text-green-600"
                      : metric.trend === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {metric.change}
                </span>{" "}
                {metric.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
