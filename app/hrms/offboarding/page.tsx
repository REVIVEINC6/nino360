"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  UserMinus,
  CheckCircle,
  Clock,
  FileText,
  User,
  Calendar,
  Target,
  Plus,
  Edit,
  Eye,
  Download,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface OffboardingEmployee {
  id: string
  name: string
  email: string
  position: string
  department: string
  lastWorkingDay: string
  reason: string
  status: "initiated" | "in-progress" | "completed" | "cancelled"
  progress: number
  manager: string
  completedTasks: number
  totalTasks: number
  exitInterviewScheduled: boolean
  exitInterviewCompleted: boolean
  documents: {
    name: string
    status: "pending" | "completed" | "not-applicable"
  }[]
}

interface OffboardingTask {
  id: string
  name: string
  description: string
  department: string
  daysBeforeLastDay: number
  required: boolean
  completed: boolean
}

export default function OffboardingPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<OffboardingEmployee[]>([])
  const [tasks, setTasks] = useState<OffboardingTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockEmployees: OffboardingEmployee[] = [
        {
          id: "1",
          name: "David Kim",
          email: "david.kim@company.com",
          position: "Sales Director",
          department: "Sales",
          lastWorkingDay: "2024-02-15",
          reason: "New Opportunity",
          status: "in-progress",
          progress: 75,
          manager: "Robert Johnson",
          completedTasks: 12,
          totalTasks: 16,
          exitInterviewScheduled: true,
          exitInterviewCompleted: false,
          documents: [
            { name: "Equipment Return", status: "completed" },
            { name: "Knowledge Transfer", status: "completed" },
            { name: "Access Revocation", status: "pending" },
            { name: "Final Payroll", status: "pending" },
            { name: "Exit Interview", status: "pending" },
          ],
        },
        {
          id: "2",
          name: "Amanda Wilson",
          email: "amanda.wilson@company.com",
          position: "HR Specialist",
          department: "HR",
          lastWorkingDay: "2024-01-31",
          reason: "Relocation",
          status: "completed",
          progress: 100,
          manager: "Jennifer Davis",
          completedTasks: 14,
          totalTasks: 14,
          exitInterviewScheduled: true,
          exitInterviewCompleted: true,
          documents: [
            { name: "Equipment Return", status: "completed" },
            { name: "Knowledge Transfer", status: "completed" },
            { name: "Access Revocation", status: "completed" },
            { name: "Final Payroll", status: "completed" },
            { name: "Exit Interview", status: "completed" },
          ],
        },
        {
          id: "3",
          name: "Tom Brown",
          email: "tom.brown@company.com",
          position: "DevOps Engineer",
          department: "Engineering",
          lastWorkingDay: "2024-02-28",
          reason: "Career Change",
          status: "initiated",
          progress: 25,
          manager: "John Smith",
          completedTasks: 4,
          totalTasks: 18,
          exitInterviewScheduled: false,
          exitInterviewCompleted: false,
          documents: [
            { name: "Equipment Return", status: "pending" },
            { name: "Knowledge Transfer", status: "pending" },
            { name: "Access Revocation", status: "pending" },
            { name: "Final Payroll", status: "pending" },
            { name: "Exit Interview", status: "pending" },
          ],
        },
      ]

      const mockTasks: OffboardingTask[] = [
        {
          id: "1",
          name: "Schedule Exit Interview",
          description: "Schedule and conduct exit interview with HR",
          department: "HR",
          daysBeforeLastDay: 7,
          required: true,
          completed: false,
        },
        {
          id: "2",
          name: "Knowledge Transfer",
          description: "Document and transfer knowledge to team members",
          department: "All",
          daysBeforeLastDay: 14,
          required: true,
          completed: false,
        },
        {
          id: "3",
          name: "Equipment Return",
          description: "Return all company equipment and assets",
          department: "IT",
          daysBeforeLastDay: 1,
          required: true,
          completed: false,
        },
        {
          id: "4",
          name: "Access Revocation",
          description: "Revoke all system access and credentials",
          department: "IT",
          daysBeforeLastDay: 0,
          required: true,
          completed: false,
        },
        {
          id: "5",
          name: "Final Payroll Processing",
          description: "Process final payroll and benefits",
          department: "Finance",
          daysBeforeLastDay: 3,
          required: true,
          completed: false,
        },
      ]

      setEmployees(mockEmployees)
      setTasks(mockTasks)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "initiated":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "not-applicable":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "New Opportunity":
        return "bg-blue-100 text-blue-800"
      case "Relocation":
        return "bg-purple-100 text-purple-800"
      case "Career Change":
        return "bg-green-100 text-green-800"
      case "Retirement":
        return "bg-orange-100 text-orange-800"
      case "Personal Reasons":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewEmployee = (employeeId: string) => {
    console.log("View employee:", employeeId)
  }

  const handleScheduleInterview = (employeeId: string) => {
    setEmployees((prev) => prev.map((emp) => (emp.id === employeeId ? { ...emp, exitInterviewScheduled: true } : emp)))
  }

  const handleDownloadReport = (employeeId: string) => {
    console.log("Download offboarding report for:", employeeId)
  }

  const handleInitiateOffboarding = () => {
    console.log("Initiate new offboarding process")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Offboarding</h1>
          <p className="text-muted-foreground">Manage employee departures and offboarding processes</p>
        </div>
        <Button onClick={handleInitiateOffboarding}>
          <Plus className="mr-2 h-4 w-4" />
          Initiate Offboarding
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Offboarding Employees</TabsTrigger>
          <TabsTrigger value="tasks">Offboarding Tasks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid gap-4">
            {employees.map((employee) => (
              <Card key={employee.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {employee.name}
                          <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {employee.position} • {employee.department}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Last Day: {new Date(employee.lastWorkingDay).toLocaleDateString()}
                          </span>
                          <Badge className={getReasonColor(employee.reason)} variant="secondary">
                            {employee.reason}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!employee.exitInterviewScheduled && (
                        <Button variant="outline" size="sm" onClick={() => handleScheduleInterview(employee.id)}>
                          <Calendar className="mr-1 h-3 w-3" />
                          Schedule Interview
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleDownloadReport(employee.id)}>
                        <Download className="mr-1 h-3 w-3" />
                        Report
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewEmployee(employee.id)}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Offboarding Progress</span>
                      <span>{employee.progress}% Complete</span>
                    </div>
                    <Progress value={employee.progress} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {employee.completedTasks} of {employee.totalTasks} tasks completed
                      </span>
                      <span>{employee.totalTasks - employee.completedTasks} remaining</span>
                    </div>
                  </div>

                  {/* Exit Interview Status */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Exit Interview</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {employee.exitInterviewCompleted ? (
                        <Badge className={getStatusColor("completed")}>Completed</Badge>
                      ) : employee.exitInterviewScheduled ? (
                        <Badge className={getStatusColor("in-progress")}>Scheduled</Badge>
                      ) : (
                        <Badge className={getStatusColor("pending")}>Not Scheduled</Badge>
                      )}
                    </div>
                  </div>

                  {/* Documents Status */}
                  <div>
                    <p className="text-sm font-medium mb-2">Task Status</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {employee.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Badge className={getStatusColor(doc.status)} variant="secondary">
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Offboarding Tasks Checklist</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {task.name}
                        {task.required && <Badge variant="destructive">Required</Badge>}
                      </CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.department}</Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Complete {task.daysBeforeLastDay} days before last working day
                    </span>
                    <Badge className={task.completed ? getStatusColor("completed") : getStatusColor("pending")}>
                      {task.completed ? "Template Ready" : "In Development"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Offboarding</CardTitle>
                <UserMinus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.filter((e) => e.status === "in-progress").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.filter((e) => e.status === "completed").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exit Interviews</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.filter((e) => e.exitInterviewCompleted).length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Departure Reasons</CardTitle>
                <CardDescription>Why employees are leaving</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>New Opportunity</span>
                    <span className="font-medium">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Career Change</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Relocation</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Personal Reasons</span>
                    <span className="font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Offboarding Time</CardTitle>
                <CardDescription>Time to complete offboarding by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Engineering</span>
                    <span className="font-medium">12 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sales</span>
                    <span className="font-medium">10 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Marketing</span>
                    <span className="font-medium">8 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>HR</span>
                    <span className="font-medium">7 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
