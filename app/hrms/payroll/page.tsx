"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Calculator,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Clock,
  Play,
  FileText,
  CreditCard,
  PieChart,
  Loader2,
} from "lucide-react"

interface PayrollRun {
  id: string
  period: string
  status: "draft" | "processing" | "completed" | "failed"
  totalEmployees: number
  totalAmount: number
  processedDate?: string
  createdDate: string
  progress: number
}

interface EmployeePay {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  baseSalary: number
  overtime: number
  bonuses: number
  deductions: number
  netPay: number
  payPeriod: string
  status: "pending" | "processed" | "paid"
  avatar?: string
}

const mockPayrollRuns: PayrollRun[] = [
  {
    id: "pr-001",
    period: "January 2024",
    status: "completed",
    totalEmployees: 45,
    totalAmount: 285000,
    processedDate: "2024-01-31",
    createdDate: "2024-01-28",
    progress: 100,
  },
  {
    id: "pr-002",
    period: "February 2024",
    status: "processing",
    totalEmployees: 47,
    totalAmount: 295000,
    createdDate: "2024-02-28",
    progress: 65,
  },
  {
    id: "pr-003",
    period: "March 2024",
    status: "draft",
    totalEmployees: 48,
    totalAmount: 302000,
    createdDate: "2024-03-01",
    progress: 0,
  },
]

const mockEmployeePay: EmployeePay[] = [
  {
    id: "ep-001",
    employeeId: "emp-001",
    employeeName: "Sarah Johnson",
    department: "Marketing",
    position: "Marketing Manager",
    baseSalary: 8500,
    overtime: 450,
    bonuses: 1000,
    deductions: 1200,
    netPay: 8750,
    payPeriod: "February 2024",
    status: "processed",
  },
  {
    id: "ep-002",
    employeeId: "emp-002",
    employeeName: "David Wilson",
    department: "Engineering",
    position: "Senior Developer",
    baseSalary: 9200,
    overtime: 680,
    bonuses: 500,
    deductions: 1350,
    netPay: 9030,
    payPeriod: "February 2024",
    status: "processed",
  },
  {
    id: "ep-003",
    employeeId: "emp-003",
    employeeName: "Emily Chen",
    department: "Sales",
    position: "Sales Representative",
    baseSalary: 6500,
    overtime: 320,
    bonuses: 1500,
    deductions: 980,
    netPay: 7340,
    payPeriod: "February 2024",
    status: "pending",
  },
]

