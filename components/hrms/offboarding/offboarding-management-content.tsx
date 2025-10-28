"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, AlertTriangle, TrendingUp, TrendingDown, CheckCircle2, Clock } from "lucide-react"
import useSWR from "swr"
import { getOffboardingOverview, getExitChecklists } from "@/app/(dashboard)/hrms/offboarding/actions"

export function OffboardingManagementContent() {
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
    return (
      <div className="glass-card p-6 rounded-xl">
        <p className="text-red-600">Error loading offboarding data</p>
      </div>
    )
  }

  if (!overview || !exits) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <p className="text-gray-600">Loading offboarding data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card p-6 rounded-xl border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active Exits</p>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {overview.activeExits}
          </p>
          <p className="text-xs text-gray-500 mt-1">In progress</p>
        </Card>

        <Card className="glass-card p-6 rounded-xl border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending Tasks</p>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {overview.pendingTasks}
          </p>
          <p className="text-xs text-orange-600 mt-1">Requires attention</p>
        </Card>

        <Card className="glass-card p-6 rounded-xl border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Completed</p>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {overview.completedThisQuarter}
          </p>
          <p className="text-xs text-gray-500 mt-1">This quarter</p>
        </Card>

        <Card className="glass-card p-6 rounded-xl border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg Completion</p>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            12.5d
          </p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            2.3 days faster
          </p>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="glass-card p-6 rounded-xl border-0">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Insights
          </span>
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-1">Knowledge Transfer Risk</p>
            <p className="text-xs text-blue-700">3 exits lack documented handover plans</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-1">Automation Success</p>
            <p className="text-xs text-green-700">87% of tasks auto-completed via RPA</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm font-medium text-orange-900 mb-1">Equipment Recovery</p>
            <p className="text-xs text-orange-700">5 items pending return from exits</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="exits" className="space-y-4">
        <TabsList className="glass-card border-0">
          <TabsTrigger value="exits">Exit Checklists</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="exits" className="space-y-4">
          <Card className="glass-card p-6 rounded-xl border-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Active Exit Checklists</h3>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Start New Exit</Button>
            </div>
            <div className="space-y-4">
              {exits.map((exit: any) => (
                <Card
                  key={exit.id}
                  className="p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {exit.employees.first_name} {exit.employees.last_name}
                        </p>
                        {exit.urgent && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      </div>
                      <p className="text-sm text-gray-600">{exit.employees.job_title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          Last day: {new Date(exit.last_day).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={exit.urgent ? "destructive" : "secondary"}
                      className={exit.urgent ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}
                    >
                      {exit.urgent ? "Urgent" : "On Track"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Exit Checklist Progress</span>
                      <span className="font-medium text-gray-900">{exit.progress}%</span>
                    </div>
                    <Progress value={exit.progress} className="h-2" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 bg-white/50 hover:bg-white/80 border-gray-200"
                  >
                    View Checklist
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card className="glass-card p-6 rounded-xl border-0">
            <h3 className="text-lg font-semibold mb-4">Pending Tasks</h3>
            <p className="text-gray-600">Task management interface coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card className="glass-card p-6 rounded-xl border-0">
            <h3 className="text-lg font-semibold mb-4">Equipment Recovery</h3>
            <p className="text-gray-600">Equipment tracking interface coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="glass-card p-6 rounded-xl border-0">
            <h3 className="text-lg font-semibold mb-4">Offboarding Analytics</h3>
            <p className="text-gray-600">Analytics dashboard coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
