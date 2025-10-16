import { listChannels } from "../actions/channels"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"

export default async function AutomationSettingsPage() {
  const channels = await listChannels()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-semibold text-2xl">Automation Settings</h2>
        <p className="text-muted-foreground text-sm">Configure notification channels and delivery settings</p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Notification Channels</h3>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Channel
          </Button>
        </div>

        <div className="grid gap-4">
          {channels.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No channels configured yet. Add a channel to start receiving notifications.
              </p>
            </Card>
          ) : (
            channels.map((channel) => (
              <Card key={channel.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{channel.name}</h4>
                      <Badge variant="outline">{channel.kind}</Badge>
                      <Badge variant={channel.is_active ? "default" : "secondary"}>
                        {channel.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {channel.config && (
                      <pre className="mt-2 text-muted-foreground text-xs">
                        {JSON.stringify(channel.config, null, 2)}
                      </pre>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
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
    </div>
  )
}
