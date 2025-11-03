"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GraduationCap, Sparkles, BookOpen, Award, PlayCircle } from "lucide-react"

export function TrainingSidebar() {
  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Insights
            </h3>
            <Card className="p-4 bg-primary/5 border-primary/20 text-sm text-muted-foreground">
              Recommend a certification track for 12 users.
            </Card>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <BookOpen className="mr-2 h-4 w-4" /> Create Course
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <PlayCircle className="mr-2 h-4 w-4" /> Launch Session
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Achievements</h3>
            <div className="space-y-2 text-sm">
              {["AWS Cloud Practitioner", "Security Essentials"].map((a, i) => (
                <Card key={i} className="p-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" /> {a}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
