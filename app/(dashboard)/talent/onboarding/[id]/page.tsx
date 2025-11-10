export const dynamic = "force-dynamic"

import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  FileText,
  Shield,
  Package,
  GraduationCap,
  LinkIcon,
} from "lucide-react"
import { getHireDetail } from "../actions"
import { TaskCard } from "@/components/talent-onboarding/task-card"
import { BackgroundPanel } from "@/components/talent-onboarding/background-panel"
import { EquipmentPanel } from "@/components/talent-onboarding/equipment-panel"

export default async function HireWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await cookies()
  const { id } = await params

  const result = await getHireDetail(id)
  if (!result.success || !result.data) {
    notFound()
  }

  const hire = result.data

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    in_progress: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    completed: "bg-green-500/20 text-green-300 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  }

  const tasksByStatus = {
    pending: hire.tasks?.filter((t: any) => t.status === "pending") || [],
    in_progress: hire.tasks?.filter((t: any) => t.status === "in_progress") || [],
    completed: hire.tasks?.filter((t: any) => t.status === "completed") || [],
    blocked: hire.tasks?.filter((t: any) => t.status === "blocked") || [],
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {hire.first_name} {hire.last_name}
              </h1>
              <Badge className={statusColors[hire.status as keyof typeof statusColors]}>
                {hire.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-slate-400">
              {hire.job_title} • Hire #{hire.hire_number} • Start Date: {new Date(hire.start_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-cyan-500/30 hover:bg-cyan-500/10 bg-transparent">
              <Send className="mr-2 h-4 w-4" />
              Send Reminder
            </Button>
            <Button className="bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy Portal Link
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200">Onboarding Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Overall Completion</span>
                <span className="font-semibold text-slate-200">{hire.progress_pct}%</span>
              </div>
              <Progress value={hire.progress_pct} className="h-2" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="h-4 w-4" />
                  Pending
                </div>
                <p className="text-2xl font-bold text-yellow-400">{tasksByStatus.pending.length}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <AlertCircle className="h-4 w-4" />
                  In Progress
                </div>
                <p className="text-2xl font-bold text-blue-400">{tasksByStatus.in_progress.length}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                </div>
                <p className="text-2xl font-bold text-green-400">{tasksByStatus.completed.length}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <AlertCircle className="h-4 w-4" />
                  Blocked
                </div>
                <p className="text-2xl font-bold text-red-400">{tasksByStatus.blocked.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm text-slate-200">{hire.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm text-slate-200">{hire.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="text-sm text-slate-200">{hire.department || "Not assigned"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Manager</p>
                  <p className="text-sm text-slate-200">{hire.manager_name || "Not assigned"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="checklist" className="space-y-4">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="checklist">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="forms">
              <FileText className="mr-2 h-4 w-4" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="background">
              <Shield className="mr-2 h-4 w-4" />
              Background Check
            </TabsTrigger>
            <TabsTrigger value="equipment">
              <Package className="mr-2 h-4 w-4" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="training">
              <GraduationCap className="mr-2 h-4 w-4" />
              Training
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="space-y-4">
            {tasksByStatus.pending.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-yellow-400">Pending Tasks</h3>
                {tasksByStatus.pending.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
            {tasksByStatus.in_progress.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-400">In Progress</h3>
                {tasksByStatus.in_progress.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
            {tasksByStatus.blocked.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-red-400">Blocked</h3>
                {tasksByStatus.blocked.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
            {tasksByStatus.completed.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-green-400">Completed</h3>
                {tasksByStatus.completed.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="forms">
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Required Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hire.forms && hire.forms.length > 0 ? (
                    hire.forms.map((form: any) => (
                      <div
                        key={form.id}
                        className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 p-4"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-slate-200">{form.form_type}</p>
                          <p className="text-sm text-slate-400">
                            {form.status === "completed" ? "Submitted" : "Pending"}
                          </p>
                        </div>
                        <Badge
                          className={
                            form.status === "completed"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          }
                        >
                          {form.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-400 py-8">No forms required</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="background">
            <BackgroundPanel checks={hire.background_checks || []} />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentPanel events={hire.provisions || []} />
          </TabsContent>

          <TabsContent value="training">
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Training Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-slate-400 py-8">Training plan integration coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
