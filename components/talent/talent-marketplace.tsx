"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

export function TalentMarketplace() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Job Board Integrations</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "LinkedIn", connected: true, posts: 45 },
            { name: "Indeed", connected: true, posts: 67 },
            { name: "Glassdoor", connected: false, posts: 0 },
          ].map((board) => (
            <Card key={board.name} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">{board.name}</p>
                {board.connected ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              {board.connected && <p className="text-sm text-muted-foreground mb-3">{board.posts} active postings</p>}
              <Button variant={board.connected ? "outline" : "default"} size="sm" className="w-full bg-transparent">
                {board.connected ? "Configure" : "Connect"}
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
