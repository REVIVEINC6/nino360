"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MessageSquare, Star } from "lucide-react"

export function CandidateEngagement() {
  return (
    <Tabs defaultValue="sequences" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sequences">
          <Mail className="mr-2 h-4 w-4" />
          Sequences
        </TabsTrigger>
        <TabsTrigger value="surveys">
          <MessageSquare className="mr-2 h-4 w-4" />
          Surveys
        </TabsTrigger>
        <TabsTrigger value="nps">
          <Star className="mr-2 h-4 w-4" />
          NPS
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sequences">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Email Sequences</h3>
          <p className="text-sm text-muted-foreground">Automated candidate communication sequences</p>
        </Card>
      </TabsContent>

      <TabsContent value="surveys">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Candidate Surveys</h3>
          <p className="text-sm text-muted-foreground">Collect feedback from candidates</p>
        </Card>
      </TabsContent>

      <TabsContent value="nps">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Net Promoter Score</h3>
          <div className="text-center py-8">
            <p className="text-5xl font-bold mb-2">8.5</p>
            <p className="text-sm text-muted-foreground">Average NPS Score</p>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
