import { Skeleton } from "@/components/ui/skeleton"

export default function PrivacyLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-[300px] w-full rounded-2xl" />
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <Skeleton className="h-[300px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
