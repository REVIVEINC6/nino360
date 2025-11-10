"use client"

import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIMessageBubbleProps {
  message: {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    created_at: string
  }
}

export function AIMessageBubble({ message }: AIMessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-linear-to-r from-blue-500 to-purple-500" : "bg-linear-to-r from-purple-500 to-pink-500",
        )}
      >
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div
        className={cn(
          "flex-1 max-w-[80%] rounded-2xl p-4",
          isUser
            ? "bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
            : "bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20",
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs text-muted-foreground mt-2">{new Date(message.created_at).toLocaleTimeString()}</p>
      </div>
    </motion.div>
  )
}
