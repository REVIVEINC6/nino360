"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, FileText, ChevronRight } from "lucide-react"

export function ApplicantTracking() {
  const stages = [
    { name: "Applied", count: 45, color: "bg-blue-500" },
    { name: "Screening", count: 23, color: "bg-yellow-500" },
    { name: "Interview", count: 12, color: "bg-purple-500" },
    { name: "Offer", count: 5, color: "bg-green-500" },
  ]

  const candidates = [
    {
      name: "John Smith",
      position: "Senior Engineer",
      stage: "Applied",
      score: 85,
      applied: "2 days ago",
    },
    {
      name: "Sarah Johnson",
      position: "Product Manager",
      stage: "Screening",
      score: 92,
      applied: "1 week ago",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {stages.map((stage) => (
          <Card key={stage.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">{stage.name}</p>
              <div className={`h-2 w-2 rounded-full ${stage.color}`} />
            </div>
            <p className="text-2xl font-bold">{stage.count}</p>
            <p className="text-xs text-muted-foreground">candidates</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stages.map((stage) => (
          <div key={stage.name} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{stage.name}</h3>
              <Badge variant="secondary">{stage.count}</Badge>
            </div>
            <div className="space-y-2">
              {candidates
                .filter((c) => c.stage === stage.name)
                .map((candidate) => (
                  <Card key={candidate.name} className="p-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Score: {candidate.score}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{candidate.applied}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-3">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <FileText className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto">
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
