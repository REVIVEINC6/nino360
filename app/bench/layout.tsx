import type React from "react"
import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"

export default function BenchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DualSidebarLayout title="Bench Management" subtitle="Manage available resources and bench strength">
      {children}
    </DualSidebarLayout>
  )
}
