import { Suspense } from "react"
import { getProjectExpenses } from "./actions"
import { ProjectExpensesContent } from "@/components/projects/project-expenses-content"
import { Skeleton } from "@/components/ui/skeleton"

export default async function ProjectExpensesPage({ params }: { params: { id: string } }) {
  const expenses = await getProjectExpenses(params.id)

  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-[600px]" />
        </div>
      }
    >
      <ProjectExpensesContent projectId={params.id} initialExpenses={expenses} />
    </Suspense>
  )
}
