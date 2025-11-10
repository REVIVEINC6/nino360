"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Calendar, TrendingUp } from "lucide-react"
import { useState } from "react"
import { getSchedulingSuggestions } from "@/app/(dashboard)/crm/actions/calendar"
import { MLConfidenceMeter } from "@/components/shared/ml-confidence-meter"
import { motion } from "framer-motion"
import { format } from "date-fns"

export function AISchedulingPanel() {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function loadSuggestions() {
    setLoading(true)
    try {
      const data = await getSchedulingSuggestions()
      setSuggestions(data)
    } catch (error) {
      console.error("Failed to load suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20">
          <Sparkles className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold">AI Scheduling Assistant</h3>
          <p className="text-xs text-muted-foreground">Optimal meeting times</p>
        </div>
      </div>

      <Button
        onClick={loadSuggestions}
        disabled={loading}
        className="w-full mb-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {loading ? "Analyzing..." : "Get AI Suggestions"}
      </Button>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Suggested Times:</p>
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-3 bg-white/50 border-purple-200/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{format(new Date(suggestion.time), "MMM d, h:mm a")}</span>
                  </div>
                  <MLConfidenceMeter confidence={suggestion.confidence} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Quick Stats:</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Best Meeting Time</span>
            <span className="font-medium">2:00 PM</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Avg Meeting Length</span>
            <span className="font-medium">45 min</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Meeting Success Rate</span>
            <span className="font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              87%
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
