import React from 'react'
import PayrollHeader from '@/components/hrms-payroll/PayrollHeader'
import PayrollKpis from '@/components/hrms-payroll/PayrollKpis'

export const dynamic = 'force-dynamic'

export default async function Page() {
  return (
    <div className="p-6">
      <PayrollHeader />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-2">
          <h2 className="text-lg font-semibold">Recent Payroll Runs</h2>
          {/* Runs table will be lazy-loaded client component later */}
        </div>
        <div>
          <PayrollKpis />
        </div>
      </div>
    </div>
  )
}
