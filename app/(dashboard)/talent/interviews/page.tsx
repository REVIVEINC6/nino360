import { cookies } from "next/headers"
import { InterviewsHeader } from "@/components/talent-interviews/interviews-header"
import { InterviewCard } from "@/components/talent-interviews/interview-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, TrendingUp, Clock } from "lucide-react"
import { listInterviews, getCalibrationMetrics, getAuditMini } from "./actions"
import { SchedulerShell } from "@/components/talent-interviews/scheduler-shell"
import { FeedbackCenter } from "@/components/talent-interviews/feedback-center"
import { CalibrationPanel } from "@/components/talent-interviews/calibration-panel"

export const dynamic = "force-dynamic"

export default async function InterviewsPage() {
  await cookies()

  // Fetch data
  const interviews = await listInterviews()
  const calibrationMetrics = await getCalibrationMetrics()
  const auditLogs = await getAuditMini()

  // Calculate KPIs
  const totalInterviews = interviews.length
  const scheduledCount = interviews.filter((i) => i.status === "scheduled").length
  const completedCount = interviews.filter((i) => i.status === "completed").length
  const noShowCount = interviews.filter((i) => i.status === "no_show").length

  // Mock feedback data for demo
  const feedbackData = [
    {
      interview: { round_name: "Technical Round 1" },
      candidate: "John Doe",
      panel: [{}, {}],
      avg_score: 4.2,
      consensus: "agree" as const,
      overdue: false,
    },
    {
      interview: { round_name: "System Design" },
      candidate: "Jane Smith",
      panel: [{}, {}, {}],
      avg_score: 3.8,
      consensus: "partial" as const,
      overdue: true,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Interviews
          </h1>
          <p className="text-muted-foreground">Panel scheduling, workspace, feedback & calibration</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-violet-500/20 bg-linear-to-br from-background to-violet-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-linear-to-br from-background to-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-linear-to-br from-background to-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalInterviews > 0 ? Math.round((completedCount / totalInterviews) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-linear-to-br from-background to-red-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">No Shows</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{noShowCount}</div>
            <p className="text-xs text-muted-foreground">Requires follow-up</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="list">Interview List</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Center</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* Interview List */}
        <TabsContent value="list" className="space-y-4">
          <InterviewsHeader />

          {interviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No interviews scheduled</h3>
                <p className="text-sm text-muted-foreground">Use the scheduler to find available slots</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Scheduler */}
        <TabsContent value="scheduler">
          <SchedulerShell />
        </TabsContent>

        {/* Feedback Center */}
        <TabsContent value="feedback">
          <FeedbackCenter feedbacks={feedbackData} />
        </TabsContent>

        {/* Calibration */}
        <TabsContent value="calibration">
          <CalibrationPanel metrics={calibrationMetrics} />
        </TabsContent>

        {/* Audit Trail */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No audit logs found</p>
                ) : (
                  auditLogs.map((log: any) => (
                    <div key={log.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{log.action}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{log.entity}</p>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600">
                        Valid
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
