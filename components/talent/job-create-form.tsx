"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type RequisitionInput = {
  title: string
  department?: string
  location?: string
  employment_type?: "full_time" | "contract" | "intern" | "part_time"
  seniority?: "junior" | "mid" | "senior" | "lead" | "principal" | "executive"
  openings?: number
  band?: string
  salary_range?: { min?: number; max?: number; currency?: string }
  skills?: string[]
  description_md?: string
  remote_policy?: "onsite" | "hybrid" | "remote"
}

export function JobCreateForm({
  onSave,
  saving,
}: {
  onSave: (data: RequisitionInput) => Promise<void>
  saving?: boolean
}) {
  const router = useRouter()
  const [form, setForm] = useState<RequisitionInput>({
    title: "",
    department: "",
    location: "",
    employment_type: undefined,
    seniority: undefined,
    openings: 1,
    remote_policy: undefined,
    description_md: "",
    skills: [],
    band: "",
    salary_range: { min: undefined, max: undefined, currency: "USD" },
  })
  const [skillsText, setSkillsText] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const parsedSkills = useMemo(() => {
    return skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 40)
  }, [skillsText])

  function update<K extends keyof RequisitionInput>(key: K, value: RequisitionInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.title || form.title.trim().length < 3) next.title = "Title must be at least 3 characters"
    if (form.openings !== undefined && (isNaN(form.openings) || (form.openings as number) < 1))
      next.openings = "Openings must be a positive integer"
    if (
      form.salary_range?.min !== undefined &&
      form.salary_range?.max !== undefined &&
      (form.salary_range.min as number) > (form.salary_range.max as number)
    )
      next.salary = "Max salary must be greater than or equal to Min"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const payload: RequisitionInput = {
      ...form,
      title: form.title.trim(),
      openings: form.openings ? Math.max(1, Math.floor(form.openings)) : 1,
      skills: parsedSkills,
      salary_range: form.salary_range?.currency
        ? {
          min: form.salary_range?.min ? Number(form.salary_range.min) : undefined,
          max: form.salary_range?.max ? Number(form.salary_range.max) : undefined,
          currency: form.salary_range.currency?.toUpperCase().slice(0, 3),
        }
        : undefined,
    }
    await onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <div className="text-sm font-medium">Job Title<span className="text-red-500">*</span></div>
            <Input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g., Senior Frontend Engineer"
            />
            {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Department</div>
            <Input value={form.department || ""} onChange={(e) => update("department", e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Location</div>
            <Input value={form.location || ""} onChange={(e) => update("location", e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Employment Type</div>
            <Select
              value={form.employment_type}
              onValueChange={(v) => update("employment_type", v as RequisitionInput["employment_type"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="part_time">Part-time</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Seniority</div>
            <Select
              value={form.seniority}
              onValueChange={(v) => update("seniority", v as RequisitionInput["seniority"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="principal">Principal</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Openings</div>
            <Input
              type="number"
              min={1}
              value={form.openings ?? 1}
              onChange={(e) => update("openings", Number(e.target.value))}
            />
            {errors.openings && <p className="text-xs text-red-600">{errors.openings}</p>}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Work Policy</div>
            <Select
              value={form.remote_policy}
              onValueChange={(v) => update("remote_policy", v as RequisitionInput["remote_policy"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Onsite / Hybrid / Remote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm font-medium">Job Description (Markdown supported)</div>
            <Textarea
              className="min-h-40"
              value={form.description_md || ""}
              onChange={(e) => update("description_md", e.target.value)}
              placeholder={`Responsibilities:\n- \n\nQualifications:\n- `}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm font-medium">Skills (comma separated, max 40)</div>
            <Input
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g., React, TypeScript, Node.js, GraphQL"
            />
            {parsedSkills.length > 0 && (
              <p className="text-xs text-muted-foreground">{parsedSkills.length} skill(s) detected</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compensation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2 md:col-span-2">
            <div className="text-sm font-medium">Band</div>
            <Input value={form.band || ""} onChange={(e) => update("band", e.target.value)} placeholder="e.g., L5" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Min</div>
            <Input
              type="number"
              min={0}
              value={form.salary_range?.min ?? ""}
              onChange={(e) => update("salary_range", { ...form.salary_range, min: Number(e.target.value) })}
              placeholder="e.g., 120000"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Max</div>
            <Input
              type="number"
              min={0}
              value={form.salary_range?.max ?? ""}
              onChange={(e) => update("salary_range", { ...form.salary_range, max: Number(e.target.value) })}
              placeholder="e.g., 160000"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Currency</div>
            <Input
              value={form.salary_range?.currency || ""}
              maxLength={3}
              onChange={(e) => update("salary_range", { ...form.salary_range, currency: e.target.value.toUpperCase() })}
              placeholder="USD"
            />
          </div>
          {errors.salary && <p className="text-xs text-red-600 md:col-span-4">{errors.salary}</p>}
        </CardContent>
      </Card>

      <div className={cn("flex items-center gap-2", "sticky bottom-0 py-4 bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/40")}>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={!!saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={!!saving}>
          {saving ? "Saving…" : "Save Draft"}
        </Button>
      </div>
    </form>
  )
}
