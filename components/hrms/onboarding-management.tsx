"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"
import useSWR from "swr"
import { getOnboardingOverview, getNewHires } from "@/app/(dashboard)/hrms/onboarding/actions"

export function OnboardingManagement() {
  const { data: overview, error: overviewError } = useSWR(
    "onboarding-overview",
    async () => {
      const result = await getOnboardingOverview()
      return result.success ? result.data : null
    },
    { refreshInterval: 30000 },
  )

  const { data: newHires, error: hiresError } = useSWR(
    "new-hires",
    async () => {
      const result = await getNewHires()
      return result.success ? result.data : []
    },
    { refreshInterval: 30000 },
  )

  if (overviewError || hiresError) {
    return <div className="text-red-500">Error loading onboarding data</div>
  }

  if (!overview || !newHires) {
    return <div className="text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Onboarding</p>
          <p className="text-2xl font-bold">{overview.activeOnboarding}</p>
          <p className="text-xs text-muted-foreground">New hires in progress</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
          <p className="text-2xl font-bold">{overview.completionRate}%</p>
          <p className="text-xs text-muted-foreground">Last 90 days</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg. Time</p>
          <p className="text-2xl font-bold">{overview.avgDays} days</p>
          <p className="text-xs text-muted-foreground">To complete</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">New Hires</h3>
        <div className="space-y-4">
          {newHires.map((hire: any) => (
            <Card key={hire.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium">
                    {hire.employees.first_name} {hire.employees.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{hire.employees.job_title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Starts {new Date(hire.start_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Badge variant={hire.status === "IN_PROGRESS" ? "default" : "secondary"}>
                  {hire.status === "IN_PROGRESS" ? "In Progress" : "Pending"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Onboarding Progress</span>
                  <span className="font-medium">{hire.progress}%</span>
                </div>
                <Progress value={hire.progress} />
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Checklist
                </Button>
                <Button size="sm" className="flex-1">
                  Send Reminder
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
