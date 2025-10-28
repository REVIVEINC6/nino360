"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, AlertTriangle } from "lucide-react"
import useSWR from "swr"
import { getOffboardingOverview, getExitChecklists } from "@/app/(dashboard)/hrms/offboarding/actions"

export function OffboardingManagement() {
  const { data: overview, error: overviewError } = useSWR(
    "offboarding-overview",
    async () => {
      const result = await getOffboardingOverview()
      return result.success ? result.data : null
    },
    { refreshInterval: 30000 },
  )

  const { data: exits, error: exitsError } = useSWR(
    "exit-checklists",
    async () => {
      const result = await getExitChecklists()
      return result.success ? result.data : []
    },
    { refreshInterval: 30000 },
  )

  if (overviewError || exitsError) {
    return <div className="text-red-500">Error loading offboarding data</div>
  }

  if (!overview || !exits) {
    return <div className="text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Exits</p>
          <p className="text-2xl font-bold">{overview.activeExits}</p>
          <p className="text-xs text-muted-foreground">In progress</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Tasks</p>
          <p className="text-2xl font-bold">{overview.pendingTasks}</p>
          <p className="text-xs text-orange-600">Requires attention</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold">{overview.completedThisQuarter}</p>
          <p className="text-xs text-muted-foreground">This quarter</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Exit Checklist</h3>
        <div className="space-y-4">
          {exits.map((exit: any) => (
            <Card key={exit.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {exit.employees.first_name} {exit.employees.last_name}
                    </p>
                    {exit.urgent && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{exit.employees.job_title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Last day: {new Date(exit.last_day).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Badge variant={exit.urgent ? "destructive" : "secondary"}>{exit.urgent ? "Urgent" : "On Track"}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exit Checklist</span>
                  <span className="font-medium">{exit.progress}%</span>
                </div>
                <Progress value={exit.progress} />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                View Checklist
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
