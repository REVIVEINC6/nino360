import { Skeleton } from "@/components/ui/skeleton"

export default function WhatsNewLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    </div>
  )
}
