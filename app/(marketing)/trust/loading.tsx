import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TrustCenterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Skeleton className="h-8 w-32 mx-auto mb-6" />
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-8 w-8 mb-4" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-24" />
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-8">
              <Skeleton className="h-12 w-12 mb-4" />
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
