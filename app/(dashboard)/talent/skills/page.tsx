import { SkillsMatrix } from "@/components/talent/skills-matrix"
import { getSkillsData } from "@/app/(dashboard)/talent/actions/skills"

export default async function SkillsPage() {
  const skillsData = await getSkillsData()

  return <SkillsMatrix initialData={skillsData} />
}
