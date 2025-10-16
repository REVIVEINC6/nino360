import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BenchAnalytics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bench Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Analytics dashboard with charts for bench size over time, average time-to-place, skills heatmap, and work
            authorization mix will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
