import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProjectSettingsContent } from "@/components/projects/project-settings-content"

export default async function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()

  const { data: project, error } = await supabase.from("projects").select("*").eq("id", params.id).single()

  if (error || !project) {
    notFound()
  }

  return <ProjectSettingsContent project={project} />
}
