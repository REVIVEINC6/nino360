"use client"
import { cn } from "@/lib/utils"

interface MLConfidenceMeterProps {
  confidence: number
  label?: string
  showPercentage?: boolean
  size?: "sm" | "md" | "lg"
}

export function MLConfidenceMeter({ confidence, label, showPercentage = true, size = "md" }: MLConfidenceMeterProps) {
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
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-slate-600">{label}</span>}
          {showPercentage && <span className="font-medium text-slate-900">{confidence}%</span>}
        </div>
      )}
      <div className={cn("relative w-full rounded-full bg-slate-100 overflow-hidden", heights[size])}>
        <div
          className={cn("h-full transition-all duration-500 rounded-full", getColor(confidence))}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  )
}
