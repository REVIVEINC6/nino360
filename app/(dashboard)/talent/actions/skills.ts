"use server"

import { createClient } from "@/lib/supabase/server"

export async function getSkillsData() {
  const supabase = await createClient()

  // Fetch skills matrix data
  const { data: skills } = await supabase.from("talent_skills").select("*").order("created_at", { ascending: false })

  return {
    skills: skills || [],
    stats: {
      totalSkills: 247,
      skillGaps: 18,
      topPerformers: 34,
      aiMatchScore: 94,
    },
  }
}
