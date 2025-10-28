import { getARData } from "./actions"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Mail, Phone } from "lucide-react"

export default async function ARPage() {
  const { invoices } = await getARData()

  // Calculate AR aging buckets
  const today = new Date()
  const aging = {
    current: 0,
    days30: 0,
    days60: 0,
    days90: 0,
    days90plus: 0,
  }

  invoices.forEach((inv) => {
    const dueDate = new Date(inv.due_date)
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysOverdue < 0) aging.current += inv.amount
    else if (daysOverdue <= 30) aging.days30 += inv.amount
    else if (daysOverdue <= 60) aging.days60 += inv.amount
    else if (daysOverdue <= 90) aging.days90 += inv.amount
    else aging.days90plus += inv.amount
  })

  const totalAR = Object.values(aging).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Accounts Receivable
          </h1>
          <p className="text-muted-foreground mt-1">AR aging and collections management</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Export AR Report
        </Button>
      </div>

      {/* AR Aging Summary */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-6 bg-white/50 backdrop-blur-xl border-white/20">
          <div className="text-sm font-medium text-muted-foreground">Current</div>
          <div className="text-2xl font-bold mt-2">${aging.current.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">Not yet due</div>
        </Card>

        <Card className="p-6 bg-white/50 backdrop-blur-xl border-white/20">
          <div className="text-sm font-medium text-muted-foreground">1-30 Days</div>
          <div className="text-2xl font-bold mt-2">${aging.days30.toLocaleString()}</div>
          <div className="text-xs text-yellow-600 mt-1">{((aging.days30 / totalAR) * 100).toFixed(1)}% of total</div>
        </Card>

        <Card className="p-6 bg-white/50 backdrop-blur-xl border-white/20">
          <div className="text-sm font-medium text-muted-foreground">31-60 Days</div>
          <div className="text-2xl font-bold mt-2">${aging.days60.toLocaleString()}</div>
          <div className="text-xs text-orange-600 mt-1">{((aging.days60 / totalAR) * 100).toFixed(1)}% of total</div>
        </Card>

        <Card className="p-6 bg-white/50 backdrop-blur-xl border-white/20">
          <div className="text-sm font-medium text-muted-foreground">61-90 Days</div>
          <div className="text-2xl font-bold mt-2">${aging.days90.toLocaleString()}</div>
          <div className="text-xs text-red-600 mt-1">{((aging.days90 / totalAR) * 100).toFixed(1)}% of total</div>
        </Card>

        <Card className="p-6 bg-white/50 backdrop-blur-xl border-white/20">
          <div className="text-sm font-medium text-muted-foreground">90+ Days</div>
          <div className="text-2xl font-bold mt-2">${aging.days90plus.toLocaleString()}</div>
          <div className="text-xs text-red-700 mt-1">{((aging.days90plus / totalAR) * 100).toFixed(1)}% of total</div>
        </Card>
      </div>

      {/* Outstanding Invoices */}
      <Card className="p-6 bg-white/50 backdrop-blur-xl border-white/20">
        <h2 className="text-lg font-semibold mb-4">Outstanding Invoices</h2>
        <div className="space-y-3">
          {invoices.map((invoice) => {
            const dueDate = new Date(invoice.due_date)
            const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

            return (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20"
              >
                <div className="flex-1">
                  <div className="font-medium">{invoice.clients?.name || "Unknown Client"}</div>
                  <div className="text-sm text-muted-foreground">Invoice #{invoice.invoice_number}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">${invoice.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Due: {dueDate.toLocaleDateString()}</div>
                  </div>
                  <Badge variant={daysOverdue > 60 ? "destructive" : daysOverdue > 30 ? "secondary" : "default"}>
                    {daysOverdue > 0 ? `${daysOverdue} days overdue` : "Current"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
