"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Download, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function OpportunitiesHeader() {
  const router = useRouter()

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-header p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Opportunities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered opportunity management with predictive insights
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => router.push("/crm/opportunities/new")}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4" />
            New Opportunity
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities by name, account, or owner..."
            className="pl-10 glass-card border-white/20"
          />
        </div>
        <Button variant="outline" className="gap-2 glass-card border-white/20 bg-transparent">
          <Sparkles className="h-4 w-4 text-purple-500" />
          AI Search
        </Button>
      </div>
    </motion.div>
  )
}
