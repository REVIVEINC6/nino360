"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, Send, Sparkles, TrendingUp, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { sendMessage } from "@/app/(dashboard)/talent/ai-assistant/actions"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function TalentAIAssistantContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI recruitment assistant. I can help you with candidate sourcing, job management, interview scheduling, and analytics. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const stats = [
    { label: "Conversations", value: "127", icon: Bot },
    { label: "Tasks Completed", value: "89", icon: Sparkles },
    { label: "Time Saved", value: "24h", icon: TrendingUp },
  ]

  const quickActions = [
    { label: "Find candidates for Senior Developer", icon: Users },
    { label: "Schedule interviews for this week", icon: Calendar },
    { label: "Generate offer letter", icon: Sparkles },
    { label: "Analyze hiring metrics", icon: TrendingUp },
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

    try {
      await sendMessage(input)

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I understand you need help with that. Let me assist you...",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Recruitment Assistant
        </h1>
        <p className="text-muted-foreground mt-2">Your intelligent hiring companion powered by AI</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-white/20 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chat Interface */}
      <Card className="relative overflow-hidden border-white/20 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl">
        <div className="h-[500px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-white/60 backdrop-blur-sm"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3">
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-3 border-t border-white/20">
            <div className="flex gap-2 flex-wrap">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white/40 hover:bg-white/60 border-white/20"
                  onClick={() => setInput(action.label)}
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/20">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything about recruitment..."
                className="flex-1 bg-white/60 border-white/20"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
