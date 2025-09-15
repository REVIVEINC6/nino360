"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Clock,
  Target,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Plus,
  Star,
  ArrowRight,
  Zap,
  Globe,
} from "lucide-react"

export default function BenchPage() {
  const stats = [
    {
      title: "Total Resources",
      value: "45",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Available Resources",
      value: "12",
      change: "-8%",
      trend: "down",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Utilization Rate",
      value: "73.3%",
      change: "+5.2%",
      trend: "up",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg. Bench Time",
      value: "18 days",
      change: "-3 days",
      trend: "up",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const quickActions = [
    {
      title: "Add Resource",
      description: "Add new resource to bench pool",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      href: "/bench/pool",
    },
    {
      title: "Allocate Resources",
      description: "Assign resources to projects",
      icon: Target,
      color: "bg-green-500 hover:bg-green-600",
      href: "/bench/allocation",
    },
    {
      title: "Generate Report",
      description: "Create bench utilization report",
      icon: BarChart3,
      color: "bg-purple-500 hover:bg-purple-600",
      href: "/bench/reports",
    },
    {
      title: "Sync Resources",
      description: "Sync with external systems",
      icon: RefreshCw,
      color: "bg-orange-500 hover:bg-orange-600",
      href: "/bench/tracking",
    },
  ]

  const features = [
    {
      title: "Resource Tracking",
      description: "Real-time tracking of resource availability and status",
      icon: Clock,
      href: "/bench/tracking",
      status: "Active",
      users: "24 resources",
    },
    {
      title: "Allocation Planning",
      description: "Strategic resource allocation and assignment planning",
      icon: Target,
      href: "/bench/allocation",
      status: "Active",
      users: "12 allocations",
    },
    {
      title: "Skills Matrix",
      description: "Comprehensive skills mapping and competency tracking",
      icon: Star,
      href: "/bench/skills",
      status: "Active",
      users: "45 profiles",
    },
    {
      title: "Utilization Analytics",
      description: "Advanced analytics for resource utilization optimization",
      icon: BarChart3,
      href: "/bench/utilization",
      status: "Active",
      users: "Real-time data",
    },
    {
      title: "Forecasting",
      description: "Predictive bench forecasting and capacity planning",
      icon: TrendingUp,
      href: "/bench/forecasting",
      status: "Active",
      users: "AI-powered",
    },
    {
      title: "Automation",
      description: "Automated bench management workflows",
      icon: Zap,
      href: "/bench/automation",
      status: "Beta",
      users: "New feature",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "allocation",
      title: "Resource allocated to Project Alpha",
      description: "John Doe assigned to development team",
      time: "2 hours ago",
      icon: Target,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "availability",
      title: "New resource available",
      description: "Sarah Smith completed current assignment",
      time: "4 hours ago",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "alert",
      title: "Long bench time alert",
      description: "Mike Johnson on bench for 25 days",
      time: "6 hours ago",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      id: 4,
      type: "forecast",
      title: "Capacity forecast updated",
      description: "Q2 resource demand projection available",
      time: "1 day ago",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Bench Management</h1>
              <p className="text-blue-100">Optimize resource allocation and minimize bench time</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">45</div>
              <div className="text-sm text-blue-100">Total Resources</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">73.3%</div>
              <div className="text-sm text-blue-100">Utilization Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">18 days</div>
              <div className="text-sm text-blue-100">Avg. Bench Time</div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <Badge
                      variant={stat.trend === "up" ? "default" : "secondary"}
                      className={stat.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common bench management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all bg-transparent"
                  onClick={() => (window.location.href = action.href)}
                >
                  <div className={`p-3 rounded-xl text-white ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Bench Management Features
            </CardTitle>
            <CardDescription>Comprehensive resource management capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => (window.location.href = feature.href)}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <feature.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <Badge variant={feature.status === "Beta" ? "secondary" : "default"}>{feature.status}</Badge>
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{feature.users}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest bench management activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
