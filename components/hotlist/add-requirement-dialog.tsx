"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createRequirement } from "@/app/(dashboard)/hotlist/actions/requirements"
import { toast } from "sonner"

interface AddRequirementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (requirement: any) => void
}

export function AddRequirementDialog({ open, onOpenChange, onSuccess }: AddRequirementDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    description: "",
    skills_required: "",
    urgency_level: "high" as "critical" | "high" | "medium",
    positions_count: "1",
    rate_min: "",
    rate_max: "",
    location: "",
    deadline_date: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const result = await createRequirement({
        ...formData,
        skills_required: formData.skills_required.split(",").map((s) => s.trim()),
        positions_count: Number.parseInt(formData.positions_count),
        rate_min: Number.parseFloat(formData.rate_min),
        rate_max: Number.parseFloat(formData.rate_max),
      })

      if (result.success) {
        toast.success("Requirement added successfully")
        onSuccess(result.data)
        setFormData({
          title: "",
          client_name: "",
          description: "",
          skills_required: "",
          urgency_level: "high",
          positions_count: "1",
          rate_min: "",
          rate_max: "",
          location: "",
          deadline_date: "",
        })
      } else {
        toast.error("Failed to add requirement")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Urgent Requirement</DialogTitle>
          <DialogDescription>Create a new high-priority job requirement for the hotlist</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Senior React Developer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Acme Corp"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the role..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills_required">Required Skills * (comma-separated)</Label>
            <Input
              id="skills_required"
              value={formData.skills_required}
              onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
              placeholder="React, TypeScript, Node.js"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="urgency_level">Urgency Level *</Label>
              <Select
                value={formData.urgency_level}
                onValueChange={(value: any) => setFormData({ ...formData, urgency_level: value })}
              >
                <SelectTrigger id="urgency_level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="positions_count">Positions *</Label>
              <Input
                id="positions_count"
                type="number"
                min="1"
                value={formData.positions_count}
                onChange={(e) => setFormData({ ...formData, positions_count: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline_date">Deadline *</Label>
              <Input
                id="deadline_date"
                type="date"
                value={formData.deadline_date}
                onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rate_min">Min Rate ($/hr) *</Label>
              <Input
                id="rate_min"
                type="number"
                min="0"
                step="0.01"
                value={formData.rate_min}
                onChange={(e) => setFormData({ ...formData, rate_min: e.target.value })}
                placeholder="50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate_max">Max Rate ($/hr) *</Label>
              <Input
                id="rate_max"
                type="number"
                min="0"
                step="0.01"
                value={formData.rate_max}
                onChange={(e) => setFormData({ ...formData, rate_max: e.target.value })}
                placeholder="80"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Remote / New York, NY"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Requirement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
