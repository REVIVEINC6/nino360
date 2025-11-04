"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sparkles, TrendingUp, Clock, AlertCircle, CheckCircle2, FileText, Users, Target, Zap } from "lucide-react"
import Link from "next/link"

interface JobsSidebarProps {
  requisitions: any[]
  total: number
}

export function JobsSidebar({ requisitions, total }: JobsSidebarProps) {
  const openReqs = requisitions.filter((r) => r.status === "open").length
  const draftReqs = requisitions.filter((r) => r.status === "draft").length
  const onHoldReqs = requisitions.filter((r) => r.status === "on_hold").length
  const avgAgeDays =
    requisitions.length > 0
      ? Math.round(requisitions.reduce((sum, r) => sum + (r.age_days || 0), 0) / requisitions.length)
      : 0

  return (
    <div className="w-80 border-l bg-muted/30 p-4 space-y-4 overflow-auto">
      <ScrollArea className="h-full">
        {/* Overview Stats */}
        <Card className="p-4 space-y-3 bg-linear-to-br from-purple-500/10 to-pink-500/10 border-purple-200/50">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-600" />
            <h3 className="font-semibold">Overview</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Requisitions</span>
              <span className="font-semibold">{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Open Positions</span>
              <span className="font-semibold text-green-600">{openReqs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">In Draft</span>
              <span className="font-semibold text-gray-600">{draftReqs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">On Hold</span>
              <span className="font-semibold text-yellow-600">{onHoldReqs}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg. Age</span>
              <span className="font-semibold">{avgAgeDays} days</span>
            </div>
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-4 space-y-3 bg-linear-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Time-to-Fill Improving</p>
                <p className="text-xs text-muted-foreground">Average reduced by 12% this month</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">3 Reqs Need Attention</p>
                <p className="text-xs text-muted-foreground">Pending approvals for 7+ days</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Strong Candidate Pipeline</p>
                <p className="text-xs text-muted-foreground">5 reqs have 10+ qualified applicants</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <h3 className="font-semibold">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <Link href="/talent/jobs/new">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                Create Requisition
              </Button>
            </Link>
            <Link href="/talent/jobs?status=draft">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Clock className="mr-2 h-4 w-4" />
                Review Drafts
              </Button>
            </Link>
            <Link href="/talent/jobs?status=open">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Users className="mr-2 h-4 w-4" />
                View Open Positions
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-sm">Recent Activity</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium">Senior Engineer approved</p>
                <p className="text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium">Product Manager published</p>
                <p className="text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium">Data Analyst created</p>
                <p className="text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>

        {/* SLA Alerts */}
        <Card className="p-4 space-y-3 bg-linear-to-br from-amber-500/10 to-orange-500/10 border-amber-200/50">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <h3 className="font-semibold">SLA Alerts</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-background/50 rounded">
              <span>Approval Pending</span>
              <Badge variant="outline" className="text-amber-600">
                2 reqs
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-background/50 rounded">
              <span>Review Overdue</span>
              <Badge variant="outline" className="text-red-600">
                1 req
              </Badge>
            </div>
          </div>
        </Card>
      </ScrollArea>
    </div>
  )
}
