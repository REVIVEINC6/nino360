"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Wallet,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  Plus,
  Filter,
  Download,
  Search,
} from "lucide-react"

export default function PayrollManagementPage() {
  const [selectedPayPeriod, setSelectedPayPeriod] = useState("current")
  const [searchQuery, setSearchQuery] = useState("")

  const payrollMetrics = {
    totalPayroll: 1050000,
    employeeCount: 145,
    contractorCount: 68,
    corpToCorpCount: 22,
    averageSalary: 85000,
    payrollGrowth: 8.5,
    nextPayDate: "2024-01-31",
    processingStatus: "in-progress",
  }

  const payrollCategories = [
    {
      id: 1,
      type: "W2 Employees",
      count: 145,
      totalAmount: 650000,
      averageAmount: 4483,
      status: "processed",
      percentage: 61.9,
      growth: 5.2,
    },
    {
      id: 2,
      type: "1099 Contractors",
      count: 68,
      totalAmount: 280000,
      averageAmount: 4118,
      status: "processing",
      percentage: 26.7,
      growth: 12.8,
    },
    {
      id: 3,
      type: "Corp-to-Corp",
      count: 22,
      totalAmount: 120000,
      averageAmount: 5455,
      status: "pending",
      percentage: 11.4,
      growth: 18.3,
    },
  ]

  const upcomingPayments = [
    {
      id: 1,
      name: "John Smith",
      type: "W2 Employee",
      amount: 5200,
      department: "Engineering",
      payDate: "2024-01-31",
      status: "ready",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      type: "1099 Contractor",
      amount: 4800,
      department: "Marketing",
      payDate: "2024-01-31",
      status: "pending-approval",
    },
    {
      id: 3,
      name: "TechCorp Solutions",
      type: "Corp-to-Corp",
      amount: 8500,
      department: "Consulting",
      payDate: "2024-02-01",
      status: "ready",
    },
    {
      id: 4,
      name: "Mike Davis",
      type: "W2 Employee",
      amount: 6200,
      department: "Sales",
      payDate: "2024-01-31",
      status: "ready",
    },
    {
      id: 5,
      name: "Lisa Chen",
      type: "1099 Contractor",
      amount: 3200,
      department: "Design",
      payDate: "2024-01-31",
      status: "pending-approval",
    },
  ]

  const payrollHistory = [
    {
      period: "January 2024",
      totalAmount: 1050000,
      employeeCount: 145,
      contractorCount: 68,
      corpCount: 22,
      status: "processing",
      processedDate: null,
    },
    {
      period: "December 2023",
      totalAmount: 985000,
      employeeCount: 142,
      contractorCount: 65,
      corpCount: 20,
      status: "completed",
      processedDate: "2023-12-31",
    },
    {
      period: "November 2023",
      totalAmount: 920000,
      employeeCount: 138,
      contractorCount: 62,
      corpCount: 18,
      status: "completed",
      processedDate: "2023-11-30",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
      case "ready":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "pending":
      case "pending-approval":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      processed: "default",
      ready: "default",
      completed: "default",
      processing: "secondary",
      pending: "secondary",
      "pending-approval": "secondary",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="capitalize">
        {status.replace("-", " ")}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(payrollMetrics.totalPayroll)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />+{payrollMetrics.payrollGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{payrollMetrics.employeeCount}</div>
            <div className="text-xs text-muted-foreground">W2 employees</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contractors</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{payrollMetrics.contractorCount}</div>
            <div className="text-xs text-muted-foreground">1099 contractors</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Pay Date</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{payrollMetrics.nextPayDate}</div>
            <div className="text-xs text-muted-foreforeground">
              Processing status: {payrollMetrics.processingStatus}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="contractors">Contractors</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payroll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Process Payroll
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payroll Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Payroll Categories</CardTitle>
                <CardDescription>Breakdown by employee type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payrollCategories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(category.status)}
                          <span className="text-sm font-medium">{category.type}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{formatCurrency(category.totalAmount)}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.count} people • Avg: {formatCurrency(category.averageAmount)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={category.percentage} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground w-12">{category.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getStatusBadge(category.status)}
                        <div className="flex items-center text-xs text-green-600">
                          <TrendingUp className="h-3 w-3 mr-1" />+{category.growth}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>Next payroll cycle payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <span className="font-medium text-sm">{payment.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {payment.type}
                          </Badge>
                          <span>{payment.department}</span>
                          <span>•</span>
                          <span>Pay: {payment.payDate}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold">{formatCurrency(payment.amount)}</div>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>W2 Employee Payroll</CardTitle>
              <CardDescription>Full-time employee payroll management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Employee Payroll Management</h3>
                <p className="text-muted-foreground mb-4">Detailed employee payroll interface coming soon</p>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Employees
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contractor Payments</CardTitle>
              <CardDescription>1099 contractor and Corp-to-Corp payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Contractor Payment Management</h3>
                <p className="text-muted-foreground mb-4">Advanced contractor payment system coming soon</p>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Contractors
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>Historical payroll processing records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollHistory.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="font-medium">{record.period}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{record.employeeCount} employees</span>
                        <span>•</span>
                        <span>{record.contractorCount} contractors</span>
                        <span>•</span>
                        <span>{record.corpCount} corp-to-corp</span>
                        {record.processedDate && (
                          <>
                            <span>•</span>
                            <span>Processed: {record.processedDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold">{formatCurrency(record.totalAmount)}</div>
                      {getStatusBadge(record.status)}
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
