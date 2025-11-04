"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Calendar } from "lucide-react"
import { useCRMRealtime } from "./crm-realtime-context"

interface KPI {
  label: string
  value: number | string
  change?: number
  trend?: "up" | "down" | "neutral"
  icon: any
  color: string
  gradient: string
}

interface LiveCRMKpiStripProps {
  initialKpis: any
}

export function LiveCRMKpiStrip({ initialKpis }: LiveCRMKpiStripProps) {
  const { events } = useCRMRealtime()
  const [kpis, setKpis] = useState<KPI[]>([
    {
      label: "Total Revenue",
      value: initialKpis?.revenue || "$1,234,567",
      change: 12.5,
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      gradient: "from-emerald-500/20 to-green-500/20",
    },
    {
      label: "Active Leads",
      value: initialKpis?.leads || 247,
      change: 8.3,
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      gradient: "from-blue-500/20 to-indigo-500/20",
    },
    {
      label: "Conversion Rate",
      value: initialKpis?.conversionRate || "23.8%",
      change: -2.1,
      trend: "down",
      icon: Target,
      color: "text-purple-600",
      gradient: "from-purple-500/20 to-violet-500/20",
    },
    {
      label: "Meetings Today",
      value: initialKpis?.meetings || 12,
      change: 0,
      trend: "neutral",
      icon: Calendar,
      color: "text-amber-600",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
  ])

  // Update KPIs based on real-time events
  useEffect(() => {
    const leadEvents = events.filter(e => e.type === "lead_created")
    const opportunityEvents = events.filter(e => e.type === "opportunity_updated")
    const meetingEvents = events.filter(e => e.type === "meeting_scheduled")

    if (leadEvents.length > 0 || opportunityEvents.length > 0 || meetingEvents.length > 0) {
      setKpis(prev => prev.map(kpi => {
        if (kpi.label === "Active Leads" && leadEvents.length > 0) {
          const currentValue = typeof kpi.value === "number" ? kpi.value : parseInt(String(kpi.value)) || 0
          return {
            ...kpi,
            value: currentValue + leadEvents.length,
            change: Math.round((leadEvents.length / currentValue) * 100 * 10) / 10,
            trend: "up" as const,
          }
        }
        if (kpi.label === "Meetings Today" && meetingEvents.length > 0) {
          const currentValue = typeof kpi.value === "number" ? kpi.value : parseInt(String(kpi.value)) || 0
          return {
            ...kpi,
            value: currentValue + meetingEvents.length,
            change: Math.round((meetingEvents.length / currentValue) * 100 * 10) / 10,
            trend: "up" as const,
          }
        }
        return kpi
      }))
    }
  }, [events])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <div key={index} className="relative group">
          <div className={`absolute inset-0 bg-linear-to-br ${kpi.gradient} rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity`} />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/90 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{kpi.value}</p>
                {typeof kpi.change === "number" && (
                  <div className="flex items-center mt-2">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                    ) : kpi.trend === "down" ? (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    ) : null}
                    <span
                      className={`text-sm font-medium ${
                        kpi.trend === "up"
                          ? "text-emerald-600"
                          : kpi.trend === "down"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {kpi.change > 0 ? "+" : ""}{kpi.change}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                )}
              </div>
              {/* Icon area: use explicit bg + text classes so colors are consistent */}
              <div className={`rounded-full ${kpi.color.replace("text-", "bg-").replace("-600", "-100")} p-3`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
