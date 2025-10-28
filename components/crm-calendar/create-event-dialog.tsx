"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { createEvent } from "@/app/(dashboard)/crm/actions/calendar"
import { Loader2 } from "lucide-react"

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await createEvent({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        eventType: formData.get("eventType") as string,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        location: formData.get("location") as string,
        meetingUrl: formData.get("meetingUrl") as string,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create event:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-modal max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" name="title" required className="glass-panel" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" className="glass-panel" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select name="eventType" required>
                <SelectTrigger className="glass-panel">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" className="glass-panel" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" name="startTime" type="datetime-local" required className="glass-panel" />
            </div>

            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" name="endTime" type="datetime-local" required className="glass-panel" />
            </div>
          </div>

          <div>
            <Label htmlFor="meetingUrl">Meeting URL (optional)</Label>
            <Input id="meetingUrl" name="meetingUrl" type="url" placeholder="https://..." className="glass-panel" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
