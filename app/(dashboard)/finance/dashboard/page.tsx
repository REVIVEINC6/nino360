import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

async function getFinanceKPIs() {
  const supabase = await createServerClient()

  // Get AR balance (sum of all invoice balances)
  const { data: arData } = await supabase.from("invoices").select("balance").not("status", "in", '("void")')

  const outstandingAR = arData?.reduce((sum, inv) => sum + Number(inv.balance || 0), 0) || 0

  // Get AP balance (sum of all bill balances)
  const { data: apData } = await supabase.from("bills").select("balance").not("status", "in", '("void")')

  const outstandingAP = apData?.reduce((sum, bill) => sum + Number(bill.balance || 0), 0) || 0

  // Get pending expenses
  const { count: pendingExpenses } = await supabase
    .from("expenses")
    .select("*", { count: "exact", head: true })
    .eq("status", "submitted")

  // Get overdue invoices
  const today = new Date().toISOString().slice(0, 10)
  const { count: overdueInvoices } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .lt("due_date", today)
    .not("status", "in", '("paid","void")')
    .gt("balance", 0)

  // Get latest forecast for cash runway
  const { data: forecast } = await supabase
    .from("forecasts")
    .select("runway_months")
    .order("as_of", { ascending: false })
    .limit(1)
    .single()

  return {
    outstandingAR,
    outstandingAP,
    pendingExpenses: pendingExpenses || 0,
    overdueInvoices: overdueInvoices || 0,
    cashRunway: forecast?.runway_months || 0,
  }
}

function KPISkeleton() {
  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="rounded-full w-8 h-8" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-1 h-8 w-32" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function FinanceKPIs() {
  const kpis = await getFinanceKPIs()

  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Outstanding AR</CardTitle>
          <TrendingUp className="text-muted-foreground w-4 h-4" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">${kpis.outstandingAR.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">Accounts receivable pending</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Outstanding AP</CardTitle>
          <TrendingDown className="text-muted-foreground w-4 h-4" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">${kpis.outstandingAP.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">Accounts payable pending</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Pending Expenses</CardTitle>
          <Clock className="text-muted-foreground w-4 h-4" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{kpis.pendingExpenses}</div>
          <p className="text-muted-foreground text-xs">Expenses awaiting approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Overdue Invoices</CardTitle>
          <AlertCircle className="text-destructive w-4 h-4" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{kpis.overdueInvoices}</div>
          <p className="text-muted-foreground text-xs">Invoices past due date</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function FinanceDashboardPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<KPISkeleton />}>
        <FinanceKPIs />
      </Suspense>

      <div className="gap-6 grid md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AR Aging</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Accounts receivable aging report will be displayed here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AP Aging</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Accounts payable aging report will be displayed here</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Cash flow chart will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  )
}
