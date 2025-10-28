"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, XCircle, TrendingUp, DollarSign, Calendar, Clock } from "lucide-react"
import { getProjectHealthMetrics } from "@/app/(dashboard)/projects/health/actions"
import Link from "next/link"

type ProjectHealth = {
  id: string
  name: string
  status: string
  progress: number
  budget: number
  budgetUsed: number
  budgetPercentage: number
  daysRemaining: number
  totalTasks: number
  totalHours: number
  health: "healthy" | "at_risk" | "critical"
  healthScore: number
}

export function ProjectHealthContent() {
  const [projects, setProjects] = useState<ProjectHealth[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHealthMetrics()
  }, [])

  async function loadHealthMetrics() {
    try {
      const data = await getProjectHealthMetrics()
      setProjects(data)
    } catch (error) {
      console.error("Failed to load health metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const healthyCount = projects.filter((p) => p.health === "healthy").length
  const atRiskCount = projects.filter((p) => p.health === "at_risk").length
  const criticalCount = projects.filter((p) => p.health === "critical").length

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-white/40 backdrop-blur-xl border-white/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Healthy Projects</p>
              <p className="text-2xl font-bold">{healthyCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/40 backdrop-blur-xl border-white/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">At Risk</p>
              <p className="text-2xl font-bold">{atRiskCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/40 backdrop-blur-xl border-white/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold">{criticalCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Project Health List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="p-6 bg-white/40 backdrop-blur-xl border-white/20 hover:bg-white/60 transition-all cursor-pointer">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          project.health === "healthy"
                            ? "default"
                            : project.health === "at_risk"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {project.health === "healthy" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {project.health === "at_risk" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {project.health === "critical" && <XCircle className="h-3 w-3 mr-1" />}
                        {project.health.replace("_", " ").toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Health Score: {project.healthScore}/100</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      Progress
                    </div>
                    <div className="space-y-1">
                      <Progress value={project.progress} className="h-2" />
                      <p className="text-sm font-medium">{project.progress}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Budget
                    </div>
                    <div className="space-y-1">
                      <Progress value={project.budgetPercentage} className="h-2" />
                      <p className="text-sm font-medium">
                        ${project.budgetUsed.toLocaleString()} / ${project.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Days Remaining
                    </div>
                    <p className="text-2xl font-bold">{project.daysRemaining}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Total Hours
                    </div>
                    <p className="text-2xl font-bold">{project.totalHours}</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
