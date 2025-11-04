"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"

export function TalentOnboarding() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">New Hires Ready for Onboarding</h3>
        <div className="space-y-3">
          {[
            { name: "John Smith", position: "Senior Engineer", startDate: "2024-02-01", status: "Ready" },
            { name: "Sarah Johnson", position: "Product Manager", startDate: "2024-02-05", status: "Pending" },
          ].map((hire) => (
            <Card key={hire.name} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{hire.name}</p>
                  <p className="text-sm text-muted-foreground">{hire.position}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Starts {hire.startDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={hire.status === "Ready" ? "default" : "secondary"}>{hire.status}</Badge>
                  <Button size="sm">
                    <ArrowRight className="mr-2 h-3 w-3" />
                    Transfer to HRMS
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
