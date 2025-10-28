"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Save, Archive, Trash2, AlertTriangle } from "lucide-react"
import { updateProjectSettings, deleteProject, archiveProject } from "@/app/(dashboard)/projects/[id]/settings/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ProjectSettingsContentProps {
  project: any
}

export function ProjectSettingsContent({ project }: ProjectSettingsContentProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
    status: project.status || "active",
    priority: project.priority || "medium",
    budget: project.budget || 0,
    start_date: project.start_date || "",
    end_date: project.end_date || "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateProjectSettings(project.id, formData)
      toast.success("Project settings updated successfully")
    } catch (error) {
      toast.error("Failed to update project settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchive = async () => {
    if (!confirm("Are you sure you want to archive this project?")) return

    setIsLoading(true)
    try {
      await archiveProject(project.id)
      toast.success("Project archived successfully")
      router.push("/projects")
    } catch (error) {
      toast.error("Failed to archive project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return

    setIsLoading(true)
    try {
      await deleteProject(project.id)
      toast.success("Project deleted successfully")
      router.push("/projects")
    } catch (error) {
      toast.error("Failed to delete project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="glass-panel p-6">
        <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          General Settings
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="gradient-bg">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="glass-panel p-6 border-red-200">
        <h2 className="text-xl font-semibold mb-6 text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-medium text-red-900">Archive Project</h3>
              <p className="text-sm text-red-700">Archive this project. You can restore it later.</p>
            </div>
            <Button
              variant="outline"
              onClick={handleArchive}
              disabled={isLoading}
              className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-medium text-red-900">Delete Project</h3>
              <p className="text-sm text-red-700">Permanently delete this project. This action cannot be undone.</p>
            </div>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
