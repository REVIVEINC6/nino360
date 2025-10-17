"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { JobEditor } from "@/components/talent/job-editor"
import { createRequisition } from "../actions"

export default function NewRequisitionPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

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

      <JobEditor onSave={handleSave} saving={saving} />
    </div>
  )
}
