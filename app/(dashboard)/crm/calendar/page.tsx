import { Suspense } from "react"
import { CalendarHeader } from "@/components/crm-calendar/calendar-header"
import { CalendarContent } from "@/components/crm-calendar/calendar-content"
import { CalendarStats } from "@/components/crm-calendar/calendar-stats"
import { AILoadingState } from "@/components/shared/ai-loading-state"
import { getCalendarAnalytics } from "@/app/(dashboard)/crm/actions/calendar"

export default async function CalendarPage() {
  const analytics = await getCalendarAnalytics()

  return (
    <div className="min-h-screen ai-gradient-bg p-6 space-y-6">
      <CalendarHeader />

      <Suspense fallback={<AILoadingState message="Loading calendar analytics..." />}>
        <CalendarStats analytics={analytics} />
      </Suspense>

      <Suspense fallback={<AILoadingState message="Loading calendar..." />}>
        <CalendarContent />
      </Suspense>
    </div>
  )
}
