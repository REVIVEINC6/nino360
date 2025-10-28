"use client"

import { Shield } from "lucide-react"
import { HashBadge } from "./hash-badge"

interface SecurityHeaderProps {
  context: any
}

export function SecurityHeader({ context }: SecurityHeaderProps) {
  const lastUpdated = context.security?.updated_at ? new Date(context.security.updated_at).toLocaleString() : "Never"

  return (
    <div className="glass p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#A855F7] bg-clip-text text-transparent">
              Security Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Tenant: {context.slug} • Last updated: {lastUpdated}
            </p>
          </div>
        </div>
        <HashBadge hash="latest" />
      </div>
    </div>
  )
}
