"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ScoreChipProps {
  score: number
  showTrend?: boolean
  trend?: number
}

export function ScoreChip({ score, showTrend = false, trend = 0 }: ScoreChipProps) {
  const getColor = (score: number) => {
    if (score >= 80) return "text-green-500 bg-green-500/10 border-green-500/20"
    if (score >= 60) return "text-blue-500 bg-blue-500/10 border-blue-500/20"
    if (score >= 40) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
    return "text-red-500 bg-red-500/10 border-red-500/20"
  }

  const getExplanation = (score: number) => {
    const factors = []
    if (score >= 80) {
      factors.push("High engagement recency")
      factors.push("Senior title")
      factors.push("Quality domain")
      factors.push("Marketing opt-in")
    } else if (score >= 60) {
      factors.push("Recent engagement")
      factors.push("Mid-level title")
      factors.push("Active account")
    } else if (score >= 40) {
      factors.push("Some engagement")
      factors.push("Entry-level title")
      factors.push("Limited data")
    } else {
      factors.push("No recent engagement")
      factors.push("Incomplete profile")
      factors.push("Low activity")
    }
    return factors
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${getColor(score)} font-mono text-xs`}>
            {score}
            {showTrend && trend !== 0 && (
              <span className="ml-1">
                {trend > 0 ? (
                  <TrendingUp className="h-3 w-3 inline" />
                ) : trend < 0 ? (
                  <TrendingDown className="h-3 w-3 inline" />
                ) : (
                  <Minus className="h-3 w-3 inline" />
                )}
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-2">
            <div className="font-semibold">Health Score: {score}/100</div>
            <div className="text-sm text-muted-foreground">
              <div className="font-medium mb-1">Contributing factors:</div>
              <ul className="list-disc list-inside space-y-1">
                {getExplanation(score).map((factor, i) => (
                  <li key={i}>{factor}</li>
                ))}
              </ul>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
