"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MapPin, Users, Calendar, Shield, Brain } from "lucide-react"
import Link from "next/link"

interface Requisition {
  id: string
  title: string
  department: string | null
  location: string | null
  employment_type: string | null
  seniority: string | null
  openings: number
  status: string
  created_at: string
  age_days: number
  ai_score: number | null
  ml_fill_probability: number | null
  blockchain_hash: string | null
  hiring_manager: { id: string; full_name: string } | null
  recruiter: { id: string; full_name: string } | null
}

interface JobsContentProps {
  requisitions: Requisition[]
  total: number
}

export function JobsContent({ requisitions, total }: JobsContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReqs = requisitions.filter((req) => req.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-card space-y-4 p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search requisitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Showing {filteredReqs.length} of {total} requisitions
        </p>
      </div>

      <div className="space-y-3">
        {filteredReqs.map((req, index) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/talent/jobs/${req.id}`}>
              <div className="glass-panel group cursor-pointer p-4 transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-balance font-semibold text-gray-900 group-hover:text-blue-600">
                        {req.title}
                      </h3>
                      <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                      {req.blockchain_hash && <Shield className="h-4 w-4 text-green-600" title="Blockchain Verified" />}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {req.department && (
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {req.department}
                        </span>
                      )}
                      {req.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {req.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {req.age_days} days old
                      </span>
                      <span className="font-medium">
                        {req.openings} {req.openings === 1 ? "opening" : "openings"}
                      </span>
                    </div>
                    {req.hiring_manager && (
                      <p className="mt-2 text-sm text-gray-500">
                        HM: {req.hiring_manager.full_name}
                        {req.recruiter && ` • Recruiter: ${req.recruiter.full_name}`}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {req.ai_score && (
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-600">
                          {(req.ai_score * 100).toFixed(0)}% AI Score
                        </span>
                      </div>
                    )}
                    {req.ml_fill_probability && (
                      <div className="text-sm text-gray-500">
                        {(req.ml_fill_probability * 100).toFixed(0)}% Fill Probability
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredReqs.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No requisitions found</p>
        </div>
      )}
    </motion.div>
  )
}
