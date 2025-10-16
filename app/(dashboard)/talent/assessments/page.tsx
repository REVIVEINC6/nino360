import { AssessmentCenter } from "@/components/talent/assessment-center"

export default async function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assessment Center</h1>
        <p className="text-muted-foreground">Tests, scores, and proctoring management</p>
      </div>

      <AssessmentCenter />
    </div>
  )
}
