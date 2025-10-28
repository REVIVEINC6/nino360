import { Skeleton } from "@/components/ui/skeleton"

export default function FAQLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <Skeleton className="h-14 w-full max-w-2xl mx-auto" />
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-6">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
