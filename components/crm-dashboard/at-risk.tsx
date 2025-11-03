"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface AtRiskProps {
  deals: Array<{
    id: string
    name: string
    reason: "stale" | "pushout" | "low-prob" | "no-activity"
    days_stale: number
    amount: number
  }>
}

export function AtRisk({ deals }: AtRiskProps) {
  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case "stale":
        return "Stale"
      case "pushout":
        return "Past Due"
      case "low-prob":
        return "Low Probability"
      case "no-activity":
        return "No Activity"
      default:
        return reason
    }
  }

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "stale":
        return "bg-orange-500/10 text-orange-500"
      case "pushout":
        return "bg-red-500/10 text-red-500"
      case "low-prob":
        return "bg-yellow-500/10 text-yellow-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          At-Risk Deals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No at-risk deals</p>
          ) : (
            deals.map((deal) => (
              <div
                key={deal.id}
                className="p-3 rounded-lg border border-border/50 hover:bg-background/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <Link href={`/crm/opportunities/${deal.id}`} className="font-medium text-sm hover:underline">
                      {deal.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{deal.days_stale} days since last update</p>
                  </div>
                  <Badge className={getReasonColor(deal.reason)}>{getReasonLabel(deal.reason)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">${(deal.amount / 1000).toFixed(1)}K</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                    Nudge Owner
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
