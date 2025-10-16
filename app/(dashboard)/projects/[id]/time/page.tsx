import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectTimePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Time Tracking</h2>
      <Card>
        <CardHeader>
          <CardTitle>Timesheet Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Time tracking integration with Finance module coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
