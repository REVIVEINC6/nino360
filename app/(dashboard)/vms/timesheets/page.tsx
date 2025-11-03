import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VMSTimesheets } from "@/components/vms/vms-timesheets"

export default function VMSTimesheetsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timesheet Management</h1>
        <p className="text-muted-foreground">Manage vendor timesheets and approvals</p>
      </div>

      <Tabs defaultValue="timesheets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="tracking">On-time Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="timesheets" className="space-y-4">
          <VMSTimesheets view="timesheets" />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <VMSTimesheets view="approvals" />
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4">
          <VMSTimesheets view="disputes" />
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <VMSTimesheets view="tracking" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
