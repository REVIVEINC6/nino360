"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Brain, Send, Sparkles, Mail, FileText, TrendingUp } from "lucide-react"

export function AIAssistant() {
  const [query, setQuery] = useState("")

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI-Powered Assistant</h3>
            <p className="text-sm text-muted-foreground">Ask questions or request actions in natural language</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Ask me anything... e.g., 'Show me all high-value deals closing this month' or 'Draft a follow-up email for Acme Corp'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <Button className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Ask AI Assistant
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="h-5 w-5 text-primary" />
            <p className="font-medium">Email Drafting</p>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Generate personalized emails for leads and customers</p>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Sparkles className="mr-2 h-3 w-3" />
            Try It
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <p className="font-medium">Meeting Summaries</p>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Automatically summarize meeting notes and action items</p>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Sparkles className="mr-2 h-3 w-3" />
            Try It
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <p className="font-medium">Deal Insights</p>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Get AI-powered insights on deal progression</p>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Sparkles className="mr-2 h-3 w-3" />
            Try It
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent AI Actions</h3>
        <div className="space-y-3">
          {[
            {
              action: "Generated follow-up email for Acme Corp",
              time: "2 minutes ago",
              type: "Email",
            },
            {
              action: "Summarized meeting with TechStart Inc",
              time: "1 hour ago",
              type: "Summary",
            },
            {
              action: "Analyzed Q1 pipeline trends",
              time: "3 hours ago",
              type: "Analysis",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
              <Badge variant="secondary">{item.type}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
