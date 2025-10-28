import { Section } from "@/components/settings/section"
import { ThemeSettings } from "@/components/settings/theme-settings"

export default function ThemePage() {
  return (
    <div className="p-8 space-y-8">
      <Section
        title="Theme & Accessibility"
        description="Customize your visual experience and accessibility preferences"
      >
        <ThemeSettings />
      </Section>
    </div>
  )
}
