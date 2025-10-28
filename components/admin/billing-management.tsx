"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, DollarSign, Download, AlertCircle, TrendingUp, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BillingTable } from "./billing-table"
import { listInvoices } from "@/app/(dashboard)/admin/billing/actions"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export function BillingManagement() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await listInvoices()
        setInvoices(data)
      } catch (error) {
        console.error("[v0] Failed to load billing data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <Skeleton className="h-[600px] w-full" />
  }

  const filteredInvoices = invoices.filter((invoice: any) => {
    const matchesSearch = invoice.tenant?.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)
  const pendingCount = invoices.filter((inv: any) => inv.status === "pending").length
  const paidCount = invoices.filter((inv: any) => inv.status === "paid").length
  const activeTenants = new Set(invoices.map((i: any) => i.tenant_id)).size

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{invoices.length} total invoices</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {pendingCount}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {paidCount}
              </div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                {activeTenants}
              </div>
              <p className="text-xs text-muted-foreground">With billing history</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Billing & Invoicing
            </CardTitle>
            <CardDescription>Provider sync, disputes, and payment management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 backdrop-blur-xl bg-white/50 border-white/20"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px] backdrop-blur-xl bg-white/50 border-white/20">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Invoices</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="backdrop-blur-xl bg-white/50 border-white/20 hover:bg-white/70">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <BillingTable invoices={filteredInvoices} />
      </motion.div>
    </div>
  )
}
