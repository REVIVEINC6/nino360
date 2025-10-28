import { Skeleton } from "@/components/ui/skeleton"

export default function ResourcesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative border-b bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <Skeleton className="h-12 w-64 mb-8" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-48 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
