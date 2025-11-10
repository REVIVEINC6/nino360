"use client"

import { Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

interface AnalyticsHeaderProps {
  tenantName: string
  dateRange: { from: string; to: string }
  grain: "day" | "week" | "month"
  onDateRangeChange: (range: { from: string; to: string }) => void
  onGrainChange: (grain: "day" | "week" | "month") => void
}

export function AnalyticsHeader({
  tenantName,
  dateRange,
  grain,
  onDateRangeChange,
  onGrainChange,
}: AnalyticsHeaderProps) {
  const presets = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
  ]

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold brand-gradient-text">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">{tenantName}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Calendar className="h-4 w-4" />
                {format(new Date(dateRange.from), "MMM d")} - {format(new Date(dateRange.to), "MMM d, yyyy")}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {presets.map((preset) => (
                <DropdownMenuItem
                  key={preset.days}
                  onClick={() => {
                    const to = new Date()
                    const from = new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000)
                    onDateRangeChange({
                      from: from.toISOString(),
                      to: to.toISOString(),
                    })
                  }}
                >
                  {preset.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Grain Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                {grain.charAt(0).toUpperCase() + grain.slice(1)}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onGrainChange("day")}>Day</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onGrainChange("week")}>Week</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onGrainChange("month")}>Month</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
