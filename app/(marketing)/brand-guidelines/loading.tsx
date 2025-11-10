import { Skeleton } from "@/components/ui/skeleton"

export default function BrandGuidelinesLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <Skeleton className="h-12 w-96 mb-4" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </section>
    </div>
  )
}
