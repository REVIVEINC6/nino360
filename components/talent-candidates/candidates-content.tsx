"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Download, Upload } from "lucide-react"
import { CandidatesTable } from "./candidates-table"
import { CandidatesSidebar } from "./candidates-sidebar"
import { AddCandidateDialog } from "@/components/talent/add-candidate-dialog"
import { BulkActionsBar } from "./bulk-actions-bar"
import { FilterPanel } from "./filter-panel"
import { ExportDialog } from "./export-dialog"
import { MessageDialog } from "./message-dialog"
import { ImportCsvDialog } from "./import-csv-dialog"
import { listCandidates } from "@/app/(dashboard)/talent/candidates/actions"
import { usePermissions } from "@/lib/rbac/hooks"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { toast } from "sonner"
import { EmptyState } from "./empty-state"
import { ErrorState } from "./error-state"

export function CandidatesContent() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<any>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const { permissions: userPermissions } = usePermissions()
  const canCreate = userPermissions.includes(PERMISSIONS.TALENT_CANDIDATES_CREATE)
  const canUpdate = userPermissions.includes(PERMISSIONS.TALENT_CANDIDATES_UPDATE)
  const canDelete = userPermissions.includes(PERMISSIONS.TALENT_CANDIDATES_DELETE)
  const canExport = userPermissions.includes(PERMISSIONS.TALENT_CANDIDATES_EXPORT)

  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await listCandidates({
        page,
        limit: 25,
        search: searchQuery,
        sortBy,
        sortOrder,
        ...filters,
      })

      if (result.success && result.data) {
        setCandidates(result.data)
        setTotal(result.pagination?.total || 0)
        setTotalPages(result.pagination?.totalPages || 1)
      } else {
        setError(result.error || "Failed to load candidates")
      }
    } catch (err) {
      console.error("[v0] Error loading candidates:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, filters, sortBy, sortOrder])

  useEffect(() => {
    loadCandidates()
  }, [loadCandidates])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const handleRefresh = () => {
    loadCandidates()
    toast.success("Candidates refreshed")
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchQuery("")
    setPage(1)
    toast.success("Filters cleared")
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadCandidates} />
  }

  if (!loading && candidates.length === 0 && !searchQuery && Object.keys(filters).length === 0) {
    return <EmptyState onAddCandidate={() => setShowAddDialog(true)} canCreate={canCreate} />
  }

  return (
    <>
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight">Candidates</h1>
                <p className="text-sm text-muted-foreground">
                  {total} {total === 1 ? "candidate" : "candidates"} in your talent pool
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowFilterPanel(!showFilterPanel)}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                {canCreate && (
                  <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                )}
                {canExport && (
                  <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                )}
                {canCreate && (
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Candidate
                  </Button>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, title, skills..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selected.length > 0 && (
              <BulkActionsBar
                selectedCount={selected.length}
                onClearSelection={() => setSelected([])}
                onMessage={() => setShowMessageDialog(true)}
                onExport={() => setShowExportDialog(true)}
                onRefresh={handleRefresh}
                canUpdate={canUpdate}
                canDelete={canDelete}
                canExport={canExport}
              />
            )}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <CandidatesTable
              candidates={candidates}
              loading={loading}
              selected={selected}
              onSelectionChange={setSelected}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
              <div className="flex items-center justify-between px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <CandidatesSidebar
          totalCandidates={total}
          selectedCount={selected.length}
          filters={filters}
          onRefresh={handleRefresh}
          onClearFilters={handleClearFilters}
          onAddCandidate={canCreate ? () => setShowAddDialog(true) : undefined}
          onExport={canExport ? () => setShowExportDialog(true) : undefined}
        />
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <FilterPanel
          open={showFilterPanel}
          onOpenChange={setShowFilterPanel}
          filters={filters}
          onFiltersChange={handleFilterChange}
        />
      )}

      {/* Dialogs */}
      <AddCandidateDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      {showExportDialog && (
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          selectedIds={selected}
          filters={filters}
        />
      )}
      {showMessageDialog && (
        <MessageDialog
          open={showMessageDialog}
          onOpenChange={setShowMessageDialog}
          selectedIds={selected}
          onSuccess={handleRefresh}
        />
      )}
      {showImportDialog && (
        <ImportCsvDialog open={showImportDialog} onOpenChange={setShowImportDialog} onSuccess={handleRefresh} />
      )}
    </>
  )
}
