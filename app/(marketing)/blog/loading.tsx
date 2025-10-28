import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <Skeleton className="h-12 max-w-2xl mx-auto mb-12" />
          <div className="flex flex-wrap gap-2 justify-center mb-16">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32" />
            ))}
          </div>
          <Skeleton className="h-96 mb-16 rounded-2xl" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
