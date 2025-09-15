"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Send, Lightbulb, TrendingUp, Package, Zap } from "lucide-react"
import { toast } from "sonner"

interface AICopilotBoxProps {
  onInsightGenerated?: (insight: any) => void
}

export function AICopilotBox({ onInsightGenerated }: AICopilotBoxProps) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestions] = useState([
    "Show me all underperforming AI packs last 3 months",
    "Suggest bundles for 'Starter Plan' tenants",
    "Which integrations have highest churn rate?",
    "Recommend pricing for new analytics module",
    "Find items with low adoption but high ratings",
  ])

  const handleQuery = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock AI response based on query
      let response = ""
      if (query.toLowerCase().includes("underperforming")) {
        response =
          "Based on the last 3 months data:\n\n• AI Recruiter Pro: 15% decline in usage\n• Smart Analytics: 22% drop in new installs\n• Automation Suite: 8% increase in uninstalls\n\nRecommendation: Consider feature updates or promotional campaigns for these items."
      } else if (query.toLowerCase().includes("bundle")) {
        response =
          "Recommended bundles for Starter Plan tenants:\n\n• CRM Essentials Bundle: CRM Core + Lead Tracker ($29/month)\n• HR Starter Pack: HRMS Core + Basic Analytics ($39/month)\n• Integration Bundle: 3 popular integrations ($19/month)\n\nProjected conversion rate: 35-45%"
      } else {
        response =
          "I've analyzed your marketplace data. Here are the key insights:\n\n• 23% of items are underutilized\n• Average rating across all items: 4.6/5\n• Top performing category: AI (67% adoption)\n• Revenue opportunity: $45K/month with optimized pricing"
      }

      toast.success("AI analysis complete!")
      onInsightGenerated?.({
        query,
        response,
        timestamp: new Date(),
        confidence: 0.87,
      })
    } catch (error) {
      toast.error("Failed to generate AI insights")
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Brain className="h-5 w-5" />
          AI Marketplace Copilot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-700">Ask me anything about your marketplace</label>
          <div className="flex gap-2">
            <Textarea
              placeholder="e.g., Which items need pricing optimization?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[80px] resize-none"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleQuery()
                }
              }}
            />
            <Button
              onClick={handleQuery}
              disabled={loading || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-700">Quick suggestions:</label>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-purple-100 text-xs p-2 border-purple-300 text-purple-700"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-200">
          <div className="flex items-center gap-2 text-xs text-purple-600">
            <Lightbulb className="h-3 w-3" />
            Smart Insights
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-600">
            <TrendingUp className="h-3 w-3" />
            Growth Forecasting
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-600">
            <Package className="h-3 w-3" />
            Bundle Optimization
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-600">
            <Zap className="h-3 w-3" />
            Pricing Analysis
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
