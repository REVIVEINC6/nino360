import { Suspense } from "react"
import type { Metadata } from "next"
import { PlatformOverviewContent } from "@/components/overview/platform-overview-content"

export const metadata: Metadata = {
  title: "Platform Overview | Nino360",
  description: "Comprehensive overview of the Nino360 Superintelligent Enterprise OS",
}

export default function PlatformOverviewPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
          Platform Overview
        </h1>
        <p className="text-muted-foreground mt-2">Comprehensive view of your Nino360 Superintelligent Enterprise OS</p>
      </div>

      <Suspense fallback={<div>Loading platform overview...</div>}>
        <PlatformOverviewContent />
      </Suspense>
    </div>
  )
}
