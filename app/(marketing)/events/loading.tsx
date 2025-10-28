import { Skeleton } from "@/components/ui/skeleton"

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <section className="border-b py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Skeleton className="mx-auto mb-6 h-12 w-3/4" />
            <Skeleton className="mx-auto h-6 w-2/3" />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Skeleton className="mb-12 h-8 w-64" />
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
