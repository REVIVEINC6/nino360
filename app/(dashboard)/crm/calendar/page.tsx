import { CalendarView } from "@/components/crm/calendar-view"

export default async function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar & Tasks</h1>
        <p className="text-muted-foreground">Tasks, meetings, reminders, and routing</p>
      </div>

      <CalendarView />
    </div>
  )
}
