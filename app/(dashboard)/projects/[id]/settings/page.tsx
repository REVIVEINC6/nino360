import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectSettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Project Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Project settings and configuration coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
