import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Card className="glass-panel p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>

      <Card className="glass-panel p-6">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    </div>
  )
}
