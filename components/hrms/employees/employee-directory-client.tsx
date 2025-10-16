"use client"

import { useState } from "react"
import { EmployeeTable } from "./employee-table"
import { DirectoryToolbar } from "./directory-toolbar"
import { useEmployeeDirectory } from "@/lib/hooks/use-hrms-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function EmployeeDirectoryClient() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    q: "",
    status: [],
    type: [],
    department: undefined,
    sortBy: "hire_date",
    sortOrder: "desc" as "asc" | "desc",
  })

  const { data, error, isLoading } = useEmployeeDirectory(filters)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message || "Failed to load employee directory"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <DirectoryToolbar filters={filters} onFiltersChange={setFilters} />
      <EmployeeTable data={data?.data || []} pagination={data?.pagination} />
    </div>
  )
}
