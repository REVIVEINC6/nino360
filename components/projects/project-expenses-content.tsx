"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Clock, CheckCircle2, Search, Plus, Download, Receipt, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface Expense {
  id: string
  date: string
  employee: { first_name: string; last_name: string }
  category: { name: string }
  description: string
  amount: number
  status: "pending" | "approved" | "rejected"
  billable: boolean
  receipt_url?: string
}

interface ProjectExpensesContentProps {
  projectId: string
  initialExpenses: Expense[]
}

export function ProjectExpensesContent({ projectId, initialExpenses }: ProjectExpensesContentProps) {
  const [expenses] = useState<Expense[]>(initialExpenses)
  const [searchQuery, setSearchQuery] = useState("")

  // Calculate metrics
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const pendingExpenses = expenses.filter((e) => e.status === "pending")
  const approvedExpenses = expenses.filter((e) => e.status === "approved")
  const billableExpenses = expenses.filter((e) => e.billable)
  const billableAmount = billableExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const billablePercentage = totalExpenses > 0 ? (billableAmount / totalExpenses) * 100 : 0

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${expense.employee.first_name} ${expense.employee.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingExpenses.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${pendingExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approvedExpenses.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${approvedExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Billable</p>
                <p className="text-2xl font-bold">{billablePercentage.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground mt-1">${billableAmount.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Expenses List */}
      <Card className="glass-panel">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Employee</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">Billable</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => (
                <motion.tr
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    {expense.employee.first_name} {expense.employee.last_name}
                  </td>
                  <td className="p-4 text-sm">{expense.category.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{expense.description}</td>
                  <td className="p-4 text-sm text-right font-medium">${expense.amount.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    {expense.billable ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-500/20">
                        No
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <Badge variant="outline" className={getStatusColor(expense.status)}>
                      {expense.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    {expense.receipt_url ? (
                      <Button variant="ghost" size="sm">
                        <Receipt className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
