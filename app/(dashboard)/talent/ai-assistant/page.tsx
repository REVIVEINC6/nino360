import { Suspense } from "react"
import { Bot, Sparkles, MessageSquare, TrendingUp } from "lucide-react"
import { AIAssistantContent } from "@/components/talent/ai-assistant-content"

export default function AIAssistantPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Recruitment Assistant
          </h1>
          <p className="text-muted-foreground mt-1">Your intelligent assistant for recruitment tasks</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/20">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium">AI Powered</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversations</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Bot className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-blue-50 border border-pink-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-100">
              <TrendingUp className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time Saved</p>
              <p className="text-2xl font-bold">42h</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Interface */}
      <Suspense fallback={<div>Loading...</div>}>
        <AIAssistantContent />
      </Suspense>
    </div>
  )
}
