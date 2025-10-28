"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo } from "react"

interface MiniChartProps {
  title: string
  type: "line" | "bar"
}

export function MiniChart({ title, type }: MiniChartProps) {
  // Generate sample data for demonstration
  const data = useMemo(() => {
    return Array.from({ length: 30 }, () => Math.floor(Math.random() * 100))
  }, [])

  const max = Math.max(...data)
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - (value / max) * 80
    return `${x},${y}`
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 100 100" className="w-full h-24" preserveAspectRatio="none">
          {type === "line" ? (
            <>
              <polyline
                points={points.join(" ")}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <polyline points={`0,100 ${points.join(" ")} 100,100`} fill="hsl(var(--primary))" fillOpacity="0.1" />
            </>
          ) : (
            data.map((value, index) => {
              const barWidth = 100 / data.length
              const barHeight = (value / max) * 80
              const x = (index / data.length) * 100
              const y = 100 - barHeight
              return (
                <rect
                  key={index}
                  x={x}
                  y={y}
                  width={barWidth * 0.8}
                  height={barHeight}
                  fill="hsl(var(--primary))"
                  fillOpacity="0.8"
                />
              )
            })
          )}
        </svg>
      </CardContent>
    </Card>
  )
}
