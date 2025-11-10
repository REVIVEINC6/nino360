"use client"

import { motion } from "framer-motion"
import { Users, Activity, Layers, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface KpiStripProps {
  usage: any
  seats: any[]
}

export function KpiStrip({ usage, seats }: KpiStripProps) {
  const totalSeats = seats.reduce((sum, s) => sum + s.licensed, 0)
  const activeSeats = seats.reduce((sum, s) => sum + s.active, 0)
  const totalSessions = usage.series?.reduce((sum: number, d: any) => sum + (d.sessions || 0), 0) || 0
  const totalEvents = usage.series?.reduce((sum: number, d: any) => sum + (d.events || 0), 0) || 0

  const kpis = [
    {
      label: "Active Users",
      value: activeSeats,
      icon: Users,
      trend: "+12%",
      color: "from-[#4F46E5] to-[#6D28D9]",
    },
    {
      label: "Sessions",
      value: totalSessions,
      icon: Activity,
      trend: "+8%",
      color: "from-[#6D28D9] to-[#8B5CF6]",
    },
    {
      label: "Events",
      value: totalEvents,
      icon: TrendingUp,
      trend: "+15%",
      color: "from-[#8B5CF6] to-[#A855F7]",
    },
    {
      label: "Modules Used",
      value: 7,
      icon: Layers,
      trend: "+2",
      color: "from-[#A855F7] to-[#D0FF00]",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-3xl font-bold">{kpi.value.toLocaleString()}</p>
                  <p className="text-xs text-[#D0FF00]">{kpi.trend}</p>
                </div>
                <div className={`p-3 rounded-xl bg-linear-to-br ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
