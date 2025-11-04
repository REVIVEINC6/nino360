"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function SkillMatching() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">AI-Powered Skill Matching</h3>
        <div className="space-y-4">
          {[
            { candidate: "John Smith", job: "Senior Engineer", match: 92, skills: ["React", "Node.js", "AWS"] },
            {
              candidate: "Sarah Johnson",
              job: "Product Manager",
              match: 88,
              skills: ["Agile", "Roadmapping", "Analytics"],
            },
          ].map((match) => (
            <Card key={match.candidate} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{match.candidate}</p>
                  <p className="text-sm text-muted-foreground">{match.job}</p>
                </div>
                <Badge variant="default">{match.match}% Match</Badge>
              </div>
              <Progress value={match.match} className="mb-3" />
              <div className="flex gap-2">
                {match.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
