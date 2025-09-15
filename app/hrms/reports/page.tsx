"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  Eye,
  Send,
} from "lucide-react"

interface Report {
  id: string
  name: string
  description: string
  category: "attendance" | "payroll" | "performance" | "benefits" | "training" | "compliance"
  type: "standard" | "custom" | "scheduled"
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "on-demand"
  lastGenerated: string
  nextScheduled?: string
  status: "active" | "inactive" | "pending" | "error"
  recipients: string[]
  format: "pdf" | "excel" | "csv"
  parameters: {
    dateRange: string
    departments: string[]
    employees: string[]
  }
}

interface ReportData {
  totalEmployees: number
  activeEmployees: number
  newHires: number
  terminations: number
  averageTenure: number
  turnoverRate: number
  attendanceRate: number
  trainingCompletionRate: number
  performanceRating: number
  benefitsEnrollment: number
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedFrequency, setSelectedFrequency] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockReports: Report[] = [
        {
          id: "1",
          name: "Monthly Attendance Report",
          description: "Comprehensive attendance tracking and analysis",
          category: "attendance",
          type: "scheduled",
          frequency: "monthly",
          lastGenerated: "2024-03-01",
          nextScheduled: "2024-04-01",
          status: "active",
          recipients: ["hr@company.com", "manager@company.com"],
          format: "pdf",
          parameters: {
            dateRange: "last-month",
            departments: ["All"],
            employees: ["All"],
          },
        },
        {
          id: "2",
          name: "Payroll Summary",
          description: "Monthly payroll breakdown by department",
          category: "payroll",
          type: "scheduled",
          frequency: "monthly",
          lastGenerated: "2024-03-31",
          nextScheduled: "2024-04-30",
          status: "active",
          recipients: ["finance@company.com", "hr@company.com"],
          format: "excel",
          parameters: {
            dateRange: "current-month",
            departments: ["All"],
            employees: ["All"],
          },
        },
        {
          id: "3",
          name: "Performance Review Status",
          description: "Track performance review completion and ratings",
          category: "performance",
          type: "standard",
          frequency: "quarterly",
          lastGenerated: "2024-01-31",
          nextScheduled: "2024-04-30",
          status: "active",
          recipients: ["hr@company.com"],
          format: "pdf",
          parameters: {
            dateRange: "current-quarter",
            departments: ["All"],
            employees: ["All"],
          },
        },
        {
          id: "4",
          name: "Benefits Enrollment Report",
          description: "Employee benefits participation and costs",
          category: "benefits",
          type: "standard",
          frequency: "yearly",
          lastGenerated: "2024-01-01",
          nextScheduled: "2025-01-01",
          status: "active",
          recipients: ["hr@company.com", "benefits@company.com"],
          format: "excel",
          parameters: {
            dateRange: "current-year",
            departments: ["All"],
            employees: ["All"],
          },
        },
        {
          id: "5",
          name: "Training Completion Dashboard",
          description: "Employee training progress and certification status",
          category: "training",
          type: "custom",
          frequency: "weekly",
          lastGenerated: "2024-03-25",
          nextScheduled: "2024-04-01",
          status: "active",
          recipients: ["training@company.com", "hr@company.com"],
          format: "pdf",
          parameters: {
            dateRange: "last-week",
            departments: ["All"],
            employees: ["All"],
          },
        },
        {
          id: "6",
          name: "Compliance Audit Report",
          description: "Regulatory compliance status and violations",
          category: "compliance",
          type: "standard",
          frequency: "quarterly",
          lastGenerated: "2024-01-31",
          nextScheduled: "2024-04-30",
          status: "pending",
          recipients: ["legal@company.com", "hr@company.com"],
          format: "pdf",
          parameters: {
            dateRange: "current-quarter",
            departments: ["All"],
            employees: ["All"],
          },
        },
      ]

      const mockReportData: ReportData = {
        totalEmployees: 157,
        activeEmployees: 152,
        newHires: 8,
        terminations: 3,
        averageTenure: 2.4,
        turnoverRate: 12.5,
        attendanceRate: 94.2,
        trainingCompletionRate: 78.5,
        performanceRating: 4.1,
        benefitsEnrollment: 85.3,
      }

      setReports(mockReports)
      setReportData(mockReportData)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "attendance":
        return <Clock className="h-4 w-4" />
      case "payroll":
        return <DollarSign className="h-4 w-4" />
      case "performance":
        return <TrendingUp className="h-4 w-4" />
      case "benefits":
        return <Award className="h-4 w-4" />
      case "training":
        return <Users className="h-4 w-4" />
      case "compliance":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredReports = reports.filter((report) => {
    if (selectedCategory !== "all" && report.category !== selectedCategory) {
      return false
    }
    if (selectedType !== "all" && report.type !== selectedType) {
      return false
    }
    if (selectedFrequency !== "all" && report.frequency !== selectedFrequency) {
      return false
    }
    return true
  })

  const handleGenerateReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? { ...report, status: "pending" as const, lastGenerated: new Date().toISOString().split("T")[0] }
          : report,
      ),
    )
    console.log("Generate report:", reportId)
  }

  const handleDownloadReport = (reportId: string) => {
    console.log("Download report:", reportId)
  }

  const handleViewReport = (reportId: string) => {
    console.log("View report:", reportId)
  }

  const handleSendReport = (reportId: string) => {
    console.log("Send report:", reportId)
  }

  const handleCreateReport = () => {
    console.log("Create new report")
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
          <h1 className="text-3xl font-bold tracking-tight">HR Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and manage HR reports and analytics</p>
        </div>
        <Button onClick={handleCreateReport}>
          <FileText className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="attendance">Attendance</SelectItem>
            <SelectItem value="payroll">Payroll</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="benefits">Benefits</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Frequencies</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      {reportData && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">+{reportData.newHires} new hires this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.turnoverRate}%</div>
              <p className="text-xs text-muted-foreground">-2.1% from last quarter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">+1.2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Rating</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.performanceRating}/5.0</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Benefits Enrollment</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.benefitsEnrollment}%</div>
              <p className="text-xs text-muted-foreground">Employee participation</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Available Reports</TabsTrigger>
          <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getCategoryIcon(report.category)}
                        {report.name}
                        <Badge className={getStatusColor(report.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(report.status)}
                            {report.status}
                          </div>
                        </Badge>
                      </CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.frequency}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {report.format.toUpperCase()}
                        </span>
                        <Badge variant="outline">{report.type}</Badge>
                        <Badge variant="outline">{report.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleGenerateReport(report.id)}>
                        <BarChart3 className="mr-1 h-3 w-3" />
                        Generate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id)}>
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewReport(report.id)}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleSendReport(report.id)}>
                        <Send className="mr-1 h-3 w-3" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Report Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium mb-2">Schedule Information</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Last Generated:</span>
                          <span>{new Date(report.lastGenerated).toLocaleDateString()}</span>
                        </div>
                        {report.nextScheduled && (
                          <div className="flex justify-between">
                            <span>Next Scheduled:</span>
                            <span>{new Date(report.nextScheduled).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Frequency:</span>
                          <span className="capitalize">{report.frequency}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Recipients</p>
                      <div className="space-y-1">
                        {report.recipients.map((recipient, index) => (
                          <Badge key={index} variant="secondary" className="mr-1">
                            {recipient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Parameters */}
                  <div>
                    <p className="text-sm font-medium mb-2">Report Parameters</p>
                    <div className="grid gap-2 md:grid-cols-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date Range:</span>
                        <span>{report.parameters.dateRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Departments:</span>
                        <span>{report.parameters.departments.join(", ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Employees:</span>
                        <span>{report.parameters.employees.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Headcount</CardTitle>
                <CardDescription>Employee distribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Engineering</span>
                    <span className="font-medium">45 employees</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sales</span>
                    <span className="font-medium">32 employees</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Marketing</span>
                    <span className="font-medium">28 employees</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>HR</span>
                    <span className="font-medium">18 employees</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Finance</span>
                    <span className="font-medium">15 employees</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hiring Trends</CardTitle>
                <CardDescription>New hires vs terminations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>January 2024</span>
                    <span className="font-medium">+5 net growth</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>February 2024</span>
                    <span className="font-medium">+3 net growth</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>March 2024</span>
                    <span className="font-medium">+8 net growth</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>April 2024</span>
                    <span className="font-medium">+2 net growth</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Employee performance ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Exceeds Expectations</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Meets Expectations</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Below Expectations</span>
                    <span className="font-medium">8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Needs Improvement</span>
                    <span className="font-medium">2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Metrics</CardTitle>
                <CardDescription>Training completion and certification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Completed Courses</span>
                    <span className="font-medium">342</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>In Progress</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Certifications Earned</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Compliance Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Report</CardTitle>
              <CardDescription>Build a custom report with specific parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Report Name</label>
                  <Input placeholder="Enter report name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="payroll">Payroll</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="benefits">Benefits</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Date Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Format</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Enter report description" />
              </div>
              <Button>Create Report</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
