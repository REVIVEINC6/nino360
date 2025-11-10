import { listAlerts } from "../actions/alerts"
import { listRules } from "../actions/rules"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, BellOff } from "lucide-react"

export default async function AlertsPage() {
  const [_alerts, _rules] = await Promise.all([listAlerts(), listRules()])

  // Staged: normalize server action results (avoid ParserError property access typing issues)
  const alerts = (_alerts as any) || []
  const rules = (_rules as any) || []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl">Alerts</h2>
          <p className="text-muted-foreground text-sm">View and manage automation alerts</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No alerts yet. Alerts will appear here when rules are triggered.</p>
          </Card>
        ) : (
          alerts.map((alert: any) => (
            <Card key={alert.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "destructive"
                          : alert.severity === "warning"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {alert.severity}
                    </Badge>
                    <Badge
                      variant={
                        alert.status === "sent" ? "default" : alert.status === "failed" ? "destructive" : "secondary"
                      }
                    >
                      {alert.status}
                    </Badge>
                    <span className="text-muted-foreground text-sm">{new Date(alert.created_at).toLocaleString()}</span>
                  </div>
                  <h3 className="mt-2 font-semibold">{alert.title}</h3>
                  <p className="mt-1 text-muted-foreground text-sm">{alert.body_md}</p>
                  {alert.rule && <p className="mt-2 text-muted-foreground text-xs">Rule: {alert.rule.name}</p>}
                  {alert.sent_channels && alert.sent_channels.length > 0 && (
                    <p className="mt-1 text-muted-foreground text-xs">Sent via: {alert.sent_channels.join(", ")}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {alert.status !== "muted" && (
                    <Button variant="ghost" size="icon">
                      <BellOff className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
