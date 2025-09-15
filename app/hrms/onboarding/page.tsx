"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  UserPlus,
  CheckCircle,
  Clock,
  FileText,
  User,
  Mail,
  Calendar,
  Target,
  Plus,
  Edit,
  Eye,
  Send,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface OnboardingCandidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  startDate: string
  status: "pending" | "in-progress" | "completed" | "on-hold"
  progress: number
  manager: string
  completedTasks: number
  totalTasks: number
  documents: {
    name: string
    status: "pending" | "submitted" | "approved" | "rejected"
  }[]
}

interface OnboardingTemplate {
  id: string
  name: string
  department: string
  tasks: {
    id: string
    name: string
    description: string
    daysToComplete: number
    required: boolean
  }[]
}

export default function OnboardingPage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<OnboardingCandidate[]>([])
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewCandidateForm, setShowNewCandidateForm] = useState(false)
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    startDate: "",
    manager: "",
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCandidates: OnboardingCandidate[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com",
          phone: "+1 (555) 123-4567",
          position: "Senior Software Engineer",
          department: "Engineering",
          startDate: "2024-02-01",
          status: "in-progress",
          progress: 65,
          manager: "John Smith",
          completedTasks: 13,
          totalTasks: 20,
          documents: [
            { name: "Employment Contract", status: "approved" },
            { name: "Tax Forms (W-4)", status: "approved" },
            { name: "Emergency Contact Info", status: "submitted" },
            { name: "Direct Deposit Form", status: "pending" },
          ],
        },
        {
          id: "2",
          name: "Michael Chen",
          email: "michael.chen@company.com",
          phone: "+1 (555) 234-5678",
          position: "Marketing Specialist",
          department: "Marketing",
          startDate: "2024-01-28",
          status: "completed",
          progress: 100,
          manager: "Lisa Wong",
          completedTasks: 15,
          totalTasks: 15,
          documents: [
            { name: "Employment Contract", status: "approved" },
            { name: "Tax Forms (W-4)", status: "approved" },
            { name: "Emergency Contact Info", status: "approved" },
            { name: "Direct Deposit Form", status: "approved" },
          ],
        },
        {
          id: "3",
          name: "Emily Rodriguez",
          email: "emily.rodriguez@company.com",
          phone: "+1 (555) 345-6789",
          position: "Sales Representative",
          department: "Sales",
          startDate: "2024-02-05",
          status: "pending",
          progress: 0,
          manager: "David Kim",
          completedTasks: 0,
          totalTasks: 18,
          documents: [
            { name: "Employment Contract", status: "pending" },
            { name: "Tax Forms (W-4)", status: "pending" },
            { name: "Emergency Contact Info", status: "pending" },
            { name: "Direct Deposit Form", status: "pending" },
          ],
        },
      ]

      const mockTemplates: OnboardingTemplate[] = [
        {
          id: "1",
          name: "Engineering Onboarding",
          department: "Engineering",
          tasks: [
            {
              id: "1",
              name: "Complete HR Documentation",
              description: "Fill out all required HR forms and documents",
              daysToComplete: 1,
              required: true,
            },
            {
              id: "2",
              name: "IT Setup",
              description: "Receive laptop, accounts, and access credentials",
              daysToComplete: 1,
              required: true,
            },
            {
              id: "3",
              name: "Team Introduction",
              description: "Meet with team members and key stakeholders",
              daysToComplete: 3,
              required: true,
            },
            {
              id: "4",
              name: "Code Repository Access",
              description: "Get access to code repositories and development tools",
              daysToComplete: 2,
              required: true,
            },
            {
              id: "5",
              name: "First Project Assignment",
              description: "Receive and begin work on first project",
              daysToComplete: 7,
              required: true,
            },
          ],
        },
        {
          id: "2",
          name: "Sales Onboarding",
          department: "Sales",
          tasks: [
            {
              id: "1",
              name: "Complete HR Documentation",
              description: "Fill out all required HR forms and documents",
              daysToComplete: 1,
              required: true,
            },
            {
              id: "2",
              name: "CRM Training",
              description: "Complete training on CRM system and processes",
              daysToComplete: 3,
              required: true,
            },
            {
              id: "3",
              name: "Product Training",
              description: "Learn about company products and services",
              daysToComplete: 5,
              required: true,
            },
            {
              id: "4",
              name: "Shadow Senior Rep",
              description: "Shadow experienced sales representative",
              daysToComplete: 7,
              required: true,
            },
          ],
        },
      ]

      setCandidates(mockCandidates)
      setTemplates(mockTemplates)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "on-hold":
        return "bg-red-100 text-red-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateCandidate = () => {
    if (!newCandidate.name || !newCandidate.email || !newCandidate.position) {
      return
    }

    const candidate: OnboardingCandidate = {
      id: Date.now().toString(),
      ...newCandidate,
      status: "pending",
      progress: 0,
      completedTasks: 0,
      totalTasks: 15,
      documents: [
        { name: "Employment Contract", status: "pending" },
        { name: "Tax Forms (W-4)", status: "pending" },
        { name: "Emergency Contact Info", status: "pending" },
        { name: "Direct Deposit Form", status: "pending" },
      ],
    }

    setCandidates((prev) => [...prev, candidate])
    setNewCandidate({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      startDate: "",
      manager: "",
    })
    setShowNewCandidateForm(false)
  }

  const handleViewCandidate = (candidateId: string) => {
    console.log("View candidate:", candidateId)
  }

  const handleSendReminder = (candidateId: string) => {
    console.log("Send reminder to candidate:", candidateId)
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
          <h1 className="text-3xl font-bold tracking-tight">Employee Onboarding</h1>
          <p className="text-muted-foreground">Manage new employee onboarding process and documentation</p>
        </div>
        <Button onClick={() => setShowNewCandidateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Employee
        </Button>
      </div>

      {/* New Candidate Form */}
      {showNewCandidateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Employee for Onboarding</CardTitle>
            <CardDescription>Enter details for the new employee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Position</label>
                <Input
                  value={newCandidate.position}
                  onChange={(e) => setNewCandidate((prev) => ({ ...prev, position: e.target.value }))}
                  placeholder="Enter job position"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <Select
                  value={newCandidate.department}
                  onValueChange={(value) => setNewCandidate((prev) => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={newCandidate.startDate}
                  onChange={(e) => setNewCandidate((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Manager</label>
                <Input
                  value={newCandidate.manager}
                  onChange={(e) => setNewCandidate((prev) => ({ ...prev, manager: e.target.value }))}
                  placeholder="Enter manager name"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateCandidate}>Create Employee</Button>
              <Button variant="outline" onClick={() => setShowNewCandidateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="candidates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="candidates">Onboarding Candidates</TabsTrigger>
          <TabsTrigger value="templates">Onboarding Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-4">
          <div className="grid gap-4">
            {candidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {candidate.name}
                          <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {candidate.position} • {candidate.department}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {candidate.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Start: {new Date(candidate.startDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Manager: {candidate.manager}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleSendReminder(candidate.id)}>
                        <Send className="mr-1 h-3 w-3" />
                        Remind
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewCandidate(candidate.id)}>
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
                      <span>Onboarding Progress</span>
                      <span>{candidate.progress}% Complete</span>
                    </div>
                    <Progress value={candidate.progress} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {candidate.completedTasks} of {candidate.totalTasks} tasks completed
                      </span>
                      <span>{candidate.totalTasks - candidate.completedTasks} remaining</span>
                    </div>
                  </div>

                  {/* Documents Status */}
                  <div>
                    <p className="text-sm font-medium mb-2">Document Status</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {candidate.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
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

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Onboarding Templates</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {template.name}
                      </CardTitle>
                      <CardDescription>{template.department} Department</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Tasks</span>
                      <span className="text-sm">{template.tasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {template.tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-muted-foreground" />
                            {task.name}
                          </span>
                          <span className="text-muted-foreground">{task.daysToComplete}d</span>
                        </div>
                      ))}
                      {template.tasks.length > 3 && (
                        <p className="text-xs text-muted-foreground">+{template.tasks.length - 3} more tasks</p>
                      )}
                    </div>
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
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{candidates.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{candidates.filter((c) => c.status === "in-progress").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{candidates.filter((c) => c.status === "completed").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(candidates.reduce((sum, c) => sum + c.progress, 0) / candidates.length)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding Timeline</CardTitle>
              <CardDescription>Average time to complete onboarding by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Engineering</span>
                  <span className="font-medium">14 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sales</span>
                  <span className="font-medium">12 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Marketing</span>
                  <span className="font-medium">10 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>HR</span>
                  <span className="font-medium">8 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
