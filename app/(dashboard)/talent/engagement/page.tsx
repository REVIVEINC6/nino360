import { CandidateEngagement } from "@/components/talent/candidate-engagement"

export default async function EngagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Candidate Engagement</h1>
        <p className="text-muted-foreground">Sequences, surveys, and NPS tracking</p>
      </div>

      <CandidateEngagement />
    </div>
  )
}
