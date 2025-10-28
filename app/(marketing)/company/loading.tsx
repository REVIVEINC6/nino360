import { Skeleton } from "@/components/ui/skeleton"

export default function CompanyLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="px-6 py-24">
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="text-center">
            <Skeleton className="mx-auto h-16 w-3/4" />
            <Skeleton className="mx-auto mt-6 h-6 w-1/2" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
