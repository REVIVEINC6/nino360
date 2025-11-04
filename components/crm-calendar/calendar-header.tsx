"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Plus, Sparkles, Brain } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { CreateEventDialog } from "./create-event-dialog"
import { CreateTaskDialog } from "./create-task-dialog"

export function CalendarHeader() {
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showTaskDialog, setShowTaskDialog] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-header p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Calendar & Tasks
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Brain className="h-4 w-4" />
                AI-powered scheduling and task management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowTaskDialog(true)}
              variant="outline"
              className="glass-panel border-blue-200/50 hover:border-blue-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
            <Button
              onClick={() => setShowEventDialog(true)}
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Technology badges */}
        <div className="flex items-center gap-2 mt-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-700 border border-blue-200/50">
            AI Scheduling
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-700 border border-purple-200/50">
            ML Prioritization
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-700 border border-green-200/50">
            Blockchain Verified
          </span>
        </div>
      </motion.div>

      <CreateEventDialog open={showEventDialog} onOpenChange={setShowEventDialog} />
      <CreateTaskDialog open={showTaskDialog} onOpenChange={setShowTaskDialog} />
    </>
  )
}
