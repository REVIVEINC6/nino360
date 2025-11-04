import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, Filter } from "lucide-react"
import { getInvoices } from "../actions/invoices"
import { formatCurrency } from "@/lib/utils/currency"
import { TwoPane } from "@/components/layout/two-pane"
import { FinanceSidebar } from "@/components/finance/finance-sidebar"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function InvoicesPage() {
  const invoices = await getInvoices()

  const totalOutstanding = invoices
    .filter((inv: any) => inv.status !== "paid")
    .reduce((acc: number, inv: any) => acc + (inv.amount || 0), 0)

  const overdue = invoices
    .filter((inv: any) => inv.status === "overdue")
    .reduce((acc: number, inv: any) => acc + (inv.amount || 0), 0)

  const dueThisMonth = invoices
    .filter((inv: any) => {
      const dueDate = new Date(inv.due_date)
      const now = new Date()
      return (
        dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear() && inv.status !== "paid"
      )
    })
    .reduce((acc: number, inv: any) => acc + (inv.amount || 0), 0)

  const paidThisMonth = invoices
    .filter((inv: any) => {
      if (!inv.paid_date) return false
      const paidDate = new Date(inv.paid_date)
      const now = new Date()
      return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear()
    })
    .reduce((acc: number, inv: any) => acc + (inv.amount || 0), 0)

  return (
    <TwoPane right={<FinanceSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">Manage accounts receivable and client invoices</p>
          </div>
          <div className="flex gap-2">
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
              New Invoice
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Outstanding</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(totalOutstanding)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overdue</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(overdue)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Due This Month</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(dueThisMonth)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Paid This Month</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(paidThisMonth)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{invoice.client_name || "Unknown Client"}</p>
                      <p className="text-sm text-muted-foreground">Invoice #{invoice.invoice_number || invoice.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(invoice.amount || 0)}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "No due date"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No invoices found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </TwoPane>
  )
}
