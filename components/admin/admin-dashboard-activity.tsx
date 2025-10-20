"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createBrowserClient } from "@supabase/ssr"

export function AdminDashboardActivity() {
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    async function loadActivity() {
      try {
        const { data } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10)

        if (data) setActivities(data)
      } catch (error) {
        console.error("[v0] Error loading activity:", error)
      }
    }

    loadActivity()
  }, [])

  return (
    <Card className="glass-card border-white/20 shadow-lg backdrop-blur-md bg-white/70">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Recent Activity
        </CardTitle>
        <CardDescription>Latest system events and user actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-white/20"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.resource}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {new Date(activity.created_at).toLocaleTimeString()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
