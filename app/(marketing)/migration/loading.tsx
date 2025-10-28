import { Skeleton } from "@/components/ui/skeleton"

export default function MigrationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton className="h-16 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
