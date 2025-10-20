export const dynamic = "force-dynamic"

import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, FileText, Upload, AlertCircle, Shield, Sparkles } from "lucide-react"
import { verifyCandidateToken } from "@/app/(dashboard)/talent/onboarding/actions"

export default async function CandidatePortalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  await cookies()
  const { token } = await params

  const result = await verifyCandidateToken(token)
  if (!result.success || !result.data) {
    notFound()
  }

  const { hire, tasks } = result.data

  const pendingTasks = tasks.filter((t: any) => t.status === "pending" && t.owner === "candidate")
  const completedTasks = tasks.filter((t: any) => t.status === "completed" && t.owner === "candidate")
  const totalCandidateTasks = pendingTasks.length + completedTasks.length
  const progress = totalCandidateTasks > 0 ? Math.round((completedTasks.length / totalCandidateTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 px-4 py-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">Welcome to Your Onboarding Portal</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome, {hire.first_name}!
          </h1>
          <p className="text-lg text-slate-400">
            We're excited to have you join us as a <span className="text-slate-200 font-medium">{hire.job_title}</span>
          </p>
          <p className="text-sm text-slate-500">Start Date: {new Date(hire.start_date).toLocaleDateString()}</p>
        </div>

        {/* Progress Card */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200">Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Onboarding Completion</span>
                <span className="font-semibold text-slate-200">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="h-4 w-4" />
                  Pending Tasks
                </div>
                <p className="text-3xl font-bold text-yellow-400">{pendingTasks.length}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                </div>
                <p className="text-3xl font-bold text-green-400">{completedTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200">Tasks to Complete</h2>
            {pendingTasks.map((task: any) => (
              <Card key={task.id} className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {task.task_type === "form" && <FileText className="h-5 w-5 text-cyan-400" />}
                          {task.task_type === "upload" && <Upload className="h-5 w-5 text-blue-400" />}
                          {task.task_type === "background_check" && <Shield className="h-5 w-5 text-purple-400" />}
                          {!["form", "upload", "background_check"].includes(task.task_type) && (
                            <AlertCircle className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-200">{task.title}</h3>
                            {task.is_required && (
                              <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">Required</Badge>
                            )}
                          </div>
                          {task.description && <p className="text-sm text-slate-400">{task.description}</p>}
                          {task.due_date && (
                            <p className="text-xs text-slate-500">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                      {task.task_type === "form" && "Fill Form"}
                      {task.task_type === "upload" && "Upload Document"}
                      {task.task_type === "background_check" && "Start Check"}
                      {!["form", "upload", "background_check"].includes(task.task_type) && "Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200">Completed Tasks</h2>
            {completedTasks.map((task: any) => (
              <Card key={task.id} className="border-slate-800 bg-slate-900/50 backdrop-blur-sm opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-200">{task.title}</h3>
                      {task.completed_at && (
                        <p className="text-xs text-slate-500">
                          Completed on {new Date(task.completed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* All Done Message */}
        {pendingTasks.length === 0 && completedTasks.length > 0 && (
          <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-400">All Tasks Complete!</h3>
              <p className="text-slate-300">
                You've completed all your onboarding tasks. We'll see you on your start date!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-400">
                Need help? Contact your HR representative or email{" "}
                <a href="mailto:hr@company.com" className="text-cyan-400 hover:text-cyan-300">
                  hr@company.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
