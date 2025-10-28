import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function RoadmapLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col lg:flex-row gap-6 items-start">
              <Skeleton className="h-12 w-48" />
              <div className="flex-1 grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((j) => (
                  <Card key={j} className="p-6">
                    <Skeleton className="h-32 w-full" />
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
