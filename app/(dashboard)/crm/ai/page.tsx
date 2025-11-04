import { Suspense } from "react"
import { AIAssistantContent } from "@/components/crm-ai/ai-assistant-content"
import { AIAssistantHeader } from "@/components/crm-ai/ai-assistant-header"
import { fetchConversations } from "./data"

export const dynamic = "force-dynamic"

export default async function CRMAIAssistantPage() {
  const conversations = await fetchConversations()

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto p-6 space-y-6">
        <AIAssistantHeader />
        <Suspense fallback={<div>Loading...</div>}>
          <AIAssistantContent initialConversations={conversations} />
        </Suspense>
      </div>
    </div>
  )
}
