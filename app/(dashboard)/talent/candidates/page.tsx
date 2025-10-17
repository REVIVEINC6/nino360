import { Suspense } from "react"
import { CandidatesContent } from "@/components/talent-candidates/candidates-content"
import { CandidatesLoadingSkeleton } from "@/components/talent-candidates/loading-skeleton"

export const metadata = {
  title: "Candidates | Nino360 Talent",
  description: "Manage your talent pool and track candidate progress",
}

export default function CandidatesPage() {
  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto">
        <Suspense fallback={<CandidatesLoadingSkeleton />}>
          <CandidatesContent />
        </Suspense>
      </div>
    </div>
  )
}
