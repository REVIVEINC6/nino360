// Minimal AI client shim for resume parsing and embedding operations.
// This is a pragmatic starting point: it supports a mock mode and a
// pluggable provider implementation later (OpenAI, Anthropic, etc.).

export type CandidateParseResult = {
  full_name?: string
  email?: string
  phone?: string
  location?: string
  headline?: string
  summary?: string
  skills?: string[]
  experience?: Array<Record<string, any>>
  education?: Array<Record<string, any>>
  resume_url?: string
}

type AiClientOptions = {
  provider?: "mock" | "openai"
}

const DEFAULT_OPTIONS: AiClientOptions = { provider: "mock" }

/**
 * Parse a resume available at `url` and return a structured candidate object.
 */
export async function parseResumeFromUrl(
  url: string,
  opts: AiClientOptions = DEFAULT_OPTIONS,
): Promise<CandidateParseResult> {
  if (!url) throw new Error("resume url required")

  if (opts.provider === "openai" || process.env.AI_PROVIDER === "openai") {
    try {
      // Fetch the resume content
      const response = await fetch(url)
      const contentType = response.headers.get("content-type")

      let resumeText = ""

      if (contentType?.includes("application/pdf")) {
        // For PDF, we'd use a library like pdf-parse
        // For now, indicate it's a PDF
        resumeText = "(PDF content - extraction requires pdf-parse library)"
      } else if (contentType?.includes("text")) {
        resumeText = await response.text()
      } else {
        throw new Error("Unsupported file type")
      }

      // Use AI to extract structured data
      const model = process.env.AI_MODEL || "openai/gpt-4o-mini"
      const prompt = `Extract structured candidate information from this resume:

${resumeText}

Return a JSON object with these fields:
- full_name: string
- email: string
- phone: string
- location: string
- headline: string (professional title)
- summary: string (2-3 sentences)
- skills: array of strings
- experience: array of {title, company, duration, description}
- education: array of {degree, institution, year}

Respond with only valid JSON, no markdown or explanations.`

      const { text } = await generateText({
        model: model as any,
        prompt,
        maxTokens: 1500,
      })

      try {
        const parsed = JSON.parse(text)
        return {
          ...parsed,
          resume_url: url,
        }
      } catch (parseError) {
        console.error("[v0] Failed to parse AI response:", parseError)
        throw new Error("Failed to parse resume")
      }
    } catch (error) {
      console.error("[v0] Resume parsing failed:", error)
      // Fall back to mock only in development
      if (process.env.NODE_ENV === "development") {
        return parseResumeFromUrl(url, { provider: "mock" })
      }
      throw error
    }
  }

  // Mock provider fallback
  if (opts.provider === "mock") {
    const nameMatch = url.match(/([A-Za-z]+)-([A-Za-z]+)/)
    const name = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : "Extracted Name"
    return {
      full_name: name,
      email: `${name.replace(/\s+/g, ".").toLowerCase()}@example.com`,
      phone: "+1-555-0100",
      skills: ["JavaScript", "TypeScript", "React"],
      summary: "Experienced software engineer with frontend and backend experience.",
      experience: [],
      education: [],
      resume_url: url,
    }
  }

  throw new Error("No AI provider configured")
}

/**
 * Convenience wrapper for embeddings — placeholder for future work.
 */
export async function embedText(_text: string): Promise<number[]> {
  // Return a deterministic empty vector for now.
  return []
}

export default {
  parseResumeFromUrl,
  embedText,
}
/**
 * AI Client for Nino360
 *
 * Provides a unified interface for all AI operations:
 * - Resume parsing
 * - JD generation
 * - Candidate matching
 * - Offer letter generation
 * - RAG queries
 * - Document embeddings
 */

import { logger } from "@/lib/logger"

export interface AIConfig {
  provider: "openai" | "anthropic" | "groq" | "mock"
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface ResumeParseResult {
  name: string
  email: string
  phone?: string
  skills: string[]
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  summary?: string
}

export interface JDGenerationResult {
  title: string
  description: string
  responsibilities: string[]
  requirements: string[]
  skills: string[]
  salary_range?: string
}

export interface CandidateMatch {
  candidate_id: string
  score: number
  reasoning: string
  matching_skills: string[]
  missing_skills: string[]
}

export interface OfferLetterResult {
  content: string
  subject: string
}

export interface RAGQueryResult {
  answer: string
  sources: Array<{
    document_id: string
    chunk: string
    relevance: number
  }>
}

export interface DigestResult {
  text: string
  tokens: number
  cost: number
}

class AIClient {
  private config: AIConfig

