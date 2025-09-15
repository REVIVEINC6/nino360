import type React from "react"
import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DualSidebarLayout title="Tenant Management" subtitle="Manage tenant settings, configurations, and multi-tenancy">
      {children}
    </DualSidebarLayout>
  )
}
