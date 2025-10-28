import { Suspense } from "react"
import { ProjectsListContent } from "@/components/projects/projects-list-content"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsListPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Suspense fallback={<ProjectsListSkeleton />}>
        <ProjectsListContent />
      </Suspense>
    </div>
  )
}

function ProjectsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  )
}
