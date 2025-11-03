"use server"

import { generateText, generateObject } from "ai"
import { z } from "zod"

export async function parseResumeWithAI(resumeText: string) {
  const resumeSchema = z.object({
    full_name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    headline: z.string().optional(),
    summary: z.string().optional(),
    skills: z.array(z.string()),
    experience: z.array(
      z.object({
        title: z.string(),
        company: z.string(),
        duration: z.string(),
        description: z.string(),
      }),
    ),
    education: z.array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        year: z.string(),
      }),
    ),
  })

  try {
    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4.5",
      schema: resumeSchema,
      prompt: `Extract structured information from this resume:\n\n${resumeText}`,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("[v0] Error parsing resume with AI:", error)
    return { success: false, error: "Failed to parse resume" }
  }
}

export async function calculateCandidateMatch(candidateProfile: string, jobDescription: string) {
  const matchSchema = z.object({
    matchScore: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    gaps: z.array(z.string()),
    recommendation: z.string(),
    keySkillsMatch: z.array(
      z.object({
        skill: z.string(),
        candidateLevel: z.string(),
        requiredLevel: z.string(),
        match: z.boolean(),
      }),
    ),
  })

  try {
    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: matchSchema,
      prompt: `Analyze the match between this candidate and job:
      
Candidate Profile:
${candidateProfile}

Job Description:
${jobDescription}

Provide a detailed match analysis with score (0-100), strengths, gaps, and recommendations.`,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("[v0] Error calculating match:", error)
    return { success: false, error: "Failed to calculate match" }
  }
}

export async function optimizeJobDescription(jobDescription: string, targetAudience: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5",
      prompt: `Optimize this job description for ${targetAudience}. Make it more engaging, inclusive, and effective at attracting top talent. Maintain key requirements but improve clarity and appeal.

Original Job Description:
${jobDescription}

Provide an optimized version that:
1. Uses inclusive language
2. Highlights growth opportunities
3. Clarifies expectations
4. Emphasizes company culture
5. Removes unnecessary jargon`,
      maxOutputTokens: 2000,
    })

    return { success: true, optimizedDescription: text }
  } catch (error) {
    console.error("[v0] Error optimizing job description:", error)
    return { success: false, error: "Failed to optimize job description" }
  }
}

export async function generateInterviewQuestions(jobTitle: string, skills: string[], level: string) {
  const questionsSchema = z.object({
    technical: z.array(
      z.object({
        question: z.string(),
        expectedAnswer: z.string(),
        difficulty: z.enum(["easy", "medium", "hard"]),
      }),
    ),
    behavioral: z.array(
      z.object({
        question: z.string(),
        evaluationCriteria: z.string(),
      }),
    ),
    situational: z.array(
      z.object({
        scenario: z.string(),
        question: z.string(),
        keyPoints: z.array(z.string()),
      }),
    ),
  })

  try {
    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: questionsSchema,
      prompt: `Generate comprehensive interview questions for a ${level} ${jobTitle} position.
      
Required Skills: ${skills.join(", ")}

Provide:
- 5 technical questions with expected answers
- 5 behavioral questions with evaluation criteria
- 3 situational questions with key points to look for`,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("[v0] Error generating interview questions:", error)
    return { success: false, error: "Failed to generate questions" }
  }
}

export async function rankCandidates(candidates: any[], jobRequirements: string) {
  const rankingSchema = z.object({
    rankedCandidates: z.array(
      z.object({
        candidateId: z.string(),
        rank: z.number(),
        score: z.number(),
        reasoning: z.string(),
        topStrengths: z.array(z.string()),
        concerns: z.array(z.string()),
      }),
    ),
  })

  try {
    const candidatesText = candidates
      .map(
        (c, i) => `
Candidate ${i + 1} (ID: ${c.id}):
Name: ${c.full_name}
Skills: ${c.skills?.join(", ") || "N/A"}
Experience: ${c.headline || "N/A"}
Summary: ${c.summary || "N/A"}
`,
      )
      .join("\n---\n")

    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: rankingSchema,
      prompt: `Rank these candidates for a position with these requirements:

${jobRequirements}

Candidates:
${candidatesText}

Rank them from best to worst fit, providing scores (0-100), reasoning, strengths, and concerns for each.`,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("[v0] Error ranking candidates:", error)
    return { success: false, error: "Failed to rank candidates" }
  }
}

export async function screenCandidate(candidateProfile: string, screeningCriteria: string[]) {
  const screeningSchema = z.object({
    passed: z.boolean(),
    score: z.number().min(0).max(100),
    criteriaResults: z.array(
      z.object({
        criterion: z.string(),
        met: z.boolean(),
        evidence: z.string(),
      }),
    ),
    recommendation: z.enum(["proceed", "review", "reject"]),
    reasoning: z.string(),
  })

  try {
    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: screeningSchema,
      prompt: `Screen this candidate against the following criteria:

Screening Criteria:
${screeningCriteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Candidate Profile:
${candidateProfile}

Evaluate each criterion and provide an overall recommendation.`,
    })

    return { success: true, data: object }
  } catch (error) {
    console.error("[v0] Error screening candidate:", error)
    return { success: false, error: "Failed to screen candidate" }
  }
}
