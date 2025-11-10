import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { LearningManagement } from "@/components/training/learning-management"

export default function LearningManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Management</h1>
        <p className="text-muted-foreground">Enrollments, track completion, personalized learning paths</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <LearningManagement />
      </Suspense>
    </div>
  )
}
