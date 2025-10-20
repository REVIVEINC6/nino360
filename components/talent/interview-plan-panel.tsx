"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit, Award, Clock, UsersIcon } from "lucide-react"
import { upsertInterviewPlan, upsertScorecard } from "@/app/(dashboard)/talent/jobs/actions"
import { toast } from "sonner"
import { ScorecardBuilder } from "./scorecard-builder"

interface InterviewPlanPanelProps {
  requisitionId: string
  initialPlan?: any[]
  scorecards?: any[]
}

export function InterviewPlanPanel({
  requisitionId,
  initialPlan = [],
  scorecards: initialScorecards = [],
}: InterviewPlanPanelProps) {
  const [steps, setSteps] = useState<any[]>(initialPlan)
  const [scorecards, setScorecards] = useState<any[]>(initialScorecards)
  const [saving, setSaving] = useState(false)
  const [editingStep, setEditingStep] = useState<any>(null)
  const [showStepDialog, setShowStepDialog] = useState(false)
  const [showScorecardDialog, setShowScorecardDialog] = useState(false)
  const [editingScorecard, setEditingScorecard] = useState<any>(null)

  // Step form state
  const [stepForm, setStepForm] = useState({
    name: "",
    duration: 30,
    panel: [] as string[],
    scorecard_id: "none",
  })

  useEffect(() => {
    setSteps(initialPlan)
    setScorecards(initialScorecards)
  }, [initialPlan, initialScorecards])

  const handleSavePlan = async () => {
    try {
      setSaving(true)
      await upsertInterviewPlan(requisitionId, steps)
      toast.success("Interview plan saved successfully")
    } catch (error) {
      console.error("[v0] Error saving interview plan:", error)
      toast.error("Failed to save interview plan")
    } finally {
      setSaving(false)
    }
  }

  const handleAddStep = () => {
    setStepForm({
      name: "",
      duration: 30,
      panel: [],
      scorecard_id: "none",
    })
    setEditingStep(null)
    setShowStepDialog(true)
  }

  const handleEditStep = (index: number) => {
    const step = steps[index]
    setStepForm(step)
    setEditingStep(index)
    setShowStepDialog(true)
  }

  const handleSaveStep = () => {
    if (!stepForm.name.trim()) {
      toast.error("Step name is required")
      return
    }

    if (editingStep !== null) {
      // Update existing step
      const newSteps = [...steps]
      newSteps[editingStep] = stepForm
      setSteps(newSteps)
    } else {
      // Add new step
      setSteps([...steps, stepForm])
    }

    setShowStepDialog(false)
    setStepForm({ name: "", duration: 30, panel: [], scorecard_id: "none" })
  }

  const handleDeleteStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...steps]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSteps.length) return
    ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    setSteps(newSteps)
  }

  const handleSaveScorecard = async (scorecardData: any) => {
    try {
      await upsertScorecard({
        requisition_id: requisitionId,
        id: editingScorecard?.id,
        ...scorecardData,
      })
      toast.success("Scorecard saved successfully")
      setShowScorecardDialog(false)
      setEditingScorecard(null)
      // Reload scorecards (in production, this would refetch from server)
      if (editingScorecard) {
        setScorecards(scorecards.map((sc) => (sc.id === editingScorecard.id ? { ...sc, ...scorecardData } : sc)))
      } else {
        setScorecards([...scorecards, { id: Date.now().toString(), ...scorecardData }])
      }
    } catch (error) {
      console.error("[v0] Error saving scorecard:", error)
      toast.error("Failed to save scorecard")
    }
  }

  return (
    <div className="space-y-6">
      {/* Interview Steps */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Interview Steps</h3>
            <p className="text-sm text-muted-foreground">Define the interview process and assign panels</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAddStep}>
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
            <Button onClick={handleSavePlan} disabled={saving}>
              {saving ? "Saving..." : "Save Plan"}
            </Button>
          </div>
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
            <h4 className="font-semibold">No Interview Steps</h4>
            <p className="text-sm text-muted-foreground">Add interview steps to define your hiring process</p>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveStep(index, "up")}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveStep(index, "down")}
                    disabled={index === steps.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    ↓
                  </Button>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      Step {index + 1}
                    </Badge>
                    <span className="font-semibold">{step.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {step.duration} min
                    </div>
                    {step.panel && step.panel.length > 0 && (
                      <div className="flex items-center gap-1">
                        <UsersIcon className="h-3 w-3" />
                        {step.panel.length} panelist{step.panel.length > 1 ? "s" : ""}
                      </div>
                    )}
                    {step.scorecard_id && step.scorecard_id !== "none" && (
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Scorecard attached
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditStep(index)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteStep(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Scorecards */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Evaluation Scorecards</h3>
            <p className="text-sm text-muted-foreground">Create scorecards to standardize candidate evaluation</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setEditingScorecard(null)
              setShowScorecardDialog(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Scorecard
          </Button>
        </div>

        {scorecards.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Award className="h-12 w-12 mx-auto text-muted-foreground" />
            <h4 className="font-semibold">No Scorecards</h4>
            <p className="text-sm text-muted-foreground">Create scorecards to evaluate candidates consistently</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scorecards.map((scorecard) => (
              <div
                key={scorecard.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-semibold">{scorecard.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {scorecard.dimensions?.length || 0} dimension{scorecard.dimensions?.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingScorecard(scorecard)
                      setShowScorecardDialog(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Step Dialog */}
      <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStep !== null ? "Edit" : "Add"} Interview Step</DialogTitle>
            <DialogDescription>
              Define the interview step details including duration and panel members
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="step-name">Step Name *</Label>
              <Input
                id="step-name"
                value={stepForm.name}
                onChange={(e) => setStepForm({ ...stepForm, name: e.target.value })}
                placeholder="e.g. Technical Screen, Culture Fit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="240"
                value={stepForm.duration}
                onChange={(e) => setStepForm({ ...stepForm, duration: Number.parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scorecard">Scorecard (optional)</Label>
              <Select
                value={stepForm.scorecard_id}
                onValueChange={(value) => setStepForm({ ...stepForm, scorecard_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a scorecard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {scorecards.map((sc) => (
                    <SelectItem key={sc.id} value={sc.id}>
                      {sc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStepDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStep}>{editingStep !== null ? "Update" : "Add"} Step</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scorecard Dialog */}
      <Dialog open={showScorecardDialog} onOpenChange={setShowScorecardDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingScorecard ? "Edit" : "Create"} Scorecard</DialogTitle>
            <DialogDescription>
              Define evaluation dimensions and rating scales for consistent candidate assessment
            </DialogDescription>
          </DialogHeader>

          <ScorecardBuilder
            initialData={editingScorecard}
            onSave={handleSaveScorecard}
            onCancel={() => {
              setShowScorecardDialog(false)
              setEditingScorecard(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
