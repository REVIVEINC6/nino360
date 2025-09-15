import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile and current skills
    const [profileResult, skillsResult] = await Promise.all([
      supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("user_skills").select("skill_name").eq("user_id", user.id),
    ])

    const profile = profileResult.data
    const currentSkills = skillsResult.data?.map((s) => s.skill_name.toLowerCase()) || []

    // Generate skill suggestions based on profile
    const suggestions = generateSkillSuggestions(profile, currentSkills)

    return NextResponse.json({
      success: true,
      data: suggestions,
    })
  } catch (error) {
    console.error("Skill suggestions API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateSkillSuggestions(profile: any, currentSkills: string[]) {
  // Define skill categories and suggestions
  const skillDatabase = {
    Technology: [
      { name: "JavaScript", priority: 9, category: "Programming" },
      { name: "Python", priority: 9, category: "Programming" },
      { name: "React", priority: 8, category: "Frontend" },
      { name: "Node.js", priority: 8, category: "Backend" },
      { name: "SQL", priority: 9, category: "Database" },
      { name: "AWS", priority: 8, category: "Cloud" },
      { name: "Docker", priority: 7, category: "DevOps" },
      { name: "Git", priority: 9, category: "Version Control" },
    ],
    Marketing: [
      { name: "Digital Marketing", priority: 9, category: "Strategy" },
      { name: "SEO", priority: 8, category: "Digital" },
      { name: "Content Marketing", priority: 8, category: "Content" },
      { name: "Social Media Marketing", priority: 7, category: "Social" },
      { name: "Google Analytics", priority: 8, category: "Analytics" },
      { name: "Email Marketing", priority: 7, category: "Email" },
      { name: "PPC Advertising", priority: 7, category: "Advertising" },
    ],
    Sales: [
      { name: "CRM Management", priority: 9, category: "Tools" },
      { name: "Lead Generation", priority: 8, category: "Prospecting" },
      { name: "Negotiation", priority: 9, category: "Communication" },
      { name: "Sales Analytics", priority: 7, category: "Analytics" },
      { name: "Customer Relationship Management", priority: 8, category: "Relationship" },
      { name: "Sales Forecasting", priority: 7, category: "Planning" },
    ],
    HR: [
      { name: "Talent Acquisition", priority: 9, category: "Recruitment" },
      { name: "Performance Management", priority: 8, category: "Management" },
      { name: "Employee Relations", priority: 8, category: "Relations" },
      { name: "HRIS Systems", priority: 7, category: "Technology" },
      { name: "Compensation & Benefits", priority: 7, category: "Compensation" },
      { name: "Training & Development", priority: 8, category: "Development" },
    ],
    Finance: [
      { name: "Financial Analysis", priority: 9, category: "Analysis" },
      { name: "Excel Advanced", priority: 8, category: "Tools" },
      { name: "Financial Modeling", priority: 8, category: "Modeling" },
      { name: "Budgeting", priority: 7, category: "Planning" },
      { name: "Risk Management", priority: 7, category: "Risk" },
      { name: "Accounting", priority: 8, category: "Accounting" },
    ],
    Universal: [
      { name: "Project Management", priority: 9, category: "Management" },
      { name: "Communication", priority: 9, category: "Soft Skills" },
      { name: "Leadership", priority: 8, category: "Soft Skills" },
      { name: "Problem Solving", priority: 9, category: "Soft Skills" },
      { name: "Time Management", priority: 8, category: "Soft Skills" },
      { name: "Data Analysis", priority: 8, category: "Analytics" },
      { name: "Presentation Skills", priority: 7, category: "Communication" },
    ],
  }

  // Get department-specific skills
  const department = profile?.department || "Universal"
  let relevantSkills = skillDatabase[department] || skillDatabase["Universal"]

  // Add universal skills
  relevantSkills = [...relevantSkills, ...skillDatabase["Universal"]]

  // Filter out skills user already has
  const suggestions = relevantSkills
    .filter((skill) => !currentSkills.includes(skill.name.toLowerCase()))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10) // Top 10 suggestions
    .map((skill) => ({
      ...skill,
      reason: generateSkillReason(skill, department),
    }))

  return suggestions
}

function generateSkillReason(skill: any, department: string): string {
  const reasons = {
    JavaScript: "Essential for modern web development and automation",
    Python: "Versatile language for data analysis, automation, and AI",
    "Project Management": "Critical for leading teams and delivering results",
    Communication: "Fundamental skill for career advancement",
    Leadership: "Important for career growth and team management",
    "Data Analysis": "Increasingly important across all departments",
    "Digital Marketing": "Essential for modern marketing strategies",
    "CRM Management": "Core skill for sales professionals",
    "Talent Acquisition": "Key competency for HR professionals",
    "Financial Analysis": "Critical for finance and business roles",
  }

  return reasons[skill.name] || `Highly valued skill in ${department} roles`
}
