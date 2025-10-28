import { Skeleton } from "@/components/ui/skeleton"

export default function TermsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-width mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-32 mx-auto mb-6" />
          <Skeleton className="h-16 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}
