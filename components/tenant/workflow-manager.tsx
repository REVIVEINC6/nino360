"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Workflow, Play, Pause, CheckCircle, Clock, AlertCircle, Users, Calendar, BarChart3 } from "lucide-react"

interface WorkflowStep {
  id: string
  name: string
  status: "pending" | "in_progress" | "completed" | "failed"
  assignee?: {
    name: string
    avatar?: string
  }
  dueDate?: Date
  completedAt?: Date
}

interface WorkflowInstance {
  id: string
  name: string
  template: string
  status: "draft" | "active" | "paused" | "completed" | "failed"
  progress: number
  steps: WorkflowStep[]
  createdAt: Date
  updatedAt: Date
  assignedTo: string[]
}

export function WorkflowManager() {
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")

  useEffect(() => {
    // Simulate workflow data loading
    const mockWorkflows: WorkflowInstance[] = [
      {
        id: "1",
        name: "Customer Onboarding - Acme Corp",
        template: "Customer Onboarding",
        status: "active",
        progress: 65,
        steps: [
          {
            id: "1",
            name: "Document Collection",
            status: "completed",
            assignee: { name: "Sarah Johnson", avatar: "/avatars/sarah.jpg" },
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            id: "2",
            name: "KYC Verification",
            status: "completed",
            assignee: { name: "Mike Chen", avatar: "/avatars/mike.jpg" },
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
          {
            id: "3",
            name: "Risk Assessment",
            status: "in_progress",
            assignee: { name: "Emily Davis", avatar: "/avatars/emily.jpg" },
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          },
          {
            id: "4",
            name: "Account Setup",
            status: "pending",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        assignedTo: ["Sarah Johnson", "Mike Chen", "Emily Davis"],
      },
      {
        id: "2",
        name: "Employee Onboarding - John Doe",
        template: "Employee Onboarding",
        status: "active",
        progress: 30,
        steps: [
          {
            id: "1",
            name: "Contract Signing",
            status: "completed",
            assignee: { name: "HR Team", avatar: "/avatars/hr.jpg" },
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
          {
            id: "2",
            name: "IT Setup",
            status: "in_progress",
            assignee: { name: "IT Support", avatar: "/avatars/it.jpg" },
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          },
          {
            id: "3",
            name: "Training Schedule",
            status: "pending",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        assignedTo: ["HR Team", "IT Support"],
      },
      {
        id: "3",
        name: "Compliance Review - Q4 2024",
        template: "Compliance Review",
        status: "completed",
        progress: 100,
        steps: [
          {
            id: "1",
            name: "Data Collection",
            status: "completed",
            assignee: { name: "Compliance Team", avatar: "/avatars/compliance.jpg" },
            completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            id: "2",
            name: "Review & Analysis",
            status: "completed",
            assignee: { name: "Legal Team", avatar: "/avatars/legal.jpg" },
            completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            id: "3",
            name: "Report Generation",
            status: "completed",
            assignee: { name: "Compliance Team", avatar: "/avatars/compliance.jpg" },
            completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        assignedTo: ["Compliance Team", "Legal Team"],
      },
    ]

    setTimeout(() => {
      setWorkflows(mockWorkflows)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "active":
      case "in_progress":
        return <Play className="h-4 w-4 text-blue-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "in_progress":
        return "text-blue-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-gray-500"
    }
  }

  const filteredWorkflows = workflows.filter((workflow) => {
    switch (activeTab) {
      case "active":
        return ["active", "in_progress"].includes(workflow.status)
      case "completed":
        return workflow.status === "completed"
      case "all":
        return true
      default:
        return true
    }
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Workflow Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Workflow className="h-5 w-5" />
          Workflow Manager
        </CardTitle>
        <CardDescription>Manage and track workflow automation across your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <ScrollArea className="h-96">
              {filteredWorkflows.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No workflows found</div>
              ) : (
                <div className="space-y-4">
                  {filteredWorkflows.map((workflow) => (
                    <div key={workflow.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(workflow.status)}
                            <h4 className="font-semibold">{workflow.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">Template: {workflow.template}</p>
                        </div>
                        <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{workflow.progress}%</span>
                        </div>
                        <Progress value={workflow.progress} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Steps</h5>
                        <div className="space-y-2">
                          {workflow.steps.map((step, index) => (
                            <div key={step.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                                <span className={getStepStatusColor(step.status)}>{step.name}</span>
                                {step.assignee && (
                                  <div className="flex items-center gap-1">
                                    <Avatar className="h-4 w-4">
                                      <AvatarImage src={step.assignee.avatar || "/placeholder.svg"} />
                                      <AvatarFallback className="text-xs">
                                        {step.assignee.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">{step.assignee.name}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {step.dueDate && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {step.dueDate.toLocaleDateString()}
                                  </div>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {step.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {workflow.assignedTo.length} team members
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {workflow.status === "active" && (
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-1" />
                              Continue
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
