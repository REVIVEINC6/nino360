"use client"

import { motion } from "framer-motion"
import { Briefcase, Users, DollarSign, FileText, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const activities = [
  {
    id: 1,
    type: "crm",
    icon: Briefcase,
    summary: "7 opportunities moved to Commit stage",
    actor: "Sales Team",
    timestamp: "2 hours ago",
    details: "Total value: $2.4M",
  },
  {
    id: 2,
    type: "hrms",
    icon: Users,
    summary: "2 SLA breaches detected",
    actor: "System",
    timestamp: "4 hours ago",
    details: "I-9 verifications overdue",
    severity: "critical",
  },
  {
    id: 3,
    type: "finance",
    icon: DollarSign,
    summary: "1 cash anomaly flagged",
    actor: "ML Engine",
    timestamp: "6 hours ago",
    details: "Unusual payment pattern detected",
    severity: "warning",
  },
  {
    id: 4,
    type: "talent",
    icon: FileText,
    summary: "12 new applications received",
    actor: "ATS",
    timestamp: "8 hours ago",
    details: "Senior Developer positions",
  },
]

export function ActivityFeed() {
  const router = useRouter()

  const handleViewActivity = (activity: (typeof activities)[0]) => {
    const routes = {
      crm: "/crm/opportunities",
      hrms: "/hrms/compliance",
      finance: "/finance/accounts-receivable",
      talent: "/talent/applicants",
    }
    router.push(routes[activity.type as keyof typeof routes])
  }

  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader>
        <CardTitle className="text-base">Activity & Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
          >
            <div className="p-2 rounded-lg bg-primary/10">
              <activity.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{activity.summary}</p>
                {activity.severity && (
                  <Badge variant={activity.severity === "critical" ? "destructive" : "secondary"} className="text-xs">
                    {activity.severity}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{activity.details}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{activity.actor}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.timestamp}
                </span>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => handleViewActivity(activity)}>
              View
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
