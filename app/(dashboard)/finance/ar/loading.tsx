import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6 bg-white/50 backdrop-blur-xl border-white/20">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-32 mt-2" />
            <Skeleton className="h-3 w-24 mt-1" />
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white/50 backdrop-blur-xl border-white/20">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    </div>
  )
}
