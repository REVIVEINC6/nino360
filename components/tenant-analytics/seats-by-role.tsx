"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"

interface SeatsByRoleProps {
  data: Array<{
    role: string
    licensed: number
    active: number
  }>
}

export function SeatsByRole({ data }: SeatsByRoleProps) {
  return (
    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold">Seats by Role</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="role" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="licensed" fill="#6D28D9" />
          <Bar dataKey="active" fill="#D0FF00" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
