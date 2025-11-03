"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, ArrowRight, Star } from "lucide-react"
import { useRouter } from "next/navigation"

export function AIRecommendations() {
  const router = useRouter()

  const recommendations = [
    {
      id: 1,
      candidate: "Emily Chen",
      job: "Senior React Developer",
      matchScore: 94,
      reasons: ["5+ years React", "TypeScript expert", "Remote experience"],
      avatar: "EC",
    },
    {
      id: 2,
      candidate: "Marcus Johnson",
      job: "DevOps Engineer",
      matchScore: 91,
      reasons: ["AWS certified", "Kubernetes", "CI/CD pipelines"],
      avatar: "MJ",
    },
    {
      id: 3,
      candidate: "Sarah Williams",
      job: "Product Manager",
      matchScore: 89,
      reasons: ["Agile certified", "B2B SaaS", "Data-driven"],
      avatar: "SW",
    },
  ]

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI-Powered Recommendations</CardTitle>
          </div>
          <Badge variant="secondary">Top Matches</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">{rec.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{rec.candidate}</p>
                  <p className="text-sm text-muted-foreground">{rec.job}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-bold text-primary">{rec.matchScore}%</span>
                <span className="text-xs text-muted-foreground">Match Score</span>
              </div>

              <div className="space-y-1 mb-3">
                {rec.reasons.map((reason, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">{reason}</span>
                  </div>
                ))}
              </div>

              <Button size="sm" className="w-full" onClick={() => router.push(`/talent/candidates/${rec.id}`)}>
                View Profile
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
