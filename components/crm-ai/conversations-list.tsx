"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

interface ConversationsListProps {
  conversations: any[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function ConversationsList({ conversations, activeId, onSelect }: ConversationsListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No conversations yet</p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2">
        {conversations.map((conversation, index) => (
          <motion.button
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(conversation.id)}
            className={cn(
              "w-full text-left p-3 rounded-lg transition-all",
              "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10",
              activeId === conversation.id &&
                "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30",
            )}
          >
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{conversation.title}</p>
                <p className="text-xs text-muted-foreground">{conversation.ai_messages?.[0]?.count || 0} messages</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </ScrollArea>
  )
}
