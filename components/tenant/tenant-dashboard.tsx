"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Building, DollarSign, TrendingUp, Activity, Zap, Brain, Shield, Globe } from "lucide-react"
import { TenantAnalytics } from "./tenant-analytics"
import { TenantUserManagement } from "./tenant-user-management"
import { BillingPanel } from "./billing-panel"
import { TenantIntegrationsPanel } from "./tenant-integrations-panel"
import { AiInsightsPanel } from "./ai-insights-panel"

export function TenantDashboard() {
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  })

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats({
        totalTenants: 1247,
        activeTenants: 1189,
        totalRevenue: 2847392,
        monthlyGrowth: 12.5,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const quickStats = [
    {
      title: "Total Tenants",
      value: stats.totalTenants.toLocaleString(),
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Active Tenants",
      value: stats.activeTenants.toLocaleString(),
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+15%",
      changeType: "positive",
    },
    {
      title: "Growth Rate",
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+2.3%",
      changeType: "positive",
    },
  ]

  const aiFeatures = [
    {
      icon: Brain,
      title: "AI Insights",
      description: "Predictive analytics and recommendations",
      status: "Active",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Zap,
      title: "Auto-scaling",
      description: "Dynamic resource allocation",
      status: "Active",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Security Monitor",
      description: "Real-time threat detection",
      status: "Active",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Worldwide content delivery",
      status: "Active",
      color: "from-blue-500 to-indigo-500",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Tenant Dashboard
          </h1>
          <p className="text-slate-600 mt-2">Comprehensive tenant management with AI-powered insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 bg-transparent">
            <Activity className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
            <Users className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <Badge
                        variant="secondary"
                        className={`${
                          stat.changeType === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-slate-500 ml-2">vs last month</span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-2xl`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Features Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-cyan-600" />
              AI-Powered Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {aiFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                    >
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {feature.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Dashboard Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-100">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <TenantAnalytics />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <TenantUserManagement />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <BillingPanel />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <TenantIntegrationsPanel />
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <AiInsightsPanel />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
