"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { BillingCopilotQuery } from "@/lib/types/billing"
import { Bot, Send, Sparkles, TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react"

interface BillingCopilotProps {
  className?: string
}

export function BillingCopilot({ className }: BillingCopilotProps) {
  const [query, setQuery] = useState("")
  const [queries, setQueries] = useState<BillingCopilotQuery[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const suggestedQueries = [
    "Show me tenants with high churn risk",
    "What's our MRR growth trend?",
    "Which plans are most popular?",
    "Find overdue invoices from last month",
    "Show usage patterns by module",
    "Identify upselling opportunities",
  ]

  const handleSubmitQuery = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    const newQuery: BillingCopilotQuery = {
      query: query.trim(),
      response: "",
      timestamp: new Date().toISOString(),
    }

    try {
      // Simulate AI response based on query patterns
      const response = await generateAIResponse(query.trim())
      newQuery.response = response.text
      newQuery.data = response.data

      setQueries((prev) => [newQuery, ...prev])
      setQuery("")
    } catch (error) {
      newQuery.response = "I'm sorry, I couldn't process that request. Please try again."
      setQueries((prev) => [newQuery, ...prev])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (query: string): Promise<{ text: string; data?: any }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("churn") || lowerQuery.includes("risk")) {
      return {
        text: "I found 3 tenants with high churn risk based on low usage and payment delays. TechCorp (85% risk) hasn't used the platform in 2 weeks, StartupXYZ (72% risk) has overdue payments, and GlobalInc (68% risk) shows declining usage patterns. I recommend immediate outreach for TechCorp and payment follow-up for StartupXYZ.",
        data: {
          high_risk_count: 3,
          critical_actions: 2,
        },
      }
    }

    if (lowerQuery.includes("mrr") || lowerQuery.includes("revenue") || lowerQuery.includes("growth")) {
      return {
        text: "Your MRR has grown 23% over the last 3 months, from $45,200 to $55,600. The growth is primarily driven by Professional plan upgrades (+$8,400) and new Enterprise customers (+$2,000). However, growth slowed to 5% last month due to 2 downgrades. I recommend focusing on customer success to maintain momentum.",
        data: {
          current_mrr: 55600,
          growth_rate: 23,
          trend: "positive",
        },
      }
    }

    if (lowerQuery.includes("plan") || lowerQuery.includes("popular") || lowerQuery.includes("subscription")) {
      return {
        text: "The Professional plan is your most popular with 45% of active tenants (127 customers). Starter plan has 35% (98 customers) and Enterprise has 20% (56 customers). Professional plan also has the highest retention rate at 94%. Consider creating a mid-tier plan between Professional and Enterprise to capture upgrade opportunities.",
        data: {
          professional_percentage: 45,
          retention_rate: 94,
        },
      }
    }

    if (lowerQuery.includes("overdue") || lowerQuery.includes("invoice") || lowerQuery.includes("payment")) {
      return {
        text: "You have 12 overdue invoices totaling $18,450. 8 are 1-15 days overdue ($8,200), 3 are 16-30 days overdue ($6,750), and 1 is over 30 days overdue ($3,500). The oldest overdue invoice is from MegaCorp for $3,500, now 45 days past due. I recommend immediate collection action for invoices over 30 days.",
        data: {
          overdue_count: 12,
          total_amount: 18450,
          critical_count: 1,
        },
      }
    }

    if (lowerQuery.includes("usage") || lowerQuery.includes("module") || lowerQuery.includes("pattern")) {
      return {
        text: "CRM module has the highest usage at 78% average utilization across tenants. HRMS follows at 65%, then Talent at 52%. However, 23% of tenants use less than 30% of their allocated resources, indicating potential downgrades. Finance and VMS modules show seasonal patterns with 40% higher usage in Q4.",
        data: {
          top_module: "CRM",
          utilization: 78,
          underutilized_tenants: 23,
        },
      }
    }

    if (lowerQuery.includes("upsell") || lowerQuery.includes("opportunity") || lowerQuery.includes("upgrade")) {
      return {
        text: "I identified 18 upselling opportunities worth $12,300 in potential MRR. 12 Starter plan customers are using 80%+ of their limits and could upgrade to Professional (+$7,200 MRR). 6 Professional customers need additional modules (+$5,100 MRR). TechFlow and DataCorp are prime candidates for Enterprise upgrades based on their usage patterns.",
        data: {
          opportunities: 18,
          potential_mrr: 12300,
          top_candidates: ["TechFlow", "DataCorp"],
        },
      }
    }

    // Default response
    return {
      text: "I can help you analyze billing data, identify trends, and provide insights. Try asking about churn risk, revenue growth, popular plans, overdue invoices, usage patterns, or upselling opportunities. What specific billing metric would you like to explore?",
    }
  }

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          AI Billing Copilot
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Beta
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Query Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask me about billing metrics, churn risk, revenue trends..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmitQuery()}
            className="flex-1"
          />
          <Button onClick={handleSubmitQuery} disabled={isLoading || !query.trim()} size="sm">
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Suggested Queries */}
        {queries.length === 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Try asking:</div>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuery(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Query History */}
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {queries.map((q, index) => (
              <div key={index} className="space-y-2">
                {/* User Query */}
                <div className="flex justify-end">
                  <div className="bg-blue-100 text-blue-900 rounded-lg px-3 py-2 max-w-[80%]">
                    <div className="text-sm">{q.query}</div>
                    <div className="text-xs text-blue-600 mt-1">{formatTimestamp(q.timestamp)}</div>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">AI Assistant</span>
                    </div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">{q.response}</div>

                    {/* Data Insights */}
                    {q.data && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(q.data).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key.replace("_", " ")}: {String(value)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="border-t pt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Quick Insights:</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedQuery("Show me today's key metrics")}
              className="justify-start"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Today's Metrics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedQuery("Find at-risk customers")}
              className="justify-start"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              At-Risk Customers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedQuery("Show revenue forecast")}
              className="justify-start"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Revenue Forecast
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedQuery("Analyze user growth")}
              className="justify-start"
            >
              <Users className="h-4 w-4 mr-2" />
              User Growth
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
