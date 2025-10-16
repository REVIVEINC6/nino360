"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileCheck } from "lucide-react"

export function AssessmentCenter() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Assessment Tests</h3>
            <p className="text-sm text-muted-foreground">Manage technical and behavioral assessments</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Test
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Technical Coding", candidates: 45, avgScore: 78 },
            { name: "System Design", candidates: 23, avgScore: 82 },
            { name: "Behavioral", candidates: 67, avgScore: 85 },
          ].map((test) => (
            <Card key={test.name} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="h-5 w-5 text-primary" />
                <p className="font-medium">{test.name}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Candidates</span>
                  <span className="font-semibold">{test.candidates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Score</span>
                  <span className="font-semibold">{test.avgScore}%</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                View Results
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
