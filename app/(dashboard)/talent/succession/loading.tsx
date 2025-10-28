import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 bg-white/60 p-6 backdrop-blur-sm">
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 bg-white/60 p-6 backdrop-blur-sm">
              <Skeleton className="h-48 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
