"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { TrendingUp, TrendingDown, Users, Clock } from "lucide-react"

interface BenchAnalyticsContentProps {
  data: {
    benchHistory: any[]
    placements: any[]
    consultants: any[]
  }
}

export default function BenchAnalyticsContent({ data }: BenchAnalyticsContentProps) {
  // Process bench size over time
  const benchSizeData = processBenchSizeData(data.benchHistory)

  // Calculate average time-to-place
  const avgTimeToPlace = calculateAvgTimeToPlace(data.placements)

  // Process skills distribution
  const skillsData = processSkillsData(data.consultants)

  // Process work authorization mix
  const workAuthData = processWorkAuthData(data.consultants)

  // Calculate metrics
  const totalOnBench = data.consultants.filter((c) => c.status === "available").length
  const placementRate =
    data.placements.length > 0
      ? ((data.placements.length / (data.placements.length + totalOnBench)) * 100).toFixed(1)
      : "0.0"

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1"]

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-linear-to-br from-blue-50 to-purple-50 border-blue-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Bench Size</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalOnBench}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3" />
              12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-purple-50 to-pink-50 border-purple-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Place</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{avgTimeToPlace} days</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              5% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-pink-50 to-orange-50 border-pink-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-900">{placementRate}%</div>
            <p className="text-xs text-pink-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-orange-50 to-yellow-50 border-orange-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{data.placements.length}</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              This quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bench Size Over Time */}
        <Card className="bg-white/50 backdrop-blur-sm border-blue-200/50">
          <CardHeader>
            <CardTitle className="text-blue-900">Bench Size Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={benchSizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Consultants" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skills Distribution */}
        <Card className="bg-white/50 backdrop-blur-sm border-purple-200/50">
          <CardHeader>
            <CardTitle className="text-purple-900">Top Skills Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="skill" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="Consultants" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Work Authorization Mix */}
        <Card className="bg-white/50 backdrop-blur-sm border-pink-200/50">
          <CardHeader>
            <CardTitle className="text-pink-900">Work Authorization Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                  <Pie
                    data={workAuthData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // accept any props from Recharts and coerce percent to number at runtime
                    label={(props: any) => `${props.name}: ${(Number(props.percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                  {workAuthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Placement Trends */}
        <Card className="bg-white/50 backdrop-blur-sm border-orange-200/50">
          <CardHeader>
            <CardTitle className="text-orange-900">Monthly Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processPlacementTrends(data.placements)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="placements" fill="#f59e0b" name="Placements" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper functions
function processBenchSizeData(history: any[]) {
  const monthlyData: { [key: string]: number } = {}

  history.forEach((item) => {
    const date = new Date(item.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
  })

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short" }),
      count,
    }))
}

function calculateAvgTimeToPlace(placements: any[]) {
  if (placements.length === 0) return 0

  const totalDays = placements.reduce((sum, p) => {
    const start = new Date(p.start_date)
    const created = new Date(p.created_at)
    const days = Math.floor((start.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    return sum + days
  }, 0)

  return Math.round(totalDays / placements.length)
}

function processSkillsData(consultants: any[]) {
  const skillCounts: { [key: string]: number } = {}

  consultants.forEach((c) => {
    if (c.skills && Array.isArray(c.skills)) {
      c.skills.forEach((skill: string) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1
      })
    }
  })

  return Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }))
}

function processWorkAuthData(consultants: any[]) {
  const authCounts: { [key: string]: number } = {}

  consultants.forEach((c) => {
    const auth = c.work_authorization || "Unknown"
    authCounts[auth] = (authCounts[auth] || 0) + 1
  })

  return Object.entries(authCounts).map(([name, value]) => ({ name, value }))
}

function processPlacementTrends(placements: any[]) {
  const monthlyData: { [key: string]: number } = {}

  placements.forEach((p) => {
    const date = new Date(p.start_date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
  })

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, placements]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short" }),
      placements,
    }))
}
