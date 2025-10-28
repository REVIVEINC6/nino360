import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-96" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="rounded-lg border backdrop-blur-xl bg-white/5 border-white/10 p-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-white/10 last:border-0">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
