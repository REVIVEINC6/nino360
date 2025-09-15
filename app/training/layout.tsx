import type React from "react"
import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DualSidebarLayout title="Training Management" subtitle="Manage training programs and employee development">
      {children}
    </DualSidebarLayout>
  )
}
