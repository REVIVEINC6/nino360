"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { getTenantAnalytics } from "@/app/(app)/tenant/analytics/actions"
import { Users, Activity, HardDrive, Zap } from "lucide-react"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"]

export function TenantAnalyticsContent() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantAnalytics().then((data) => {
      setAnalytics(data)
      setLoading(false)
    })
  }, [])

  if (loading || !analytics) {
    return <div>Loading analytics...</div>
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="bg-white/50 backdrop-blur-sm border border-white/20">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="modules">Modules</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">102</p>
                <p className="text-xs text-green-600">+14% this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Modules</p>
                <p className="text-2xl font-bold">8/12</p>
                <p className="text-xs text-blue-600">67% enabled</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-pink-50 to-orange-50 border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500">
                <HardDrive className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold">88 GB</p>
                <p className="text-xs text-muted-foreground">of 100 GB</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">API Calls</p>
                <p className="text-2xl font-bold">9.5K</p>
                <p className="text-xs text-muted-foreground">this week</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <h3 className="text-lg font-semibold mb-4">Storage Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.storageUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, size }) => `${category}: ${size}GB`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="size"
                >
                  {analytics.storageUsage.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="users" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold mb-4">User Growth Trend</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analytics.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </TabsContent>

      <TabsContent value="modules" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold mb-4">Module Usage</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analytics.moduleUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="module" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="usage" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </TabsContent>

      <TabsContent value="resources" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <h3 className="text-lg font-semibold mb-4">API Calls (Weekly)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.apiCalls}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="calls" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.storageUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, size }) => `${category}: ${size}GB`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="size"
                >
                  {analytics.storageUsage.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
