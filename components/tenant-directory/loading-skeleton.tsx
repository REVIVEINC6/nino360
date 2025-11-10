import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 bg-white/10" />
                <Skeleton className="h-4 w-24 bg-white/10" />
              </div>
              <Skeleton className="h-6 w-16 bg-white/10" />
            </div>
            <Skeleton className="h-6 w-20 bg-white/10" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 bg-white/10" />
              <Skeleton className="h-6 w-16 bg-white/10" />
              <Skeleton className="h-6 w-16 bg-white/10" />
            </div>
            <Skeleton className="h-16 w-full bg-white/10" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 bg-white/10" />
              <Skeleton className="h-10 w-10 bg-white/10" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
