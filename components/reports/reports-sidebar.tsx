"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Download, BarChart3, Bookmark } from "lucide-react"

export function ReportsSidebar() {
  const bookmarks = [
    { title: "Revenue vs Collection (30d)", id: "revcol-30" },
    { title: "ATS Hires & Offers", id: "ats-ho" },
    { title: "Bench Status", id: "bench" },
  ]

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* AI Insight */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Insights
            </h3>
            <Card className="p-4 bg-primary/5 border-primary/20 text-sm text-muted-foreground">
              Report usage suggests adding a weekly scheduled export for Finance KPIs.
            </Card>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Download className="mr-2 h-4 w-4" /> Export Current View
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Bookmark className="mr-2 h-4 w-4" /> Save as Bookmark
              </Button>
            </div>
          </div>

          <Separator />

          {/* Bookmarks */}
          <div>
            <h3 className="font-semibold mb-3">Bookmarks</h3>
            <div className="space-y-2">
              {bookmarks.map((b) => (
                <Card key={b.id} className="p-3 text-sm cursor-pointer hover:shadow-sm">
                  {b.title}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
