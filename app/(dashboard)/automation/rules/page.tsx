import { listRules } from "../actions/rules"
import { listChannels } from "../actions/channels"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export default async function RulesPage() {
  const [rules, channels] = await Promise.all([listRules(), listChannels()])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl">Rules</h2>
          <p className="text-muted-foreground text-sm">Configure automation rules and alerts</p>
        </div>
        <Button asChild>
          <Link href="/automation/rules/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Rule
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No rules configured yet. Create your first automation rule to get started.
            </p>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card key={rule.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{rule.name}</h3>
                    <Badge variant={rule.is_enabled ? "default" : "secondary"}>
                      {rule.is_enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Badge variant="outline">{rule.trigger_type}</Badge>
                    <Badge
                      variant={
                        rule.severity === "critical"
                          ? "destructive"
                          : rule.severity === "warning"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {rule.severity}
                    </Badge>
                  </div>
                  {rule.description && <p className="mt-2 text-muted-foreground text-sm">{rule.description}</p>}
                  <div className="mt-4 flex items-center gap-4 text-muted-foreground text-sm">
                    {rule.trigger_type === "event" && <span>Event: {rule.event_key}</span>}
                    {rule.trigger_type === "schedule" && <span>Schedule: {rule.schedule_rrule}</span>}
                    <span>Throttle: {rule.throttle_seconds}s</span>
                    {rule.channel_ids && rule.channel_ids.length > 0 && (
                      <span>
                        Channels:{" "}
                        {rule.channel_ids.map((id) => channels.find((c) => c.id === id)?.name || id).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    {rule.is_enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/automation/rules/${rule.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
