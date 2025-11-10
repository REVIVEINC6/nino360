import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface AIInsightCardProps {
  title: string
  description: string
  icon?: ReactNode
  className?: string
  variant?: "default" | "success" | "warning" | "info"
}

export function AIInsightCard({ title, description, icon, className, variant = "default" }: AIInsightCardProps) {
  const variantStyles = {
    default: "from-purple-500/20 to-blue-500/20 border-purple-500/30",
    success: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    warning: "from-orange-500/20 to-yellow-500/20 border-orange-500/30",
    info: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-linear-to-br p-4 backdrop-blur-xl",
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-lg bg-white/10 p-2">
          {icon || <Sparkles className="h-5 w-5 text-purple-400" />}
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-semibold text-white">{title}</h4>
          <p className="text-sm text-white/70">{description}</p>
        </div>
      </div>
    </div>
  )
}
