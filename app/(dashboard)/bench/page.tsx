import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { BenchConsultantsTable } from "@/components/bench/bench-consultants-table"
import { BenchStats } from "@/components/bench/bench-stats"
import { AvailabilityCalendar } from "@/components/bench/availability-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BenchPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bench</h1>
          <p className="text-muted-foreground">Manage available consultants and resources</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add to Bench
          </Button>
        </div>
      </div>

      {/* Stats */}
      <BenchStats />

      {/* Bench Tabs */}
      <Tabs defaultValue="consultants" className="space-y-6">
        <TabsList>
          <TabsTrigger value="consultants">Available Consultants</TabsTrigger>
          <TabsTrigger value="calendar">Availability Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="consultants">
          <Card>
            <CardHeader>
              <CardTitle>Bench Consultants</CardTitle>
              <CardDescription>Available resources ready for placement</CardDescription>
            </CardHeader>
            <CardContent>
              <BenchConsultantsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Availability Timeline</CardTitle>
              <CardDescription>View consultant availability over time</CardDescription>
            </CardHeader>
            <CardContent>
              <AvailabilityCalendar />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
