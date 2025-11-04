"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addToHotlist } from "@/app/(dashboard)/hotlist/actions/candidates"
import { toast } from "@/hooks/use-toast"

interface AddToHotlistDialogProps {
  candidateId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddToHotlistDialog({ candidateId, open, onOpenChange, onSuccess }: AddToHotlistDialogProps) {
  const [loading, setLoading] = useState(false)
  const [priorityLevel, setPriorityLevel] = useState("medium")
  const [reason, setReason] = useState("")

  async function handleSubmit() {
    try {
      setLoading(true)
      await addToHotlist({
        candidate_id: candidateId,
        priority_level: priorityLevel as any,
        added_reason: reason,
      })

      toast({
        title: "Success",
        description: "Candidate added to hotlist",
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add candidate",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Hotlist</DialogTitle>
          <DialogDescription>Add this candidate to the priority hotlist for rapid placement</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={priorityLevel} onValueChange={setPriorityLevel}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Why is this candidate being prioritized?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add to Hotlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
