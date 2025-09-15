"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Calendar,
  BarChart3,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react"

interface ForecastData {
  period: string
  demandForecast: number
  supplyForecast: number
  utilizationForecast: number
  revenueForecast: number
  benchForecast: number
  confidence: number
}

interface SkillDemandForecast {
  skill: string
  currentDemand: number
  forecastedDemand: number
  growth: number
  confidence: number
  category: string
}

interface ResourceForecast {
  resourceId: string
  resourceName: string
  department: string
  currentUtilization: number
  forecastedUtilization: number
  predictedBenchDays: number
  riskLevel: "low" | "medium" | "high"
  recommendations: string[]
}

const mockForecastData: ForecastData[] = [
  {
    period: "Q1 2024",
    demandForecast: 85,
    supplyForecast: 78,
    utilizationForecast: 82,
    revenueForecast: 245000,
    benchForecast: 45,
    confidence: 92,
  },
  {
    period: "Q2 2024",
    demandForecast: 92,
    supplyForecast: 85,
    utilizationForecast: 88,
    revenueForecast: 285000,
    benchForecast: 32,
    confidence: 87,
  },
  {
    period: "Q3 2024",
    demandForecast: 88,
    supplyForecast: 90,
    utilizationForecast: 91,
    revenueForecast: 295000,
    benchForecast: 28,
    confidence: 83,
  },
  {
    period: "Q4 2024",
    demandForecast: 95,
    supplyForecast: 88,
    utilizationForecast: 85,
    revenueForecast: 310000,
    benchForecast: 38,
    confidence: 78,
  },
]

const mockSkillDemandForecast: SkillDemandForecast[] = [
  {
    skill: "React",
    currentDemand: 85,
    forecastedDemand: 95,
    growth: 12,
    confidence: 89,
    category: "Frontend",
  },
  {
    skill: "AWS",
    currentDemand: 90,
    forecastedDemand: 98,
    growth: 9,
    confidence: 92,
    category: "Cloud",
  },
  {
    skill: "Python",
    currentDemand: 88,
    forecastedDemand: 92,
    growth: 5,
    confidence: 85,
    category: "Programming",
  },
  {
    skill: "Node.js",
    currentDemand: 75,
    forecastedDemand: 85,
    growth: 13,
    confidence: 87,
    category: "Backend",
  },
]

const mockResourceForecast: ResourceForecast[] = [
  {
    resourceId: "1",
    resourceName: "Sarah Johnson",
    department: "Engineering",
    currentUtilization: 95,
    forecastedUtilization: 88,
    predictedBenchDays: 5,
    riskLevel: "medium",
    recommendations: [
      "Consider reducing allocation to prevent burnout",
      "Schedule training during predicted low-demand period",
    ],
  },
  {
    resourceId: "2",
    resourceName: "Michael Chen",
    department: "Design",
    currentUtilization: 88,
    forecastedUtilization: 92,
    predictedBenchDays: 2,
    riskLevel: "low",
    recommendations: ["Optimal utilization trajectory", "Consider for high-priority projects"],
  },
  {
    resourceId: "3",
    resourceName: "Emily Rodriguez",
    department: "Data Science",
    currentUtilization: 0,
    forecastedUtilization: 75,
    predictedBenchDays: 15,
    riskLevel: "high",
    recommendations: ["Priority allocation needed", "Consider upskilling in high-demand areas"],
  },
]

