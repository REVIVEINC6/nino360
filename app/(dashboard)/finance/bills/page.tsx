import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, Filter } from "lucide-react"
import { getBills } from "../actions/bills"
import { TwoPane } from "@/components/layout/two-pane"
import { FinanceSidebar } from "@/components/finance/finance-sidebar"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BillsPage() {
  const bills = await getBills()

  return (
    <TwoPane right={<FinanceSidebar />}>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bills</h1>
          <p className="text-muted-foreground">Manage accounts payable and vendor bills</p>
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
            New Bill
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Payable</CardDescription>
            <CardTitle className="text-2xl">$0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-2xl">$0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Due This Week</CardDescription>
            <CardTitle className="text-2xl">$0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid This Month</CardDescription>
            <CardTitle className="text-2xl">$0</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No bills found</p>
        </CardContent>
      </Card>
      </div>
    </TwoPane>
  )
}
