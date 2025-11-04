import { Suspense } from "react"
import { ApplicantsHeader } from "@/components/talent-applicants/applicants-header"
import { ApplicantsBoard } from "@/components/talent-applicants/applicants-board"
import { ApplicantsSidebar } from "@/components/talent-applicants/applicants-sidebar"
import { LoadingSkeleton } from "@/components/talent-applicants/loading-skeleton"
import { getContext } from "./actions"
import { TwoPane } from "@/components/layout/two-pane"

export const dynamic = "force-dynamic"

export default async function ApplicantsPage() {
  const context = await getContext()

  return (
    <TwoPane right={<ApplicantsSidebar context={context} />}>
      <ApplicantsHeader context={context} />
      <Suspense fallback={<LoadingSkeleton />}>
        <ApplicantsBoard context={context} />
      </Suspense>
    </TwoPane>
  )
}
