"use client"

import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Database, Mail, MessageSquare, CreditCard, Cloud } from "lucide-react"

interface IntegrationsStepProps {
  tenantId: string
  onComplete: () => void
}

export function IntegrationsStep({ tenantId, onComplete }: IntegrationsStepProps) {
  const integrations = [
    { id: "supabase", name: "Supabase", icon: Database, description: "Database and authentication", enabled: true },
    { id: "sendgrid", name: "SendGrid", icon: Mail, description: "Email delivery service", enabled: false },
    { id: "slack", name: "Slack", icon: MessageSquare, description: "Team communication", enabled: false },
    { id: "stripe", name: "Stripe", icon: CreditCard, description: "Payment processing", enabled: false },
    { id: "aws", name: "AWS S3", icon: Cloud, description: "File storage", enabled: false },
  ]

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">Connect external services to enhance your workspace capabilities.</p>

      {integrations.map((integration) => {
        const Icon = integration.icon
        return (
          <Card key={integration.id} className="backdrop-blur-xl bg-white/5 border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{integration.name}</h3>
                  <p className="text-white/60 text-sm">{integration.description}</p>
                </div>
              </div>
              <Switch checked={integration.enabled} disabled={integration.enabled} />
            </div>
          </Card>
        )
      })}

      <button
        onClick={onComplete}
        className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white py-2 px-4 rounded-lg transition-colors mt-6"
      >
        Continue
      </button>
    </div>
  )
}
