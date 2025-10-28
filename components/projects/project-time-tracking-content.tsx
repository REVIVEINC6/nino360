"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Plus, Calendar, DollarSign, TrendingUp } from "lucide-react"
import { format } from "date-fns"

interface TimeEntry {
  id: string
  date: string
  hours: number
  description: string | null
  billable: boolean
  employee: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  task: {
    id: string
    title: string
  } | null
}

interface ProjectTimeTrackingContentProps {
  projectId: string
  initialTimeEntries: TimeEntry[]
}

export function ProjectTimeTrackingContent({ projectId, initialTimeEntries }: ProjectTimeTrackingContentProps) {
  const [timeEntries] = useState(initialTimeEntries)

  // Calculate metrics
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)
  const billableHours = timeEntries.filter((e) => e.billable).reduce((sum, entry) => sum + entry.hours, 0)
  const nonBillableHours = totalHours - billableHours
  const billablePercentage = totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0

  // Group by week
  const thisWeekEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.date)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return entryDate >= weekAgo && entryDate <= now
  })
  const thisWeekHours = thisWeekEntries.reduce((sum, entry) => sum + entry.hours, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Time Tracking
        </h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Log Time
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-panel border-blue-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {totalHours.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">All time entries</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-green-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {billableHours.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">{billablePercentage}% of total</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-orange-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Billable</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {nonBillableHours.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">{100 - billablePercentage}% of total</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-purple-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {thisWeekHours.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries Table */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No time entries yet</p>
            ) : (
              <div className="space-y-2">
                {timeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{format(new Date(entry.date), "MMM d, yyyy")}</span>
                      </div>

                      <div className="flex-1">
                        <div className="font-medium">
                          {entry.employee.first_name} {entry.employee.last_name}
                        </div>
                        {entry.task && <div className="text-sm text-muted-foreground">{entry.task.title}</div>}
                        {entry.description && (
                          <div className="text-sm text-muted-foreground mt-1">{entry.description}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={entry.billable ? "default" : "secondary"}>
                          {entry.billable ? "Billable" : "Non-Billable"}
                        </Badge>
                        <div className="flex items-center gap-1 min-w-[60px]">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{entry.hours}h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
