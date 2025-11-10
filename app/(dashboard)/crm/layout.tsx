import type React from "react"
import { Building2 } from "lucide-react"

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">CRM</h1>
          <p className="text-sm text-muted-foreground">Manage accounts, contacts, leads, and sales pipeline</p>
        </div>
      </div>
      {children}
    </div>
  )
}
