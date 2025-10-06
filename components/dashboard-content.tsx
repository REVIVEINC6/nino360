"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Target,
  TrendingUp,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  DollarSign,
  UserCheck,
  Building2,
  Star,
  FolderOpen,
  Settings,
  Award,
  Activity,
  Eye,
  Plus,
  ArrowRight,
  Search,
  Filter,
  Download,
  RefreshCw,
  Maximize2,
  MoreHorizontal,
} from "lucide-react"

const moduleStats = [
  {
    name: "CRM",
    icon: Target,
    color: "bg-blue-500",
    stats: { active: 156, pending: 23, completed: 89 },
    trend: "+12%",
    description: "Customer relationship management and sales pipeline",
  },
  {
    name: "Talent",
    icon: UserCheck,
    color: "bg-green-500",
    stats: { active: 89, pending: 15, completed: 67 },
    trend: "+8%",
    description: "Talent acquisition and recruitment management",
  },
  {
    name: "HRMS",
    icon: Users,
    color: "bg-purple-500",
    stats: { active: 234, pending: 12, completed: 156 },
    trend: "+15%",
    description: "Human resource management system",
  },
  {
    name: "Finance",
    icon: DollarSign,
    color: "bg-yellow-500",
    stats: { active: 45, pending: 8, completed: 78 },
    trend: "+6%",
    description: "Financial management and accounting",
  },
  {
    name: "VMS",
    icon: Building2,
    color: "bg-red-500",
    stats: { active: 67, pending: 19, completed: 34 },
    trend: "+10%",
    description: "Vendor management system",
  },
  {
    name: "Training",
    icon: Award,
    color: "bg-indigo-500",
    stats: { active: 123, pending: 25, completed: 89 },
    trend: "+18%",
    description: "Learning and development platform",
  },
  {
    name: "Project",
    icon: FolderOpen,
    color: "bg-orange-500",
    stats: { active: 78, pending: 14, completed: 45 },
    trend: "+22%",
    description: "Project management and collaboration",
  },
  {
    name: "Bench",
    icon: Clock,
    color: "bg-teal-500",
    stats: { active: 34, pending: 7, completed: 23 },
    trend: "+5%",
    description: "Bench management and resource allocation",
  },
  {
    name: "Hotlist",
    icon: Star,
    color: "bg-pink-500",
    stats: { active: 56, pending: 11, completed: 78 },
    trend: "+14%",
    description: "Priority candidate and requirement tracking",
  },
  {
    name: "Admin",
    icon: Settings,
    color: "bg-gray-500",
    stats: { active: 12, pending: 3, completed: 89 },
    trend: "+3%",
    description: "System administration and configuration",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "crm",
    title: "New lead added to pipeline",
    description: "TechCorp Solutions - Senior Developer position",
    time: "2 minutes ago",
    user: "Sarah Johnson",
  avatar: "/nino360-primary.png?height=32&width=32",
    priority: "high",
  },
  {
    id: 2,
    type: "talent",
    title: "Interview scheduled",
    description: "John Doe - React Developer interview at 3 PM",
    time: "15 minutes ago",
    user: "Mike Chen",
  avatar: "/nino360-primary.png?height=32&width=32",
    priority: "medium",
  },
  {
    id: 3,
    type: "hrms",
    title: "Employee onboarding completed",
    description: "Emily Davis successfully onboarded to Development team",
    time: "1 hour ago",
    user: "Lisa Wang",
  avatar: "/nino360-primary.png?height=32&width=32",
    priority: "low",
  },
  {
    id: 4,
    type: "project",
    title: "Project milestone reached",
    description: "Nino360 Platform Redesign - 75% completion milestone",
    time: "2 hours ago",
    user: "David Kim",
  avatar: "/nino360-primary.png?height=32&width=32",
    priority: "high",
  },
  {
    id: 5,
    type: "finance",
    title: "Invoice processed",
    description: "Q4 2024 vendor payments processed successfully",
    time: "3 hours ago",
    user: "Maria Garcia",
  avatar: "/nino360-primary.png?height=32&width=32",
    priority: "medium",
  },
]

