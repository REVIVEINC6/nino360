"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react"

const activities = [
  {
    id: 1,
    type: "email",
    title: "Email sent to TechCorp Inc.",
    description: "Follow-up on enterprise software proposal",
    contact: "John Smith",
    company: "TechCorp Inc.",
    avatar: "/placeholder.svg?height=32&width=32&text=JS",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "call",
    title: "Call completed with DataFlow Solutions",
    description: "Discussed cloud migration requirements and timeline",
    contact: "Sarah Johnson",
    company: "DataFlow Solutions",
    avatar: "/placeholder.svg?height=32&width=32&text=SJ",
    timestamp: "4 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "meeting",
    title: "Meeting scheduled with CloudTech Ltd.",
    description: "Product demo and technical discussion",
    contact: "Mike Chen",
    company: "CloudTech Ltd.",
    avatar: "/placeholder.svg?height=32&width=32&text=MC",
    timestamp: "6 hours ago",
    status: "scheduled",
  },
]

const tasks = [
  {
    id: 1,
    title: "Follow up on TechCorp proposal",
    description: "Check if they need any clarifications on pricing",
    contact: "John Smith",
    company: "TechCorp Inc.",
    dueDate: "Today",
    priority: "High",
    status: "pending",
  },
  {
    id: 2,
    title: "Prepare demo for CloudTech",
    description: "Customize demo to show AI analytics features",
    contact: "Mike Chen",
    company: "CloudTech Ltd.",
    dueDate: "Tomorrow",
    priority: "Medium",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Send contract to DataFlow",
    description: "Final contract with agreed terms and conditions",
    contact: "Sarah Johnson",
    company: "DataFlow Solutions",
    dueDate: "Jan 20",
    priority: "High",
    status: "pending",
  },
]

export default function EngagementsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "call":
        return <Phone className="h-4 w-4 text-green-500" />
      case "meeting":
        return <Calendar className="h-4 w-4 text-purple-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engagements</h1>
          <p className="text-muted-foreground">Activity log, task tracking, and AI reminders</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Activity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+18.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">5 due today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Mail className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reminders">AI Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Complete timeline of customer interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        {getStatusIcon(activity.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {activity.contact}
                        </div>
                        <span>•</span>
                        <span>{activity.company}</span>
                        <span>•</span>
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.contact} />
                      <AvatarFallback>
                        {activity.contact
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Track and manage your sales tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.contact}
                        </div>
                        <span>•</span>
                        <span>{task.company}</span>
                        <span>•</span>
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Mark Complete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Reminders</CardTitle>
              <CardDescription>Smart suggestions to keep your deals moving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-800">Follow-up Overdue</h4>
                      <p className="text-sm text-orange-600 mb-2">
                        TechCorp Inc. deal hasn't been contacted in 7 days. High-value opportunity at risk.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Send Email
                        </Button>
                        <Button size="sm" variant="outline">
                          Schedule Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-800">Meeting Preparation</h4>
                      <p className="text-sm text-blue-600 mb-2">
                        Demo with CloudTech Ltd. tomorrow. Prepare AI analytics showcase.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Prepare Demo
                        </Button>
                        <Button size="sm" variant="outline">
                          Review Notes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800">Ready to Close</h4>
                      <p className="text-sm text-green-600 mb-2">
                        DataFlow Solutions shows 95% close probability. Send final proposal.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Send Proposal
                        </Button>
                        <Button size="sm" variant="outline">
                          Schedule Closing Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
