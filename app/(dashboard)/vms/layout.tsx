import type React from "react"
import { Suspense } from "react"

export default function VMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Vendor Management</h1>
        <p className="text-muted-foreground">Manage vendor relationships, compliance, and submissions</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  )
}
