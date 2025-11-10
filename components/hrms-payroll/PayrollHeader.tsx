import React from 'react'

export default function PayrollHeader() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Payroll</h1>
        <p className="text-sm text-muted-foreground">Manage payroll runs, approvals and payouts</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn">Create Preview</button>
        <button className="btn btn-secondary">Settings</button>
      </div>
    </header>
  )
}
