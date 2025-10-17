import { Suspense } from "react"
import { SourcingHeader } from "@/components/talent-sourcing/sourcing-header"
import { SourcingContent } from "@/components/talent-sourcing/sourcing-content"
import { SourcingSidebar } from "@/components/talent-sourcing/sourcing-sidebar"
import { LoadingSkeleton } from "@/components/talent-sourcing/loading-skeleton"
import { getContext } from "./actions"

export default async function SourcingPage() {
  const context = await getContext()

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <SourcingHeader context={context.data} />
        <Suspense fallback={<LoadingSkeleton />}>
          <SourcingContent />
        </Suspense>
      </div>
      <SourcingSidebar context={context.data} />
    </div>
  )
}
