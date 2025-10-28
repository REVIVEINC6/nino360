"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Send,
  Sparkles,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  MessageSquare,
  Zap,
  Shield,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export function TalentAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your Talent AI Assistant. I can help you with candidate searches, interview scheduling, job description optimization, and recruitment analytics. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        "Find candidates for Senior Developer role",
        "Schedule interviews for this week",
        "Analyze recruitment funnel",
        "Optimize job description",
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const quickActions = [
    { icon: Users, label: "Find Candidates", prompt: "Help me find qualified candidates for" },
    { icon: Calendar, label: "Schedule Interview", prompt: "Schedule an interview with" },
    { icon: FileText, label: "Draft Job Description", prompt: "Create a job description for" },
    { icon: TrendingUp, label: "Analyze Pipeline", prompt: "Show me analytics for" },
  ]

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you want to ${input}. Let me help you with that. Based on our current data, I can provide insights and recommendations.`,
        timestamp: new Date(),
        suggestions: ["Show me more details", "Export this data", "Schedule a follow-up"],
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleQuickAction = (prompt: string) => {
    setInput(prompt + " ")
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="glass-card rounded-2xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Talent AI Assistant</h1>
                <p className="text-sm text-gray-600">Powered by GPT-4 with recruitment expertise</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <Sparkles className="mr-1 h-3 w-3" />
              Online
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="glass-card h-[600px] overflow-hidden rounded-2xl border border-white/20 bg-white/40 shadow-xl backdrop-blur-xl">
              <div className="flex h-full flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                      >
                        {message.role === "assistant" && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                            <Brain className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3",
                            message.role === "user"
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                              : "bg-white/60 text-gray-900 backdrop-blur-sm",
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.suggestions && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestion(suggestion)}
                                  className="h-7 rounded-full border-white/40 bg-white/40 text-xs backdrop-blur-sm hover:bg-white/60"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.role === "user" && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                          <Brain className="h-4 w-4 animate-pulse text-white" />
                        </div>
                        <div className="rounded-2xl bg-white/60 px-4 py-3 backdrop-blur-sm">
                          <div className="flex gap-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="border-t border-white/20 bg-white/20 p-4 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask me anything about recruitment..."
                      className="flex-1 border-white/40 bg-white/60 backdrop-blur-sm"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass-card rounded-2xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Zap className="h-5 w-5 text-yellow-500" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    onClick={() => handleQuickAction(action.prompt)}
                    className="w-full justify-start border-white/40 bg-white/40 backdrop-blur-sm hover:bg-white/60"
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* AI Capabilities */}
            <Card className="glass-card rounded-2xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Brain className="h-5 w-5 text-purple-500" />
                AI Capabilities
              </h3>
              <Tabs defaultValue="prompts" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-white/40">
                  <TabsTrigger value="prompts">Prompts</TabsTrigger>
                  <TabsTrigger value="redaction">Redaction</TabsTrigger>
                </TabsList>
                <TabsContent value="prompts" className="space-y-2">
                  {[
                    { name: "Resume Parsing", usage: 1234 },
                    { name: "JD Optimization", usage: 456 },
                    { name: "Interview Questions", usage: 789 },
                    { name: "Candidate Scoring", usage: 567 },
                  ].map((prompt) => (
                    <div
                      key={prompt.name}
                      className="rounded-lg border border-white/40 bg-white/40 p-3 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <p className="text-sm font-medium">{prompt.name}</p>
                        </div>
                        <Badge variant="secondary" className="bg-white/60">
                          {prompt.usage}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="redaction" className="space-y-2">
                  <div className="rounded-lg border border-white/40 bg-white/40 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <p className="text-sm font-medium">PII Protection</p>
                    </div>
                    <p className="text-xs text-gray-600">
                      Automatically redacts sensitive information from resumes and documents
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
