"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Briefcase, MapPin, Users, Calendar, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface JobDetailHeaderProps {
  job: any
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const router = useRouter()

  const statusColors = {
    draft: "bg-gray-500/10 text-gray-700 border-gray-300",
    open: "bg-green-500/10 text-green-700 border-green-300",
    on_hold: "bg-yellow-500/10 text-yellow-700 border-yellow-300",
    closed: "bg-blue-500/10 text-blue-700 border-blue-300",
    canceled: "bg-red-500/10 text-red-700 border-red-300",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-b border-white/20 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
          <Badge className={statusColors[job.status as keyof typeof statusColors]}>{job.status}</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {job.department && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {job.department}
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
              )}
              {job.openings && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {job.openings} {job.openings === 1 ? "opening" : "openings"}
                </div>
              )}
              {job.created_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </div>
              )}
              {job.salary_range?.min && job.salary_range?.max && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {job.salary_range.currency || "USD"} {job.salary_range.min.toLocaleString()} -{" "}
                  {job.salary_range.max.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 10).map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="glass-panel">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 10 && (
                <Badge variant="secondary" className="glass-panel">
                  +{job.skills.length - 10} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
