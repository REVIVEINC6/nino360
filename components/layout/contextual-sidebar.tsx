"use client"

import { usePathname } from "next/navigation"
import {
  Bell,
  Filter,
  Clock,
  Star,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Activity,
  FileText,
  Users,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

export function ContextualSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Determine context based on current route
  const getContextualContent = () => {
    if (pathname.includes("/talent")) {
      return {
        title: "Talent Actions",
        icon: Users,
        quickActions: [
          { label: "Add Candidate", icon: Users, action: "add-candidate" },
          { label: "Schedule Interview", icon: Clock, action: "schedule-interview" },
          { label: "Post Job", icon: FileText, action: "post-job" },
        ],
        recentActivity: [
          { text: "John Doe applied to Senior Developer", time: "5m ago" },
          { text: "Interview scheduled with Jane Smith", time: "1h ago" },
          { text: "New job posted: React Engineer", time: "2h ago" },
        ],
      }
    } else if (pathname.includes("/finance")) {
      return {
        title: "Finance Actions",
        icon: TrendingUp,
        quickActions: [
          { label: "Create Invoice", icon: FileText, action: "create-invoice" },
          { label: "Record Payment", icon: TrendingUp, action: "record-payment" },
          { label: "Add Expense", icon: FileText, action: "add-expense" },
        ],
        recentActivity: [
          { text: "Invoice #1234 paid", time: "10m ago" },
          { text: "New timesheet submitted", time: "30m ago" },
          { text: "Expense approved: $500", time: "1h ago" },
        ],
      }
    } else if (pathname.includes("/bench")) {
      return {
        title: "Bench Actions",
        icon: Users,
        quickActions: [
          { label: "Add Consultant", icon: Users, action: "add-consultant" },
          { label: "Update Status", icon: Activity, action: "update-status" },
          { label: "Marketing Push", icon: Sparkles, action: "marketing-push" },
        ],
        recentActivity: [
          { text: "Consultant placed: Mike Johnson", time: "15m ago" },
          { text: "Status updated: Available", time: "45m ago" },
          { text: "Marketing email sent to 5 clients", time: "2h ago" },
        ],
      }
    } else if (pathname.includes("/reports")) {
      return {
        title: "Reports Actions",
        icon: Activity,
        quickActions: [
          { label: "AI Copilot", icon: Sparkles, action: "ai-copilot" },
          { label: "Export Data", icon: FileText, action: "export-data" },
          { label: "Schedule Report", icon: Clock, action: "schedule-report" },
        ],
        recentActivity: [
          { text: "Monthly report generated", time: "20m ago" },
          { text: "Dashboard viewed 15 times", time: "1h ago" },
          { text: "Export completed: Q4 data", time: "3h ago" },
        ],
      }
    }

    // Default context
    return {
      title: "Quick Actions",
      icon: Sparkles,
      quickActions: [
        { label: "AI Assistant", icon: Sparkles, action: "ai-assistant" },
        { label: "Search", icon: Filter, action: "search" },
        { label: "Notifications", icon: Bell, action: "notifications" },
      ],
      recentActivity: [
        { text: "Welcome to NINO360", time: "now" },
        { text: "System updated successfully", time: "1h ago" },
      ],
    }
  }

  const context = getContextualContent()
  const ContextIcon = context.icon

  if (collapsed) {
    return (
      <div className="relative w-12 border-l bg-card flex flex-col items-center py-4 gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCollapsed(false)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Separator />
        <Bell className="h-5 w-5 text-muted-foreground" />
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Sparkles className="h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="relative w-80 border-l bg-card flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <ContextIcon className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">{context.title}</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCollapsed(true)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {context.quickActions.map((action, index) => {
                const ActionIcon = action.icon
                return (
                  <Button key={index} variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <ActionIcon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {context.recentActivity.map((activity, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                  {index < context.recentActivity.length - 1 && <Separator className="mt-2" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </span>
                <Badge variant="secondary">3</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm">New candidate application</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm">Invoice payment received</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">System maintenance scheduled</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Assistant
              </CardTitle>
              <CardDescription className="text-xs">Ask me anything about your data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default" size="sm" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Chat
              </Button>
            </CardContent>
          </Card>

          {/* Favorites */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Favorites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Monthly Revenue Report
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Active Candidates
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Pipeline Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
