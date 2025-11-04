"use client"

import { useState, useEffect, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, CheckCircle2, Send, TrendingUp, Clock, DollarSign, MapPin } from "lucide-react"
import { runAutoMatch } from "@/app/(dashboard)/hotlist/actions/matches"
import { createCampaign } from "@/app/(dashboard)/hotlist/actions/campaigns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface AutoMatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requirement: {
    id: string
    title: string
    client_name: string
    skills_required: string[]
    rate_min: number
    rate_max: number
    location: string
  }
}

interface Match {
  candidate_id: string
  candidate_name: string
  candidate_email: string
  candidate_title: string
  candidate_skills: string[]
  candidate_rate: number
  candidate_location: string
  candidate_avatar?: string
  match_score: number
  match_reasons: string[]
  availability_status: string
}

export function AutoMatchDialog({ open, onOpenChange, requirement }: AutoMatchDialogProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (open) {
      loadMatches()
    }
  }, [open, requirement.id])

  async function loadMatches() {
    setIsLoading(true)
    const result = await runAutoMatch(requirement.id)
    // runAutoMatch returns { matches, message } — normalize it
    if (result && Array.isArray((result as any).matches)) {
      setMatches((result as any).matches)
    } else {
      toast.error("Failed to load matches")
    }
    setIsLoading(false)
  }

  function toggleMatch(candidateId: string) {
    const newSelected = new Set(selectedMatches)
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId)
    } else {
      newSelected.add(candidateId)
    }
    setSelectedMatches(newSelected)
  }

  function handleSendCampaign() {
    if (selectedMatches.size === 0) {
      toast.error("Please select at least one candidate")
      return
    }

    startTransition(async () => {
      const result = await createCampaign({
        name: `Auto-match for ${requirement.title}`,
        requirement_id: requirement.id,
        candidate_ids: Array.from(selectedMatches),
        message_template: `Hi {candidate_name},\n\nWe have an exciting opportunity with ${requirement.client_name} for a ${requirement.title} role that matches your profile.\n\nKey details:\n- Skills: ${requirement.skills_required.join(", ")}\n- Rate: $${requirement.rate_min}-${requirement.rate_max}/hr\n- Location: ${requirement.location}\n\nAre you interested in learning more?\n\nBest regards`,
        send_immediately: true,
      })

      if (result.success) {
        toast.success(`Campaign sent to ${selectedMatches.size} candidates`)
        onOpenChange(false)
      } else {
        toast.error("Failed to send campaign")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            AI-Powered Matches
          </DialogTitle>
          <DialogDescription>
            {requirement.title} at {requirement.client_name}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground">
                Try adjusting the requirement criteria or add more candidates to the hotlist
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {matches.map((match) => (
                <Card
                  key={match.candidate_id}
                  className={cn(
                    "border-border/40 bg-card/50 backdrop-blur cursor-pointer transition-all",
                    selectedMatches.has(match.candidate_id) && "ring-2 ring-blue-500 bg-blue-500/5",
                  )}
                  onClick={() => toggleMatch(match.candidate_id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-1">
                        <div
                          className={cn(
                            "h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
                            selectedMatches.has(match.candidate_id)
                              ? "bg-blue-500 border-blue-500"
                              : "border-muted-foreground",
                          )}
                        >
                          {selectedMatches.has(match.candidate_id) && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={match.candidate_avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {match.candidate_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold">{match.candidate_name}</h4>
                            <p className="text-sm text-muted-foreground">{match.candidate_title}</p>
                          </div>
                            <Badge className="bg-linear-to-r from-blue-500 to-purple-500 text-white shrink-0">
                              {Math.round((Number(match.match_score) || 0) * 100)}% match
                            </Badge>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {match.candidate_skills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        {/* Info */}
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />${match.candidate_rate}/hr
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {match.candidate_location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {match.availability_status}
                          </div>
                        </div>

                        {/* Match reasons */}
                        <div className="space-y-1">
                          {match.match_reasons.map((reason, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <TrendingUp className="h-3 w-3 mt-0.5 text-blue-400 shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {selectedMatches.size} of {matches.length} selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSendCampaign}
                  disabled={selectedMatches.size === 0 || isPending}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Campaign
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
