import { AIAssistant } from "@/components/crm/ai-assistant"

export default async function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground">Natural language actions, email drafting, and summaries</p>
      </div>

      <AIAssistant />
    </div>
  )
}
