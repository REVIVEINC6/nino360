"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Eye, X } from "lucide-react"
import { createCampaign } from "@/app/(dashboard)/hotlist/actions/campaigns"
import { toast } from "sonner"

export function CampaignComposer() {
  const [isPending, startTransition] = useTransition()
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    requirement_id: "",
    message_template: "",
    send_immediately: true,
  })

  function handleAIGenerate() {
    // Mock AI generation - in production, this would call an AI service
    const aiMessage = `Hi {candidate_name},

I hope this message finds you well! I wanted to reach out because we have an exciting opportunity that aligns perfectly with your background and expertise.

We're currently working with a leading tech company that's looking for talented professionals like yourself. Based on your profile, I believe this could be a great fit for your next career move.

Key highlights:
- Competitive compensation package
- Remote-friendly work environment
- Opportunity to work with cutting-edge technologies
- Strong company culture and growth potential

Would you be interested in learning more about this opportunity? I'd love to schedule a brief call to discuss the details.

Looking forward to hearing from you!

Best regards,
{sender_name}`

    setFormData({ ...formData, message_template: aiMessage })
    toast.success("AI-generated message template created")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (selectedCandidates.length === 0) {
      toast.error("Please select at least one candidate")
      return
    }

    startTransition(async () => {
      const result = await createCampaign({
        ...formData,
        candidate_ids: selectedCandidates,
      })

      if (result.success) {
        toast.success(`Campaign ${formData.send_immediately ? "sent" : "scheduled"} successfully`)
        // Reset form
        setFormData({
          name: "",
          requirement_id: "",
          message_template: "",
          send_immediately: true,
        })
        setSelectedCandidates([])
      } else {
        toast.error("Failed to create campaign")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Campaign Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Q1 2024 Priority Outreach"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirement_id">Link to Requirement (Optional)</Label>
                <Select
                  value={formData.requirement_id}
                  onValueChange={(value) => setFormData({ ...formData, requirement_id: value })}
                >
                  <SelectTrigger id="requirement_id">
                    <SelectValue placeholder="Select a requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="req-1">Senior React Developer - Acme Corp</SelectItem>
                    <SelectItem value="req-2">Full Stack Engineer - TechCo</SelectItem>
                    <SelectItem value="req-3">DevOps Specialist - CloudInc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="message_template">Message Template *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAIGenerate}
                    className="gap-2 bg-transparent"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Generate
                  </Button>
                </div>
                <Textarea
                  id="message_template"
                  value={formData.message_template}
                  onChange={(e) => setFormData({ ...formData, message_template: e.target.value })}
                  placeholder="Hi {candidate_name},&#10;&#10;We have an exciting opportunity..."
                  rows={12}
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {"{candidate_name}"}, {"{candidate_title}"}, {"{sender_name}"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recipients & Actions */}
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Selected Candidates</Label>
                <div className="min-h-[100px] p-3 border border-border/40 rounded-lg bg-card/30">
                  {selectedCandidates.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No candidates selected</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidates.map((id) => (
                        <Badge key={id} variant="secondary" className="gap-1">
                          Candidate {id}
                          <button
                            type="button"
                            onClick={() => setSelectedCandidates(selectedCandidates.filter((c) => c !== id))}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  // Mock candidate selection - in production, this would open a candidate picker
                  const mockId = `cand-${Date.now()}`
                  setSelectedCandidates([...selectedCandidates, mockId])
                  toast.success("Candidate added")
                }}
              >
                Add Candidates
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button type="button" variant="outline" className="w-full gap-2 bg-transparent">
                <Eye className="h-4 w-4" />
                Preview
              </Button>

              <Button type="submit" disabled={isPending} className="w-full gap-2">
                <Send className="h-4 w-4" />
                {isPending ? "Sending..." : "Send Campaign"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Campaign will be sent to {selectedCandidates.length} candidate
                {selectedCandidates.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
