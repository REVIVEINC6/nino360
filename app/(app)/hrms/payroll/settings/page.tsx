import React from 'react'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Payroll Settings</h1>
      <p className="text-sm text-muted-foreground">Configure providers, tax mappings and approval flows.</p>
    </div>
  )
}
