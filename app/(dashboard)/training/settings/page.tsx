import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { TrainingSettings } from "@/components/training/training-settings"

export default function TrainingSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Training Settings</h1>
        <p className="text-muted-foreground">Author vs Learner roles, exam integrity, PII protection</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <TrainingSettings />
      </Suspense>
    </div>
  )
}
