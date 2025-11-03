import { getI9Records, getI9Stats } from "./actions"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileCheck, AlertTriangle, Clock, CheckCircle2, Search, Download, Plus } from "lucide-react"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function I9CompliancePage() {
  const [records, stats] = await Promise.all([getI9Records(), getI9Stats()])

  return (
    <TwoPane right={<HRMSSidebar />}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              I-9 Compliance
            </h1>
            <p className="text-sm text-gray-600 mt-1">Employment eligibility verification and tracking</p>
          </div>
          <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            New I-9 Form
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-xl shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-emerald-500/10" />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliant</p>
                  <p className="text-3xl font-bold text-green-600">{stats.compliant}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-xl shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-yellow-500/10 to-orange-500/10" />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.expiring}</p>
                </div>
                <div className="rounded-full bg-yellow-100 p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-xl shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-red-500/10 to-pink-500/10" />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expired</p>
                  <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-xl shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10" />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <FileCheck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search by employee name..." className="pl-10 bg-white/50 border-gray-200" />
              </div>
              <Button variant="outline" className="bg-white/50">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* I-9 Records Table */}
        <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">Document Type</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">Expiration</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((record: {
                    id: string | number
                    employee?: { first_name?: string; last_name?: string; email?: string } | null
                    document_type: string
                    issue_date: string | number | Date
                    expiration_date?: string | number | Date | null
                    status: "compliant" | "expiring_soon" | "expired" | string
                  }) => (
                    <tr key={record.id} className="group hover:bg-white/50 transition-colors">
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {record.employee?.first_name} {record.employee?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{record.employee?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-700">{record.document_type}</td>
                      <td className="py-4 text-sm text-gray-700">{new Date(record.issue_date).toLocaleDateString()}</td>
                      <td className="py-4 text-sm text-gray-700">
                        {record.expiration_date ? new Date(record.expiration_date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={
                            record.status === "compliant"
                              ? "default"
                              : record.status === "expiring_soon"
                                ? "secondary"
                                : record.status === "expired"
                                  ? "destructive"
                                  : "outline"
                          }
                          className={
                            record.status === "compliant"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : record.status === "expiring_soon"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                : record.status === "expired"
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : ""
                          }
                        >
                          {record.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </TwoPane>
  )
}
