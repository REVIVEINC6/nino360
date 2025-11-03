import { AIAssistantChat } from "@/components/crm/ai-assistant-chat"

export const dynamic = "force-dynamic"

export default async function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-muted-foreground mt-2">
            Natural language actions, email drafting, and intelligent insights
          </p>
        </div>

        <AIAssistantChat />
      </div>
    </div>
  )
}
