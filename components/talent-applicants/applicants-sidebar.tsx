"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Users, Calendar, CheckCircle2, TrendingUp, Sparkles } from "lucide-react"

interface ApplicantsSidebarProps {
  context: any
  stats?: {
    total: number
    byStage: Record<string, number>
    avgTimeToHire: number
    offerAcceptanceRate: number
  }
}

export function ApplicantsSidebar({ context, stats }: ApplicantsSidebarProps) {
  const defaultStats = {
    total: 0,
    byStage: {},
    avgTimeToHire: 0,
    offerAcceptanceRate: 0,
  }

  const currentStats = stats || defaultStats

  return (
    <div className="w-80 border-l bg-card/50 backdrop-blur-sm p-6 space-y-6 overflow-y-auto">
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Pipeline Overview
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Applicants</span>
            <Badge variant="secondary">{currentStats.total}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Avg. Time to Hire</span>
            <span className="text-sm font-medium">{currentStats.avgTimeToHire}d</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Offer Accept Rate</span>
            <span className="text-sm font-medium">{currentStats.offerAcceptanceRate}%</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Insights
        </h3>
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground">
            Your pipeline is moving efficiently. Consider scheduling interviews for the 3 candidates in the Screen
            stage.
          </p>
        </Card>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Interviews
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <Users className="h-4 w-4 mr-2" />
            Bulk Update Stage
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Send Offers
          </Button>
        </div>
      </div>
    </div>
  )
}