export default function PayrollPage() {
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(mockPayrollRuns)
  const [employeePay, setEmployeePay] = useState<EmployeePay[]>(mockEmployeePay)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null)
  const [showNewRunDialog, setShowNewRunDialog] = useState(false)
  const [processingRun, setProcessingRun] = useState<string | null>(null)

  const filteredEmployeePay = employeePay.filter((emp) => {
    const matchesSearch =
      emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const departments = Array.from(new Set(employeePay.map((emp) => emp.department)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "processed":
      case "paid":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleProcessPayroll = async (runId: string) => {
    setProcessingRun(runId)

    // Simulate payroll processing
    const run = payrollRuns.find((r) => r.id === runId)
    if (!run) return

    try {
      // Update status to processing
      setPayrollRuns((prev) =>
        prev.map((r) => (r.id === runId ? { ...r, status: "processing" as const, progress: 0 } : r)),
      )

      // Simulate progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setPayrollRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, progress } : r)))
      }

      // Complete processing
      setPayrollRuns((prev) =>
        prev.map((r) =>
          r.id === runId
            ? {
                ...r,
                status: "completed" as const,
                progress: 100,
                processedDate: new Date().toISOString().split("T")[0],
              }
            : r,
        ),
      )

      toast({
        title: "Success",
        description: `Payroll for ${run.period} has been processed successfully`,
      })
    } catch (error) {
      setPayrollRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, status: "failed" as const } : r)))

      toast({
        title: "Error",
        description: "Failed to process payroll. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingRun(null)
    }
  }

  const handleCreateNewRun = () => {
    const newRun: PayrollRun = {
      id: `pr-${Date.now()}`,
      period: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      status: "draft",
      totalEmployees: employeePay.length,
      totalAmount: employeePay.reduce((sum, emp) => sum + emp.netPay, 0),
      createdDate: new Date().toISOString().split("T")[0],
      progress: 0,
    }

    setPayrollRuns((prev) => [newRun, ...prev])
    setShowNewRunDialog(false)

    toast({
      title: "Success",
      description: "New payroll run created successfully",
    })
  }

  const totalPayroll = payrollRuns
    .filter((run) => run.status === "completed")
    .reduce((sum, run) => sum + run.totalAmount, 0)

  const currentMonthRun = payrollRuns.find((run) => run.status === "processing" || run.status === "draft")

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Payroll Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage employee compensation, benefits, and payroll processing</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500" onClick={() => setShowNewRunDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Payroll Run
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Payroll</p>
                <p className="text-3xl font-bold">${totalPayroll.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2% from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employees</p>
                <p className="text-3xl font-bold">{employeePay.length}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  Active payroll
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Salary</p>
                <p className="text-3xl font-bold">
                  $
                  {Math.round(
                    employeePay.reduce((sum, emp) => sum + emp.netPay, 0) / employeePay.length,
                  ).toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Calculator className="h-3 w-3 mr-1" />
                  Per employee
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-3xl font-bold">{payrollRuns.filter((run) => run.status === "processing").length}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  In progress
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="runs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
          <TabsTrigger value="employees">Employee Pay</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="space-y-6">
          {/* Current Processing Status */}
          {currentMonthRun && (
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Current Payroll Run - {currentMonthRun.period}
                </CardTitle>
                <CardDescription>
                  {currentMonthRun.status === "processing"
                    ? "Payroll is currently being processed"
                    : "Ready to process payroll for this period"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(currentMonthRun.status)}>{currentMonthRun.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {currentMonthRun.totalEmployees} employees • ${currentMonthRun.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentMonthRun.status === "draft" && (
                        <Button
                          onClick={() => handleProcessPayroll(currentMonthRun.id)}
                          disabled={processingRun === currentMonthRun.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processingRun === currentMonthRun.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          Process Payroll
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {currentMonthRun.status === "processing" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Processing Progress</span>
                        <span>{currentMonthRun.progress}%</span>
                      </div>
                      <Progress value={currentMonthRun.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payroll Runs History */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Payroll History
              </CardTitle>
              <CardDescription>View and manage previous payroll runs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollRuns.map((run, index) => (
                  <motion.div
                    key={run.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{run.period}</h4>
                        <p className="text-sm text-muted-foreground">
                          {run.totalEmployees} employees • ${run.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(run.createdDate).toLocaleDateString()}
                          {run.processedDate && ` • Processed: ${new Date(run.processedDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(run.status)}>{run.status}</Badge>

                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        {run.status === "draft" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProcessPayroll(run.id)}
                            disabled={processingRun === run.id}
                          >
                            {processingRun === run.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Employee Pay List */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Employee Compensation
              </CardTitle>
              <CardDescription>Detailed breakdown of employee pay for the current period</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {filteredEmployeePay.map((employee, index) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.avatar || "/nino360-primary.png"} />
                          <AvatarFallback>
                            {employee.employeeName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{employee.employeeName}</h4>
                          <p className="text-sm text-muted-foreground">{employee.position}</p>
                          <p className="text-xs text-muted-foreground">{employee.department}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium">Base: ${employee.baseSalary.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            OT: ${employee.overtime} • Bonus: ${employee.bonuses}
                          </p>
                          <p className="text-xs text-muted-foreground">Deductions: ${employee.deductions}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold">${employee.netPay.toLocaleString()}</p>
                          <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Payroll Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800">Base Salaries</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${employeePay.reduce((sum, emp) => sum + emp.baseSalary, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">
                        {(
                          (employeePay.reduce((sum, emp) => sum + emp.baseSalary, 0) /
                            employeePay.reduce((sum, emp) => sum + emp.netPay, 0)) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Overtime</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${employeePay.reduce((sum, emp) => sum + emp.overtime, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">
                        {(
                          (employeePay.reduce((sum, emp) => sum + emp.overtime, 0) /
                            employeePay.reduce((sum, emp) => sum + emp.netPay, 0)) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-800">Bonuses</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${employeePay.reduce((sum, emp) => sum + emp.bonuses, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-600">
                        {(
                          (employeePay.reduce((sum, emp) => sum + emp.bonuses, 0) /
                            employeePay.reduce((sum, emp) => sum + emp.netPay, 0)) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Department Costs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const deptEmployees = employeePay.filter((emp) => emp.department === dept)
                    const deptTotal = deptEmployees.reduce((sum, emp) => sum + emp.netPay, 0)
                    const totalPayroll = employeePay.reduce((sum, emp) => sum + emp.netPay, 0)
                    const percentage = (deptTotal / totalPayroll) * 100

                    return (
                      <div key={dept} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{dept}</span>
                          <span className="text-sm font-bold">${deptTotal.toLocaleString()}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {deptEmployees.length} employee{deptEmployees.length !== 1 ? "s" : ""} •{" "}
                          {percentage.toFixed(1)}% of total
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Payroll Run Dialog */}
      <Dialog open={showNewRunDialog} onOpenChange={setShowNewRunDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Payroll Run</DialogTitle>
            <DialogDescription>Set up a new payroll run for the current period</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="period">Pay Period</Label>
              <Input
                id="period"
                value={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">Employees</Label>
              <Input id="employees" value={`${employeePay.length} employees`} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Estimated Total</Label>
              <Input
                id="total"
                value={`$${employeePay.reduce((sum, emp) => sum + emp.netPay, 0).toLocaleString()}`}
                readOnly
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewRunDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewRun}>Create Payroll Run</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
