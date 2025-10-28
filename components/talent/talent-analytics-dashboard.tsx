"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Target,
  Zap,
  Brain,
  Award,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart as RechartsLine,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

const funnelData = [
  { stage: "Applied", count: 450, conversion: 100 },
  { stage: "Screened", count: 280, conversion: 62 },
  { stage: "Interviewed", count: 120, conversion: 27 },
  { stage: "Offered", count: 45, conversion: 10 },
  { stage: "Hired", count: 38, conversion: 8 },
]

const timeToHireData = [
  { month: "Jan", days: 32, target: 30 },
  { month: "Feb", days: 30, target: 30 },
  { month: "Mar", days: 28, target: 30 },
  { month: "Apr", days: 26, target: 30 },
  { month: "May", days: 28, target: 30 },
  { month: "Jun", days: 25, target: 30 },
]

const sourceROIData = [
  { name: "LinkedIn", hires: 45, cost: 12000, roi: 375 },
  { name: "Indeed", hires: 32, cost: 8000, roi: 400 },
  { name: "Referrals", hires: 28, cost: 5600, roi: 500 },
  { name: "Career Site", hires: 18, cost: 3000, roi: 600 },
  { name: "Agencies", hires: 12, cost: 15000, roi: 80 },
]

const qualityOfHireData = [
  { month: "Jan", score: 3.8, performance: 3.9, retention: 3.7 },
  { month: "Feb", score: 3.9, performance: 4.0, retention: 3.8 },
  { month: "Mar", score: 4.0, performance: 4.1, retention: 3.9 },
  { month: "Apr", score: 4.1, performance: 4.2, retention: 4.0 },
  { month: "May", score: 4.2, performance: 4.3, retention: 4.1 },
  { month: "Jun", score: 4.3, performance: 4.4, retention: 4.2 },
]

const diversityData = [
  { name: "Male", value: 52, color: "#3b82f6" },
  { name: "Female", value: 45, color: "#ec4899" },
  { name: "Non-binary", value: 3, color: "#8b5cf6" },
]

const COLORS = ["#3b82f6", "#ec4899", "#8b5cf6", "#f59e0b", "#10b981"]

export function TalentAnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card p-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Talent Analytics
              </h1>
              <p className="text-gray-600 mt-1">ML-powered insights, funnel metrics, and source ROI</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl">
              <Brain className="h-5 w-5" />
              <span className="font-semibold">AI Insights Active</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card border-white/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Time to Hire</CardTitle>
              <Clock className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                28 days
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>-3 days</span>
                </div>
                <span className="text-gray-500 text-sm">vs last quarter</span>
              </div>
              <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Quality of Hire</CardTitle>
              <Award className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                4.3/5.0
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+0.5</span>
                </div>
                <span className="text-gray-500 text-sm">vs last quarter</span>
              </div>
              <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-[86%] bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Source ROI</CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                375%
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+25%</span>
                </div>
                <span className="text-gray-500 text-sm">vs last quarter</span>
              </div>
              <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Acceptance Rate</CardTitle>
              <Target className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                85%
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+5%</span>
                </div>
                <span className="text-gray-500 text-sm">vs last quarter</span>
              </div>
              <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="funnel" className="space-y-4">
          <TabsList className="glass-card border-white/20 p-1">
            <TabsTrigger value="funnel" className="data-[state=active]:bg-white/80">
              <BarChart3 className="h-4 w-4 mr-2" />
              Funnel Analysis
            </TabsTrigger>
            <TabsTrigger value="time" className="data-[state=active]:bg-white/80">
              <LineChart className="h-4 w-4 mr-2" />
              Time to Hire
            </TabsTrigger>
            <TabsTrigger value="sources" className="data-[state=active]:bg-white/80">
              <DollarSign className="h-4 w-4 mr-2" />
              Source ROI
            </TabsTrigger>
            <TabsTrigger value="quality" className="data-[state=active]:bg-white/80">
              <Award className="h-4 w-4 mr-2" />
              Quality of Hire
            </TabsTrigger>
            <TabsTrigger value="diversity" className="data-[state=active]:bg-white/80">
              <PieChart className="h-4 w-4 mr-2" />
              Diversity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="space-y-4">
            <Card className="glass-card border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Recruitment Funnel Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="conversion" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <Card className="glass-card border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Time to Hire Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timeToHireData}>
                    <defs>
                      <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="days" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDays)" />
                    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <Card className="glass-card border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Source ROI Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={sourceROIData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="roi" fill="#10b981" radius={[0, 8, 8, 0]} />
                    <Bar dataKey="hires" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <Card className="glass-card border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Quality of Hire Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsLine data={qualityOfHireData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="performance" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={2} />
                  </RechartsLine>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diversity" className="space-y-4">
            <Card className="glass-card border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-pink-500" />
                  Diversity Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPie>
                    <Pie
                      data={diversityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {diversityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Insights */}
        <Card className="glass-card border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Optimize LinkedIn Sourcing</p>
                  <p className="text-sm text-blue-700 mt-1">
                    LinkedIn shows 375% ROI with 45 hires. Consider increasing budget by 20% for Q3.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-purple-900">Reduce Time to Hire</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Automate initial screening to reduce time to hire by an estimated 5 additional days.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Quality Improvement Detected</p>
                  <p className="text-sm text-green-700 mt-1">
                    Quality of hire increased 0.5 points. Referral program showing strong results.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
