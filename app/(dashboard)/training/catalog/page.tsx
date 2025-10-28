import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CourseCatalog } from "@/components/training/course-catalog"

export default function CourseCatalogPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
        <p className="text-muted-foreground">Browse courses, enroll (auto from role/skill gaps)</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <CourseCatalog />
      </Suspense>
    </div>
  )
}
