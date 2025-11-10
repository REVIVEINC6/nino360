"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface FilterPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: any
  onFiltersChange: (filters: any) => void
}

const statusOptions = ["New", "Screening", "Interviewing", "Offered", "Hired", "Rejected", "Withdrawn"]
const sourceOptions = ["LinkedIn", "Referral", "Job Board", "Website", "Agency", "Direct"]

export function FilterPanel({ open, onOpenChange, filters, onFiltersChange }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleApply = () => {
    onFiltersChange(localFilters)
    onOpenChange(false)
  }

  const handleClear = () => {
    setLocalFilters({})
    onFiltersChange({})
  }

  const toggleArrayFilter = (key: string, value: string) => {
    const current = localFilters[key] || []
    const updated = current.includes(value) ? current.filter((v: string) => v !== value) : [...current, value]
    setLocalFilters({ ...localFilters, [key]: updated })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Candidates</SheetTitle>
          <SheetDescription>Refine your candidate search with advanced filters</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Status</Label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={localFilters.status?.includes(status)}
                    onCheckedChange={() => toggleArrayFilter("status", status)}
                  />
                  <label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Source Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Source</Label>
            <div className="space-y-2">
              {sourceOptions.map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={`source-${source}`}
                    checked={localFilters.source?.includes(source)}
                    onCheckedChange={() => toggleArrayFilter("source", source)}
                  />
                  <label htmlFor={`source-${source}`} className="text-sm cursor-pointer">
                    {source}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Experience Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Experience (Years)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exp-min" className="text-sm">
                  Minimum
                </Label>
                <Input
                  id="exp-min"
                  type="number"
                  min="0"
                  value={localFilters.experience_min || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, experience_min: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-max" className="text-sm">
                  Maximum
                </Label>
                <Input
                  id="exp-max"
                  type="number"
                  min="0"
                  value={localFilters.experience_max || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, experience_max: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Skills Filter */}
          <div className="space-y-3">
            <Label htmlFor="skills" className="text-base font-semibold">
              Skills (comma-separated)
            </Label>
            <Input
              id="skills"
              placeholder="e.g., React, Node.js, Python"
              value={localFilters.skills?.join(", ") || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClear} className="flex-1 bg-transparent">
            Clear All
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
