"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, FileText, Shield } from "lucide-react"

interface OnboardingHeaderProps {
  onCreateChecklist?: () => void
  onConvertOffer?: () => void
  onSearch?: (query: string) => void
  onFilterStatus?: (status: string) => void
  onFilterManager?: (managerId: string) => void
  onFilterRegion?: (region: string) => void
}

export function OnboardingHeader({
  onCreateChecklist,
  onConvertOffer,
  onSearch,
  onFilterStatus,
  onFilterManager,
  onFilterRegion,
}: OnboardingHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Employee Onboarding
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage new hire onboarding workflows, checklists, and compliance
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hires..."
            className="pl-9 bg-background/50 backdrop-blur-sm"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <Select onValueChange={onFilterStatus}>
          <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>

        {/* Region Filter */}
        <Select onValueChange={onFilterRegion}>
          <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="US">US</SelectItem>
            <SelectItem value="EU">EU</SelectItem>
            <SelectItem value="APAC">APAC</SelectItem>
          </SelectContent>
        </Select>

        {/* Actions */}
        <Button onClick={onCreateChecklist} variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
          <FileText className="h-4 w-4 mr-2" />
          New Checklist
        </Button>

        <Button
          onClick={onConvertOffer}
          size="sm"
          className="bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Convert Offer
        </Button>

        <Button variant="ghost" size="icon" className="bg-background/50 backdrop-blur-sm">
          <Shield className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
