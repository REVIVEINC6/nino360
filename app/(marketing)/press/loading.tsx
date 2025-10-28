import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PressLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-6" />
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 bg-white/60 backdrop-blur-sm">
                <Skeleton className="h-8 w-8 mb-3" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-20" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 bg-white/60 backdrop-blur-sm">
                <Skeleton className="h-6 w-32 mb-3" />
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-32" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
