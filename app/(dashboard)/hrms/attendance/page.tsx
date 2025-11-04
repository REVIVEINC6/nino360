import { AttendanceContent } from "@/components/hrms/attendance-content"
import { getAttendance } from "./actions"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export const dynamic = "force-dynamic"

export default async function AttendancePage() {
  const today = new Date().toISOString().split("T")[0]
  const result = await getAttendance({
    from: today,
    to: today,
  })

  return (
    <TwoPane right={<HRMSSidebar />}>
      <AttendanceContent initialData={result} />
    </TwoPane>
  )
}
