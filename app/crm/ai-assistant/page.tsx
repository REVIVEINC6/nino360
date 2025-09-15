"use client"

import AIChatInterface from "@/components/ai/ai-chat-interface"

export default function AIAssistantPage() {
  return (
    <div className="h-[calc(100vh-4rem)] p-6">
      <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        <AIChatInterface />
      </div>
    </div>
  )
}
