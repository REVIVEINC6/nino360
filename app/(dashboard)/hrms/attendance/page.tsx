import { AttendanceContent } from "@/components/hrms/attendance-content"
import { getAttendance } from "./actions"

export const dynamic = "force-dynamic"

export default async function AttendancePage() {
  const today = new Date().toISOString().split("T")[0]
  const result = await getAttendance({
    from: today,
    to: today,
  })

  return <AttendanceContent initialData={result} />
}
