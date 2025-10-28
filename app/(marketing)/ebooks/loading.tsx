import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EBooksLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-6" />
          <Skeleton className="h-16 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-10 w-20 mb-2" />
                <Skeleton className="h-4 w-24" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>

          <Card className="p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-[3/4] rounded-lg" />
              <div>
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-20 w-full mb-6" />
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="aspect-[3/4] rounded-lg mb-4" />
                <Skeleton className="h-6 w-24 mb-3" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
