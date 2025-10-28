"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Sparkles, Shield, TrendingUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ApplicantCardProps {
  applicant: any
}

export function ApplicantCard({ applicant }: ApplicantCardProps) {
  const initials = `${applicant.first_name[0]}${applicant.last_name[0]}`
  const priorityColors = {
    urgent: "bg-red-500/10 text-red-500 border-red-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    low: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  }

  return (
    <Card className="p-4 cursor-pointer hover:shadow-lg transition-all bg-background/80 backdrop-blur-sm border-border/40 hover:border-border">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">
            {applicant.first_name} {applicant.last_name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">{applicant.job_title}</p>
        </div>
      </div>

      {/* AI Score */}
      {applicant.ai_score && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">AI Match Score</span>
              <span className="text-xs font-bold text-purple-500">{applicant.ai_score}%</span>
            </div>
            <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                style={{ width: `${applicant.ai_score}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {applicant.skills?.slice(0, 3).map((skill: string, index: number) => (
          <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
            {skill}
          </Badge>
        ))}
        {applicant.skills?.length > 3 && (
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            +{applicant.skills.length - 3}
          </Badge>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {applicant.blockchain_verified_at && (
            <div className="flex items-center gap-1 text-green-500">
              <Shield className="h-3 w-3" />
              <span>Verified</span>
            </div>
          )}
          {applicant.experience_years && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{applicant.experience_years}y exp</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(applicant.created_at), { addSuffix: true })}</span>
        </div>
      </div>

      {/* Priority Badge */}
      {applicant.priority && applicant.priority !== "medium" && (
        <Badge
          className={`absolute top-2 right-2 text-xs ${priorityColors[applicant.priority as keyof typeof priorityColors]}`}
        >
          {applicant.priority}
        </Badge>
      )}
    </Card>
  )
}
