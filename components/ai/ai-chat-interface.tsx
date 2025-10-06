"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
  Sparkles,
  Copy,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
} from "lucide-react"

// Types
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "voice" | "system"
  metadata?: {
    confidence?: number
    processingTime?: number
    sources?: string[]
    suggestions?: string[]
  }
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  context?: {
    module?: string
    userId?: string
    tenantId?: string
    currentPage?: string
  }
}

interface AICapabilities {
  voiceInput: boolean
  voiceOutput: boolean
  contextAware: boolean
  multiModal: boolean
  realTimeAnalysis: boolean
}

interface VoiceSettings {
  enabled: boolean
  autoSpeak: boolean
  voice: string
  rate: number
  pitch: number
  volume: number
}

// Mock data for demonstration
const mockCapabilities: AICapabilities = {
  voiceInput: true,
  voiceOutput: true,
  contextAware: true,
  multiModal: true,
  realTimeAnalysis: true,
}

const mockSuggestions = [
  "Show me today's attendance summary",
  "What are the top performance metrics?",
  "Generate a recruitment report",
  "Analyze employee engagement trends",
  "Create a training schedule",
  "Review pending approvals",
]

const mockQuickActions = [
  { icon: BarChart3, label: "Analytics", action: "analytics" },
  { icon: Users, label: "Team Overview", action: "team" },
  { icon: Calendar, label: "Schedule", action: "schedule" },
  { icon: TrendingUp, label: "Insights", action: "insights" },
]

export default function AIChatInterface({
  module = "general",
  context = {},
  onClose,
  className = "",
  // optional voice props to integrate with parent voice settings
  voiceEnabled = true,
  autoSpeak = true,
}: {
  module?: string
  context?: Record<string, any>
  onClose?: () => void
  className?: string
  voiceEnabled?: boolean
  autoSpeak?: boolean
}) {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your AI assistant for the ${module} module. I can help you with analytics, insights, automation, and much more. How can I assist you today?`,
      timestamp: new Date(),
      type: "system",
      metadata: {
        suggestions: mockSuggestions.slice(0, 3),
      },
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: voiceEnabled,
    autoSpeak: autoSpeak,
    voice: "default",
    rate: 1,
    pitch: 1,
    volume: 0.8,
  })
  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: `session-${Date.now()}`,
    title: `${module} Chat Session`,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    context: { module, ...context },
  })

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)

  const { toast } = useToast()

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Speech Recognition
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          toast({
            title: "Voice Input Error",
            description: "Could not process voice input. Please try again.",
            variant: "destructive",
          })
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }

      // Speech Synthesis
      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis
      }
    }
  }, [toast])

  // Voice input handler
  const handleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }, [isListening, toast])

  // Text-to-speech handler
  const handleTextToSpeech = useCallback(
    (text: string) => {
      if (!synthRef.current || !voiceSettings.enabled) return

      // Cancel any ongoing speech
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume

      synthRef.current.speak(utterance)
    },
    [voiceSettings],
  )

  // Send message handler
  const handleSendMessage = useCallback(
    async (content: string, type: "text" | "voice" = "text") => {
      if (!content.trim() || isLoading) return

      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
        type,
      }

      setMessages((prev) => [...prev, userMessage])
      setInputValue("")
      setIsLoading(true)

      try {
        // Simulate API call to AI service
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            context: currentSession.context,
            module,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to get AI response")
        }

        const data = await response.json()

        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: "assistant",
          content: data.content || "I'm sorry, I couldn't process your request right now. Please try again.",
          timestamp: new Date(),
          type: "text",
          metadata: {
            confidence: data.confidence || 0.95,
            processingTime: data.processingTime || 1200,
            sources: data.sources || [],
            suggestions: data.suggestions || [],
          },
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Auto-speak response if enabled
        if (voiceSettings.enabled && voiceSettings.autoSpeak) {
          handleTextToSpeech(assistantMessage.content)
        }
      } catch (error) {
        console.error("Error sending message:", error)
        const errorMessage: Message = {
          id: `msg-${Date.now()}-error`,
          role: "assistant",
          content: "I'm experiencing some technical difficulties. Please try again in a moment.",
          timestamp: new Date(),
          type: "system",
        }
        setMessages((prev) => [...prev, errorMessage])

        toast({
          title: "Connection Error",
          description: "Failed to connect to AI service. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [messages, currentSession.context, module, isLoading, voiceSettings, handleTextToSpeech, toast],
  )

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      handleSendMessage(inputValue)
    },
    [inputValue, handleSendMessage],
  )

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSendMessage(suggestion)
    },
    [handleSendMessage],
  )

  // Handle quick action
  const handleQuickAction = useCallback(
    (action: string) => {
      const actionMessages = {
        analytics: "Show me the latest analytics dashboard",
        team: "Give me an overview of my team's performance",
        schedule: "What's on my schedule for today?",
        insights: "Provide insights based on recent data trends",
      }
      handleSendMessage(actionMessages[action as keyof typeof actionMessages] || `Execute ${action}`)
    },
    [handleSendMessage],
  )

  // Copy message to clipboard
  const handleCopyMessage = useCallback(
    (content: string) => {
      navigator.clipboard.writeText(content)
      toast({
        title: "Copied to Clipboard",
        description: "Message content has been copied.",
      })
    },
    [toast],
  )

  // Message component
  const MessageComponent = ({ message }: { message: Message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      {message.role === "assistant" && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            message.role === "user"
              ? "bg-primary text-primary-foreground ml-auto"
              : message.type === "system"
                ? "bg-muted border border-border"
                : "bg-muted"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs opacity-70">Suggested actions:</p>
              <div className="flex flex-wrap gap-2">
                {message.metadata.suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-transparent"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {message.metadata?.confidence && (
            <Badge variant="outline" className="text-xs">
              {Math.round(message.metadata.confidence * 100)}% confidence
            </Badge>
          )}
          {message.role === "assistant" && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleCopyMessage(message.content)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleTextToSpeech(message.content)}
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {message.role === "user" && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback className="bg-secondary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  )

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{module} Module</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceSettings((prev) => ({ ...prev, enabled: !prev.enabled }))}
              className={voiceSettings.enabled ? "text-primary" : "text-muted-foreground"}
            >
              {voiceSettings.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          {mockQuickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-transparent"
              onClick={() => handleQuickAction(action.action)}
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>

        <Separator />

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about your data, analytics, or workflows..."
              disabled={isLoading}
              className="pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 ${
                isListening ? "text-red-500" : "text-muted-foreground hover:text-primary"
              }`}
              onClick={handleVoiceInput}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          <Button type="submit" disabled={!inputValue.trim() || isLoading} className="px-3">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>

        {/* Status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              {mockCapabilities.voiceInput && (
                <Badge variant="outline" className="text-xs">
                  Voice Input
                </Badge>
              )}
            </span>
            <span>
              {mockCapabilities.contextAware && (
                <Badge variant="outline" className="text-xs">
                  Context Aware
                </Badge>
              )}
            </span>
            <span>
              {mockCapabilities.realTimeAnalysis && (
                <Badge variant="outline" className="text-xs">
                  Real-time Analysis
                </Badge>
              )}
            </span>
          </div>
          <span>{messages.length} messages</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Named export for compatibility
export { AIChatInterface }
