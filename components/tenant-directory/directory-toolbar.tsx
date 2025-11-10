"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Filter } from "lucide-react"
import { CreateTenantDialog } from "./create-tenant-dialog"

interface DirectoryToolbarProps {
  onSearch?: (query: string) => void
  onFilterRole?: (role: string) => void
  onFilterStatus?: (status: string) => void
  onFilterRegion?: (region: string) => void
}

export function DirectoryToolbar({ onSearch, onFilterRole, onFilterStatus, onFilterRegion }: DirectoryToolbarProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            placeholder="Search tenants... (Cmd+K)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-white/10 bg-white/5 pl-10 backdrop-blur-xl focus-visible:ring-[#8B5CF6]"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select onValueChange={(v) => onFilterRole?.(v)}>
            <SelectTrigger className="w-[140px] border-white/10 bg-white/5 backdrop-blur-xl">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => onFilterStatus?.(v)}>
            <SelectTrigger className="w-[140px] border-white/10 bg-white/5 backdrop-blur-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => onFilterRegion?.(v)}>
            <SelectTrigger className="w-[140px] border-white/10 bg-white/5 backdrop-blur-xl">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="us-east">US East</SelectItem>
              <SelectItem value="us-west">US West</SelectItem>
              <SelectItem value="eu-west">EU West</SelectItem>
              <SelectItem value="ap-south">AP South</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Tenant
          </Button>
        </div>
      </div>

      <CreateTenantDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  )
}
