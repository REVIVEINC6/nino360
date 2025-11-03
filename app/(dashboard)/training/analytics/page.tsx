import { Suspense } from "react"
import { TrainingAnalytics } from "@/components/training/training-analytics"

export default function TrainingAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Training Analytics</h1>
        <p className="text-muted-foreground">Completion trends, time-to-proficiency, skill gap analysis</p>
      </div>

      <Suspense fallback={<div>Loading analytics...</div>}>
        <TrainingAnalytics />
      </Suspense>
    </div>
  )
}
