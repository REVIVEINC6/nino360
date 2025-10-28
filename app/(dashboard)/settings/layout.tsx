import type React from "react"
import { SettingsSidebar } from "@/components/settings/settings-sidebar"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <SettingsSidebar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-purple-950/20">
        {children}
      </main>
    </div>
  )
}
