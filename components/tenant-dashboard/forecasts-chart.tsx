"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Users, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ForecastData {
  date: string
  value: number
  lower: number
  upper: number
}

interface ForecastsChartProps {
  activityForecast: ForecastData[]
  userGrowthForecast: ForecastData[]
}

export function ForecastsChart({ activityForecast, userGrowthForecast }: ForecastsChartProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Predictive Forecasts
            </CardTitle>
            <CardDescription>AI-powered predictions based on historical trends</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity Forecast
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Growth
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <ChartContainer
              config={{
                value: {
                  label: "Activity",
                  color: "hsl(var(--chart-1))",
                },
                lower: {
                  label: "Lower Bound",
                  color: "hsl(var(--chart-2))",
                },
                upper: {
                  label: "Upper Bound",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityForecast}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="hsl(var(--chart-2))"
                    fill="url(#colorConfidence)"
                    strokeDasharray="3 3"
                    name="Upper Bound"
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stroke="hsl(var(--chart-3))"
                    fill="url(#colorConfidence)"
                    strokeDasharray="3 3"
                    name="Lower Bound"
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#colorActivity)"
                    strokeWidth={2}
                    name="Predicted Activity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              30-day activity forecast with 95% confidence intervals
            </p>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <ChartContainer
              config={{
                value: {
                  label: "Users",
                  color: "hsl(var(--chart-4))",
                },
                lower: {
                  label: "Lower Bound",
                  color: "hsl(var(--chart-5))",
                },
                upper: {
                  label: "Upper Bound",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthForecast}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short" })}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="upper"
                    stroke="hsl(var(--chart-5))"
                    strokeDasharray="3 3"
                    dot={false}
                    name="Upper Bound"
                  />
                  <Line
                    type="monotone"
                    dataKey="lower"
                    stroke="hsl(var(--chart-5))"
                    strokeDasharray="3 3"
                    dot={false}
                    name="Lower Bound"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-4))", r: 4 }}
                    name="Predicted Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              12-month user growth projection with confidence intervals
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
