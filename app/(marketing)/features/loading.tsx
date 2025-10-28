import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto mb-8" />
            <div className="flex gap-4 justify-center">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
