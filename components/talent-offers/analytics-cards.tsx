"use client"

import { TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalyticsData {
  total: number
  accepted: number
  declined: number
  pending: number
  acceptanceRate: number
  timeToOfferAvgDays: number
  avgCompByBand: Array<{ band: string; avg: number }>
  expiringSoonCount: number
}

interface AnalyticsCardsProps {
  data: AnalyticsData
}

export function AnalyticsCards({ data }: AnalyticsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
          <DollarSign className="h-4 w-4 text-indigo-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {data.accepted} accepted • {data.declined} declined
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
          {data.acceptanceRate >= 70 ? (
            <TrendingUp className="h-4 w-4 text-green-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.acceptanceRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {data.accepted} of {data.total} offers
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Time to Offer</CardTitle>
          <Clock className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.timeToOfferAvgDays} days</div>
          <p className="text-xs text-muted-foreground mt-1">Average from creation to send</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.expiringSoonCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Within next 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
}
