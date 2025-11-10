import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ContentCreation } from "@/components/training/content-creation"

export default function ContentCreationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Creation</h1>
        <p className="text-muted-foreground">Author content, publish courses, AI quiz generator</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <ContentCreation />
      </Suspense>
    </div>
  )
}
