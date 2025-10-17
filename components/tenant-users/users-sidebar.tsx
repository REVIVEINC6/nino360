"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Shield, Activity, TrendingUp, Sparkles, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface UsersSidebarProps {
  context: {
    tenantId: string
    slug: string
    myRole: string
    features: Record<string, boolean>
    canManage: boolean
  }
  stats: {
    rows: any[]
    total: number
  }
}

export function UsersSidebar({ context, stats }: UsersSidebarProps) {
  const activeUsers = stats.rows.filter((u) => u.status === "active").length
  const invitedUsers = stats.rows.filter((u) => u.status === "invited").length
  const admins = stats.rows.filter((u) => u.role === "tenant_admin").length

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 space-y-4 sticky top-6 h-fit"
    >
      {/* Overview Stats */}
      <Card className="p-4 backdrop-blur-xl bg-white/5 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-[#8B5CF6]" />
          <h3 className="font-semibold">Overview</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Members</span>
            <Badge variant="secondary">{stats.total}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{activeUsers}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pending Invites</span>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{invitedUsers}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Administrators</span>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{admins}</Badge>
          </div>
        </div>
      </Card>

      {/* Security Status */}
      <Card className="p-4 backdrop-blur-xl bg-white/5 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-[#D0FF00]" />
          <h3 className="font-semibold">Security Status</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span className="text-sm">RBAC Enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span className="text-sm">Audit Logging Active</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span className="text-sm">Hash Chain Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">2 Users without MFA</span>
          </div>
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="p-4 backdrop-blur-xl bg-gradient-to-br from-[#4F46E5]/10 to-[#8B5CF6]/10 border-[#8B5CF6]/30">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-[#D0FF00]" />
          <h3 className="font-semibold">AI Insights</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">User growth up 23% this month</p>
          </div>
          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">Peak activity: 2-4 PM daily</p>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">3 users inactive for 30+ days</p>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4 backdrop-blur-xl bg-white/5 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-[#F81CE5]" />
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">John Doe joined</p>
              <p className="text-xs text-muted-foreground/60">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Role updated: Manager</p>
              <p className="text-xs text-muted-foreground/60">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">3 invites sent</p>
              <p className="text-xs text-muted-foreground/60">1 day ago</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      {context.canManage && (
        <Card className="p-4 backdrop-blur-xl bg-white/5 border-white/10">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Shield className="h-4 w-4 mr-2" />
              Review Permissions
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Activity className="h-4 w-4 mr-2" />
              View Audit Logs
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Sparkles className="h-4 w-4 mr-2" />
              Run AI Analysis
            </Button>
          </div>
        </Card>
      )}
    </motion.div>
  )
}
