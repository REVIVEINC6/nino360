"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Send,
  Sparkles,
  Mail,
  FileText,
  TrendingUp,
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Zap,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react"
import { chatWithAI, saveConversation, getConversationHistory } from "@/app/(dashboard)/crm/actions/ai-assistant"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  actions?: Array<{
    type: string
    label: string
    data: any
  }>
}

export function AIAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const loadHistory = async () => {
    try {
      const history = await getConversationHistory()
      if (history.length > 0) {
        setMessages(history)
        setConversationId(history[0].conversation_id)
      }
    } catch (error) {
      console.error("Error loading history:", error)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await chatWithAI(input, conversationId)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        actions: response.actions,
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (response.conversationId) {
        setConversationId(response.conversationId)
      }

      // Save conversation
      await saveConversation({
        conversationId: response.conversationId || conversationId || Date.now().toString(),
        userMessage: input,
        assistantMessage: response.message,
      })
    } catch (error) {
      toast.error("Failed to get AI response")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const quickActions = [
    {
      icon: Mail,
      label: "Draft Email",
      prompt: "Draft a follow-up email for my top prospect",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileText,
      label: "Summarize Meeting",
      prompt: "Summarize my last meeting and extract action items",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      label: "Pipeline Analysis",
      prompt: "Analyze my pipeline and show deals at risk",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Calendar,
      label: "Schedule Meeting",
      prompt: "Find the best time to schedule a meeting with my team this week",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      label: "Lead Insights",
      prompt: "Show me insights on my top 5 leads",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: DollarSign,
      label: "Revenue Forecast",
      prompt: "Forecast my revenue for next quarter based on current pipeline",
      color: "from-yellow-500 to-orange-500",
    },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Chat Area */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
        <Card className="glass-card border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI-Powered Assistant</h3>
                <p className="text-sm text-muted-foreground">Ask questions or request actions in natural language</p>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="p-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-4">
                    <Sparkles className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
                  <p className="text-muted-foreground max-w-md">
                    Ask me anything about your CRM data, draft emails, analyze deals, or get insights
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 h-fit">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                            : "glass-card border-white/20"
                        } rounded-2xl p-4`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
                            {message.actions.map((action, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="w-full glass-button bg-transparent"
                              >
                                <Zap className="mr-2 h-3 w-3" />
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                          {message.role === "assistant" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      {message.role === "user" && (
                        <div className="p-2 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 h-fit">
                          <User className="h-5 w-5 text-gray-700" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 h-fit">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="glass-card border-white/20 rounded-2xl p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>

          <div className="p-6 border-t border-white/20 bg-white/50">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask me anything... e.g., 'Show me all high-value deals closing this month'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={2}
                className="resize-none glass-card border-white/20"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {/* Quick Actions */}
        <Card className="glass-card border-white/20 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setInput(action.prompt)}
                className="w-full p-3 rounded-lg glass-card border-white/20 hover:border-white/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-indigo-600 transition-colors">
                    {action.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>

        {/* AI Capabilities */}
        <Card className="glass-card border-white/20 p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Capabilities
          </h3>
          <div className="space-y-3">
            {[
              { icon: Mail, label: "Email Generation", desc: "Draft personalized emails" },
              { icon: FileText, label: "Document Analysis", desc: "Extract insights from docs" },
              { icon: TrendingUp, label: "Predictive Analytics", desc: "Forecast outcomes" },
              { icon: Calendar, label: "Smart Scheduling", desc: "Optimize meeting times" },
            ].map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/50"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <capability.icon className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{capability.label}</p>
                  <p className="text-xs text-muted-foreground">{capability.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