  constructor(config?: Partial<AIConfig>) {
    this.config = {
      provider: (process.env.AI_PROVIDER as AIConfig["provider"]) || "mock",
      apiKey: process.env.AI_API_KEY,
      model: process.env.AI_MODEL || "gpt-4",
      temperature: 0.7,
      maxTokens: 2000,
      ...config,
    }
  }

  /**
   * Parse resume from text or file
   */
  async parseResume(resumeText: string): Promise<ResumeParseResult> {
    logger.info("Parsing resume", { provider: this.config.provider })

    if (this.config.provider !== "mock") {
      try {
        const model = this.config.model || "openai/gpt-4o-mini"
        const prompt = `Extract structured candidate information from this resume:

${resumeText}

Return a JSON object with these fields:
- name: string
- email: string
- phone: string
- skills: array of strings
- experience: array of {title, company, duration, description}
- education: array of {degree, institution, year}
- summary: string (2-3 sentences)

Respond with only valid JSON.`

        const { text } = await generateText({
          model: model as any,
          prompt,
          maxTokens: 1500,
          temperature: this.config.temperature,
        })

        return JSON.parse(text)
      } catch (error) {
        logger.error("Resume parsing failed", { error })
        if (process.env.NODE_ENV !== "production") {
          return this.mockParseResume(resumeText)
        }
        throw error
      }
    }

    return this.mockParseResume(resumeText)
  }

  /**
   * Generate job description
   */
  async generateJD(params: { title: string; company: string; requirements?: string[] }): Promise<JDGenerationResult> {
    logger.info("Generating JD", { provider: this.config.provider, title: params.title })

    if (this.config.provider !== "mock") {
      try {
        const model = this.config.model || "openai/gpt-4o-mini"
        const prompt = `Generate a professional job description for:

Position: ${params.title}
Company: ${params.company}
${params.requirements ? `Requirements: ${params.requirements.join(", ")}` : ""}

Return a JSON object with:
- title: string
- description: string (2-3 paragraphs)
- responsibilities: array of strings (5-7 items)
- requirements: array of strings (5-7 items)
- skills: array of strings (8-12 technical skills)
- salary_range: string (if applicable)

Respond with only valid JSON.`

        const { text } = await generateText({
          model: model as any,
          prompt,
          maxTokens: 1000,
          temperature: this.config.temperature,
        })

        return JSON.parse(text)
      } catch (error) {
        logger.error("JD generation failed", { error })
        if (process.env.NODE_ENV !== "production") {
          return this.mockGenerateJD(params)
        }
        throw error
      }
    }

    return this.mockGenerateJD(params)
  }

  /**
   * Match candidates to job
   */
  async matchCandidates(jobId: string, candidateIds: string[]): Promise<CandidateMatch[]> {
    logger.info("Matching candidates", {
      provider: this.config.provider,
      jobId,
      candidateCount: candidateIds.length,
    })

    if (this.config.provider !== "mock") {
      try {
        // This would require database access - for now, delegate to server action
        // that has access to Supabase client
        throw new Error("Use server action for candidate matching")
      } catch (error) {
        logger.error("Candidate matching failed", { error })
        if (process.env.NODE_ENV !== "production") {
          return this.mockMatchCandidates(candidateIds)
        }
        throw error
      }
    }

    return this.mockMatchCandidates(candidateIds)
  }

  /**
   * Generate offer letter
   */
  async generateOfferLetter(params: {
    candidateName: string
    position: string
    salary: number
    startDate: string
    companyName: string
  }): Promise<OfferLetterResult> {
    logger.info("Generating offer letter", { provider: this.config.provider, position: params.position })

    if (this.config.provider === "mock") {
      return this.mockGenerateOfferLetter(params)
    }

    // TODO: Implement actual AI generation
    return this.mockGenerateOfferLetter(params)
  }

  /**
   * Query RAG system
   */
  async queryRAG(query: string, tenantId: string): Promise<RAGQueryResult> {
    logger.info("Querying RAG", { provider: this.config.provider, tenantId })

    if (this.config.provider === "mock") {
      return this.mockQueryRAG(query)
    }

    // TODO: Implement actual RAG query
    return this.mockQueryRAG(query)
  }

