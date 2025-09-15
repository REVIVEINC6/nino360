"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { BillingAccount } from "@/lib/types/billing"
import { Search, Filter, Download, Receipt, Plus, AlertCircle } from "lucide-react"

interface BillingTableProps {
  accounts: BillingAccount[]
  loading: boolean
  onUpdateAccount: (accountId: string, updates: Partial<BillingAccount>) => Promise<any>
  onAddCredit: (tenantId: string, amount: number, reason: string) => Promise<any>
  onGenerateInvoice: (tenantId: string) => Promise<any>
  onExportData: (format: "csv" | "json") => Promise<void>
}

export function BillingTable({
  accounts,
  loading,
  onUpdateAccount,
  onAddCredit,
  onGenerateInvoice,
  onExportData,
}: BillingTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAccount, setSelectedAccount] = useState<BillingAccount | null>(null)
  const [creditAmount, setCreditAmount] = useState("")
  const [creditReason, setCreditReason] = useState("")
  const [isAddingCredit, setIsAddingCredit] = useState(false)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const { toast } = useToast()

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || account.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      trial: "secondary",
      past_due: "destructive",
      canceled: "outline",
      suspended: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleStatusChange = async (accountId: string, newStatus: string) => {
    try {
      await onUpdateAccount(accountId, { status: newStatus as any })
      toast({
        title: "Status Updated",
        description: "Billing account status has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account status.",
        variant: "destructive",
      })
    }
  }

  const handleAddCredit = async () => {
    if (!selectedAccount || !creditAmount || !creditReason) return

    try {
      setIsAddingCredit(true)
      await onAddCredit(selectedAccount.tenant_id, Number.parseFloat(creditAmount), creditReason)
      setCreditAmount("")
      setCreditReason("")
      setSelectedAccount(null)
      toast({
        title: "Credit Added",
        description: `$${creditAmount} credit has been added to ${selectedAccount.tenant_name}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add credit.",
        variant: "destructive",
      })
    } finally {
      setIsAddingCredit(false)
    }
  }

  const handleGenerateInvoice = async (tenantId: string, tenantName: string) => {
    try {
      setIsGeneratingInvoice(true)
      await onGenerateInvoice(tenantId)
      toast({
        title: "Invoice Generated",
        description: `Invoice has been generated for ${tenantName}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invoice.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingInvoice(false)
    }
  }

  const handleExport = async (format: "csv" | "json") => {
    try {
      await onExportData(format)
      toast({
        title: "Export Started",
        description: `Billing data export in ${format.toUpperCase()} format has started.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tenant Billing Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tenant Billing Accounts</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("json")}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tenants or plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Tenant</th>
                <th className="text-left p-4 font-medium">Plan</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">MRR</th>
                <th className="text-left p-4 font-medium">Usage</th>
                <th className="text-left p-4 font-medium">Credit</th>
                <th className="text-left p-4 font-medium">Next Billing</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{account.tenant_name}</div>
                      <div className="text-sm text-gray-500">{account.billing_cycle} billing</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{account.plan_name}</div>
                    <div className="text-sm text-gray-500">{account.modules.length} modules</div>
                  </td>
                  <td className="p-4">
                    <Select value={account.status} onValueChange={(value) => handleStatusChange(account.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="trial">Trial</SelectItem>
                        <SelectItem value="past_due">Past Due</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{formatCurrency(account.mrr)}</div>
                    <div className="text-sm text-gray-500">ARR: {formatCurrency(account.arr)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        {account.usage_current.toLocaleString()} / {account.usage_limit.toLocaleString()}
                      </div>
                      {account.usage_current / account.usage_limit > 0.8 && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (account.usage_current / account.usage_limit) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`font-medium ${account.credit_balance < 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatCurrency(account.credit_balance)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{formatDate(account.next_billing_date)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedAccount(account)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Credit</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="amount">Credit Amount ($)</Label>
                              <Input
                                id="amount"
                                type="number"
                                value={creditAmount}
                                onChange={(e) => setCreditAmount(e.target.value)}
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <Label htmlFor="reason">Reason</Label>
                              <Textarea
                                id="reason"
                                value={creditReason}
                                onChange={(e) => setCreditReason(e.target.value)}
                                placeholder="Reason for credit adjustment..."
                              />
                            </div>
                            <Button
                              onClick={handleAddCredit}
                              disabled={isAddingCredit || !creditAmount || !creditReason}
                              className="w-full"
                            >
                              {isAddingCredit ? "Adding..." : "Add Credit"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateInvoice(account.tenant_id, account.tenant_name)}
                        disabled={isGeneratingInvoice}
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-8 text-gray-500">No billing accounts found matching your criteria.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
