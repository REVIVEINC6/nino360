import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewsletterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-6" />
          <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-4" />
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-24 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
