"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, X } from "lucide-react"
import { rewriteJD, extractSkills } from "@/app/(dashboard)/talent/jobs/actions"

interface JobEditorProps {
  initialData?: any
  onSave: (data: any) => Promise<void>
  saving?: boolean
}

export function JobEditor({ initialData, onSave, saving }: JobEditorProps) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      department: "",
      location: "",
      employment_type: "full_time",
      seniority: "mid",
      openings: 1,
      remote_policy: "hybrid",
      description_md: "",
      skills: [],
      salary_range: { min: 0, max: 0, currency: "USD" },
    },
  )

  const [skillInput, setSkillInput] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      })
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s: string) => s !== skill),
    })
  }

  const handleAIRewrite = async (tone: "formal" | "casual" | "inclusive") => {
    if (!initialData?.id) return
    try {
      setAiLoading(true)
      const result = await rewriteJD(initialData.id, tone)
      setFormData({ ...formData, description_md: result.rewritten })
    } catch (error) {
      console.error("[v0] Error rewriting JD:", error)
    } finally {
      setAiLoading(false)
    }
  }

  const handleExtractSkills = async () => {
    if (!initialData?.id) return
    try {
      setAiLoading(true)
      const result = await extractSkills(initialData.id)
      setFormData({ ...formData, skills: result.skills })
    } catch (error) {
      console.error("[v0] Error extracting skills:", error)
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) => setFormData({ ...formData, employment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seniority">Seniority</Label>
                <Select
                  value={formData.seniority}
                  onValueChange={(value) => setFormData({ ...formData, seniority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid-Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="principal">Principal</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openings">Openings</Label>
                <Input
                  id="openings"
                  type="number"
                  min="1"
                  value={formData.openings}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      openings: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remote_policy">Remote Policy</Label>
              <Select
                value={formData.remote_policy}
                onValueChange={(value) => setFormData({ ...formData, remote_policy: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="description" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Job Description</Label>
              {initialData?.id && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIRewrite("formal")}
                    disabled={aiLoading}
                  >
                    <Sparkles className="mr-2 h-3 w-3" />
                    Formal
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIRewrite("inclusive")}
                    disabled={aiLoading}
                  >
                    <Sparkles className="mr-2 h-3 w-3" />
                    Inclusive
                  </Button>
                </div>
              )}
            </div>
            <Textarea
              id="description"
              rows={15}
              value={formData.description_md}
              onChange={(e) => setFormData({ ...formData, description_md: e.target.value })}
              placeholder="Write a compelling job description..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">Supports Markdown formatting</p>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Skills & Requirements</Label>
              {initialData?.id && (
                <Button type="button" variant="outline" size="sm" onClick={handleExtractSkills} disabled={aiLoading}>
                  <Sparkles className="mr-2 h-3 w-3" />
                  Extract from JD
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddSkill()
                  }
                }}
                placeholder="Add a skill (press Enter)"
              />
              <Button type="button" onClick={handleAddSkill}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="compensation" className="space-y-4">
          <Card className="p-6 space-y-4">
            <Label>Salary Range</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_min">Minimum</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={formData.salary_range.min}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary_range: {
                        ...formData.salary_range,
                        min: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_max">Maximum</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={formData.salary_range.max}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary_range: {
                        ...formData.salary_range,
                        max: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.salary_range.currency}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      salary_range: {
                        ...formData.salary_range,
                        currency: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Requisition"}
        </Button>
      </div>
    </form>
  )
}
