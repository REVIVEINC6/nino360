import { Skeleton } from "@/components/ui/skeleton"

export default function IntegrationsLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <Skeleton className="mx-auto h-12 w-3/4" />
          <Skeleton className="mx-auto mt-6 h-6 w-1/2" />
        </div>
      </section>
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
