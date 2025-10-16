import { ApplicantTracking } from "@/components/talent/applicant-tracking"

export default async function ApplicantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applicant Tracking</h1>
        <p className="text-muted-foreground">Kanban view by stage with bulk operations</p>
      </div>

      <ApplicantTracking />
    </div>
  )
}
