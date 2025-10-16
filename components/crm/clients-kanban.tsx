"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, DollarSign, Briefcase } from "lucide-react"

const stages = [
  {
    name: "Prospect",
    clients: [
      {
        id: "1",
        name: "RetailMax Corp",
        industry: "Retail",
        value: "$0",
        positions: 0,
        contact: "Mike Johnson",
      },
      {
        id: "2",
        name: "MediaTech Inc",
        industry: "Media",
        value: "$0",
        positions: 0,
        contact: "Sarah Williams",
      },
    ],
  },
  {
    name: "Negotiation",
    clients: [
      {
        id: "3",
        name: "CloudSystems LLC",
        industry: "Technology",
        value: "$150,000",
        positions: 2,
        contact: "David Brown",
      },
    ],
  },
  {
    name: "Active",
    clients: [
      {
        id: "4",
        name: "TechCorp Inc",
        industry: "Technology",
        value: "$450,000",
        positions: 5,
        contact: "John Smith",
      },
      {
        id: "5",
        name: "FinanceHub LLC",
        industry: "Finance",
        value: "$320,000",
        positions: 3,
        contact: "Emily Davis",
      },
      {
        id: "6",
        name: "HealthTech Solutions",
        industry: "Healthcare",
        value: "$180,000",
        positions: 2,
        contact: "Robert Wilson",
      },
    ],
  },
  {
    name: "At Risk",
    clients: [
      {
        id: "7",
        name: "OldTech Corp",
        industry: "Technology",
        value: "$90,000",
        positions: 1,
        contact: "Lisa Anderson",
      },
    ],
  },
]

export function ClientsKanban() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stages.map((stage) => (
        <div key={stage.name} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{stage.name}</h3>
            <Badge variant="secondary">{stage.clients.length}</Badge>
          </div>
          <div className="space-y-3">
            {stage.clients.map((client) => (
              <Card key={client.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} />
                      <AvatarFallback>
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium truncate">{client.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{client.industry}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{client.value}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span>{client.positions} open positions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    <span className="truncate">{client.contact}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
