"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, CheckCircle2, TrendingUp, Calendar, FileText, Mail, AlertCircle, Sparkles } from "lucide-react"
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
    return (
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>Error loading onboarding data</span>
        </div>
      </div>
    )
  }

  if (!overview || !newHires) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
          <span>Loading onboarding data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card p-6 rounded-xl border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <Badge className="bg-blue-100 text-blue-700 border-0">Active</Badge>
          </div>
          <p className="text-3xl font-bold text-gray-900">{overview.activeOnboarding}</p>
          <p className="text-sm text-gray-600 mt-1">Active Onboarding</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>New hires in progress</span>
          </div>
        </Card>

        <Card className="glass-card p-6 rounded-xl border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <Badge className="bg-green-100 text-green-700 border-0">Rate</Badge>
          </div>
          <p className="text-3xl font-bold text-gray-900">{overview.completionRate}%</p>
          <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Last 90 days</span>
          </div>
        </Card>

        <Card className="glass-card p-6 rounded-xl border-0 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <Badge className="bg-purple-100 text-purple-700 border-0">Time</Badge>
          </div>
          <p className="text-3xl font-bold text-gray-900">{overview.avgDays}</p>
          <p className="text-sm text-gray-600 mt-1">Avg. Days to Complete</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <TrendingUp className="h-3 w-3" />
            <span>Industry avg: 30 days</span>
          </div>
        </Card>

        <Card className="glass-card p-6 rounded-xl border-0 hover:scale-105 transition-transform bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="h-5 w-5 text-white" />
            <Badge className="bg-white/20 text-white border-0">AI</Badge>
          </div>
          <p className="text-3xl font-bold text-white">94%</p>
          <p className="text-sm text-white/90 mt-1">Automation Rate</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-white/80">
            <CheckCircle2 className="h-3 w-3" />
            <span>Tasks automated</span>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="glass-card p-6 rounded-xl border-0">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-sm font-medium text-blue-900 mb-1">Onboarding Efficiency</p>
            <p className="text-xs text-blue-700">
              Your onboarding completion rate is 15% higher than industry average. Consider sharing best practices.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
            <p className="text-sm font-medium text-amber-900 mb-1">Document Collection</p>
            <p className="text-xs text-amber-700">
              3 new hires have pending I-9 documents. Automated reminders will be sent in 2 days.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-green-50 border border-green-100">
            <p className="text-sm font-medium text-green-900 mb-1">Equipment Provisioning</p>
            <p className="text-xs text-green-700">
              All equipment orders for upcoming starts are on track. No delays expected.
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="new-hires" className="space-y-4">
        <TabsList className="glass-card border-0">
          <TabsTrigger value="new-hires">New Hires</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="new-hires" className="space-y-4">
          <Card className="glass-card p-6 rounded-xl border-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">New Hires</h3>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <Users className="h-4 w-4 mr-2" />
                Add New Hire
              </Button>
            </div>
            <div className="space-y-4">
              {newHires.map((hire: any) => (
                <Card key={hire.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {hire.employees.first_name} {hire.employees.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{hire.employees.job_title}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Starts {new Date(hire.start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {Math.ceil((new Date(hire.start_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                            until start
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        hire.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700 border-0"
                          : "bg-gray-100 text-gray-700 border-0"
                      }
                    >
                      {hire.status === "IN_PROGRESS" ? "In Progress" : "Pending"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Onboarding Progress</span>
                      <span className="font-semibold text-gray-900">{hire.progress}%</span>
                    </div>
                    <Progress value={hire.progress} className="h-2" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      View Checklist
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="checklists">
          <Card className="glass-card p-6 rounded-xl border-0">
            <p className="text-gray-600">Onboarding checklists and task templates</p>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="glass-card p-6 rounded-xl border-0">
            <p className="text-gray-600">Document collection and verification</p>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card className="glass-card p-6 rounded-xl border-0">
            <p className="text-gray-600">Equipment provisioning and tracking</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
