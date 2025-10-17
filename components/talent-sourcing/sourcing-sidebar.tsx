"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Upload, Mail, Users, TrendingUp, Sparkles, FileSpreadsheet } from "lucide-react"

interface SourcingSidebarProps {
  stats?: {
    totalCandidates: number
    newThisWeek: number
    pools: number
    activeCampaigns: number
  }
}

export function SourcingSidebar({ stats }: SourcingSidebarProps) {
  const defaultStats = {
    totalCandidates: 0,
    newThisWeek: 0,
    pools: 0,
    activeCampaigns: 0,
  }

  const currentStats = stats || defaultStats

  return (
    <div className="w-80 border-l bg-card/50 backdrop-blur-sm p-6 space-y-6 overflow-y-auto">
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Sourcing Overview
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Candidates</span>
            <Badge variant="secondary">{currentStats.totalCandidates}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">New This Week</span>
            <Badge variant="default">{currentStats.newThisWeek}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Talent Pools</span>
            <span className="text-sm font-medium">{currentStats.pools}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Campaigns</span>
            <span className="text-sm font-medium">{currentStats.activeCampaigns}</span>
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
            15 candidates match your open Software Engineer role. Consider adding them to your pipeline.
          </p>
        </Card>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Upload CSV
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <Upload className="h-4 w-4 mr-2" />
            Upload Resumes
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <Mail className="h-4 w-4 mr-2" />
            Email Intake
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <Users className="h-4 w-4 mr-2" />
            Create Pool
          </Button>
        </div>
      </div>
    </div>
  )
}
