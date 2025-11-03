import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Download, Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import { PageHeader } from "@/components/hrms/page-header"
import { PageSkeleton } from "@/components/hrms/page-skeleton"
import { ErrorState } from "@/components/hrms/error-state"
import { Badge } from "@/components/ui/badge"
import { listTimesheets } from "./actions"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

async function TimesheetsContent() {
  try {
    const timesheets = await listTimesheets()

    const stats = {
      pending: timesheets.filter((t: any) => t.status === "draft" || t.status === "submitted").length,
      approved: timesheets.filter((t: any) => t.status === "approved").length,
      rejected: timesheets.filter((t: any) => t.status === "rejected").length,
      total: timesheets.length,
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card rounded-xl border border-white/20 bg-white/40 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.pending}</p>
                <p className="mt-1 text-xs text-gray-500">Awaiting approval</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl border border-white/20 bg-white/40 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.approved}</p>
                <p className="mt-1 text-xs text-gray-500">Ready for export</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl border border-white/20 bg-white/40 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="mt-1 text-xs text-gray-500">Needs revision</p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl border border-white/20 bg-white/40 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="mt-1 text-xs text-gray-500">All timesheets</p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl border border-white/20 bg-white/40 p-6 backdrop-blur-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Timesheets</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Week Start</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Hours</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No timesheets found
                      </td>
                    </tr>
                  ) : (
                    timesheets.map((ts: any) => (
                      <tr key={ts.id} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {ts.employee?.first_name} {ts.employee?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{ts.employee?.code}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{ts.week_start}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{ts.total_hours || 0}h</td>
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
          </div>
        </div>
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
    <TwoPane right={<HRMSSidebar />}>
      <div className="space-y-6">
        <PageHeader
          title="Timesheets"
          description="Manage employee timesheets and approvals"
          actions={
            <>
              <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Timesheet
              </Button>
            </>
          }
        />

        <Suspense fallback={<PageSkeleton />}>
          {await TimesheetsContent()}
        </Suspense>
      </div>
    </TwoPane>
  )
}
