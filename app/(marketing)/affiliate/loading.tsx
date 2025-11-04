import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AffiliateLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <Skeleton className="mx-auto h-12 w-96" />
          <Skeleton className="mx-auto mt-6 h-6 w-[600px]" />
          <div className="mt-10 flex justify-center gap-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 bg-white/60 p-6 backdrop-blur-sm">
                <Skeleton className="h-20 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
