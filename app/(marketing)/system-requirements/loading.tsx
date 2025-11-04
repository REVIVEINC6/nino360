import { Skeleton } from "@/components/ui/skeleton"

export default function SystemRequirementsLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>

        <div className="mb-12">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Skeleton className="h-[350px] rounded-2xl" />
          <Skeleton className="h-[350px] rounded-2xl" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Skeleton className="h-[200px] rounded-2xl" />
          <Skeleton className="h-[200px] rounded-2xl" />
          <Skeleton className="h-[200px] rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
