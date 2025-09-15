"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  Receipt,
  Building,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  Download,
  Search,
} from "lucide-react"

export default function ExpenseManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const expenseMetrics = {
    totalExpenses: 1850000,
    monthlyChange: -5.2,
    pendingApprovals: 45000,
    averageExpense: 2500,
    topCategory: "Technology",
    budgetUtilization: 78.5,
  }

  const expenseCategories = [
    {
      id: 1,
      name: "Technology & Software",
      amount: 450000,
      percentage: 24.3,
      change: 8.5,
      budget: 500000,
      items: 125,
    },
    {
      id: 2,
      name: "Office & Facilities",
      amount: 320000,
      percentage: 17.3,
      change: -2.1,
      budget: 350000,
      items: 89,
    },
    {
      id: 3,
      name: "Travel & Entertainment",
      amount: 280000,
      percentage: 15.1,
      change: 15.7,
      budget: 300000,
      items: 156,
    },
    {
      id: 4,
      name: "Marketing & Advertising",
      amount: 250000,
      percentage: 13.5,
      change: 22.3,
      budget: 275000,
      items: 67,
    },
    {
      id: 5,
      name: "Professional Services",
      amount: 200000,
      percentage: 10.8,
      change: -8.9,
      budget: 225000,
      items: 34,
    },
    {
      id: 6,
      name: "Other Expenses",
      amount: 350000,
      percentage: 18.9,
      change: 3.2,
      budget: 400000,
      items: 198,
    },
  ]

  const recentExpenses = [
    {
      id: 1,
      description: "Microsoft Office 365 Subscription",
      amount: 2500,
      category: "Technology",
      vendor: "Microsoft",
      date: "2024-01-15",
      status: "approved",
      approver: "John Smith",
    },
    {
      id: 2,
      description: "Client Dinner - TechCorp Meeting",
      amount: 450,
      category: "Travel & Entertainment",
      vendor: "The Capital Grille",
      date: "2024-01-14",
      status: "pending",
      submitter: "Sarah Johnson",
    },
    {
      id: 3,
      description: "LinkedIn Recruiter License",
      amount: 8000,
      category: "Technology",
      vendor: "LinkedIn",
      date: "2024-01-13",
      status: "approved",
      approver: "Mike Davis",
    },
    {
      id: 4,
      description: "Office Supplies - Q1 Order",
      amount: 1200,
      category: "Office & Facilities",
      vendor: "Staples",
      date: "2024-01-12",
      status: "rejected",
      reason: "Exceeds monthly budget",
    },
    {
      id: 5,
      description: "Google Ads Campaign",
      amount: 5000,
      category: "Marketing",
      vendor: "Google",
      date: "2024-01-11",
      status: "pending",
      submitter: "Lisa Chen",
    },
  ]

  const pendingApprovals = [
    {
      id: 1,
      description: "Annual Software Licenses",
      amount: 15000,
      submitter: "IT Department",
      category: "Technology",
      urgency: "high",
      daysWaiting: 3,
    },
    {
      id: 2,
      description: "Conference Registration - HR Summit",
      amount: 2500,
      submitter: "HR Team",
      category: "Professional Development",
      urgency: "medium",
      daysWaiting: 1,
    },
    {
      id: 3,
      description: "Office Furniture Upgrade",
      amount: 8500,
      submitter: "Facilities",
      category: "Office & Facilities",
      urgency: "low",
      daysWaiting: 7,
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
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="capitalize">
        {status}
      </Badge>
    )
  }

  const getUrgencyBadge = (urgency: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }
    return <Badge className={`${colors[urgency as keyof typeof colors]} capitalize`}>{urgency}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(expenseMetrics.totalExpenses)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              {Math.abs(expenseMetrics.monthlyChange)}% decrease from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(expenseMetrics.pendingApprovals)}</div>
            <div className="text-xs text-muted-foreground">{pendingApprovals.length} items awaiting approval</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <Receipt className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(expenseMetrics.averageExpense)}</div>
            <div className="text-xs text-muted-foreground">Per transaction</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{expenseMetrics.budgetUtilization}%</div>
            <div className="text-xs text-muted-foreground">Of allocated budget</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
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
              New Expense
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Latest expense submissions and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(expense.status)}
                          <span className="font-medium text-sm">{expense.description}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{expense.vendor}</span>
                          <span>•</span>
                          <span>{expense.date}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {expense.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold">{formatCurrency(expense.amount)}</div>
                        {getStatusBadge(expense.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expense Categories Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Top Expense Categories</CardTitle>
                <CardDescription>Highest spending categories this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.slice(0, 5).map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.name}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{formatCurrency(category.amount)}</div>
                          <div className="text-xs text-muted-foreground">{category.items} items</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(category.amount / category.budget) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {((category.amount / category.budget) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {expenseCategories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Receipt className="h-4 w-4" />
                          {category.items} items
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          Budget: {formatCurrency(category.budget)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold">{formatCurrency(category.amount)}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{category.percentage}% of total</Badge>
                        <div
                          className={`flex items-center text-xs ${
                            category.change > 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {category.change > 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(category.change)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Utilization</span>
                      <span>{((category.amount / category.budget) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (category.amount / category.budget) * 100 > 90
                            ? "bg-red-500"
                            : (category.amount / category.budget) * 100 > 75
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min((category.amount / category.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Expenses awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{approval.description}</span>
                        {getUrgencyBadge(approval.urgency)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {approval.submitter}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {approval.daysWaiting} days waiting
                        </div>
                        <Badge variant="outline">{approval.category}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(approval.amount)}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Reports</CardTitle>
              <CardDescription>Generate detailed expense reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-period">Report Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current-month">Current Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="office">Office & Facilities</SelectItem>
                        <SelectItem value="travel">Travel & Entertainment</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-format">Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="PDF" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Generate Expense Report</h3>
                  <p className="text-muted-foreground mb-4">Create detailed expense reports with custom filters</p>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
