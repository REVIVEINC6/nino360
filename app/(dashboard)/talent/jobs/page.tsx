"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Archive,
  FileText,
  Users,
  Calendar,
  MapPin,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { listRequisitions, exportRequisitionsCSV, cloneRequisition } from "./actions"
import { useRouter } from "next/navigation"
import { JobsSidebar } from "@/components/talent-jobs/jobs-sidebar"

export default function JobsPage() {
  const router = useRouter()
  const [requisitions, setRequisitions] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([])
  const [ownerFilter, setOwnerFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  const loadRequisitions = async () => {
    try {
      setLoading(true)
      const { rows, total: totalCount } = await listRequisitions({
        q: searchQuery || undefined,
        status: statusFilter.length > 0 ? (statusFilter as any) : undefined,
        department: departmentFilter.length > 0 ? departmentFilter : undefined,
        owner: ownerFilter as any,
        page,
        pageSize,
      })
      setRequisitions(rows)
      setTotal(totalCount)
    } catch (error) {
      console.error("[v0] Error loading requisitions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequisitions()
  }, [searchQuery, statusFilter, departmentFilter, ownerFilter, page])

  const handleExportCSV = async () => {
    try {
      const result = await exportRequisitionsCSV({
        q: searchQuery || undefined,
        status: statusFilter.length > 0 ? (statusFilter as any) : undefined,
        department: departmentFilter.length > 0 ? departmentFilter : undefined,
        owner: ownerFilter as any,
        page: 1,
        pageSize: 1000,
      })

      // Download CSV
      const blob = new Blob([result.content], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = result.filename
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Error exporting CSV:", error)
    }
  }

  const handleClone = async (id: string) => {
    try {
      const newId = await cloneRequisition(id)
      router.push(`/talent/jobs/${newId}`)
    } catch (error) {
      console.error("[v0] Error cloning requisition:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "closed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Requisitions</h1>
            <p className="text-muted-foreground">Manage job openings, approvals, and publishing</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Link href="/talent/jobs/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Requisition
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requisitions</SelectItem>
                <SelectItem value="me">My Requisitions</SelectItem>
                <SelectItem value="team">My Team</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {(statusFilter.length > 0 || departmentFilter.length > 0) && (
                    <Badge variant="secondary" className="ml-2">
                      {statusFilter.length + departmentFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                {["draft", "open", "on_hold", "closed", "canceled"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => {
                      setStatusFilter((prev) =>
                        prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
                      )
                    }}
                  >
                    <input type="checkbox" checked={statusFilter.includes(status)} className="mr-2" readOnly />
                    {status.replace("_", " ")}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">Total</div>
            </div>
            <div className="text-2xl font-bold mt-2">{total}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-green-600" />
              <div className="text-sm font-medium text-muted-foreground">Open</div>
            </div>
            <div className="text-2xl font-bold mt-2">{requisitions.filter((r) => r.status === "open").length}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div className="text-sm font-medium text-muted-foreground">Draft</div>
            </div>
            <div className="text-2xl font-bold mt-2">{requisitions.filter((r) => r.status === "draft").length}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <div className="text-sm font-medium text-muted-foreground">On Hold</div>
            </div>
            <div className="text-2xl font-bold mt-2">{requisitions.filter((r) => r.status === "on_hold").length}</div>
          </Card>
        </div>

        {/* Requisitions List */}
        <div className="space-y-3">
          {loading ? (
            <Card className="p-8 text-center text-muted-foreground">Loading requisitions...</Card>
          ) : requisitions.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No requisitions found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first job requisition</p>
              <Link href="/talent/jobs/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Requisition
                </Button>
              </Link>
            </Card>
          ) : (
            requisitions.map((req) => (
              <Card key={req.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Link href={`/talent/jobs/${req.id}`} className="text-lg font-semibold hover:underline">
                        {req.title}
                      </Link>
                      <Badge className={getStatusColor(req.status)}>{req.status.replace("_", " ")}</Badge>
                      {req.age_days > 30 && (
                        <Badge variant="outline" className="text-orange-600">
                          {req.age_days}d old
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {req.department && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {req.department}
                        </div>
                      )}
                      {req.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {req.location}
                        </div>
                      )}
                      {req.employment_type && (
                        <Badge variant="outline" className="text-xs">
                          {req.employment_type.replace("_", " ")}
                        </Badge>
                      )}
                      {req.seniority && (
                        <Badge variant="outline" className="text-xs">
                          {req.seniority}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {req.openings} {req.openings === 1 ? "opening" : "openings"}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {req.hiring_manager && <div>HM: {req.hiring_manager.full_name}</div>}
                      {req.recruiter && <div>Recruiter: {req.recruiter.full_name}</div>}
                      <div>Created {new Date(req.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/talent/jobs/${req.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/talent/jobs/${req.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleClone(req.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {total > pageSize && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} requisitions
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <JobsSidebar requisitions={requisitions} total={total} />
    </div>
  )
}
