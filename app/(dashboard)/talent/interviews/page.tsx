"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar } from "lucide-react"
import { listInterviews, upsertInterview } from "../actions/interviews"

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})

  const load = async () => {
    try {
      const data = await listInterviews()
      setInterviews(data)
    } catch (error) {
      console.error("[v0] Error loading interviews:", error)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsertInterview(formData)
      setIsAddOpen(false)
      setFormData({})
      load()
    } catch (error) {
      console.error("[v0] Error saving interview:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground">Schedule and manage candidate interviews</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="round_name">Round Name *</Label>
                <Input
                  id="round_name"
                  required
                  placeholder="e.g., Technical Round 1"
                  value={formData.round_name || ""}
                  onChange={(e) => setFormData({ ...formData, round_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_start">Start Time *</Label>
                  <Input
                    id="scheduled_start"
                    type="datetime-local"
                    required
                    value={formData.scheduled_start || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduled_start: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled_end">End Time *</Label>
                  <Input
                    id="scheduled_end"
                    type="datetime-local"
                    required
                    value={formData.scheduled_end || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduled_end: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mode">Mode *</Label>
                <Select
                  value={formData.mode || "video"}
                  onValueChange={(value) => setFormData({ ...formData, mode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meet_url">Meeting URL</Label>
                <Input
                  id="meet_url"
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={formData.meet_url || ""}
                  onChange={(e) => setFormData({ ...formData, meet_url: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell className="font-medium">
                  {interview.application?.candidate?.first_name} {interview.application?.candidate?.last_name}
                </TableCell>
                <TableCell>{interview.application?.job?.title}</TableCell>
                <TableCell>{interview.round_name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(interview.scheduled_start).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{interview.mode}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={interview.status === "scheduled" ? "default" : "secondary"}>{interview.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
