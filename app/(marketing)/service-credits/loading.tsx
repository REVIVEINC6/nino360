import { Skeleton } from "@/components/ui/skeleton"

export default function ServiceCreditsLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full max-w-2xl" />
            <Skeleton className="h-6 w-full max-w-xl" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  )
}
