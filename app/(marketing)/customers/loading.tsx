import { Skeleton } from "@/components/ui/skeleton"

export default function CustomersLoading() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
