"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Brain, FileText, Shield } from "lucide-react"

export function TalentAI() {
  return (
    <Tabs defaultValue="prompts" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="prompts">
          <Brain className="mr-2 h-4 w-4" />
          Prompt Library
        </TabsTrigger>
        <TabsTrigger value="redaction">
          <Shield className="mr-2 h-4 w-4" />
          Redaction Rules
        </TabsTrigger>
      </TabsList>

      <TabsContent value="prompts">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">AI Prompt Templates</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "Resume Parsing", usage: 1234 },
              { name: "JD Optimization", usage: 456 },
              { name: "Interview Questions", usage: 789 },
              { name: "Candidate Scoring", usage: 567 },
            ].map((prompt) => (
              <Card key={prompt.name} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <p className="font-medium">{prompt.name}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{prompt.usage} uses</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Edit Template
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="redaction">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">PII Redaction Rules</h3>
          <p className="text-sm text-muted-foreground">Configure automatic redaction of sensitive information</p>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
