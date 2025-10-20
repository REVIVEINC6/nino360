"use client"

import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { CreateLeadDialog } from "./create-lead-dialog"

export function LeadsHeader() {
  const router = useRouter()
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-header p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lead Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              AI-powered lead scoring and qualification
            </p>
          </div>

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </motion.div>

      <CreateLeadDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </>
  )
}
