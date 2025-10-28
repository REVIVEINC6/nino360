import { Skeleton } from "@/components/ui/skeleton"

export default function SecurityAdvisoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-6" />
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>

        <Skeleton className="h-96 w-full rounded-2xl mb-8" />
        <Skeleton className="h-[500px] w-full rounded-2xl mb-8" />

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>

        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  )
}
