"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle2 } from "lucide-react"
import { EventsTab } from "./events-tab"
import { TasksTab } from "./tasks-tab"
import { AISchedulingPanel } from "./ai-scheduling-panel"

export function CalendarContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="glass-panel p-1">
            <TabsTrigger value="events" className="data-[state=active]:bg-white/80">
              <Calendar className="mr-2 h-4 w-4" />
              Events & Meetings
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-white/80">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Tasks & Reminders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventsTab />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksTab />
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-1">
        <AISchedulingPanel />
      </div>
    </div>
  )
}
