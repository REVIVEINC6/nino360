"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Send, Loader2, MessageSquare } from "lucide-react"
import { createConversation, sendMessage, getConversationMessages } from "@/app/(dashboard)/crm/ai/actions"
import { AIMessageBubble } from "./ai-message-bubble"
import { ConversationsList } from "./conversations-list"
import { useEffect } from "react"

interface AIAssistantContentProps {
  initialConversations: any[]
}

export function AIAssistantContent({ initialConversations }: AIAssistantContentProps) {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation)
    }
  }, [activeConversation])

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true)
    const result = await getConversationMessages(conversationId)
    if (result.success) {
      setMessages(result.data || [])
    }
    setIsLoading(false)
  }

  const handleNewConversation = () => {
    startTransition(async () => {
      const result = await createConversation("New Conversation")
      if (result.success) {
        setConversations([result.data, ...conversations])
        setActiveConversation(result.data.id)
        setMessages([])
      }
    })
  }

  const handleSendMessage = () => {
    if (!input.trim() || !activeConversation) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    }

    setMessages([...messages, userMessage])
    setInput("")

    startTransition(async () => {
      const result = await sendMessage(activeConversation, input)
      if (result.success) {
        setMessages((prev) => [...prev, result.data])
      }
    })
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-3 glass-panel p-4 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Conversations</h2>
          <Button
            size="sm"
            onClick={handleNewConversation}
            disabled={isPending}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ConversationsList
          conversations={conversations}
          activeId={activeConversation}
          onSelect={setActiveConversation}
        />
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-9 glass-panel flex flex-col"
      >
        {activeConversation ? (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Ask me anything about your CRM data, draft emails, analyze leads, or get insights.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <AIMessageBubble key={message.id} message={message} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything..."
                  disabled={isPending}
                  className="flex-1 bg-background/50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isPending || !input.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
              <p className="text-sm text-muted-foreground mb-4">Select a conversation or start a new one</p>
              <Button
                onClick={handleNewConversation}
                disabled={isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
