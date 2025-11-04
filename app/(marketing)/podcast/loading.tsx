import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PodcastLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-6" />
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-8 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
