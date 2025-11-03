import { Suspense } from "react"
import { DirectoryToolbar } from "@/components/hrms/employees/directory-toolbar"
import { EmployeeTable } from "@/components/hrms/employees/employee-table"
import { EmployeeSkeleton } from "@/components/hrms/employees/skeletons"
import { getDirectory } from "./actions"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 20
  const q = typeof params.q === "string" ? params.q : undefined
  const status = params.status ? (Array.isArray(params.status) ? params.status : [params.status]) : undefined
  const type = params.type ? (Array.isArray(params.type) ? params.type : [params.type]) : undefined
  const department = typeof params.department === "string" ? params.department : undefined

  const result = await getDirectory({
    page,
    pageSize,
    q,
    status,
    type,
    department,
    sortBy: "hire_date",
    sortOrder: "desc",
  })

  return (
    <TwoPane right={<HRMSSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Employee Directory
            </h1>
            <p className="mt-2 text-slate-600">Manage employee records, profiles, and lifecycle with AI insights</p>
          </div>
        </div>

        {/* Toolbar */}
        <DirectoryToolbar />

        {/* Table */}
        <Suspense fallback={<EmployeeSkeleton />}>
          {result.success ? (
            <EmployeeTable data={(result.data || []) as any} pagination={result.pagination} />
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-red-600">{result.error}</p>
            </div>
          )}
        </Suspense>
      </div>
    </TwoPane>
  )
}
