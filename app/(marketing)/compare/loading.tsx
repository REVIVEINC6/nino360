import { Skeleton } from "@/components/ui/skeleton"

export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
      </div>
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
