import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

interface FormRowProps {
  label: string
  description?: string
  children: ReactNode
}

export function FormRow({ label, description, children }: FormRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="space-y-0.5 flex-1">
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  )
}
