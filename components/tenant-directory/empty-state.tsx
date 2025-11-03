"use client"

import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onCreateTenant: () => void
}

export function EmptyState({ onCreateTenant }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 p-12 text-center backdrop-blur-xl">
      <Building2 className="mb-4 h-12 w-12 text-white/20" />
      <h3 className="mb-2 text-lg font-semibold text-white">No tenants found</h3>
      <p className="mb-6 max-w-sm text-sm text-white/60">
        You're not a member of any organizations yet. Create your first tenant to get started.
      </p>
      <Button
        onClick={onCreateTenant}
        className="bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Tenant
      </Button>
    </div>
  )
}
