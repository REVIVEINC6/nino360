import { Suspense } from "react"
import { getScreeningTemplates, getScreeningHistory, getContext } from "../actions"
import { ScreeningView } from "@/components/talent-applicants/screening-view"
import { LoadingSkeleton } from "@/components/talent-applicants/loading-skeleton"

export const dynamic = "force-dynamic"

export default async function ScreeningPage() {
  const [templatesResponse, historyResponse, context] = await Promise.all([
    getScreeningTemplates(),
    getScreeningHistory(),
    getContext(),
  ])

  const templates = templatesResponse.success ? templatesResponse.data : []
  const history = historyResponse.success ? historyResponse.data : []

  return (
    <>
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Screening</h1>
        </div>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <ScreeningView templates={templates} history={history} />
      </Suspense>
    </>
  )
}
