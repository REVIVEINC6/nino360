import type React from "react"
import { Building2 } from "lucide-react"

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Tenant Administration</h1>
          <p className="text-muted-foreground">Manage organization settings, branding, and configuration</p>
        </div>
      </div>
      {children}
    </div>
  )
}
