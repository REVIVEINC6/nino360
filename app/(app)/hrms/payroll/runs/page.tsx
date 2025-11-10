import React from 'react'

export const dynamic = 'force-dynamic'

export default async function RunsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Payroll Runs</h1>
      <p className="text-sm text-muted-foreground">List of payroll runs with preview, approvals and actions.</p>
    </div>
  )
}
