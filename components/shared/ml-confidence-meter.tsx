"use client"
import { cn } from "@/lib/utils"

interface MLConfidenceMeterProps {
  confidence?: number | any
  // alias used across components
  value?: number | any
  label?: string
  showPercentage?: boolean
  // legacy alias
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function MLConfidenceMeter({ confidence, value, label, showPercentage = true, showLabel, size = "md" }: MLConfidenceMeterProps) {
  const score = typeof confidence !== "undefined" ? confidence : value || 0
  const getColor = (value: number) => {
    if (value >= 80) return "bg-emerald-500"
    if (value >= 60) return "bg-blue-500"
    if (value >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className="space-y-1.5">
      {(label || showPercentage || showLabel) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-slate-600">{label}</span>}
          {showPercentage && <span className="font-medium text-slate-900">{score}%</span>}
        </div>
      )}
      <div className={cn("relative w-full rounded-full bg-slate-100 overflow-hidden", heights[size])}>
        <div
          className={cn("h-full transition-all duration-500 rounded-full", getColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
