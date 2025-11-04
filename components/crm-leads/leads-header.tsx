"use client"

import { Button } from "@/components/ui/button"
import { Plus, Sparkles, Linkedin, Wand2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { CreateLeadDialog } from "./create-lead-dialog"
import { ImportLinkedInDialog } from "./import-linkedin-dialog"
import { UploadSheetModal } from "./upload-sheet-modal"
import { NLFilterBar } from "./nl-filter-bar"

export function LeadsHeader() {
  const router = useRouter()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-header p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lead Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              AI-powered lead scoring and qualification
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => setShowUpload(true)} variant="secondary" className="gap-2">
              <Wand2 className="h-4 w-4" /> Upload
            </Button>
            <Button
              onClick={() => setShowImport(true)}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <Linkedin className="h-4 w-4 text-blue-600" /> Import
            </Button>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <NLFilterBar
            onFilters={(filters) => {
              const qs = new URLSearchParams()
              if (filters.status) qs.set("status", filters.status)
              if (filters.source) qs.set("source", filters.source)
              if (filters.minScore) qs.set("minScore", String(filters.minScore))
              if (filters.search) qs.set("search", filters.search)
              router.push(`/crm/leads?${qs.toString()}`)
            }}
          />
        </div>
      </motion.div>

      <CreateLeadDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <ImportLinkedInDialog open={showImport} onOpenChange={setShowImport} />
      <UploadSheetModal open={showUpload} onOpenChange={setShowUpload} />
    </>
  )
}
