import { listWebhooks } from "../actions/webhooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Send } from "lucide-react"
import Link from "next/link"

export default async function WebhooksPage() {
  const webhooks = await listWebhooks()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl">Webhooks</h2>
          <p className="text-muted-foreground text-sm">Configure outgoing webhooks for external integrations</p>
        </div>
        <Button asChild>
          <Link href="/automation/webhooks/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Webhook
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {webhooks.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No webhooks configured yet. Add a webhook to send events to external systems.
            </p>
          </Card>
        ) : (
          webhooks.map((webhook) => (
            <Card key={webhook.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{webhook.name}</h3>
                    <Badge variant={webhook.is_active ? "default" : "secondary"}>
                      {webhook.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="mt-2 font-mono text-muted-foreground text-sm">{webhook.url}</p>
                  {webhook.secret && <p className="mt-1 text-muted-foreground text-xs">HMAC signing enabled</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/automation/webhooks/${webhook.id}/edit`}>
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
