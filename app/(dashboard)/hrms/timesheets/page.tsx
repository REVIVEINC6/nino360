import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Download, Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import { PageHeader } from "@/components/hrms/page-header"
import { PageSkeleton } from "@/components/hrms/page-skeleton"
import { ErrorState } from "@/components/hrms/error-state"
import { Badge } from "@/components/ui/badge"
import { listTimesheets } from "./actions"

async function TimesheetsContent() {
  try {
    const timesheets = await listTimesheets()

    const stats = {
      pending: timesheets.filter((t) => t.status === "draft" || t.status === "submitted").length,
      approved: timesheets.filter((t) => t.status === "approved").length,
      rejected: timesheets.filter((t) => t.status === "rejected").length,
      total: timesheets.length,
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Ready for export</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Needs revision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All timesheets</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Timesheets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-sm">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Week Start</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Hours</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No timesheets found
                      </td>
                    </tr>
                  ) : (
                    timesheets.map((ts) => (
                      <tr key={ts.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium">
                            {ts.employee?.first_name} {ts.employee?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">{ts.employee?.code}</div>
                        </td>
                        <td className="py-3 px-4 text-sm">{ts.week_start}</td>
                        <td className="py-3 px-4 text-sm font-medium">{ts.total_hours || 0}h</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              ts.status === "approved"
                                ? "default"
                                : ts.status === "submitted"
                                  ? "secondary"
                                  : ts.status === "rejected"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {ts.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    return (
      <ErrorState
        title="Failed to load timesheets"
        message={error instanceof Error ? error.message : "An unexpected error occurred"}
      />
    )
  }
}

export default async function TimesheetsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Timesheets"
        description="Manage employee timesheets and approvals"
        actions={
          <>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Timesheet
            </Button>
          </>
        }
      />

      <Suspense fallback={<PageSkeleton />}>
        <TimesheetsContent />
      </Suspense>
    </div>
  )
}
