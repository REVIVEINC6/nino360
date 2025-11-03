"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  Settings,
} from "lucide-react"
import Link from "next/link"

interface ProjectDetailContentProps {
  project: any
}

export function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const completedTasks = project.tasks?.filter((t: any) => t.status === "completed").length || 0
  const totalTasks = project.tasks?.length || 0
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const upcomingMilestones =
    project.milestones?.filter((m: any) => m.status !== "completed" && new Date(m.due_date) > new Date()).slice(0, 3) ||
    []

  const statusColors = {
    active: "bg-green-500/10 text-green-700 border-green-500/20",
    planning: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    on_hold: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    completed: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  }

  const priorityColors = {
    high: "bg-red-500/10 text-red-700 border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    low: "bg-green-500/10 text-green-700 border-green-500/20",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {project.name}
            </h1>
            <Badge className={statusColors[project.status as keyof typeof statusColors]}>{project.status}</Badge>
            <Badge className={priorityColors[project.priority as keyof typeof priorityColors]}>
              {project.priority} priority
            </Badge>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 bg-linear-to-br from-blue-50 to-purple-50 border-blue-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold text-blue-700">{Math.round(progress)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <Progress value={progress} className="mt-3" />
        </Card>

        <Card className="p-6 bg-linear-to-br from-purple-50 to-pink-50 border-purple-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Budget</p>
              <p className="text-2xl font-bold text-purple-700">${project.budget?.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">${project.spent?.toLocaleString()} spent</p>
        </Card>

        <Card className="p-6 bg-linear-to-br from-pink-50 to-orange-50 border-pink-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team</p>
              <p className="text-2xl font-bold text-pink-700">{project.team?.length || 0}</p>
            </div>
            <Users className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">members</p>
        </Card>

        <Card className="p-6 bg-linear-to-br from-green-50 to-teal-50 border-green-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tasks</p>
              <p className="text-2xl font-bold text-green-700">
                {completedTasks}/{totalTasks}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">completed</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Project Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Timeline</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(project.start_date).toLocaleDateString()} -{" "}
                  {new Date(project.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Client</p>
                <p className="text-sm text-muted-foreground">{project.client?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-muted-foreground capitalize">{project.type}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Members */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Team Members</h2>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
          <div className="space-y-3">
            {project.team?.slice(0, 5).map((member: any) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.employee.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {member.employee.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.employee.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Badge variant="outline">{member.allocation}%</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Milestones */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Milestones</h2>
            <Link href={`/projects/${project.id}/milestones`}>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingMilestones.length > 0 ? (
              upcomingMilestones.map((milestone: any) => (
                <div key={milestone.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {new Date(milestone.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Progress value={milestone.completion} className="w-20" />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming milestones</p>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Task completed</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Team member added</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Milestone at risk</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
