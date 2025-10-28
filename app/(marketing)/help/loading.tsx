import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function HelpCenterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-64 mx-auto mb-8" />
          <Skeleton className="h-14 w-full max-w-2xl mx-auto" />
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 mb-16">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-12 w-12 rounded-xl mx-auto mb-4" />
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </Card>
            ))}
          </div>

          <Skeleton className="h-8 w-64 mx-auto mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-20" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
