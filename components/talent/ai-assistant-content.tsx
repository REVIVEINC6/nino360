"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendMessage } from "@/app/(dashboard)/talent/ai-assistant/actions"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAssistantContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI recruitment assistant. I can help you with candidate sourcing, job management, interview scheduling, offer generation, and analytics. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const result = await sendMessage(input, conversationId)
      setConversationId(result.conversationId)

      const assistantMessage: Message = {
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] rounded-lg border border-border bg-gradient-to-br from-white/50 to-blue-50/30 backdrop-blur-sm">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                    : "bg-white/80 backdrop-blur-sm border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-muted-foreground"}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-white/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about recruitment..."
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI-powered responses may take a few seconds
        </p>
      </div>
    </div>
  )
}
