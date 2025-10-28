import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function I9ComplianceLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 bg-white/70 backdrop-blur-xl shadow-xl p-6">
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>

        <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl p-6">
          <Skeleton className="h-10 w-full" />
        </Card>

        <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl p-6">
          <Skeleton className="h-96 w-full" />
        </Card>
      </div>
    </div>
  )
}
