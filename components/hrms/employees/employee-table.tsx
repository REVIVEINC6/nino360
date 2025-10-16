"use client"

import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

type Employee = {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  department?: string
  designation?: string
  employment_type?: string
  status: string
  hire_date?: string
  manager?: { first_name: string; last_name: string }
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export function EmployeeTable({ data, pagination }: { data: Employee[]; pagination?: Pagination }) {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "on_leave":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "terminated":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-slate-300">Employee</TableHead>
              <TableHead className="text-slate-300">Department</TableHead>
              <TableHead className="text-slate-300">Designation</TableHead>
              <TableHead className="text-slate-300">Manager</TableHead>
              <TableHead className="text-slate-300">Type</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead className="text-slate-300">Hire Date</TableHead>
              <TableHead className="text-slate-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((employee) => (
              <TableRow key={employee.id} className="border-white/10 hover:bg-white/5">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-indigo-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm">
                        {getInitials(employee.first_name, employee.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="text-sm text-slate-400">{employee.employee_id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-300">{employee.department || "-"}</TableCell>
                <TableCell className="text-slate-300">{employee.designation || "-"}</TableCell>
                <TableCell className="text-slate-300">
                  {employee.manager ? `${employee.manager.first_name} ${employee.manager.last_name}` : "-"}
                </TableCell>
                <TableCell className="text-slate-300">{employee.employment_type || "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-300">
                  {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/hrms/employees/${employee.id}`)}
                    className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
          <div className="text-sm text-slate-400">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} employees
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => router.push(`?page=${pagination.page - 1}`)}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => router.push(`?page=${pagination.page + 1}`)}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
