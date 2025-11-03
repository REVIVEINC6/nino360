"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sparkles } from "lucide-react"
import { submitFeedback, generateFeedbackDraft } from "@/app/(dashboard)/talent/interviews/actions"

interface ScorecardFormProps {
  interviewId: string
  reviewerId: string
  dimensions: Array<{
    key: string
    label: string
    description?: string
    scale_min: number
    scale_max: number
  }>
  onSubmit?: () => void
}

export function ScorecardForm({ interviewId, reviewerId, dimensions, onSubmit }: ScorecardFormProps) {
  const [ratings, setRatings] = useState<Record<string, { score: number; note: string }>>({})
  const [overall, setOverall] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRatingChange = (key: string, score: number) => {
    setRatings((prev) => ({ ...prev, [key]: { ...prev[key], score } }))
  }

  const handleNoteChange = (key: string, note: string) => {
    setRatings((prev) => ({ ...prev, [key]: { ...prev[key], note } }))
  }

  const handleAIDraft = async (key: string) => {
    try {
      const result = await generateFeedbackDraft(interviewId, key)
      handleNoteChange(key, result.draft)
    } catch (error) {
      console.error("[v0] Error generating draft:", error)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const ratingsArray = Object.entries(ratings).map(([dimension_key, data]) => ({
        dimension_key,
        score: data.score,
        note: data.note,
      }))

      await submitFeedback({
        interview_id: interviewId,
        reviewer_id: reviewerId,
        ratings: ratingsArray,
        overall: overall as any,
        notes,
      })

      onSubmit?.()
    } catch (error) {
      console.error("[v0] Error submitting feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Scorecard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {dimensions.map((dim) => (
          <div key={dim.key} className="space-y-3 pb-6 border-b last:border-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label className="text-base font-semibold">{dim.label}</Label>
                {dim.description && <p className="text-sm text-muted-foreground mt-1">{dim.description}</p>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAIDraft(dim.key)}
                className="text-violet-600 hover:text-violet-700"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                AI Draft
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className="font-semibold">{ratings[dim.key]?.score || dim.scale_min}</span>
              </div>
              <Slider
                value={[ratings[dim.key]?.score || dim.scale_min]}
                onValueChange={([value]) => handleRatingChange(dim.key, value)}
                min={dim.scale_min}
                max={dim.scale_max}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{dim.scale_min}</span>
                <span>{dim.scale_max}</span>
              </div>
            </div>

            <Textarea
              placeholder="Add notes for this dimension..."
              value={ratings[dim.key]?.note || ""}
              onChange={(e) => handleNoteChange(dim.key, e.target.value)}
              rows={2}
            />
          </div>
        ))}

        <div className="space-y-3 pt-4 border-t">
          <Label className="text-base font-semibold">Overall Recommendation</Label>
          <Select value={overall} onValueChange={setOverall}>
            <SelectTrigger>
              <SelectValue placeholder="Select recommendation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strong_yes">Strong Yes - Exceptional candidate</SelectItem>
              <SelectItem value="yes">Yes - Good fit</SelectItem>
              <SelectItem value="lean_yes">Lean Yes - Potential with reservations</SelectItem>
              <SelectItem value="no">No - Not a fit</SelectItem>
              <SelectItem value="strong_no">Strong No - Clear mismatch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Additional Notes</Label>
          <Textarea
            placeholder="Any additional observations or comments..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading || !overall} className="w-full">
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </CardContent>
    </Card>
  )
}
