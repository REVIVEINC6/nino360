import { Suspense } from "react"
import { ApplicantsHeader } from "@/components/talent-applicants/applicants-header"
import { ApplicantsBoard } from "@/components/talent-applicants/applicants-board"
import { ApplicantsSidebar } from "@/components/talent-applicants/applicants-sidebar"
import { LoadingSkeleton } from "@/components/talent-applicants/loading-skeleton"
import { getContext } from "./actions"

export default async function ApplicantsPage() {
  const context = await getContext()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ApplicantsHeader context={context} />

        <Suspense fallback={<LoadingSkeleton />}>
          <ApplicantsBoard context={context} />
        </Suspense>
      </div>

      {/* Right Sidebar */}
      <ApplicantsSidebar context={context} />
    </div>
  )
}
