import { Skeleton } from "@/components/ui/skeleton"

export default function SecurityLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="border-b px-6 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <Skeleton className="mx-auto mb-6 h-8 w-48" />
          <Skeleton className="mx-auto mb-6 h-16 w-full max-w-3xl" />
          <Skeleton className="mx-auto mb-10 h-24 w-full max-w-2xl" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    </div>
  )
}
