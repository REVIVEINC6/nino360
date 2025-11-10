"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react"

export function TalentAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Time to Hire</p>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">28 days</p>
          <p className="text-xs text-green-600">-3 days from last quarter</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Quality of Hire</p>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">4.2/5</p>
          <p className="text-xs text-green-600">+0.3 from last quarter</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Source ROI</p>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">245%</p>
          <p className="text-xs text-green-600">+15% from last quarter</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Acceptance Rate</p>
            <Users className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold">85%</p>
          <p className="text-xs text-green-600">+5% from last quarter</p>
        </Card>
      </div>
    </div>
  )
}
