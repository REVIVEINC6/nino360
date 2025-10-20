"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Download, Filter, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { CreateAccountDialog } from "./create-account-dialog"

export function AccountsHeader() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-header space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Accounts
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage customer accounts with AI-powered insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search accounts by name, industry, or owner..."
              className="pl-10 glass-card border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="glass-card bg-transparent">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="glass-card bg-transparent">
            <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
            AI Insights
          </Button>
        </div>
      </motion.div>

      <CreateAccountDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </>
  )
}
