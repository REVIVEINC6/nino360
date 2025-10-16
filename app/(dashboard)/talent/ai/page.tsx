import { TalentAI } from "@/components/talent/talent-ai"

export default async function AIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Capabilities</h1>
        <p className="text-muted-foreground">Prompt library and redaction rules</p>
      </div>

      <TalentAI />
    </div>
  )
}
