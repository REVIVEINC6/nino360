import type React from "react"
import { Suspense } from "react"

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl">Finance</h1>
          <p className="text-muted-foreground text-sm">Manage accounts receivable, payable, timesheets, and expenses</p>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  )
}
