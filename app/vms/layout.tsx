import type React from "react"
import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"

export default function VMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DualSidebarLayout title="Vendor Management System" subtitle="Manage vendors, contracts, and procurement">
      {children}
    </DualSidebarLayout>
  )
}
