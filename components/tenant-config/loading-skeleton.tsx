import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-10 w-full max-w-2xl" />
        <div className="grid gap-4 mt-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}
