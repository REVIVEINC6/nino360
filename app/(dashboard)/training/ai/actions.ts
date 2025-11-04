import { createServerClient } from "@/lib/supabase/server"
import { generateObject, generateText } from "ai"
import { z } from "zod"

// Quiz generation schema
const QuizSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      type: z.enum(["multiple_choice", "true_false", "short_answer"]),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      explanation: z.string(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      points: z.number(),
    }),
  ),
})

export async function generateQuiz(input: {
  topic: string
  difficulty: "easy" | "medium" | "hard" | "mixed"
  questionCount: number
  questionTypes?: ("multiple_choice" | "true_false" | "short_answer")[]
}) {
  "use server"

  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: QuizSchema,
      prompt: `Generate a quiz with ${input.questionCount} questions on the topic: ${input.topic}

Difficulty: ${input.difficulty}
${input.questionTypes ? `Question Types: ${input.questionTypes.join(", ")}` : "Mix of multiple choice, true/false, and short answer"}

Requirements:
1. Create engaging, clear questions
2. For multiple choice, provide 4 options with only one correct answer
3. Include detailed explanations for each answer
4. Vary difficulty if "mixed" is selected
5. Assign appropriate points (easy: 1-2, medium: 3-4, hard: 5-6)
6. Ensure questions test understanding, not just memorization
7. Cover different aspects of the topic

Make questions practical and relevant to real-world applications.`,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("[v0] Quiz generation error:", error)
    return { success: false, error: "Failed to generate quiz" }
  }
}

// Course outline generation
export async function generateCourseOutline(input: {
  title: string
  description: string
  targetAudience: string
  duration: string
  learningObjectives: string[]
}) {
  "use server"

  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: `Create a comprehensive course outline for:

Title: ${input.title}
Description: ${input.description}
Target Audience: ${input.targetAudience}
Duration: ${input.duration}
Learning Objectives:
${input.learningObjectives.map((obj) => `- ${obj}`).join("\n")}

Generate a detailed course outline with:
1. Course Overview
2. Prerequisites
3. Module Breakdown (5-8 modules)
   - For each module:
     * Module title and description
     * Learning outcomes
     * Topics covered (3-5 topics per module)
     * Estimated time
     * Activities/Assessments
4. Final Assessment
5. Additional Resources

Make it structured, progressive, and aligned with the learning objectives.`,
    })

    return { success: true, data: text }
  } catch (error) {
    console.error("[v0] Course outline generation error:", error)
    return { success: false, error: "Failed to generate course outline" }
  }
}

// Learning path recommendation
export async function recommendLearningPath(employeeId: string) {
  "use server"

  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Fetch employee data
    const { data: employee } = await supabase
      .from("hrms_employees")
      .select("*, lms_enrollments(*, lms_courses(*)), hrms_employee_skills(*)")
      .eq("id", employeeId)
      .single()

    if (!employee) {
      return { success: false, error: "Employee not found" }
    }

    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: `Recommend a personalized learning path for this employee:

Employee: ${employee.first_name} ${employee.last_name}
Position: ${employee.position || "Not specified"}
Department: ${employee.department || "Not specified"}
Current Skills: ${employee.hrms_employee_skills?.map((s: any) => s.skill_name).join(", ") || "Not specified"}
Completed Courses: ${employee.lms_enrollments?.filter((e: any) => e.status === "completed").length || 0}
In Progress: ${employee.lms_enrollments?.filter((e: any) => e.status === "in_progress").length || 0}

Provide:
1. Skill Gap Analysis
2. Recommended Learning Path (5-7 courses in order)
   - For each course:
     * Course title
     * Why it's recommended
     * Expected outcomes
     * Estimated time
     * Priority (high/medium/low)
3. Career Development Opportunities
4. Timeline (3-6-12 months)

Focus on practical skills that will help career growth and current role performance.`,
    })

    return { success: true, data: text }
  } catch (error) {
    console.error("[v0] Learning path recommendation error:", error)
    return { success: false, error: "Failed to recommend learning path" }
  }
}
