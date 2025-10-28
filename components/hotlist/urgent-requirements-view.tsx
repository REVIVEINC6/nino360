"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, Clock, DollarSign, MapPin, Users, TrendingUp, AlertCircle } from "lucide-react"
import { AutoMatchDialog } from "./auto-match-dialog"
import { AddRequirementDialog } from "./add-requirement-dialog"
import { cn } from "@/lib/utils"

interface Requirement {
  id: string
  title: string
  client_name: string
  skills_required: string[]
  urgency_level: "critical" | "high" | "medium"
  positions_count: number
  rate_min: number
  rate_max: number
  location: string
  deadline_date: string
  match_count?: number
  created_at: string
}

interface UrgentRequirementsViewProps {
  initialRequirements: Requirement[]
}

export function UrgentRequirementsView({ initialRequirements }: UrgentRequirementsViewProps) {
  const [requirements, setRequirements] = useState(initialRequirements)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all")
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null)
  const [showAutoMatch, setShowAutoMatch] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isPending, startTransition] = useTransition()

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.skills_required.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesUrgency = selectedUrgency === "all" || req.urgency_level === selectedUrgency

    return matchesSearch && matchesUrgency
  })

  const urgencyColors = {
    critical: "bg-red-500/10 text-red-500 border-red-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  }

  const urgencyIcons = {
    critical: AlertCircle,
    high: TrendingUp,
    medium: Clock,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Urgent Requirements
          </h1>
          <p className="text-muted-foreground mt-1">High-priority job openings requiring immediate attention</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Users className="h-4 w-4" />
          Add Requirement
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, client, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "critical", "high", "medium"].map((urgency) => (
                <Button
                  key={urgency}
                  variant={selectedUrgency === urgency ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedUrgency(urgency)}
                  className="capitalize"
                >
                  {urgency}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRequirements.map((req) => {
          const UrgencyIcon = urgencyIcons[req.urgency_level]
          const daysUntilDeadline = Math.ceil(
            (new Date(req.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          )

          return (
            <Card
              key={req.id}
              className={cn(
                "border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all cursor-pointer",
                "hover:shadow-lg hover:scale-[1.02]",
              )}
              onClick={() => {
                setSelectedRequirement(req)
                setShowAutoMatch(true)
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{req.title}</CardTitle>
                  <Badge className={cn("shrink-0", urgencyColors[req.urgency_level])}>
                    <UrgencyIcon className="h-3 w-3 mr-1" />
                    {req.urgency_level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{req.client_name}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {req.skills_required.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {req.skills_required.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{req.skills_required.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{req.positions_count} positions</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      ${req.rate_min} - ${req.rate_max}/hr
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{req.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className={cn(daysUntilDeadline <= 3 && "text-red-500 font-medium")}>
                      {daysUntilDeadline} days left
                    </span>
                  </div>
                </div>

                {/* Auto-match indicator */}
                {req.match_count !== undefined && req.match_count > 0 && (
                  <div className="pt-3 border-t border-border/40">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-2 text-blue-400 hover:text-blue-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRequirement(req)
                        setShowAutoMatch(true)
                      }}
                    >
                      <Sparkles className="h-4 w-4" />
                      {req.match_count} AI matches found
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty state */}
      {filteredRequirements.length === 0 && (
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No requirements found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or add a new requirement</p>
            <Button onClick={() => setShowAddDialog(true)}>Add Requirement</Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      {selectedRequirement && (
        <AutoMatchDialog open={showAutoMatch} onOpenChange={setShowAutoMatch} requirement={selectedRequirement} />
      )}

      <AddRequirementDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={(newReq) => {
          setRequirements([newReq, ...requirements])
          setShowAddDialog(false)
        }}
      />
    </div>
  )
}
