import { Suspense } from "react"
import { SourcingHeader } from "@/components/talent-sourcing/sourcing-header"
import { AISourcingContent } from "@/components/talent-sourcing/ai-sourcing-content"
import { AISourcingSidebar } from "@/components/talent-sourcing/ai-sourcing-sidebar"
import { LoadingSkeleton } from "@/components/talent-sourcing/loading-skeleton"
import { fetchContext, fetchSourcingAnalytics, fetchSourcingInsights } from "./data"

export const dynamic = "force-dynamic"

export default async function SourcingPage() {
  const [context, analytics, insights] = await Promise.all([
    fetchContext(),
    fetchSourcingAnalytics(),
    fetchSourcingInsights(),
  ])

  return (
    <div className="flex h-full bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex-1 flex flex-col min-w-0">
  <SourcingHeader />
        <Suspense fallback={<LoadingSkeleton />}>
          <AISourcingContent insights={insights} />
        </Suspense>
      </div>
      <AISourcingSidebar analytics={analytics} insights={insights} />
    </div>
  )
}
