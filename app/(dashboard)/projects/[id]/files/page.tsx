import { ProjectFilesContent } from "@/components/projects/project-files-content"

interface ProjectFilesPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectFilesPage({ params }: ProjectFilesPageProps) {
  const { id } = await params

  return <ProjectFilesContent projectId={id} />
}
