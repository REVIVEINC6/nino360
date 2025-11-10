"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Mon", users: 120, tenants: 15 },
  { name: "Tue", users: 145, tenants: 18 },
  { name: "Wed", users: 165, tenants: 22 },
  { name: "Thu", users: 180, tenants: 25 },
  { name: "Fri", users: 195, tenants: 28 },
  { name: "Sat", users: 210, tenants: 30 },
  { name: "Sun", users: 225, tenants: 32 },
]

export function AdminDashboardCharts() {
  return (
    <Card className="glass-card border-white/20 shadow-lg backdrop-blur-md bg-white/70">
      <CardHeader>
        <CardTitle className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Growth Trends
        </CardTitle>
        <CardDescription>User and tenant growth over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
            <Line type="monotone" dataKey="tenants" stroke="#ec4899" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
