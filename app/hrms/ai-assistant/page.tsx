"use client"

import { AIChatInterface } from "@/components/ai/ai-chat-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  HelpCircle,
  Zap,
} from "lucide-react"

const aiCapabilities = [
  {
    icon: Users,
    title: "Employee Management",
    description: "Get insights on employee data, performance, and workforce analytics",
    color: "text-blue-500",
  },
  {
    icon: Clock,
    title: "Attendance Tracking",
    description: "Analyze attendance patterns and generate attendance reports",
    color: "text-green-500",
  },
  {
    icon: Calendar,
    title: "Leave Management",
    description: "Process leave requests and manage employee time-off policies",
    color: "text-purple-500",
  },
  {
    icon: DollarSign,
    title: "Payroll Insights",
    description: "Analyze payroll data and provide compensation recommendations",
    color: "text-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track performance metrics and identify improvement opportunities",
    color: "text-orange-500",
  },
  {
    icon: FileText,
    title: "Report Generation",
    description: "Create comprehensive HR reports and compliance documentation",
    color: "text-indigo-500",
  },
]

const usageTips = [
  "Ask specific questions about employee data or HR processes",
  "Use natural language - no need for technical commands",
  "Request reports and analytics for better decision making",
  "Get help with HR policy questions and compliance issues",
  "Ask for recommendations on workforce management",
]

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-muted-foreground mt-1">Your intelligent HR companion powered by advanced AI technology</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Zap className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Brain className="h-3 w-3 mr-1" />
            GPT-4 Enhanced
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2">
          <AIChatInterface className="h-full" />
        </div>

        {/* Sidebar with AI Capabilities and Tips */}
        <div className="space-y-6">
          {/* AI Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Capabilities
              </CardTitle>
              <CardDescription>Discover what our AI assistant can help you with</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiCapabilities.map((capability, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <capability.icon className={`h-5 w-5 mt-0.5 ${capability.color}`} />
                  <div>
                    <h4 className="font-medium text-sm">{capability.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{capability.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Usage Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Usage Tips
              </CardTitle>
              <CardDescription>Get the most out of your AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {usageTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Session Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-xs text-muted-foreground">Messages</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-xs text-muted-foreground">Reports Generated</div>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Start a conversation to see your session statistics</p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Brain className="h-4 w-4 mr-2" />
                Model Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat History
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Export Conversations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
