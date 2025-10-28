"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download, Shield } from "lucide-react"

interface PayOnPayHeaderProps {
  onCreateRun?: () => void
  onExport?: () => void
  filters?: {
    status?: string
    dateFrom?: string
    dateTo?: string
  }
  onFilterChange?: (filters: any) => void
}

export function PayOnPayHeader({ onCreateRun, onExport, filters, onFilterChange }: PayOnPayHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Pay-on-Pay Settlement
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Blockchain-anchored client-to-vendor linkage with MPC/TSS custody
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={onCreateRun} className="bg-gradient-to-r from-cyan-500 to-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            New Settlement Run
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search runs..."
            className="pl-9 bg-background/50 backdrop-blur-sm border-white/10"
            onChange={(e) => onFilterChange?.({ ...filters, search: e.target.value })}
          />
        </div>

        <Select value={filters?.status} onValueChange={(value) => onFilterChange?.({ ...filters, status: value })}>
          <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm border-white/10">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <Shield className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium text-cyan-400">Blockchain Verified</span>
        </div>
      </div>
    </div>
  )
}
