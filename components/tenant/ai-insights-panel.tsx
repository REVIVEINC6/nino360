"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  MessageSquare,
  Send,
  Lightbulb,
  BarChart3,
  ArrowRight,
  Zap,
  RefreshCw,
} from "lucide-react"

interface AIInsight {
  id: string
  type: "opportunity" | "risk" | "recommendation" | "alert" | "prediction"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  action?: string
  data?: any
  timestamp: Date
  priority: "urgent" | "high" | "medium" | "low"
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const mockInsights: AIInsight[] = [
  {
    id: "1",
    type: "opportunity",
    title: "High-Value Deal Ready to Close",
    description:
      "TechCorp Inc. shows 95% close probability based on engagement patterns and decision-maker involvement.",
    confidence: 95,
    impact: "high",
    action: "Schedule final negotiation call",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    priority: "high",
    data: { dealValue: "$450K", company: "TechCorp Inc." },
  },
  {
    id: "2",
    type: "risk",
    title: "Deal at Risk of Going Cold",
    description:
      "DataFlow Solutions hasn't responded to emails in 7 days. Historical data shows 73% chance of deal stalling.",
    confidence: 87,
    impact: "high",
    action: "Send personalized follow-up",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    priority: "urgent",
    data: { dealValue: "$280K", company: "DataFlow Solutions", daysSinceContact: 7 },
  },
  {
    id: "3",
    type: "recommendation",
    title: "Upsell Opportunity Detected",
    description: "CloudTech Ltd. usage increased 40% this month. Perfect timing for expansion conversation.",
    confidence: 78,
    impact: "medium",
    action: "Create expansion proposal",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    priority: "medium",
    data: { currentValue: "$125K", potentialUpsell: "$75K", usageIncrease: "40%" },
  },
  {
    id: "4",
    type: "prediction",
    title: "Q4 Revenue Forecast Update",
    description: "Based on current pipeline velocity, Q4 revenue likely to exceed target by 12%.",
    confidence: 82,
    impact: "high",
    action: "Review resource allocation",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    priority: "medium",
    data: { forecastRevenue: "$2.8M", target: "$2.5M", confidence: "82%" },
  },
]

const mockChatHistory: ChatMessage[] = [
  {
    id: "1",
    type: "ai",
    content:
      "Hi! I'm your AI Sales Copilot. I've analyzed your pipeline and found 3 high-priority opportunities. Would you like me to walk you through them?",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    suggestions: ["Show me opportunities", "Analyze my pipeline", "What's at risk?"],
  },
  {
    id: "2",
    type: "user",
    content: "Show me opportunities",
    timestamp: new Date(Date.now() - 58 * 60 * 1000),
  },
  {
    id: "3",
    type: "ai",
    content:
      "Great! I've identified TechCorp Inc. as your highest probability close at 95% confidence. They've engaged with your proposal 8 times this week and the decision maker has been CC'd on recent emails. I recommend scheduling a final negotiation call within the next 2 days.",
    timestamp: new Date(Date.now() - 57 * 60 * 1000),
    suggestions: ["Schedule the call", "Draft follow-up email", "Show deal details"],
  },
]

export function AIInsightsPanel() {
  const [activeTab, setActiveTab] = useState<"insights" | "chat">("insights")
  const [chatInput, setChatInput] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(mockChatHistory)
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights)
  const [isTyping, setIsTyping] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Target className="h-5 w-5 text-green-500" />
      case "risk":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />
      case "prediction":
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      case "alert":
        return <Zap className="h-5 w-5 text-orange-500" />
      default:
        return <Brain className="h-5 w-5 text-purple-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I understand you're asking about " + chatInput + ". Let me analyze your data and provide insights...",
        timestamp: new Date(),
        suggestions: ["Tell me more", "Show related data", "Create action plan"],
      }
      setChatHistory((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const handleRefreshInsights = async () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl border-l border-white/20">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Sales Copilot</h2>
            <p className="text-sm text-muted-foreground">Intelligent insights & recommendations</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "insights" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("insights")}
            className={
              activeTab === "insights" ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-white/60 backdrop-blur-sm"
            }
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Insights
          </Button>
          <Button
            variant={activeTab === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("chat")}
            className={
              activeTab === "chat" ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-white/60 backdrop-blur-sm"
            }
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "insights" ? (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {/* Insights Header */}
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Smart Insights</h3>
                    <p className="text-xs text-muted-foreground">{insights.length} active insights</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRefreshInsights}
                    disabled={refreshing}
                    className="bg-white/60 backdrop-blur-sm border-white/20"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Insights List */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getInsightIcon(insight.type)}
                              <div>
                                <CardTitle className="text-sm font-semibold">{insight.title}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(insight.priority)}`} />
                                  <span className="text-xs text-muted-foreground capitalize">{insight.priority}</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(insight.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge className={getImpactColor(insight.impact)}>{insight.impact} impact</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>

                          {/* Confidence & Data */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <BarChart3 className="h-3 w-3" />
                              <span>{insight.confidence}% confidence</span>
                            </div>
                            {insight.data && (
                              <div className="text-xs font-medium text-green-600">
                                {insight.data.dealValue || insight.data.forecastRevenue}
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          {insight.action && (
                            <Button
                              size="sm"
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            >
                              {insight.action}
                              <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-white/60 backdrop-blur-sm border border-white/20"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${message.type === "user" ? "text-white/70" : "text-muted-foreground"}`}
                        >
                          {formatTimeAgo(message.timestamp)}
                        </p>

                        {/* AI Suggestions */}
                        {message.type === "ai" && message.suggestions && (
                          <div className="mt-3 space-y-1">
                            {message.suggestions.map((suggestion, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="mr-2 mb-1 h-7 text-xs bg-white/50 hover:bg-white/70"
                                onClick={() => setChatInput(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/60 backdrop-blur-sm border border-white/20 p-3 rounded-2xl">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about your sales data..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-white/60 backdrop-blur-sm border-white/20 focus:bg-white/80"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Named export for compatibility
export const AiInsightsPanel = AIInsightsPanel

// Default export
export default AIInsightsPanel
