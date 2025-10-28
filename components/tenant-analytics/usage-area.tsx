"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"

interface UsageAreaProps {
  data: Array<{
    date: string
    dau: number
    wau: number
    mau: number
  }>
  grain: "day" | "week" | "month"
}

export function UsageArea({ data, grain }: UsageAreaProps) {
  return (
    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold">Active Users Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorWau" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMau" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
            }}
          />
          <Area type="monotone" dataKey="dau" stroke="#4F46E5" fillOpacity={1} fill="url(#colorDau)" />
          <Area type="monotone" dataKey="wau" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorWau)" />
          <Area type="monotone" dataKey="mau" stroke="#A855F7" fillOpacity={1} fill="url(#colorMau)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
