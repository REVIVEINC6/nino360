import type { ReactNode } from "react"

interface SectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function Section({ title, description, children }: SectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 shadow-[0_0_1px_#ffffff33]">
        {children}
      </div>
    </div>
  )
}
