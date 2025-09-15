import type React from "react"
import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DualSidebarLayout title="Finance Management" subtitle="Manage financial operations, budgets, and reporting">
      {children}
    </DualSidebarLayout>
  )
}
