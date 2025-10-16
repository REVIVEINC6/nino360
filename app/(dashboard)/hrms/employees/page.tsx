import { Suspense } from "react"
import { DirectoryToolbar } from "@/components/hrms/employees/directory-toolbar"
import { EmployeeTable } from "@/components/hrms/employees/employee-table"
import { EmployeeSkeleton } from "@/components/hrms/employees/skeletons"
import { getDirectory } from "./actions"

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
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Employee Directory
            </h1>
            <p className="mt-2 text-slate-400">Manage employee records, profiles, and lifecycle</p>
          </div>
        </div>

        {/* Toolbar */}
        <DirectoryToolbar />

        {/* Table */}
        <Suspense fallback={<EmployeeSkeleton />}>
          {result.success ? (
            <EmployeeTable data={result.data || []} pagination={result.pagination} />
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-red-400">{result.error}</p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}
