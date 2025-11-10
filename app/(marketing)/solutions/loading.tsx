import { Skeleton } from "@/components/ui/skeleton"

export default function SolutionsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b px-6 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <Skeleton className="mx-auto h-12 w-96" />
          <Skeleton className="mx-auto mt-6 h-6 w-[600px]" />
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
