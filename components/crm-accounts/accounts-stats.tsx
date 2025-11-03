"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, DollarSign, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface AccountsStatsProps {
  accounts: any[]
}

export function AccountsStats({ accounts }: AccountsStatsProps) {
  const totalAccounts = accounts.length
  const activeCustomers = accounts.filter((a) => a.status === "customer").length
  const conversionRate = totalAccounts > 0 ? ((activeCustomers / totalAccounts) * 100).toFixed(1) : "0"

  const stats = [
    {
      title: "Total Accounts",
      value: totalAccounts,
      change: "+12 this month",
      icon: Building2,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Active Customers",
      value: activeCustomers,
      change: `${conversionRate}% conversion rate`,
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Total Revenue",
      value: "$4.2M",
      change: "+18% from last quarter",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Growth Rate",
      value: "+24%",
      change: "Year over year",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-lg bg-linear-to-br ${stat.color} p-2`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
