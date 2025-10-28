"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface TopDealsProps {
  deals: Array<{
    id: string
    name: string
    stage: string
    amount: number
    probability: number
    close_date: string
    owner: string
    avatar?: string
  }>
}

export function TopDeals({ deals }: TopDealsProps) {
  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return "bg-green-500/10 text-green-500"
    if (prob >= 50) return "bg-yellow-500/10 text-yellow-500"
    return "bg-red-500/10 text-red-500"
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Top Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/crm/opportunities/${deal.id}`}
              className="block p-3 rounded-lg hover:bg-background/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">{deal.name}</p>
                <Badge className={getProbabilityColor(deal.probability)}>{deal.probability}%</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{deal.owner[0]}</AvatarFallback>
                  </Avatar>
                  <span>{deal.owner}</span>
                </div>
                <span className="font-medium text-foreground">${(deal.amount / 1000).toFixed(1)}K</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
