"use client"

import { Search, Plus, Upload, Download, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface OffersHeaderProps {
  onSearch: (q: string) => void
  onFilterStatus: (status: string) => void
  onFilterRequisition: (reqId: string) => void
  onNewOffer: () => void
  onBulkGenerate: () => void
  onExport: () => void
  auditHash?: string
}

export function OffersHeader({
  onSearch,
  onFilterStatus,
  onFilterRequisition,
  onNewOffer,
  onBulkGenerate,
  onExport,
  auditHash,
}: OffersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-linear-to-r from-indigo-600/10 via-purple-600/10 to-fuchsia-600/10 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Offer Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, approve, and track job offers with e-sign integration
          </p>
        </div>
        <div className="flex items-center gap-2">
          {auditHash && (
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              Verified
            </Badge>
          )}
          <Button onClick={onExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={onBulkGenerate} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Generate
          </Button>
          <Button onClick={onNewOffer} size="sm" className="bg-linear-to-r from-indigo-600 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            New Offer
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search offers by number, candidate..."
            className="pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <Select onValueChange={onFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="awaiting_approval">Awaiting Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onFilterRequisition}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Requisition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requisitions</SelectItem>
            {/* TODO: Load requisitions dynamically */}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
