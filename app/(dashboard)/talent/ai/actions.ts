import { createServerClient } from "@/lib/supabase/server"
import { generateObject, generateText } from "ai"
import { z } from "zod"

// Resume parsing schema
const ResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().url().optional(),
    portfolio: z.string().url().optional(),
  }),
  summary: z.string(),
  skills: z.array(
    z.object({
      name: z.string(),
      category: z.enum(["technical", "soft", "language", "certification"]),
      proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
    }),
  ),
  experience: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      current: z.boolean(),
      description: z.string(),
      achievements: z.array(z.string()),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      gpa: z.string().optional(),
    }),
  ),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
      expiryDate: z.string().optional(),
    }),
  ),
})

export async function parseResume(resumeText: string) {
  "use server"

  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Use AI to parse resume
    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: ResumeSchema,
      prompt: `Parse the following resume and extract structured information. Be thorough and accurate.

Resume:
${resumeText}

Extract all personal information, skills (categorize them), work experience with achievements, education, and certifications.`,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("[v0] Resume parsing error:", error)
    return { success: false, error: "Failed to parse resume" }
  }
}

// Job description generation
export async function generateJobDescription(input: {
  title: string
  department: string
  level: "entry" | "mid" | "senior" | "lead" | "executive"
  skills: string[]
  responsibilities?: string[]
  benefits?: string[]
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
      prompt: `Generate a compelling job description for the following position:

Title: ${input.title}
Department: ${input.department}
Level: ${input.level}
Required Skills: ${input.skills.join(", ")}
${input.responsibilities ? `Key Responsibilities: ${input.responsibilities.join(", ")}` : ""}
${input.benefits ? `Benefits: ${input.benefits.join(", ")}` : ""}

Create a professional, engaging job description that includes:
1. Company overview (generic but professional)
2. Role summary
3. Key responsibilities (5-7 bullet points)
4. Required qualifications
5. Preferred qualifications
6. Benefits and perks
7. Equal opportunity statement

Make it attractive to top talent while being clear about expectations.`,
    })

    return { success: true, data: text }
  } catch (error) {
    console.error("[v0] JD generation error:", error)
    return { success: false, error: "Failed to generate job description" }
  }
}

// Candidate-Job matching
const MatchScoreSchema = z.object({
  overallScore: z.number().min(0).max(100),
  skillsMatch: z.object({
    score: z.number().min(0).max(100),
    matchedSkills: z.array(z.string()),
    missingSkills: z.array(z.string()),
  }),
  experienceMatch: z.object({
    score: z.number().min(0).max(100),
    relevantYears: z.number(),
    analysis: z.string(),
  }),
  educationMatch: z.object({
    score: z.number().min(0).max(100),
    analysis: z.string(),
  }),
  cultureFit: z.object({
    score: z.number().min(0).max(100),
    analysis: z.string(),
  }),
  recommendation: z.enum(["strong_match", "good_match", "potential_match", "weak_match"]),
  reasoning: z.string(),
  interviewQuestions: z.array(z.string()),
})

export async function matchCandidateToJob(candidateId: string, jobId: string) {
  "use server"

  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Fetch candidate data
    const { data: candidate } = await supabase
      .from("ats_candidates")
      .select("*, ats_candidate_skills(*)")
      .eq("id", candidateId)
      .single()

    // Fetch job data
    const { data: job } = await supabase.from("ats_job_requisitions").select("*").eq("id", jobId).single()

    if (!candidate || !job) {
      return { success: false, error: "Candidate or job not found" }
    }

    // Use AI to match candidate to job
    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: MatchScoreSchema,
      prompt: `Analyze the match between this candidate and job opening. Provide detailed scoring and recommendations.

CANDIDATE:
Name: ${candidate.first_name} ${candidate.last_name}
Email: ${candidate.email}
Skills: ${candidate.ats_candidate_skills?.map((s: any) => s.skill_name).join(", ") || "Not specified"}
Experience: ${candidate.years_of_experience || 0} years
Education: ${candidate.highest_education || "Not specified"}
Summary: ${candidate.summary || "Not provided"}

JOB:
Title: ${job.title}
Department: ${job.department}
Level: ${job.level}
Description: ${job.description}
Required Skills: ${job.required_skills?.join(", ") || "Not specified"}
Preferred Skills: ${job.preferred_skills?.join(", ") || "Not specified"}
Min Experience: ${job.min_experience || 0} years

Provide:
1. Overall match score (0-100)
2. Skills match analysis with matched and missing skills
3. Experience match analysis
4. Education match analysis
5. Culture fit assessment based on job description tone
6. Clear recommendation (strong_match, good_match, potential_match, weak_match)
7. Detailed reasoning for the recommendation
8. 5 tailored interview questions to assess fit`,
    })

    // Store the match score
    await supabase.from("ats_candidate_job_matches").insert({
      candidate_id: candidateId,
      job_id: jobId,
      match_score: object.overallScore,
      skills_match_score: object.skillsMatch.score,
      experience_match_score: object.experienceMatch.score,
      education_match_score: object.educationMatch.score,
      culture_fit_score: object.cultureFit.score,
      recommendation: object.recommendation,
      reasoning: object.reasoning,
      matched_skills: object.skillsMatch.matchedSkills,
      missing_skills: object.skillsMatch.missingSkills,
      interview_questions: object.interviewQuestions,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("[v0] Candidate matching error:", error)
    return { success: false, error: "Failed to match candidate to job" }
  }
}

// Generate interview questions
export async function generateInterviewQuestions(input: {
  jobTitle: string
  skills: string[]
  level: string
  focusAreas?: string[]
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
      prompt: `Generate a comprehensive set of interview questions for the following position:

Job Title: ${input.jobTitle}
Level: ${input.level}
Required Skills: ${input.skills.join(", ")}
${input.focusAreas ? `Focus Areas: ${input.focusAreas.join(", ")}` : ""}

Create 15-20 interview questions organized into categories:
1. Technical Skills (5-7 questions)
2. Behavioral/Situational (4-5 questions)
3. Problem-Solving (3-4 questions)
4. Cultural Fit (2-3 questions)
5. Role-Specific (2-3 questions)

Make questions specific, relevant, and appropriate for the ${input.level} level.
Include a mix of easy, medium, and hard questions.`,
    })

    return { success: true, data: text }
  } catch (error) {
    console.error("[v0] Interview questions generation error:", error)
    return { success: false, error: "Failed to generate interview questions" }
  }
}
