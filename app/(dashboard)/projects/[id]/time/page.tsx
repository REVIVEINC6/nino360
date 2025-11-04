import { getProjectTimeEntries } from "./actions"
import { ProjectTimeTrackingContent } from "@/components/projects/project-time-tracking-content"

export default async function ProjectTimePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const timeEntries = await getProjectTimeEntries(id)

  return <ProjectTimeTrackingContent projectId={id} initialTimeEntries={timeEntries} />
}