const upcomingTasks = [
  {
    id: 1,
    title: "Review candidate applications",
    module: "Talent",
    dueDate: "Today, 2:00 PM",
    priority: "High",
    assignee: "Sarah Johnson",
    progress: 60,
  },
  {
    id: 2,
    title: "Client presentation preparation",
    module: "CRM",
    dueDate: "Tomorrow, 10:00 AM",
    priority: "High",
    assignee: "Mike Chen",
    progress: 30,
  },
  {
    id: 3,
    title: "Monthly payroll processing",
    module: "HRMS",
    dueDate: "Dec 30, 2024",
    priority: "Medium",
    assignee: "Emily Davis",
    progress: 80,
  },
  {
    id: 4,
    title: "Vendor contract renewal",
    module: "VMS",
    dueDate: "Jan 5, 2025",
    priority: "Medium",
    assignee: "David Kim",
    progress: 45,
  },
  {
    id: 5,
    title: "Training module update",
    module: "Training",
    dueDate: "Jan 10, 2025",
    priority: "Low",
    assignee: "Lisa Wang",
    progress: 20,
  },
]

const keyMetrics = [
  {
    title: "Total Revenue",
    value: "$2.4M",
    change: "+12.5%",
    trend: "up",
    description: "vs last quarter",
  },
  {
    title: "Active Clients",
    value: "156",
    change: "+8.2%",
    trend: "up",
    description: "vs last month",
  },
  {
    title: "Placement Rate",
    value: "87%",
    change: "+3.1%",
    trend: "up",
    description: "vs last quarter",
  },
  {
    title: "Employee Satisfaction",
    value: "4.8/5",
    change: "+0.2",
    trend: "up",
    description: "vs last survey",
  },
]

export function DashboardContent() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "crm":
        return Target
      case "talent":
        return UserCheck
      case "hrms":
        return Users
      case "project":
        return FolderOpen
      case "finance":
        return DollarSign
      default:
        return Activity
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening across your Nino360 platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <TrendingUp className={`h-4 w-4 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>{metric.change}</span>{" "}
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Latest updates across all modules</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.slice(0, 5).map((activity) => {
                    const IconComponent = getActivityIcon(activity.type)
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${activity.priority === "high" ? "bg-red-100" : activity.priority === "medium" ? "bg-yellow-100" : "bg-green-100"}`}
                        >
                          <IconComponent
                            className={`h-4 w-4 ${activity.priority === "high" ? "text-red-600" : activity.priority === "medium" ? "text-yellow-600" : "text-green-600"}`}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{activity.time}</span>
                            <span>•</span>
                            <span>by {activity.user}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type.toUpperCase()}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Tasks</CardTitle>
                    <CardDescription>Tasks requiring your attention</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{task.module}</span>
                            <span>•</span>
                            <span>{task.dueDate}</span>
                            <span>•</span>
                            <span>{task.assignee}</span>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Performance Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Module Performance</CardTitle>
                  <CardDescription>Activity and performance metrics across all modules</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {moduleStats.slice(0, 5).map((module, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${module.color} text-white`}>
                        <module.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{module.name}</p>
                        <p className="text-xs text-muted-foreground">{module.trend}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{module.stats.active}</div>
                        <div className="text-xs text-muted-foreground">Active</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-600">{module.stats.pending}</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{module.stats.completed}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {moduleStats.map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${module.color} text-white`}>
                        <module.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <CardDescription className="text-sm">{module.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {module.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{module.stats.active}</div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{module.stats.pending}</div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{module.stats.completed}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Open Module
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Activities</CardTitle>
                  <CardDescription>Complete activity feed across all modules</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type)
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.avatar || "/nino360-primary.png"} />
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{activity.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {activity.type.toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(activity.priority)}>{activity.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.time}</span>
                          <span>•</span>
                          <span>by {activity.user}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Task Management</CardTitle>
                  <CardDescription>All tasks across modules with priorities and deadlines</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="space-y-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{task.module}</Badge>
                          <span>•</span>
                          <Calendar className="h-3 w-3" />
                          <span>{task.dueDate}</span>
                          <span>•</span>
                          <Users className="h-3 w-3" />
                          <span>{task.assignee}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
