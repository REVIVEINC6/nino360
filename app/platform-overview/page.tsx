"use client"

import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"
import { PlatformOverview } from "@/components/dashboard/platform-overview"

export default function PlatformOverviewPage() {
  return (
    <DualSidebarLayout module="admin" page="platform-overview">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <PlatformOverview />
      </div>
    </DualSidebarLayout>
  )
}
