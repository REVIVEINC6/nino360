"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Sparkles } from "lucide-react"
import { useState } from "react"

interface InterviewsHeaderProps {
  onFilterChange?: (filters: any) => void
  onFindSlots?: () => void
}

export function InterviewsHeader({ onFilterChange, onFindSlots }: InterviewsHeaderProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  const handleFilterChange = () => {
    onFilterChange?.({ search, status, dateRange })
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search interviews, candidates, jobs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              handleFilterChange()
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value)
            handleFilterChange()
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={dateRange}
          onValueChange={(value) => {
            setDateRange(value)
            handleFilterChange()
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export ICS
        </Button>
        <Button onClick={onFindSlots} className="bg-linear-to-r from-violet-600 to-purple-600">
          <Sparkles className="h-4 w-4 mr-2" />
          Find Slots
        </Button>
      </div>
    </div>
  )
}
