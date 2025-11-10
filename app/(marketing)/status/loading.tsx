import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StatusLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <Card className="p-8 mb-8">
          <Skeleton className="h-16 w-full" />
        </Card>

        <div className="grid gap-6 mb-12">
          <Skeleton className="h-8 w-48" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-16 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
