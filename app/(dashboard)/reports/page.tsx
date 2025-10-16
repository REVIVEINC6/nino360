import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Users, DollarSign, Briefcase } from "lucide-react"
import { ReportFilters } from "@/components/reports/report-filters"
import { AnalyticsCharts } from "@/components/reports/analytics-charts"
import { AICopilot } from "@/components/ai/ai-copilot"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Advanced analytics and AI-powered insights</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export All Reports
        </Button>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsCharts />
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <ReportFilters />

          {/* Report Categories */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>
                <CardTitle className="mt-4">Revenue Analytics</CardTitle>
                <CardDescription>Financial performance, revenue trends, and profit margins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">$2.8M</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Growth Rate</p>
                    <p className="text-2xl font-bold text-green-600">+18%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>
                <CardTitle className="mt-4">Talent Pipeline</CardTitle>
                <CardDescription>Candidate flow, placement rates, and hiring metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Active Candidates</p>
                    <p className="text-2xl font-bold">1,284</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Placement Rate</p>
                    <p className="text-2xl font-bold text-green-600">68%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>
                <CardTitle className="mt-4">Client Performance</CardTitle>
                <CardDescription>Client revenue, retention, and satisfaction metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Active Clients</p>
                    <p className="text-2xl font-bold">94</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Retention Rate</p>
                    <p className="text-2xl font-bold text-green-600">92%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>
                <CardTitle className="mt-4">Project Analytics</CardTitle>
                <CardDescription>Project completion rates, budget utilization, and timelines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold">18</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">On-Time Rate</p>
                    <p className="text-2xl font-bold text-green-600">85%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AICopilot />
        </TabsContent>
      </Tabs>
    </div>
  )
}
