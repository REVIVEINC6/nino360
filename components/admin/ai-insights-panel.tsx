"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, X, Send, AlertTriangle, CheckCircle, Info, Lightbulb, Zap, BarChart3, Activity } from "lucide-react"

interface AIInsight {
  type: "warning" | "info" | "success" | "error"
  title: string
  description: string
  action: string
  priority: "high" | "medium" | "low"
  impact?: string
  recommendation?: string
}

interface AIInsightsPanelProps {
  isOpen: boolean
  onClose: () => void
  insights: AIInsight[]
  context?: {
    module: string
    totalTenants: number
    activeTenants: number
    trialTenants: number
    suspendedTenants: number
  }
}

const quickQuestions = [
  "Which tenants are underutilizing modules?",
  "Who's nearing usage limits?",
  "Show me tenants at risk of churning",
  "Which tenants should I upsell?",
  "Find inactive trial accounts",
  "Show revenue trends by tenant",
]

const aiSuggestions = [
  {
    category: "Optimization",
    items: [
      "3 tenants have Finance module enabled but no transactions in 30 days",
      "5 tenants are approaching user limits - suggest plan upgrades",
      "2 tenants have low feature adoption rates",
    ],
  },
  {
    category: "Risk Management",
    items: [
      "8 trial tenants expire within 3 days",
      "4 tenants haven't logged in for 7+ days",
      "1 tenant has payment issues",
    ],
  },
  {
    category: "Growth Opportunities",
    items: [
      "12 tenants qualify for enterprise upgrade",
      "6 tenants showing high engagement - ready for add-ons",
      "New integration requests from 4 tenants",
    ],
  },
]

export function AIInsightsPanel({ isOpen, onClose, insights, context }: AIInsightsPanelProps) {
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ type: "user" | "ai"; message: string; timestamp: Date }>>([])
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return

    const userMessage = {
      type: "user" as const,
      message: chatMessage,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, userMessage])
    setChatMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: "ai" as const,
        message: generateAIResponse(chatMessage),
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (question: string) => {
    const responses = {
      underutilizing:
        "Based on my analysis, TechStart Inc and Global Solutions have CRM modules enabled but show low activity. TechStart has only 12% feature utilization, while Global Solutions hasn't created any leads in 14 days. I recommend scheduling training sessions.",
      "usage limits":
        "5 tenants are approaching their user limits: Acme Corp (95% capacity), Innovation Labs (88%), and StartupXYZ (92%). These are prime candidates for plan upgrades. Shall I draft upgrade proposals?",
      churning:
        "I've identified 3 tenants at high churn risk: Global Solutions (45% health score, payment delays), QuickStart LLC (no logins in 8 days), and DevCorp (support tickets indicate frustration). Immediate intervention recommended.",
      upsell:
        "12 tenants show strong engagement and qualify for upselling: 8 for enterprise plans, 4 for additional modules. Combined potential revenue increase: $18,400/month. Would you like me to prioritize by likelihood to convert?",
      trial:
        "8 trial accounts expire soon: 3 in 1 day, 5 in 2-3 days. Conversion probability ranges from 65-85% based on engagement scores. I recommend personalized conversion campaigns.",
      revenue:
        "Revenue trends show 15% growth month-over-month. Top performers: Enterprise accounts (+22%), Professional plans (+18%). Starter plans declining (-5%). Consider value-based pricing adjustments.",
    }

    const lowerQuestion = question.toLowerCase()
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuestion.includes(key)) {
        return response
      }
    }

    return "I can help you analyze tenant data, identify opportunities, and provide actionable insights. Try asking about specific metrics, tenant health, or growth opportunities."
  }

  const handleQuickQuestion = (question: string) => {
    setChatMessage(question)
    handleSendMessage()
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Copilot</h2>
                <p className="text-sm text-gray-600">Intelligent tenant insights and recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                <Activity className="h-3 w-3 mr-1" />
                Active
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="insights" className="h-full flex flex-col">
            <div className="border-b px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Smart Insights
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="insights" className="h-full p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Context Summary */}
                  {context && (
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-blue-900">Current Context</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{context.totalTenants}</div>
                            <div className="text-sm text-blue-700">Total Tenants</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{context.activeTenants}</div>
                            <div className="text-sm text-green-700">Active</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{context.trialTenants}</div>
                            <div className="text-sm text-yellow-700">Trial</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{context.suspendedTenants}</div>
                            <div className="text-sm text-red-700">Suspended</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Priority Insights */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Priority Insights
                    </h3>
                    <div className="space-y-3">
                      {insights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                {getInsightIcon(insight.type)}
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                                    <Badge className={getPriorityColor(insight.priority)}>{insight.priority}</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                                  {insight.recommendation && (
                                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                      <p className="text-sm text-gray-700">
                                        <strong>Recommendation:</strong> {insight.recommendation}
                                      </p>
                                    </div>
                                  )}
                                  <Button size="sm" variant="outline">
                                    {insight.action}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
                    <div className="space-y-4">
                      {aiSuggestions.map((category, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{category.category}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {category.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="h-full flex flex-col">
                <div className="flex-1 flex flex-col">
                  {/* Quick Questions */}
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="text-sm font-medium mb-3">Quick Questions</h4>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((question, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickQuestion(question)}
                          className="text-xs"
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Chat History */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {chatHistory.length === 0 && (
                        <div className="text-center py-8">
                          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Assistant Ready</h3>
                          <p className="text-gray-600">
                            Ask me anything about your tenants, or use one of the quick questions above.
                          </p>
                        </div>
                      )}

                      <AnimatePresence>
                        {chatHistory.map((message, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-3">
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
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask me about your tenants..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!chatMessage.trim() || isTyping}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="h-full p-6 overflow-y-auto">
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600 mb-4">
                    Deep dive into tenant analytics, usage patterns, and predictive insights.
                  </p>
                  <Button>View Full Analytics Dashboard</Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
