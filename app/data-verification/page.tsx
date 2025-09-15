"use client"

import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"
import { DataVerificationPanel } from "@/components/dashboard/data-verification-panel"

export default function DataVerificationPage() {
  return (
    <DualSidebarLayout module="admin" page="data-verification">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <DataVerificationPanel />
      </div>
    </DualSidebarLayout>
  )
}
