import { Skeleton } from "@/components/ui/skeleton"

export default function GlossaryLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-6" />
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
          <Skeleton className="h-14 w-full max-w-2xl mx-auto mb-12" />

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {Array.from({ length: 26 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <Skeleton className="h-px flex-1" />
              </div>
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, j) => (
                  <Skeleton key={j} className="h-32 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
