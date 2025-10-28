import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function VideosLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Skeleton className="h-16 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-[600px] mx-auto mb-4" />
          <Skeleton className="h-6 w-[500px] mx-auto" />
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-video" />
              <div className="flex flex-col justify-center space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
