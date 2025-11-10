import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function PricingCalculatorLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-6" />
          <Skeleton className="h-16 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-8">
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-32 w-full mb-8" />
              <Skeleton className="h-64 w-full mb-8" />
              <Skeleton className="h-24 w-full" />
            </Card>
            <div className="space-y-6">
              <Card className="p-8">
                <Skeleton className="h-64 w-full" />
              </Card>
              <Card className="p-8">
                <Skeleton className="h-48 w-full" />
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
