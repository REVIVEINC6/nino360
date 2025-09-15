import type React from "react"
import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"

export default function HotlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DualSidebarLayout title="Hotlist Management" subtitle="Manage priority requirements and urgent positions">
      {children}
    </DualSidebarLayout>
  )
}
