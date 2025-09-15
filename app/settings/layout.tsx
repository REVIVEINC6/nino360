import type React from "react"
import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DualSidebarLayout title="Settings" subtitle="Configure application preferences, integrations, and system options">
      {children}
    </DualSidebarLayout>
  )
}
