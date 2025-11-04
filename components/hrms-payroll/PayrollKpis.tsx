import React from 'react'

export default function PayrollKpis() {
  return (
    <div className="space-y-4">
  <div className="rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 p-4 text-white">
        <div className="text-xs">Last Run Status</div>
        <div className="text-xl font-semibold">Completed</div>
      </div>
      <div className="rounded-lg bg-background p-4">
        <div className="text-xs">Total Payroll (L12M)</div>
        <div className="text-xl font-semibold">$1,234,567</div>
      </div>
    </div>
  )
}
