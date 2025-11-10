"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Upload, ShieldCheck, Rocket } from "lucide-react"
import { JobCreateForm } from "@/components/talent/job-create-form"
import {
  createRequisition,
  createAndPublishRequisition,
  aiComposeFromDraft,
  aiExtractSkillsFromDraft,
  aiDiversityReviewDraft,
  listTargets,
  getContext,
} from "../actions"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function NewRequisitionPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [ctx, setCtx] = useState<any | null>(null)
  const [targets, setTargets] = useState<any[]>([])
  const [selectedTargets, setSelectedTargets] = useState<string[]>([])

  // AI draft helpers state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [skillsText, setSkillsText] = useState("")
  const parsedSkills = useMemo(
    () => skillsText.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 40),
    [skillsText],
  )
  const [aiBusy, setAiBusy] = useState(false)
  const [tone, setTone] = useState<"formal" | "casual" | "inclusive">("inclusive")

  useEffect(() => {
    ;(async () => {
      try {
        const c = await getContext()
        setCtx(c)
        const t = await listTargets()
        setTargets(t || [])
      } catch {}
    })()
  }, [])

  const handleSave = async (data: any) => {
    try {
      setSaving(true)
      const id = await createRequisition(data)
      router.push(`/talent/jobs/${id}`)
    } catch (error) {
      console.error("[v0] Error creating requisition:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCreateAndPublish = async (data: any) => {
    try {
      setSaving(true)
      const res = await createAndPublishRequisition(data, selectedTargets)
      toast.success("Requisition created and publish initiated")
      router.push(`/talent/jobs/${res.id}`)
    } catch (e) {
      toast.error("Failed to create & publish")
    } finally {
      setSaving(false)
    }
  }

  // AI helpers
  const composeJD = async () => {
    if (!title.trim()) return toast.error("Enter a title first")
    setAiBusy(true)
    try {
      const res = await aiComposeFromDraft({ title, description, skills: parsedSkills, tone })
      setDescription(res.text || description)
    } finally {
      setAiBusy(false)
    }
  }

  const extractSkills = async () => {
    if (!title.trim() && !description.trim()) return toast.error("Enter a title or description first")
    setAiBusy(true)
    try {
      const res = await aiExtractSkillsFromDraft({ title, description })
      const merged = Array.from(new Set([...
        parsedSkills,
        ...(res.skills || []),
      ])).slice(0, 40)
      setSkillsText(merged.join(", "))
    } finally {
      setAiBusy(false)
    }
  }

  const diversityReview = async () => {
    if (!description.trim()) return toast.error("Enter a description first")
    setAiBusy(true)
    try {
      const res = await aiDiversityReviewDraft({ description })
      const issues = res.issues?.length || 0
      const suggestions = res.suggestions?.length || 0
      toast.info(`Diversity review: ${issues} issues, ${suggestions} suggestions`)
    } finally {
      setAiBusy(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Job Requisition</h1>
          <p className="text-muted-foreground">Create a new job opening and start hiring</p>
        </div>
      </div>

      {/* AI Draft Assistant */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium flex items-center gap-2"><Sparkles className="h-4 w-4 text-indigo-600"/>AI Draft Assistant</div>
          <div className="flex items-center gap-2">
            <Select value={tone} onValueChange={(v) => setTone(v as any)}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Tone"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="inclusive">Inclusive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={composeJD} disabled={aiBusy || (ctx && ctx.features && ctx.features.copilot === false)}>
              <Sparkles className="h-4 w-4 mr-1"/> Compose
            </Button>
            <Button variant="outline" size="sm" onClick={extractSkills} disabled={aiBusy || (ctx && ctx.features && ctx.features.copilot === false)}>
              <Upload className="h-4 w-4 mr-1"/> Extract Skills
            </Button>
            <Button variant="outline" size="sm" onClick={diversityReview} disabled={aiBusy || (ctx && ctx.features && ctx.features.copilot === false)}>
              <ShieldCheck className="h-4 w-4 mr-1"/> Diversity Review
            </Button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm">Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Senior Frontend Engineer"/>
            <div className="text-sm">Description</div>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-36"/>
            <div className="text-sm">Skills (comma separated)</div>
            <Input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, TypeScript, GraphQL"/>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Preview (markdown)</div>
            <pre className="p-3 rounded-md bg-muted/50 text-xs whitespace-pre-wrap min-h-36">{description}</pre>
          </div>
        </div>
      </Card>

      {/* Creation form */}
      <JobCreateForm
        onSave={async (data) => {
          const canPublish = ctx?.features?.publish !== false
          if (selectedTargets.length > 0 && canPublish) {
            await handleCreateAndPublish({ ...data, title: data.title || title, description_md: data.description_md || description, skills: data.skills?.length ? data.skills : (skillsText ? skillsText.split(",").map((s)=>s.trim()).filter(Boolean) : undefined) })
          } else {
            await handleSave({ ...data, title: data.title || title, description_md: data.description_md || description, skills: data.skills?.length ? data.skills : (skillsText ? skillsText.split(",").map((s)=>s.trim()).filter(Boolean) : undefined) })
          }
        }}
        saving={saving}
      />

      {/* One-click publish selection */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium flex items-center gap-2"><Rocket className="h-4 w-4 text-green-600"/>One-Click Publish</div>
          <div className="text-xs text-muted-foreground">
            Optional: choose job boards/targets before saving
            {ctx?.features?.publish === false && (
              <span className="ml-2 text-amber-600">Disabled by feature flag</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {targets.map((t: any) => (
            <Button
              key={t.key}
              variant={selectedTargets.includes(t.key) ? "default" : "outline"}
              size="sm"
              disabled={ctx?.features?.publish === false}
              onClick={() =>
                setSelectedTargets((prev) =>
                  prev.includes(t.key) ? prev.filter((k) => k !== t.key) : [...prev, t.key],
                )
              }
            >
              {t.name}
            </Button>
          ))}
          {targets.length === 0 && (
            <div className="text-sm text-muted-foreground">No targets configured</div>
          )}
        </div>
      </Card>
    </div>
  )
}
