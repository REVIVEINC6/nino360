"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Award,
  Heart,
  BookOpen,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Download,
  RefreshCw,
  Edit,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  MapPin,
  Bot,
  Brain,
  Zap,
  Target,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  status: "active" | "inactive" | "on-leave" | "terminated"
  startDate: string
  salary: number
  manager: string
  location: string
  performanceScore: number
  attendanceRate: number
  leaveBalance: number
  skills: string[]
  lastReview: string
}

interface LeaveRequest {
  id: string
  employeeName: string
  type: "vacation" | "sick" | "personal" | "maternity" | "paternity"
  startDate: string
  endDate: string
  days: number
  status: "pending" | "approved" | "rejected"
  reason: string
  submittedDate: string
}

interface HRMetrics {
  totalEmployees: number
  activeEmployees: number
  newHires: number
  turnoverRate: number
  avgSalary: number
  avgPerformance: number
  avgAttendance: number
  pendingLeaves: number
  upcomingReviews: number
  trainingCompleted: number
}

export function HRMSModule() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const [metrics, setMetrics] = useState<HRMetrics>({
    totalEmployees: 1247,
    activeEmployees: 1156,
    newHires: 23,
    turnoverRate: 8.2,
    avgSalary: 85000,
    avgPerformance: 4.2,
    avgAttendance: 94.5,
    pendingLeaves: 12,
    upcomingReviews: 34,
    trainingCompleted: 89,
  })

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1-555-0123",
      department: "Engineering",
      position: "Senior Software Engineer",
      status: "active",
      startDate: "2022-03-15",
      salary: 120000,
      manager: "Mike Wilson",
      location: "San Francisco, CA",
      performanceScore: 4.5,
      attendanceRate: 96.2,
      leaveBalance: 18,
      skills: ["React", "Node.js", "Python", "AWS"],
      lastReview: "2024-01-15",
    },
    {
      id: "2",
      name: "David Chen",
      email: "david.chen@company.com",
      phone: "+1-555-0456",
      department: "Product",
      position: "Product Manager",
      status: "active",
      startDate: "2021-08-20",
      salary: 135000,
      manager: "Lisa Brown",
      location: "New York, NY",
      performanceScore: 4.3,
      attendanceRate: 94.8,
      leaveBalance: 22,
      skills: ["Product Strategy", "Analytics", "Agile", "Leadership"],
      lastReview: "2024-01-10",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      phone: "+1-555-0789",
      department: "Design",
      position: "UX Designer",
      status: "on-leave",
      startDate: "2023-01-10",
      salary: 95000,
      manager: "Alex Kim",
      location: "Austin, TX",
      performanceScore: 4.1,
      attendanceRate: 92.5,
      leaveBalance: 8,
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      lastReview: "2023-12-20",
    },
  ])

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeName: "John Smith",
      type: "vacation",
      startDate: "2024-02-15",
      endDate: "2024-02-22",
      days: 7,
      status: "pending",
      reason: "Family vacation",
      submittedDate: "2024-01-20",
    },
    {
      id: "2",
      employeeName: "Maria Garcia",
      type: "sick",
      startDate: "2024-01-25",
      endDate: "2024-01-26",
      days: 2,
      status: "approved",
      reason: "Medical appointment",
      submittedDate: "2024-01-24",
    },
    {
      id: "3",
      employeeName: "Robert Wilson",
      type: "personal",
      startDate: "2024-02-10",
      endDate: "2024-02-12",
      days: 3,
      status: "pending",
      reason: "Personal matters",
      submittedDate: "2024-01-22",
    },
  ])

  const refreshData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update metrics with slight variations
      setMetrics((prev) => ({
        ...prev,
        activeEmployees: prev.activeEmployees + Math.floor((Math.random() - 0.5) * 10),
        newHires: prev.newHires + Math.floor(Math.random() * 3),
        turnoverRate: Math.max(5, Math.min(12, prev.turnoverRate + (Math.random() - 0.5) * 1)),
        avgPerformance: Math.max(3.5, Math.min(5, prev.avgPerformance + (Math.random() - 0.5) * 0.2)),
        avgAttendance: Math.max(90, Math.min(98, prev.avgAttendance + (Math.random() - 0.5) * 2)),
      }))

      toast.success("HRMS data refreshed successfully")
    } catch (error) {
      toast.error("Failed to refresh HRMS data")
    } finally {
      setLoading(false)
    }
  }

  const handleEmployeeAction = async (employeeId: string, action: string) => {
    try {
      switch (action) {
        case "activate":
          setEmployees((prev) =>
            prev.map((emp) => (emp.id === employeeId ? { ...emp, status: "active" as const } : emp)),
          )
          toast.success("Employee activated successfully")
          break
        case "deactivate":
          setEmployees((prev) =>
            prev.map((emp) => (emp.id === employeeId ? { ...emp, status: "inactive" as const } : emp)),
          )
          toast.success("Employee deactivated successfully")
          break
        case "terminate":
          if (confirm("Are you sure you want to terminate this employee?")) {
            setEmployees((prev) =>
              prev.map((emp) => (emp.id === employeeId ? { ...emp, status: "terminated" as const } : emp)),
            )
            toast.success("Employee terminated")
          }
          break
        case "edit":
          toast.info("Opening employee editor...")
          break
        case "review":
          toast.info("Opening performance review...")
          break
        case "contact":
          toast.info("Opening contact form...")
          break
        default:
          toast.info(`Action ${action} performed`)
      }
    } catch (error) {
      toast.error("Failed to perform action")
    }
  }

  const handleLeaveAction = async (leaveId: string, action: "approve" | "reject") => {
    try {
      setLeaveRequests((prev) =>
        prev.map((leave) =>
          leave.id === leaveId ? { ...leave, status: action === "approve" ? "approved" : "rejected" } : leave,
        ),
      )
      toast.success(`Leave request ${action}d successfully`)
    } catch (error) {
      toast.error(`Failed to ${action} leave request`)
    }
  }

  const exportData = async (type: string) => {
    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const data = type === "employees" ? employees : type === "leaves" ? leaveRequests : metrics
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `hrms-${type}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`${type} data exported successfully`)
    } catch (error) {
      toast.error("Failed to export data")
    } finally {
      setLoading(false)
    }
  }

  const getEmployeeStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "on-leave":
        return "bg-yellow-100 text-yellow-800"
      case "terminated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "vacation":
        return "bg-blue-100 text-blue-800"
      case "sick":
        return "bg-red-100 text-red-800"
      case "personal":
        return "bg-purple-100 text-purple-800"
      case "maternity":
      case "paternity":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 4.5) return "text-green-600"
    if (score >= 4.0) return "text-blue-600"
    if (score >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "overview") {
        refreshData()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">HRMS Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive human resource management with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportData("overview")} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEmployees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {metrics.activeEmployees} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Hires</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.newHires}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgPerformance.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +0.2 vs last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Above target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">HR Overview</TabsTrigger>
          <TabsTrigger value="employees">Employee Management</TabsTrigger>
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employee count by department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { dept: "Engineering", count: 342, percentage: 27.4 },
                  { dept: "Sales", count: 198, percentage: 15.9 },
                  { dept: "Marketing", count: 156, percentage: 12.5 },
                  { dept: "Product", count: 134, percentage: 10.7 },
                  { dept: "Support", count: 89, percentage: 7.1 },
                  { dept: "HR", count: 67, percentage: 5.4 },
                ].map((item) => (
                  <div key={item.dept} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.dept}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent HR Activities</CardTitle>
                <CardDescription>Latest HR system activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { activity: "New employee onboarded", user: "Sarah Johnson", time: "2 hours ago", type: "hire" },
                  { activity: "Leave request approved", user: "David Chen", time: "4 hours ago", type: "leave" },
                  {
                    activity: "Performance review completed",
                    user: "Emily Rodriguez",
                    time: "1 day ago",
                    type: "review",
                  },
                  {
                    activity: "Salary adjustment processed",
                    user: "Michael Brown",
                    time: "2 days ago",
                    type: "payroll",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Turnover Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{metrics.turnoverRate}%</div>
                <p className="text-xs text-muted-foreground">Industry avg: 12%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pending Leaves</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{metrics.pendingLeaves}</div>
                <p className="text-xs text-muted-foreground">Require approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Upcoming Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{metrics.upcomingReviews}</div>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Training Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{metrics.trainingCompleted}%</div>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Employee Management</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportData("employees")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-medium">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      <p className="text-sm text-muted-foreground">{employee.department}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{employee.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getEmployeeStatusColor(employee.status)}>{employee.status}</Badge>
                        <span className="text-sm text-muted-foreground">Manager: {employee.manager}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {employee.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {employee.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{employee.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${employee.salary.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Annual salary</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-muted-foreground">Performance:</span>
                        <span className={`text-sm font-medium ${getPerformanceColor(employee.performanceScore)}`}>
                          {employee.performanceScore}/5
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-muted-foreground">Attendance:</span>
                        <span className="text-sm font-medium">{employee.attendanceRate}%</span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-muted-foreground">Leave balance:</span>
                        <span className="text-sm font-medium">{employee.leaveBalance} days</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <Button size="sm" variant="outline" onClick={() => handleEmployeeAction(employee.id, "edit")}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEmployeeAction(employee.id, "review")}>
                            <Award className="h-4 w-4 mr-2" />
                            Performance Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEmployeeAction(employee.id, "contact")}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {employee.status === "active" ? (
                            <DropdownMenuItem onClick={() => handleEmployeeAction(employee.id, "deactivate")}>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleEmployeeAction(employee.id, "activate")}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleEmployeeAction(employee.id, "terminate")}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Terminate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Leave Management</h3>
            <Button variant="outline" size="sm" onClick={() => exportData("leaves")}>
              <Download className="h-4 w-4 mr-2" />
              Export Leaves
            </Button>
          </div>

          <div className="grid gap-4">
            {leaveRequests.map((leave) => (
              <motion.div
                key={leave.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{leave.employeeName}</h4>
                    <p className="text-sm text-muted-foreground">{leave.reason}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getLeaveTypeColor(leave.type)}>{leave.type}</Badge>
                      <Badge className={getLeaveStatusColor(leave.status)}>{leave.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {leave.startDate} - {leave.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {leave.days} days
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Submitted: {leave.submittedDate}</p>
                    {leave.status === "pending" && (
                      <div className="flex items-center gap-1 mt-2">
                        <Button size="sm" onClick={() => handleLeaveAction(leave.id, "approve")}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleLeaveAction(leave.id, "reject")}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI-Powered HR Insights</h3>
            <Button variant="outline" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              Generate New Insights
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                </div>
                <Badge variant="outline">91% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Turnover Risk Analysis</h4>
              <p className="text-sm text-muted-foreground mb-4">
                AI identified 23 employees at high risk of leaving based on performance trends, engagement scores, and
                market conditions.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Implement retention strategies including career development plans and competitive compensation
                  reviews.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Create Retention Plan
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <Badge className="bg-green-100 text-green-800">Performance</Badge>
                </div>
                <Badge variant="outline">88% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">High Performer Identification</h4>
              <p className="text-sm text-muted-foreground mb-4">
                34 employees show exceptional performance patterns and are ready for promotion or increased
                responsibilities.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Fast-track these employees for leadership development programs and consider promotion opportunities.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Start Development
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <Badge className="bg-blue-100 text-blue-800">Training</Badge>
                </div>
                <Badge variant="outline">85% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Skills Gap Analysis</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Analysis reveals critical skills gaps in cloud technologies, data analysis, and leadership across
                multiple departments.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Design targeted training programs and consider external hiring for critical skill areas.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Plan Training
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-orange-600" />
                  <Badge className="bg-yellow-100 text-yellow-800">Wellness</Badge>
                </div>
                <Badge variant="outline">79% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Employee Wellness Alert</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Increased sick leave patterns and decreased productivity suggest potential burnout in 18% of the
                workforce.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Implement wellness programs, flexible work arrangements, and mental health support initiatives.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Launch Wellness Program
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
