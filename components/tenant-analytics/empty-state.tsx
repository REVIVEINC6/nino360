import { BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-2xl font-bold">No Analytics Data</h2>
        <p className="text-muted-foreground">Start using the platform to see analytics and insights.</p>
        <div className="flex gap-3 justify-center">
          <Button>Invite Users</Button>
          <Button variant="outline">Enable Modules</Button>
        </div>
      </div>
    </div>
  )
}
