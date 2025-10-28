"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Upload } from "lucide-react"
import { upsertCandidate } from "@/app/(dashboard)/talent/actions/candidates"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AddCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCandidateDialog({ open, onOpenChange }: AddCandidateDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    summary: "",
    source: "upload" as const,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const candidate = await upsertCandidate(formData)
      toast.success("Candidate added successfully!")
      onOpenChange(false)
      router.push(`/talent/candidates/${candidate.id}`)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error adding candidate:", error)
      toast.error("Failed to add candidate")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>Enter candidate details manually or use AI to parse from resume</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">Current Title/Headline</Label>
            <Input
              id="headline"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={formData.source} onValueChange={(value: any) => setFormData({ ...formData, source: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upload">Direct Upload</SelectItem>
                <SelectItem value="sourced">Sourced</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="job_board">Job Board</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={4}
              placeholder="Brief professional summary..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" disabled={loading}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>
            <Button type="button" variant="outline" className="flex-1 bg-transparent" disabled={loading}>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Parse Resume
            </Button>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Adding..." : "Add Candidate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
