import { getAPData } from "./actions"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, AlertCircle, Calendar, TrendingUp, Download, Filter } from "lucide-react"
import { TwoPane } from "@/components/layout/two-pane"
import { FinanceSidebar } from "@/components/finance/finance-sidebar"

export default async function APPage() {
  const { bills } = await getAPData()

  // Calculate AP aging buckets
  const today = new Date()
  const aging = {
    current: 0,
    days1to30: 0,
    days31to60: 0,
    days61to90: 0,
    days90plus: 0,
  }

  bills.forEach((bill: any) => {
    const dueDate = new Date(bill.due_date)
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysOverdue < 0) {
      aging.current += bill.amount
    } else if (daysOverdue <= 30) {
      aging.days1to30 += bill.amount
    } else if (daysOverdue <= 60) {
      aging.days31to60 += bill.amount
    } else if (daysOverdue <= 90) {
      aging.days61to90 += bill.amount
    } else {
      aging.days90plus += bill.amount
    }
  })

  const totalAP = Object.values(aging).reduce((sum, val) => sum + val, 0)

  return (
    <TwoPane right={<FinanceSidebar />}>
      <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Accounts Payable
          </h1>
          <p className="text-muted-foreground mt-1">AP aging analysis and payment management</p>
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
        </div>
      </div>

      {/* AP Aging Buckets */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4 bg-white/40 backdrop-blur-xl border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current</p>
              <p className="text-2xl font-bold mt-1">${aging.current.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalAP > 0 ? ((aging.current / totalAP) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/40 backdrop-blur-xl border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">1-30 Days</p>
              <p className="text-2xl font-bold mt-1">${aging.days1to30.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalAP > 0 ? ((aging.days1to30 / totalAP) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/40 backdrop-blur-xl border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">31-60 Days</p>
              <p className="text-2xl font-bold mt-1">${aging.days31to60.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalAP > 0 ? ((aging.days31to60 / totalAP) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/40 backdrop-blur-xl border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">61-90 Days</p>
              <p className="text-2xl font-bold mt-1">${aging.days61to90.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalAP > 0 ? ((aging.days61to90 / totalAP) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/40 backdrop-blur-xl border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">90+ Days</p>
              <p className="text-2xl font-bold mt-1">${aging.days90plus.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalAP > 0 ? ((aging.days90plus / totalAP) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Outstanding Bills */}
      <Card className="p-6 bg-white/40 backdrop-blur-xl border-white/20">
        <h2 className="text-lg font-semibold mb-4">Outstanding Bills</h2>
        <div className="space-y-3">
          {bills.map((bill: any) => {
            const dueDate = new Date(bill.due_date)
            const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

            return (
              <div
                key={bill.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{bill.vendor?.name || "Unknown Vendor"}</p>
                  <p className="text-sm text-muted-foreground">
                    Bill #{bill.bill_number} • Due {dueDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">${bill.amount.toLocaleString()}</p>
                    {daysOverdue > 0 && <p className="text-sm text-red-600">{daysOverdue} days overdue</p>}
                  </div>
                  <Badge
                    variant={
                      daysOverdue > 90
                        ? "destructive"
                        : daysOverdue > 60
                          ? "default"
                          : daysOverdue > 30
                            ? "secondary"
                            : daysOverdue > 0
                              ? "outline"
                              : "secondary"
                    }
                  >
                    {daysOverdue > 90
                      ? "Critical"
                      : daysOverdue > 60
                        ? "Urgent"
                        : daysOverdue > 30
                          ? "Overdue"
                          : daysOverdue > 0
                            ? "Due"
                            : "Current"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Pay
                  </Button>
                </div>
              </div>
            )
          })}
          {bills.length === 0 && <div className="text-center py-8 text-muted-foreground">No outstanding bills</div>}
        </div>
      </Card>
      </div>
    </TwoPane>
  )
}
