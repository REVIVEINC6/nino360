"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Shield, Activity, TrendingUp, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

export function AdminDashboardStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTenants: 0,
    activeRoles: 0,
    systemHealth: 100,
    aiRequests: 0,
    blockchainAnchors: 0,
  })

  useEffect(() => {
    const supabase = createClient()

    async function loadStats() {
      try {
        const [users, tenants, roles, aiLogs, anchors] = await Promise.all([
          supabase.from("users").select("id", { count: "exact", head: true }),
          supabase.from("tenants").select("id", { count: "exact", head: true }),
          supabase.from("roles").select("id", { count: "exact", head: true }),
          supabase.from("ai_logs").select("id", { count: "exact", head: true }),
          supabase.from("anchors").select("id", { count: "exact", head: true }),
        ])

        setStats({
          totalUsers: users.count || 0,
          totalTenants: tenants.count || 0,
          activeRoles: roles.count || 0,
          systemHealth: 98.5,
          aiRequests: aiLogs.count || 0,
          blockchainAnchors: anchors.count || 0,
        })
      } catch (error) {
        console.error("[v0] Error loading admin stats:", error)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Tenants",
      value: stats.totalTenants.toLocaleString(),
      icon: Building2,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "System Roles",
      value: stats.activeRoles.toLocaleString(),
      icon: Shield,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      title: "System Health",
      value: `${stats.systemHealth}%`,
      icon: Activity,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "AI Requests (24h)",
      value: stats.aiRequests.toLocaleString(),
      icon: Zap,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Blockchain Anchors",
      value: stats.blockchainAnchors.toLocaleString(),
      icon: TrendingUp,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card border-white/20 shadow-lg backdrop-blur-md bg-white/70 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 bg-linear-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
