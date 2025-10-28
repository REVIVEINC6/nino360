import { Skeleton } from "@/components/ui/skeleton"

export default function PartnersLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-32 mx-auto mb-4" />
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
