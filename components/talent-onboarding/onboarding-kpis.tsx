"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, AlertTriangle, Package } from "lucide-react"

interface OnboardingKpisProps {
  activeOnboards: number
  avgTimeToActivate: number
  bgFailRate: number
  equipmentFulfillment: number
}

export function OnboardingKpis({
  activeOnboards,
  avgTimeToActivate,
  bgFailRate,
  equipmentFulfillment,
}: OnboardingKpisProps) {
  const kpis = [
    {
      label: "Active Onboards",
      value: activeOnboards,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      suffix: "",
    },
    {
      label: "Avg Time to Activate",
      value: avgTimeToActivate,
      icon: Clock,
      color: "from-purple-500 to-pink-500",
      suffix: " days",
    },
    {
      label: "Background Fail Rate",
      value: bgFailRate,
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
      suffix: "%",
    },
    {
      label: "Equipment Fulfillment",
      value: equipmentFulfillment,
      icon: Package,
      color: "from-green-500 to-emerald-500",
      suffix: "%",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.label} className="relative overflow-hidden bg-background/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-2">
                    {kpi.value}
                    <span className="text-sm font-normal text-muted-foreground">{kpi.suffix}</span>
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-linear-to-br ${kpi.color} opacity-10`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${kpi.color}`} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
