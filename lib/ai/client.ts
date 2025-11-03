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
 *
 * Current implementation is a mock that returns heuristic fields extracted
 * from the URL and a tiny deterministic sample set. Replace with real LLM
 * + extractor pipeline when integrating a provider.
 */
export async function parseResumeFromUrl(url: string, opts: AiClientOptions = DEFAULT_OPTIONS): Promise<CandidateParseResult> {
  if (!url) throw new Error("resume url required")

  if (opts.provider === "mock") {
    // Simple deterministic mock for local development / tests.
    const nameMatch = url.match(/([A-Za-z]+)-([A-Za-z]+)/)
    const name = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : "Extracted Name"
    return {
      full_name: name,
      email: `${name.replace(/\s+/g, ".").toLowerCase()}@example.com`,
      phone: "+1-555-0100",
      skills: ["JavaScript", "TypeScript", "React"],
      summary: "(Mock) Experienced software engineer with frontend and backend experience.",
      experience: [],
      education: [],
      resume_url: url,
    }
  }

  // TODO: Implement provider-based parsing. Example steps:
  // 1) Fetch PDF/DOCX, extract text (pdf-parse / mammoth)
  // 2) Chunk + embed or send to LLM extraction prompt
  // 3) Validate/normalize output according to CandidateParseResult

  // For now, fallback to the mock behaviour.
  return parseResumeFromUrl(url, { provider: "mock" })
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

    if (this.config.provider === "mock") {
      return this.mockParseResume(resumeText)
    }

    // TODO: Implement actual AI parsing
    // const response = await fetch('/api/ai/parse-resume', {
    //   method: 'POST',
    //   body: JSON.stringify({ text: resumeText })
    // })
    // return response.json()

    return this.mockParseResume(resumeText)
  }

  /**
   * Generate job description
   */
  async generateJD(params: { title: string; company: string; requirements?: string[] }): Promise<JDGenerationResult> {
    logger.info("Generating JD", { provider: this.config.provider, title: params.title })

    if (this.config.provider === "mock") {
      return this.mockGenerateJD(params)
    }

    // TODO: Implement actual AI generation
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

    if (this.config.provider === "mock") {
      return this.mockMatchCandidates(candidateIds)
    }

    // TODO: Implement actual AI matching
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
