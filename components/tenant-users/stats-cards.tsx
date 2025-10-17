"use client"

import { Card } from "@/components/ui/card"
import { Users, UserCheck, UserPlus, Shield } from "lucide-react"
import { motion } from "framer-motion"

interface StatsCardsProps {
  data: {
    rows: any[]
    total: number
  }
}

export function StatsCards({ data }: StatsCardsProps) {
  const activeUsers = data.rows.filter((u) => u.status === "active").length
  const invitedUsers = data.rows.filter((u) => u.status === "invited").length
  const admins = data.rows.filter((u) => u.role === "tenant_admin").length

  const stats = [
    {
      label: "Total Members",
      value: data.total,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Pending Invites",
      value: invitedUsers,
      icon: UserPlus,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Administrators",
      value: admins,
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`p-4 backdrop-blur-xl bg-white/5 border-white/10 hover:border-white/20 transition-colors ${stat.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
