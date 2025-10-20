"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, TrendingUp, Shield, Zap } from "lucide-react"

interface SettlementKpisProps {
  data: {
    totalRuns: number
    completedRuns: number
    totalClientReceipts: number
    totalVendorPayouts: number
    totalFees: number
    anchoredRuns: number
  }
}

export function SettlementKpis({ data }: SettlementKpisProps) {
  const kpis = [
    {
      label: "Total Runs",
      value: data.totalRuns.toString(),
      subtext: `${data.completedRuns} completed`,
      icon: Zap,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      label: "Client Receipts",
      value: `$${(data.totalClientReceipts / 1000).toFixed(1)}K`,
      subtext: "Total received",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      label: "Vendor Payouts",
      value: `$${(data.totalVendorPayouts / 1000).toFixed(1)}K`,
      subtext: "Total disbursed",
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600",
    },
    {
      label: "Blockchain Anchored",
      value: data.anchoredRuns.toString(),
      subtext: "Verified on-chain",
      icon: Shield,
      gradient: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card
            key={index}
            className="relative overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-white/10"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                  <p className="text-3xl font-bold mb-1">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.subtext}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${kpi.gradient} opacity-20`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.gradient}`} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
