"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAutomationRule } from "@/app/(dashboard)/hotlist/actions/campaigns"
import { toast } from "sonner"

interface CreateRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (rule: any) => void
}

export function CreateRuleDialog({ open, onOpenChange, onSuccess }: CreateRuleDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    trigger_type: "candidate_added",
    action_type: "send_campaign",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const result = await createAutomationRule({
        name: formData.name,
        trigger_type: formData.trigger_type,
        conditions: {},
        actions: { type: formData.action_type },
      })

      if (result.success) {
        toast.success("Automation rule created")
        onSuccess(result.data)
        setFormData({
          name: "",
          trigger_type: "candidate_added",
          action_type: "send_campaign",
        })
      } else {
        toast.error("Failed to create rule")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Automation Rule</DialogTitle>
          <DialogDescription>Set up a new automation rule to streamline your hotlist workflow</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Auto-send to new candidates"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trigger_type">Trigger *</Label>
            <Select
              value={formData.trigger_type}
              onValueChange={(value) => setFormData({ ...formData, trigger_type: value })}
            >
              <SelectTrigger id="trigger_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="candidate_added">When candidate is added</SelectItem>
                <SelectItem value="requirement_created">When requirement is created</SelectItem>
                <SelectItem value="match_found">When match is found</SelectItem>
                <SelectItem value="response_received">When response is received</SelectItem>
                <SelectItem value="scheduled">On schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="action_type">Action *</Label>
            <Select
              value={formData.action_type}
              onValueChange={(value) => setFormData({ ...formData, action_type: value })}
            >
              <SelectTrigger id="action_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="send_campaign">Send campaign</SelectItem>
                <SelectItem value="notify_team">Notify team</SelectItem>
                <SelectItem value="update_status">Update status</SelectItem>
                <SelectItem value="create_task">Create task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Rule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
