"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { createTask } from "@/app/(dashboard)/crm/actions/calendar"
import { Loader2 } from "lucide-react"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await createTask({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        taskType: formData.get("taskType") as string,
        priority: formData.get("priority") as string,
        dueDate: formData.get("dueDate") as string,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-modal max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input id="title" name="title" required className="glass-panel" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" className="glass-panel" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taskType">Task Type</Label>
              <Select name="taskType" required>
                <SelectTrigger className="glass-panel">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" required>
                <SelectTrigger className="glass-panel">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" name="dueDate" type="datetime-local" className="glass-panel" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
