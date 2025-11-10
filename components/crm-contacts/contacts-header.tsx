"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Upload, Download, Users, LayoutGrid, LayoutList, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ContactsHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  ownerFilter: string
  onOwnerChange: (value: string) => void
  engagedFilter: string
  onEngagedChange: (value: string) => void
  healthRange: [number, number]
  onHealthRangeChange: (value: [number, number]) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags: string[]
  view: "table" | "profile"
  onViewChange: (view: "table" | "profile") => void
  onNewContact: () => void
  onImport: () => void
  onExport: () => void
  onBulkActions: () => void
  selectedCount: number
  features: { import: boolean; export: boolean }
}

export function ContactsHeader({
  searchQuery,
  onSearchChange,
  ownerFilter,
  onOwnerChange,
  engagedFilter,
  onEngagedChange,
  healthRange,
  onHealthRangeChange,
  selectedTags,
  onTagsChange,
  availableTags,
  view,
  onViewChange,
  onNewContact,
  onImport,
  onExport,
  onBulkActions,
  selectedCount,
  features,
}: ContactsHeaderProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-4">
      {/* Main header row */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts by name, email, or company..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border p-1">
            <Button variant={view === "table" ? "secondary" : "ghost"} size="sm" onClick={() => onViewChange("table")}>
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "profile" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange("profile")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter toggle */}
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          {/* Actions */}
          {selectedCount > 0 && (
            <Button variant="outline" size="sm" onClick={onBulkActions}>
              <Users className="mr-2 h-4 w-4" />
              Bulk Actions ({selectedCount})
            </Button>
          )}

          {features.import && (
            <Button variant="outline" size="sm" onClick={onImport}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          )}

          {features.export && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}

          <Button onClick={onNewContact}>
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </Button>
        </div>
      </div>

      {/* Filters row */}
      {showFilters && (
        <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
          {/* Owner filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Owner:</span>
            <Select value={ownerFilter} onValueChange={onOwnerChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="me">Me</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Engaged filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Engaged:</span>
            <Select value={engagedFilter} onValueChange={onEngagedChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any time</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="none">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Health score filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Health: {healthRange[0]}-{healthRange[1]}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Health Score Range</span>
                    <span className="text-sm text-muted-foreground">
                      {healthRange[0]} - {healthRange[1]}
                    </span>
                  </div>
                  <Slider
                    value={healthRange}
                    onValueChange={(value) => onHealthRangeChange(value as [number, number])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Tags filter */}
          {availableTags.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {availableTags.map((tag) => (
                  <DropdownMenuItem
                    key={tag}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        onTagsChange(selectedTags.filter((t) => t !== tag))
                      } else {
                        onTagsChange([...selectedTags, tag])
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded border ${selectedTags.includes(tag) ? "bg-primary" : ""}`} />
                      <span>{tag}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Clear filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange("")
              onOwnerChange("all")
              onEngagedChange("any")
              onHealthRangeChange([0, 100])
              onTagsChange([])
            }}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Active filters display */}
      {(selectedTags.length > 0 || ownerFilter !== "all" || engagedFilter !== "any") && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {ownerFilter !== "all" && (
            <Badge variant="secondary">
              Owner: {ownerFilter}
              <button onClick={() => onOwnerChange("all")} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          )}
          {engagedFilter !== "any" && (
            <Badge variant="secondary">
              Engaged: {engagedFilter}
              <button onClick={() => onEngagedChange("any")} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <button
                onClick={() => onTagsChange(selectedTags.filter((t) => t !== tag))}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
