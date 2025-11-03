"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Users, TrendingUp, Calendar, ClipboardCheck, Sparkles, FileText, Settings } from "lucide-react"

export function HRMSSidebar() {
  const kpis = {
    employees: 248,
    openAssignments: 19,
    pendingApprovals: 7,
  }

  return (
    <div className="w-80 border-l bg-card/50 backdrop-blur-sm p-6 space-y-6 overflow-y-auto">
      {/* Quick Stats */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" /> HR Snapshot
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Employees</span>
            <Badge variant="secondary">{kpis.employees}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Open Assignments</span>
            <Badge variant="secondary">{kpis.openAssignments}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pending Approvals</span>
            <Badge variant="secondary">{kpis.pendingApprovals}</Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* AI Insights */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> AI Insights
        </h3>
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground">
            Overtime has spiked 18% this month. Consider adjusting staffing plans.
          </p>
        </Card>
      </div>

      <Separator />

      {/* Quick Actions */}
      <div>
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <Users className="h-4 w-4 mr-2" /> Add Employee
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <Calendar className="h-4 w-4 mr-2" /> Approve Timesheets
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <ClipboardCheck className="h-4 w-4 mr-2" /> Run Compliance Check
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <FileText className="h-4 w-4 mr-2" /> Generate Reports
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" /> HR Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
