"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, TrendingUp, DollarSign, Target, AlertTriangle, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Budget {
  id: string
  name: string
  fiscalYear: number
  startDate: string
  endDate: string
  totalBudget: number
  actualSpent: number
  status: "draft" | "active" | "closed"
  variance: number
  variancePercentage: number
}

interface BudgetLineItem {
  id: string
  budgetId: string
  category: string
  accountName: string
  budgetedAmount: number
  actualAmount: number
  variance: number
  variancePercentage: number
}

export default function BudgetingPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [budgetLineItems, setBudgetLineItems] = useState<BudgetLineItem[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      const mockBudgets: Budget[] = [
        {
          id: "1",
          name: "FY 2024 Operating Budget",
          fiscalYear: 2024,
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          totalBudget: 2500000,
          actualSpent: 625000,
          status: "active",
          variance: -125000,
          variancePercentage: -5.0,
        },
        {
          id: "2",
          name: "Q1 2024 Marketing Budget",
          fiscalYear: 2024,
          startDate: "2024-01-01",
          endDate: "2024-03-31",
          totalBudget: 150000,
          actualSpent: 142000,
          status: "closed",
          variance: 8000,
          variancePercentage: 5.3,
        },
        {
          id: "3",
          name: "FY 2025 Capital Budget",
          fiscalYear: 2025,
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          totalBudget: 1800000,
          actualSpent: 0,
          status: "draft",
          variance: 0,
          variancePercentage: 0,
        },
      ]
      setBudgets(mockBudgets)
      if (mockBudgets.length > 0) {
        setSelectedBudget(mockBudgets[0])
        fetchBudgetLineItems(mockBudgets[0].id)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch budgets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBudgetLineItems = async (budgetId: string) => {
    try {
      // Simulate API call
      const mockLineItems: BudgetLineItem[] = [
        {
          id: "1",
          budgetId,
          category: "Revenue",
          accountName: "Sales Revenue",
          budgetedAmount: 3000000,
          actualAmount: 750000,
          variance: -750000,
          variancePercentage: -25.0,
        },
        {
          id: "2",
          budgetId,
          category: "Cost of Sales",
          accountName: "Direct Costs",
          budgetedAmount: 1200000,
          actualAmount: 300000,
          variance: -900000,
          variancePercentage: -75.0,
        },
        {
          id: "3",
          budgetId,
          category: "Operating Expenses",
          accountName: "Salaries & Benefits",
          budgetedAmount: 800000,
          actualAmount: 200000,
          variance: -600000,
          variancePercentage: -75.0,
        },
        {
          id: "4",
          budgetId,
          category: "Operating Expenses",
          accountName: "Office Rent",
          budgetedAmount: 96000,
          actualAmount: 24000,
          variance: -72000,
          variancePercentage: -75.0,
        },
        {
          id: "5",
          budgetId,
          category: "Operating Expenses",
          accountName: "Marketing & Advertising",
          budgetedAmount: 150000,
          actualAmount: 45000,
          variance: -105000,
          variancePercentage: -70.0,
        },
      ]
      setBudgetLineItems(mockLineItems)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch budget line items",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      closed: { color: "bg-blue-100 text-blue-800", label: "Closed" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-green-600"
    if (variance < 0) return "text-red-600"
    return "text-gray-600"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (percentage: number) => {
    return `${percentage > 0 ? "+" : ""}${percentage.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600">Plan, track, and analyze your financial budgets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budgetName">Budget Name</Label>
                  <Input id="budgetName" placeholder="Enter budget name" />
                </div>
                <div>
                  <Label htmlFor="fiscalYear">Fiscal Year</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fiscal year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="totalBudget">Total Budget</Label>
                  <Input id="totalBudget" type="number" placeholder="0.00" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>Create Budget</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgets</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgets.length}</div>
            <p className="text-xs text-muted-foreground">
              {budgets.filter((b) => b.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(budgets.reduce((sum, b) => sum + b.totalBudget, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Across all budgets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(budgets.reduce((sum, b) => sum + b.actualSpent, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getVarianceColor(budgets.reduce((sum, b) => sum + b.variance, 0))}`}>
              {formatCurrency(budgets.reduce((sum, b) => sum + b.variance, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Total variance</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget List and Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Budget List */}
        <Card>
          <CardHeader>
            <CardTitle>Budgets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.map((budget) => (
              <div
                key={budget.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedBudget?.id === budget.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  setSelectedBudget(budget)
                  fetchBudgetLineItems(budget.id)
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{budget.name}</h3>
                  {getStatusBadge(budget.status)}
                </div>
                <div className="text-sm text-gray-600 mb-2">FY {budget.fiscalYear}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget:</span>
                    <span className="font-medium">{formatCurrency(budget.totalBudget)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Spent:</span>
                    <span className="font-medium">{formatCurrency(budget.actualSpent)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Variance:</span>
                    <span className={`font-medium ${getVarianceColor(budget.variance)}`}>
                      {formatCurrency(budget.variance)} ({formatPercentage(budget.variancePercentage)})
                    </span>
                  </div>
                  <Progress value={(budget.actualSpent / budget.totalBudget) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Budget Details */}
        <div className="lg:col-span-2">
          {selectedBudget ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedBudget.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {selectedBudget.startDate} - {selectedBudget.endDate}
                    </p>
                  </div>
                  {getStatusBadge(selectedBudget.status)}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="line-items">
                  <TabsList>
                    <TabsTrigger value="line-items">Line Items</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="line-items" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Budget Line Items</h3>
                      <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Line Item
                      </Button>
                    </div>

                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">Budgeted</TableHead>
                            <TableHead className="text-right">Actual</TableHead>
                            <TableHead className="text-right">Variance</TableHead>
                            <TableHead className="text-right">%</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {budgetLineItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.category}</TableCell>
                              <TableCell>{item.accountName}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.budgetedAmount)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.actualAmount)}</TableCell>
                              <TableCell className={`text-right ${getVarianceColor(item.variance)}`}>
                                {formatCurrency(item.variance)}
                              </TableCell>
                              <TableCell className={`text-right ${getVarianceColor(item.variance)}`}>
                                {formatPercentage(item.variancePercentage)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Budget vs Actual</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span>Total Budgeted:</span>
                              <span className="font-medium">{formatCurrency(selectedBudget.totalBudget)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Spent:</span>
                              <span className="font-medium">{formatCurrency(selectedBudget.actualSpent)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Remaining:</span>
                              <span className="font-medium">
                                {formatCurrency(selectedBudget.totalBudget - selectedBudget.actualSpent)}
                              </span>
                            </div>
                            <Progress
                              value={(selectedBudget.actualSpent / selectedBudget.totalBudget) * 100}
                              className="h-3"
                            />
                            <div className="text-sm text-center text-gray-600">
                              {((selectedBudget.actualSpent / selectedBudget.totalBudget) * 100).toFixed(1)}% utilized
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Variance Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span>Total Variance:</span>
                              <span className={`font-medium ${getVarianceColor(selectedBudget.variance)}`}>
                                {formatCurrency(selectedBudget.variance)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Variance %:</span>
                              <span className={`font-medium ${getVarianceColor(selectedBudget.variance)}`}>
                                {formatPercentage(selectedBudget.variancePercentage)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {selectedBudget.variance > 0
                                ? "Budget is under-utilized. Consider reallocating funds."
                                : selectedBudget.variance < 0
                                  ? "Budget is over-utilized. Monitor spending closely."
                                  : "Budget is on track."}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Budget history and audit trail will be displayed here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a budget to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
