import { Section } from "@/components/settings/section"
import { AiPreferencesForm } from "@/components/settings/ai-preferences-form"

export default function AiPage() {
  return (
    <div className="p-8 space-y-8">
      <Section title="AI & Copilot Preferences" description="Configure your AI assistant behavior and privacy settings">
        <AiPreferencesForm />
      </Section>
    </div>
  )
}
