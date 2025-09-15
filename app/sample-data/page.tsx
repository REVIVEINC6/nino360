"use client"

import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"
import { SampleDataDashboard } from "@/components/dashboard/sample-data-dashboard"

export default function SampleDataPage() {
  return (
    <DualSidebarLayout module="admin" page="sample-data">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <SampleDataDashboard />
      </div>
    </DualSidebarLayout>
  )
}
