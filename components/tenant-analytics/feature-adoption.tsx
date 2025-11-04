"use client"

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"

interface FeatureAdoptionProps {
  data: Array<{
    date: string
    crm: number
    talent: number
    hrms: number
    finance: number
    bench: number
    vms: number
    projects: number
  }>
}

export function FeatureAdoption({ data }: FeatureAdoptionProps) {
  return (
    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold">Feature Adoption</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
          <Legend />
          <Line type="monotone" dataKey="crm" stroke="#4F46E5" />
          <Line type="monotone" dataKey="talent" stroke="#6D28D9" />
          <Line type="monotone" dataKey="hrms" stroke="#8B5CF6" />
          <Line type="monotone" dataKey="finance" stroke="#A855F7" />
          <Line type="monotone" dataKey="bench" stroke="#D0FF00" />
          <Line type="monotone" dataKey="vms" stroke="#F81CE5" />
          <Line type="monotone" dataKey="projects" stroke="#4F46E5" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
