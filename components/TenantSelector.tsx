import React from 'react'

export default function TenantSelector({ onChange, tenantId }: { onChange?: (id: string)=>void, tenantId?: string }) {
  return (
    <div>
      <select className="border p-2 rounded" value={tenantId} onChange={(e)=>onChange?.(e.target.value)}>
        <option value="">Select tenant</option>
        <option value="demo-tenant-1">Demo Tenant 1</option>
      </select>
    </div>
  )
}
