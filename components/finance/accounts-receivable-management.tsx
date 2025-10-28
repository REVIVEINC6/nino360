"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Download, Send, DollarSign, Clock, AlertCircle } from "lucide-react"

interface AccountsReceivableManagementProps {
  view: "invoices" | "collections" | "aging" | "payments"
}

export function AccountsReceivableManagement({ view }: AccountsReceivableManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")

  if (view === "invoices") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$245,890</div>
              <p className="text-xs text-muted-foreground">Across 45 invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">$45,230</div>
              <p className="text-xs text-muted-foreground">12 invoices overdue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg DSO</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32 days</div>
              <p className="text-xs text-green-600">-3 days from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Manage and track client invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: "INV-2024-001",
                    client: "Acme Corp",
                    amount: "$12,500",
                    dueDate: "2024-01-15",
                    status: "overdue",
                  },
                  {
                    id: "INV-2024-002",
                    client: "TechStart Inc",
                    amount: "$8,750",
                    dueDate: "2024-01-20",
                    status: "pending",
                  },
                  {
                    id: "INV-2024-003",
                    client: "Global Solutions",
                    amount: "$15,200",
                    dueDate: "2024-01-25",
                    status: "paid",
                  },
                  {
                    id: "INV-2024-004",
                    client: "Innovation Labs",
                    amount: "$9,800",
                    dueDate: "2024-01-30",
                    status: "pending",
                  },
                ].map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "paid"
                            ? "default"
                            : invoice.status === "overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        {invoice.status !== "paid" && (
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (view === "collections") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collections Management</CardTitle>
          <CardDescription>Track collection efforts and dunning campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Automated Dunning</h4>
                  <p className="text-sm text-muted-foreground">Email reminders for overdue invoices</p>
                </div>
                <Badge>Active</Badge>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Manual Follow-ups</h4>
                  <p className="text-sm text-muted-foreground">Track manual collection calls and emails</p>
                </div>
                <Button size="sm">View Queue</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (view === "aging") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aging Report</CardTitle>
          <CardDescription>View outstanding invoices by age</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>1-30 Days</TableHead>
                <TableHead>31-60 Days</TableHead>
                <TableHead>61-90 Days</TableHead>
                <TableHead>90+ Days</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  client: "Acme Corp",
                  current: "$5,000",
                  d30: "$8,500",
                  d60: "$12,500",
                  d90: "$0",
                  d90plus: "$0",
                  total: "$26,000",
                },
                {
                  client: "TechStart Inc",
                  current: "$12,000",
                  d30: "$0",
                  d60: "$0",
                  d90: "$0",
                  d90plus: "$0",
                  total: "$12,000",
                },
                {
                  client: "Global Solutions",
                  current: "$0",
                  d30: "$15,200",
                  d60: "$0",
                  d90: "$0",
                  d90plus: "$0",
                  total: "$15,200",
                },
              ].map((row) => (
                <TableRow key={row.client}>
                  <TableCell className="font-medium">{row.client}</TableCell>
                  <TableCell>{row.current}</TableCell>
                  <TableCell>{row.d30}</TableCell>
                  <TableCell>{row.d60}</TableCell>
                  <TableCell>{row.d90}</TableCell>
                  <TableCell>{row.d90plus}</TableCell>
                  <TableCell className="font-semibold">{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Track received payments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment #</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                id: "PAY-001",
                invoice: "INV-2024-003",
                client: "Global Solutions",
                amount: "$15,200",
                date: "2024-01-10",
                method: "ACH",
              },
              {
                id: "PAY-002",
                invoice: "INV-2023-098",
                client: "Innovation Labs",
                amount: "$9,800",
                date: "2024-01-08",
                method: "Wire",
              },
            ].map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.invoice}</TableCell>
                <TableCell>{payment.client}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>
                  <Badge variant="outline">{payment.method}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