  /**
   * Embed document for RAG
   */
  async embedDocument(documentId: string, content: string, tenantId: string): Promise<{ success: boolean }> {
    logger.info("Embedding document", { provider: this.config.provider, documentId, tenantId })

    if (this.config.provider === "mock") {
      return { success: true }
    }

    // TODO: Implement actual embedding
    return { success: true }
  }

  /**
   * Generate AI digest for tenant dashboard
   */
  async generateDigest(params: { tenantId: string; from: string; to: string }): Promise<DigestResult> {
    logger.info("Generating AI digest", { provider: this.config.provider, tenantId: params.tenantId })

    if (this.config.provider === "mock") {
      return this.mockGenerateDigest(params)
    }

    // TODO: Implement actual AI digest generation
    // const response = await fetch('/api/ai/generate-digest', {
    //   method: 'POST',
    //   body: JSON.stringify(params)
    // })
    // return response.json()

    return this.mockGenerateDigest(params)
  }

  // Mock implementations for development
  private mockParseResume(text: string): ResumeParseResult {
    return {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
      experience: [
        {
          title: "Senior Software Engineer",
          company: "Tech Corp",
          duration: "2020-2024",
          description: "Led development of enterprise applications",
        },
      ],
      education: [
        {
          degree: "BS Computer Science",
          institution: "University of Technology",
          year: "2020",
        },
      ],
      summary: "Experienced software engineer with 5+ years in full-stack development",
    }
  }

  private mockGenerateJD(params: { title: string; company: string }): JDGenerationResult {
    return {
      title: params.title,
      description: `${params.company} is seeking a talented ${params.title} to join our growing team.`,
      responsibilities: [
        "Design and develop scalable applications",
        "Collaborate with cross-functional teams",
        "Mentor junior developers",
        "Participate in code reviews",
      ],
      requirements: [
        "5+ years of relevant experience",
        "Strong problem-solving skills",
        "Excellent communication abilities",
        "Bachelor's degree in Computer Science or related field",
      ],
      skills: ["JavaScript", "TypeScript", "React", "Node.js", "SQL"],
      salary_range: "$120,000 - $180,000",
    }
  }

  private mockMatchCandidates(candidateIds: string[]): CandidateMatch[] {
    return candidateIds.map((id, index) => ({
      candidate_id: id,
      score: 85 - index * 5,
      reasoning: "Strong technical background with relevant experience",
      matching_skills: ["JavaScript", "React", "Node.js"],
      missing_skills: ["GraphQL", "Docker"],
    }))
  }

  private mockGenerateOfferLetter(params: {
    candidateName: string
    position: string
    salary: number
    startDate: string
    companyName: string
  }): OfferLetterResult {
    return {
      subject: `Offer Letter - ${params.position} at ${params.companyName}`,
      content: `Dear ${params.candidateName},

We are pleased to offer you the position of ${params.position} at ${params.companyName}.

Position: ${params.position}
Salary: $${params.salary.toLocaleString()} per year
Start Date: ${params.startDate}

We look forward to welcoming you to our team!

Best regards,
${params.companyName} HR Team`,
    }
  }

  private mockQueryRAG(query: string): RAGQueryResult {
    return {
      answer: `Based on the available documentation, here's what I found about "${query}": This is a mock response. In production, this would query the RAG system and return relevant information from your documents.`,
      sources: [
        {
          document_id: "doc-1",
          chunk: "Relevant information from document 1",
          relevance: 0.95,
        },
        {
          document_id: "doc-2",
          chunk: "Additional context from document 2",
          relevance: 0.87,
        },
      ],
    }
  }

  private mockGenerateDigest(params: { tenantId: string; from: string; to: string }): DigestResult {
    const fromDate = new Date(params.from)
    const toDate = new Date(params.to)
    const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))

    return {
      text: `In the last ${days} days, your organization has seen significant activity across multiple modules. User engagement increased by 23%, with the CRM module showing the highest adoption rate. The Talent ATS processed 47 new applications, and 12 candidates moved to interview stages. Finance module recorded 8 new invoices totaling $124,500. Your team collaborated on 15 projects with 89% on-time completion rate. Security audit logs show no anomalies, and all hash chain verifications passed successfully.`,
      tokens: 512,
      cost: 0.0021,
    }
  }
}

// Export singleton instance
export const aiClient = new AIClient()

// Export class for custom instances
export { AIClient }

async function generateText(options: {
  model: any
  prompt: string
  maxTokens: number
  temperature?: number
}): Promise<{ text: string }> {
  // Placeholder for actual AI text generation logic
  return { text: "{}" }
}
