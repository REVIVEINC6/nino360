"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { createAutomationWorkflow } from "@/app/(dashboard)/talent/applicants/actions"
import { useToast } from "@/hooks/use-toast"

interface CreateWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateWorkflowDialog({ open, onOpenChange }: CreateWorkflowDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [triggerType, setTriggerType] = useState("")
  const [actions, setActions] = useState<Array<{ type: string; config: any }>>([])
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  const handleAddAction = () => {
    setActions([...actions, { type: "", config: {} }])
  }

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index))
  }

  const handleActionTypeChange = (index: number, type: string) => {
    const newActions = [...actions]
    newActions[index].type = type
    setActions(newActions)
  }

  const handleCreate = async () => {
    if (!name || !triggerType || actions.length === 0) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setCreating(true)
    try {
      const response = await createAutomationWorkflow({
        name,
        description,
        trigger_type: triggerType,
        trigger_conditions: {},
        actions,
        is_active: true,
      })

      if (response.success) {
        toast({
          title: "Workflow created",
          description: "Automation workflow created successfully",
        })
        onOpenChange(false)
        // Reset form
        setName("")
        setDescription("")
        setTriggerType("")
        setActions([])
      } else {
        toast({
          title: "Creation failed",
          description: response.error || "Failed to create workflow",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the workflow",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Automation Workflow</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Workflow Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Auto-screen new applicants"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this workflow does..."
              rows={3}
            />
          </div>

          <div>
            <Label>Trigger Type</Label>
            <Select value={triggerType} onValueChange={setTriggerType}>
              <SelectTrigger>
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on_application_submit">On Application Submit</SelectItem>
                <SelectItem value="on_status_change">On Status Change</SelectItem>
                <SelectItem value="on_score_threshold">On Score Threshold</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Actions</Label>
              <Button size="sm" variant="outline" onClick={handleAddAction}>
                <Plus className="h-4 w-4 mr-1" />
                Add Action
              </Button>
            </div>

            <div className="space-y-2">
              {actions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Select value={action.type} onValueChange={(value) => handleActionTypeChange(index, value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="send_email">Send Email</SelectItem>
                      <SelectItem value="update_status">Update Status</SelectItem>
                      <SelectItem value="run_screening">Run AI Screening</SelectItem>
                      <SelectItem value="schedule_interview">Schedule Interview</SelectItem>
                      <SelectItem value="send_rejection">Send Rejection</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveAction(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreate} disabled={creating} className="flex-1">
              {creating ? "Creating..." : "Create Workflow"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
