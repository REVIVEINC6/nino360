import type React from "react"
import { ModuleSidebar } from "@/components/layout/module-sidebar"
import { SubmoduleSidebar } from "@/components/layout/submodule-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { KeyboardShortcuts } from "@/components/dashboard/keyboard-shortcuts"
import { ErrorBoundary } from "@/components/error-boundary"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <KeyboardShortcuts />
      <ModuleSidebar />
      <SubmoduleSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
