"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Mail, Download, Shield } from "lucide-react"

interface ApplicantsHeaderProps {
  context: any
}

export function ApplicantsHeader({ context }: ApplicantsHeaderProps) {
  const [selectedReq, setSelectedReq] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    stage: [] as string[],
    source: [] as string[],
    owner: "all",
  })

  return (
  <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-4 p-4">
        {/* Requisition Switcher */}
        <Select value={selectedReq} onValueChange={setSelectedReq}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select requisition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requisitions</SelectItem>
            {context.reqs.map((req: any) => (
              <SelectItem key={req.id} value={req.id}>
                {req.code} - {req.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {(filters.stage.length > 0 || filters.source.length > 0) && (
            <Badge variant="secondary" className="ml-2">
              {filters.stage.length + filters.source.length}
            </Badge>
          )}
        </Button>

        <div className="flex-1" />

        {/* Actions */}
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Bulk Email
        </Button>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>

        {context.features.audit && (
          <Button variant="ghost" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Audit
          </Button>
        )}
      </div>
    </div>
  )
}
