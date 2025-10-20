import { Suspense } from "react"
import { getScreeningTemplates, getScreeningHistory } from "../actions"
import { ScreeningView } from "@/components/talent-applicants/screening-view"
import { LoadingSkeleton } from "@/components/talent-applicants/loading-skeleton"

export const dynamic = "force-dynamic"

export default async function ScreeningPage() {
  const [templatesResponse, historyResponse] = await Promise.all([getScreeningTemplates(), getScreeningHistory()])

  const templates = templatesResponse.success ? templatesResponse.data : []
  const history = historyResponse.success ? historyResponse.data : []

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ScreeningView templates={templates} history={history} />
    </Suspense>
  )
}