export default function ForecastingPage() {
  const [forecastData, setForecastData] = useState<ForecastData[]>(mockForecastData)
  const [skillForecast, setSkillForecast] = useState<SkillDemandForecast[]>(mockSkillDemandForecast)
  const [resourceForecast, setResourceForecast] = useState<ResourceForecast[]>(mockResourceForecast)
  const [timeHorizon, setTimeHorizon] = useState<string>("quarterly")
  const [forecastModel, setForecastModel] = useState<string>("ai-enhanced")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const handleRefreshForecast = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Forecast Updated",
        description: "AI forecast models have been refreshed with latest data.",
      })
    }, 2000)
  }

  const handleExportForecast = () => {
    toast({
      title: "Export Started",
      description: "Forecast data export has been initiated.",
    })
  }

  const avgConfidence = Math.round(forecastData.reduce((sum, f) => sum + f.confidence, 0) / forecastData.length)
  const nextQuarterRevenue = forecastData[1]?.revenueForecast || 0
  const revenueGrowth =
    forecastData.length > 1
      ? Math.round(
          ((forecastData[1].revenueForecast - forecastData[0].revenueForecast) / forecastData[0].revenueForecast) * 100,
        )
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Predictive Forecasting</h1>
          <p className="text-muted-foreground">AI-powered predictions for resource planning and demand forecasting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshForecast} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Forecast
          </Button>
          <Button variant="outline" onClick={handleExportForecast}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Select value={timeHorizon} onValueChange={setTimeHorizon}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Forecast Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Confidence</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgConfidence}%</div>
            <Progress value={avgConfidence} className="mt-2" />
            <p className="text-xs text-blue-700 mt-1">AI model accuracy</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Forecast</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${(nextQuarterRevenue / 1000).toFixed(0)}K</div>
            <div className="flex items-center gap-1 text-xs text-green-700 mt-1">
              {getGrowthIcon(revenueGrowth)}
              <span>+{revenueGrowth}% growth</span>
            </div>
            <p className="text-xs text-green-700">Next quarter</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{forecastData[1]?.utilizationForecast || 0}%</div>
            <Progress value={forecastData[1]?.utilizationForecast || 0} className="mt-2" />
            <p className="text-xs text-purple-700 mt-1">Predicted utilization</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bench Forecast</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{forecastData[1]?.benchForecast || 0} days</div>
            <p className="text-xs text-orange-700 mt-1">
              {forecastData[1]?.benchForecast < forecastData[0]?.benchForecast ? "Decreasing" : "Increasing"} trend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Forecast Overview</TabsTrigger>
          <TabsTrigger value="skills">Skill Demand</TabsTrigger>
          <TabsTrigger value="resources">Resource Forecast</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Planning</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Forecast</CardTitle>
                <CardDescription>Demand, supply, and utilization predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forecastData.map((forecast, index) => (
                    <motion.div
                      key={forecast.period}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{forecast.period}</h4>
                        <Badge variant="outline">{forecast.confidence}% confidence</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Demand</p>
                          <p className="font-medium">{forecast.demandForecast}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Supply</p>
                          <p className="font-medium">{forecast.supplyForecast}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Utilization</p>
                          <p className="font-medium">{forecast.utilizationForecast}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-medium">${(forecast.revenueForecast / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Supply vs Demand</span>
                          <span>{Math.round((forecast.supplyForecast / forecast.demandForecast) * 100)}%</span>
                        </div>
                        <Progress value={(forecast.supplyForecast / forecast.demandForecast) * 100} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast Trends</CardTitle>
                <CardDescription>Visual representation of predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Forecast Chart</h3>
                    <p className="text-sm mb-4">Advanced forecasting visualization coming soon</p>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Timeline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Demand Forecast</CardTitle>
              <CardDescription>Predicted demand growth for key skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillForecast.map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-medium">{skill.skill}</h4>
                        <p className="text-sm text-muted-foreground">{skill.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{skill.confidence}% confidence</Badge>
                        <div className="flex items-center gap-1">
                          {getGrowthIcon(skill.growth)}
                          <span className="text-sm font-medium">+{skill.growth}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Demand</p>
                        <p className="font-medium">{skill.currentDemand}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Forecasted Demand</p>
                        <p className="font-medium">{skill.forecastedDemand}%</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Demand Growth</span>
                        <span>{skill.forecastedDemand}%</span>
                      </div>
                      <Progress value={skill.forecastedDemand} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Resource Forecasts</CardTitle>
              <CardDescription>Personalized predictions for each resource</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resourceForecast.map((resource, index) => (
                  <motion.div
                    key={resource.resourceId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-medium">{resource.resourceName}</h4>
                        <p className="text-sm text-muted-foreground">{resource.department}</p>
                      </div>
                      <Badge className={getRiskColor(resource.riskLevel)}>{resource.riskLevel} risk</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Utilization</p>
                        <p className="font-medium">{resource.currentUtilization}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Forecasted Utilization</p>
                        <p className="font-medium">{resource.forecastedUtilization}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Predicted Bench Days</p>
                        <p className="font-medium">{resource.predictedBenchDays}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">AI Recommendations</p>
                      <div className="space-y-1">
                        {resource.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <TrendingUp className="h-5 w-5" />
                  Optimistic Scenario
                </CardTitle>
                <CardDescription>Best case projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Utilization</span>
                  <span className="font-medium text-green-700">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Revenue Growth</span>
                  <span className="font-medium text-green-700">+25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bench Time</span>
                  <span className="font-medium text-green-700">15 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Probability</span>
                  <span className="font-medium text-green-700">25%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Target className="h-5 w-5" />
                  Most Likely Scenario
                </CardTitle>
                <CardDescription>Expected projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Utilization</span>
                  <span className="font-medium text-blue-700">88%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Revenue Growth</span>
                  <span className="font-medium text-blue-700">+16%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bench Time</span>
                  <span className="font-medium text-blue-700">32 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Probability</span>
                  <span className="font-medium text-blue-700">50%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <TrendingDown className="h-5 w-5" />
                  Conservative Scenario
                </CardTitle>
                <CardDescription>Worst case projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Utilization</span>
                  <span className="font-medium text-red-700">72%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Revenue Growth</span>
                  <span className="font-medium text-red-700">+8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bench Time</span>
                  <span className="font-medium text-red-700">55 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Probability</span>
                  <span className="font-medium text-red-700">25%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Forecast Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Demand Pattern Recognition</p>
                      <p className="text-sm text-blue-700">
                        Historical data shows 23% increase in React demand during Q2. Model predicts similar pattern.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Revenue Opportunity</p>
                      <p className="text-sm text-green-700">
                        Forecasted demand surge in AWS skills could generate additional $45K revenue if capacity is
                        available.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Capacity Risk</p>
                      <p className="text-sm text-yellow-700">
                        Q4 demand forecast exceeds current supply by 7%. Consider hiring or upskilling initiatives.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Prediction Accuracy</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <Progress value={89} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Model Confidence</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Data Quality Score</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <Progress value={95} />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Model Update:</strong> Last trained on 2,847 data points from the past 18 months.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
