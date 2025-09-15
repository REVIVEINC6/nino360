"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  PieChart,
  Calculator,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

export function FinanceModule() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const financeMetrics = {
    totalRevenue: 2450000,
    monthlyGrowth: 12.5,
    profitMargin: 23.8,
    accountsReceivable: 345000,
    accountsPayable: 189000,
    cashFlow: 156000,
  }

  const revenueData = [
    { month: "Jan", revenue: 2100000, expenses: 1600000 },
    { month: "Feb", revenue: 2250000, expenses: 1650000 },
    { month: "Mar", revenue: 2450000, expenses: 1700000 },
  ]

  const payrollSummary = [
    { category: "W2 Employees", amount: 450000, count: 45, status: "processed" },
    { category: "1099 Contractors", amount: 280000, count: 28, status: "processing" },
    { category: "Corp-to-Corp", amount: 320000, count: 12, status: "pending" },
  ]

  const upcomingPayments = [
    { id: 1, vendor: "TechCorp Solutions", amount: 45000, dueDate: "2024-01-20", type: "Invoice" },
    { id: 2, vendor: "Office Supplies Inc", amount: 2500, dueDate: "2024-01-22", type: "Expense" },
    { id: 3, vendor: "Software Licenses", amount: 12000, dueDate: "2024-01-25", type: "Subscription" },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(financeMetrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{financeMetrics.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financeMetrics.profitMargin}%</div>
            <Progress value={financeMetrics.profitMargin} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Receivable</CardTitle>
            <Receipt className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(financeMetrics.accountsReceivable)}</div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Payable</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(financeMetrics.accountsPayable)}</div>
            <p className="text-xs text-muted-foreground">Due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(financeMetrics.cashFlow)}</div>
            <p className="text-xs text-muted-foreground">Net this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and expenses comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{data.month}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600">{formatCurrency(data.revenue)}</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(data.expenses)} expenses</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={(data.revenue / 3000000) * 100} className="h-2 bg-green-100" />
                        <Progress value={(data.expenses / 3000000) * 100} className="h-1 bg-red-100" />
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
                <CardDescription>Scheduled payments and due dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{payment.vendor}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{payment.type}</Badge>
                          <span className="text-xs text-muted-foreground">Due: {payment.dueDate}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{formatCurrency(payment.amount)}</div>
                        <Button variant="outline" size="sm" className="mt-1 bg-transparent">
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
              <CardDescription>Current payroll processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollSummary.map((payroll, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{payroll.category}</p>
                      <p className="text-sm text-muted-foreground">{payroll.count} employees</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(payroll.amount)}</div>
                      </div>
                      <Badge
                        variant={payroll.status === "processed" ? "default" : "secondary"}
                        className={payroll.status === "processed" ? "bg-green-500" : ""}
                      >
                        {payroll.status === "processed" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payroll.status === "processing" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {payroll.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoicing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>Create and manage client invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Invoice Management</h3>
                <p className="text-muted-foreground mb-4">Advanced invoicing system coming soon</p>
                <Button>
                  <Receipt className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate comprehensive financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Financial Reports</h3>
                <p className="text-muted-foreground mb-4">Detailed reporting dashboard coming soon</p>
                <Button>
                  <Calculator className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
