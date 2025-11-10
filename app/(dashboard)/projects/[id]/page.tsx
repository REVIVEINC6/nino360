import { getProjectDetail } from "./actions"
import { ProjectDetailContent } from "@/components/projects/project-detail-content"

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const project = await getProjectDetail(params.id)

  return <ProjectDetailContent project={project} />
}
