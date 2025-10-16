import { SkillMatching } from "@/components/talent/skill-matching"

export default async function SkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Skill Matching</h1>
        <p className="text-muted-foreground">Profile extraction and JD-fit scoring</p>
      </div>

      <SkillMatching />
    </div>
  )
}
