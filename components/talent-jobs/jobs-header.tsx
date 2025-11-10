"use client"

import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function JobsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel border-b border-white/20 p-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-bold text-gray-900">Jobs & Requisitions</h1>
            <p className="mt-1 text-pretty text-sm text-gray-600">
              AI-powered job requisition management with intelligent insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Button>
            <Link href="/talent/jobs/new">
              <Button className="gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4" />
                New Requisition
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
