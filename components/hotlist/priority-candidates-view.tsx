"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Package, Send, Archive, Search, Grid3x3, List, Star, Clock, DollarSign, MapPin, Briefcase } from "lucide-react"
import { getHotlistCandidates } from "@/app/(dashboard)/hotlist/actions/candidates"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type ViewMode = "grid" | "list"

export function PriorityCandidatesView() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    status: "all",
    priority_level: "all",
    search: "",
  })

  useEffect(() => {
    loadCandidates()
  }, [filters])

  async function loadCandidates() {
    try {
      setLoading(true)
      const result = await getHotlistCandidates(filters)
      setCandidates(result.candidates)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load candidates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function toggleSelection(id: string) {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  function selectAll() {
    if (selectedIds.size === candidates.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(candidates.map((c) => c.id)))
    }
  }

  const selectedCount = selectedIds.size

  return (
    <div className="space-y-4">
      {/* Filters & Actions Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9"
            />
          </div>

          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="packaged">Packaged</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="interested">Interested</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority_level}
            onValueChange={(value) => setFilters({ ...filters, priority_level: value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode("grid")}>
            <Grid3x3 className={cn("h-4 w-4", viewMode === "grid" && "text-primary")} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode("list")}>
            <List className={cn("h-4 w-4", viewMode === "list" && "text-primary")} />
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Checkbox checked={selectedIds.size === candidates.length} onCheckedChange={selectAll} />
              <span className="text-sm font-medium">
                {selectedCount} candidate{selectedCount !== 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Bulk Package
              </Button>
              <Button size="sm" variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Bulk Send
              </Button>
              <Button size="sm" variant="outline">
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading candidates...</p>
        </div>
      ) : candidates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No priority candidates</h3>
            <p className="text-sm text-muted-foreground mb-4">Add candidates to the hotlist to get started</p>
            <Button>Add Candidates</Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {candidates.map((item) => (
            <CandidateCard
              key={item.id}
              candidate={item}
              selected={selectedIds.has(item.id)}
              onToggleSelect={() => toggleSelection(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {candidates.map((item) => (
            <CandidateListItem
              key={item.id}
              candidate={item}
              selected={selectedIds.has(item.id)}
              onToggleSelect={() => toggleSelection(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CandidateCard({
  candidate,
  selected,
  onToggleSelect,
}: {
  candidate: any
  selected: boolean
  onToggleSelect: () => void
}) {
  const cand = candidate.candidate

  return (
    <Card className={cn("relative transition-all hover:shadow-md", selected && "ring-2 ring-primary")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox checked={selected} onCheckedChange={onToggleSelect} />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">
                {cand?.first_name} {cand?.last_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground truncate">{cand?.primary_skill}</p>
            </div>
          </div>
          <PriorityBadge level={candidate.priority_level} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Readiness Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Readiness</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  candidate.readiness_score >= 80
                    ? "bg-green-500"
                    : candidate.readiness_score >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500",
                )}
                style={{ width: `${candidate.readiness_score}%` }}
              />
            </div>
            <span className="text-sm font-medium">{candidate.readiness_score}%</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {cand?.skills?.slice(0, 3).map((skill: any, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {typeof skill === "string" ? skill : skill.name}
            </Badge>
          ))}
          {cand?.skills?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{cand.skills.length - 3}
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Briefcase className="h-3 w-3" />
            <span>{cand?.experience_years}+ years</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3" />
            <span>${cand?.current_rate}/hr</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>
              Available {cand?.availability_date ? new Date(cand.availability_date).toLocaleDateString() : "Now"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span>{cand?.location || "Remote"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Package className="mr-1 h-3 w-3" />
            Package
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Send className="mr-1 h-3 w-3" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CandidateListItem({
  candidate,
  selected,
  onToggleSelect,
}: {
  candidate: any
  selected: boolean
  onToggleSelect: () => void
}) {
  const cand = candidate.candidate

  return (
    <Card className={cn("transition-all hover:shadow-sm", selected && "ring-2 ring-primary")}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Checkbox checked={selected} onCheckedChange={onToggleSelect} />

          <div className="flex-1 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3">
              <p className="font-medium">
                {cand?.first_name} {cand?.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{cand?.primary_skill}</p>
            </div>

            <div className="col-span-2">
              <PriorityBadge level={candidate.priority_level} />
            </div>

            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full",
                      candidate.readiness_score >= 80
                        ? "bg-green-500"
                        : candidate.readiness_score >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500",
                    )}
                    style={{ width: `${candidate.readiness_score}%` }}
                  />
                </div>
                <span className="text-sm">{candidate.readiness_score}%</span>
              </div>
            </div>

            <div className="col-span-2 text-sm text-muted-foreground">
              {cand?.experience_years}+ yrs • ${cand?.current_rate}/hr
            </div>

            <div className="col-span-2 text-sm text-muted-foreground">
              {cand?.availability_date ? new Date(cand.availability_date).toLocaleDateString() : "Available now"}
            </div>

            <div className="col-span-1 flex justify-end gap-2">
              <Button size="sm" variant="ghost">
                <Package className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PriorityBadge({ level }: { level: string }) {
  const variants = {
    critical: "bg-red-500 text-white",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-500 text-white",
    low: "bg-blue-500 text-white",
  }

  return (
    <Badge className={cn("text-xs", variants[level as keyof typeof variants] || variants.medium)}>
      <Star className="mr-1 h-3 w-3" />
      {level}
    </Badge>
  )
}
