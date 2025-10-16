# AI Integrations Guide

## Overview

Nino360 includes AI-powered features across multiple modules:

- **Resume Parsing** - Extract structured data from resumes
- **JD Generation** - Generate job descriptions from requirements
- **Candidate Matching** - Match candidates to jobs using AI
- **Offer Letter Generation** - Create personalized offer letters
- **RAG System** - Query company documents with AI
- **Document Embeddings** - Index documents for semantic search

## Architecture

### AI Client

The centralized AI client (`lib/ai/client.ts`) provides a unified interface for all AI operations.

\`\`\`typescript
import { aiClient } from '@/lib/ai/client'

// Parse resume
const parsed = await aiClient.parseResume(resumeText)

// Generate JD
const jd = await aiClient.generateJD({
  title: 'Senior Engineer',
  company: 'Acme Corp'
})

// Match candidates
const matches = await aiClient.matchCandidates(jobId, candidateIds)
\`\`\`

### Mock Mode

By default, the AI client runs in mock mode for development. This allows you to:
- Test AI features without API keys
- Develop UI/UX without external dependencies
- Preview AI responses with realistic data

## Production Setup

### 1. Choose AI Provider

Set your AI provider in environment variables:

\`\`\`bash
AI_PROVIDER=openai  # or anthropic, groq
AI_API_KEY=your-api-key
AI_MODEL=gpt-4      # or claude-3-opus, llama-3-70b
\`\`\`

### 2. Implement AI Routes

Create API routes for each AI operation:

\`\`\`typescript
// app/api/ai/parse-resume/route.ts
import { aiClient } from '@/lib/ai/client'

export async function POST(request: Request) {
  const { text } = await request.json()
  const result = await aiClient.parseResume(text)
  return Response.json(result)
}
\`\`\`

### 3. Update AI Client

Replace mock implementations with actual API calls:

\`\`\`typescript
// In lib/ai/client.ts
async parseResume(resumeText: string): Promise<ResumeParseResult> {
  if (this.config.provider === 'mock') {
    return this.mockParseResume(resumeText)
  }
  
  // Actual implementation
  const response = await fetch('/api/ai/parse-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: resumeText })
  })
  
  return response.json()
}
\`\`\`

### 4. Deploy Edge Functions (Optional)

For better performance, deploy AI operations as edge functions:

\`\`\`typescript
// edge-functions/parse-resume.ts
export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  const { text } = await req.json()
  
  // Call AI provider
  const result = await parseWithAI(text)
  
  return new Response(JSON.stringify(result))
}
\`\`\`

## AI Features by Module

### Talent/ATS Module

#### Resume Parsing

\`\`\`typescript
import { aiClient } from '@/lib/ai/client'

export async function uploadResume(file: File) {
  const text = await file.text()
  const parsed = await aiClient.parseResume(text)
  
  // Create candidate from parsed data
  await createCandidate({
    name: parsed.name,
    email: parsed.email,
    skills: parsed.skills,
    // ... other fields
  })
}
\`\`\`

#### JD Generation

\`\`\`typescript
import { aiClient } from '@/lib/ai/client'

export async function generateJobDescription(title: string) {
  const jd = await aiClient.generateJD({
    title,
    company: 'Your Company'
  })
  
  return jd
}
\`\`\`

#### Candidate Matching

\`\`\`typescript
import { aiClient } from '@/lib/ai/client'

export async function matchCandidatesToJob(jobId: string) {
  const candidates = await getCandidates()
  const candidateIds = candidates.map(c => c.id)
  
  const matches = await aiClient.matchCandidates(jobId, candidateIds)
  
  // Sort by score
  return matches.sort((a, b) => b.score - a.score)
}
\`\`\`

#### Offer Letter Generation

\`\`\`typescript
import { aiClient } from '@/lib/ai/client'

export async function generateOffer(candidateId: string, jobId: string) {
  const candidate = await getCandidate(candidateId)
  const job = await getJob(jobId)
  
  const offer = await aiClient.generateOfferLetter({
    candidateName: candidate.name,
    position: job.title,
    salary: job.salary,
    startDate: '2024-03-01',
    companyName: 'Your Company'
  })
  
  return offer
}
\`\`\`

### Tenant Module

#### RAG System

\`\`\`typescript
import { aiClient } from '@/lib/ai/client'

// Query documents
export async function queryDocuments(query: string, tenantId: string) {
  const result = await aiClient.queryRAG(query, tenantId)
  return result
}

// Embed new document
export async function indexDocument(documentId: string, content: string, tenantId: string) {
  await aiClient.embedDocument(documentId, content, tenantId)
}
\`\`\`

### Bench Module

#### Consultant Recommendations

\`\`\`typescript
import { aiClient } from '@/lib/ai/client'

export async function recommendConsultants(jobRequirements: string[]) {
  const consultants = await getAvailableConsultants()
  
  // Use AI to match consultants to requirements
  const matches = await aiClient.matchCandidates(
    'job-requirements',
    consultants.map(c => c.id)
  )
  
  return matches
}
\`\`\`

## Cost Optimization

### 1. Caching

Cache AI responses to reduce API calls:

\`\`\`typescript
import { cached, CACHE_CONFIG } from '@/lib/cache'

const cachedParseResume = cached(
  aiClient.parseResume,
  ['ai', 'parse-resume'],
  { revalidate: CACHE_CONFIG.VERY_LONG }
)
\`\`\`

### 2. Batch Processing

Process multiple items in a single API call:

\`\`\`typescript
async function batchMatchCandidates(jobs: Job[]) {
  const allCandidates = await getCandidates()
  
  // Match all jobs in one call
  const results = await Promise.all(
    jobs.map(job => 
      aiClient.matchCandidates(job.id, allCandidates.map(c => c.id))
    )
  )
  
  return results
}
\`\`\`

### 3. Streaming Responses

For long-form content, use streaming:

\`\`\`typescript
async function* streamJDGeneration(title: string) {
  const stream = await fetch('/api/ai/generate-jd-stream', {
    method: 'POST',
    body: JSON.stringify({ title })
  })
  
  const reader = stream.body?.getReader()
  // ... stream processing
}
\`\`\`

## Testing

### Unit Tests

\`\`\`typescript
import { AIClient } from '@/lib/ai/client'

describe('AIClient', () => {
  it('should parse resume', async () => {
    const client = new AIClient({ provider: 'mock' })
    const result = await client.parseResume('resume text')
    
    expect(result.name).toBeDefined()
    expect(result.skills).toBeInstanceOf(Array)
  })
})
\`\`\`

### Integration Tests

\`\`\`typescript
describe('Resume Upload Flow', () => {
  it('should parse and create candidate', async () => {
    const file = new File(['resume content'], 'resume.pdf')
    await uploadResume(file)
    
    const candidates = await getCandidates()
    expect(candidates).toHaveLength(1)
  })
})
\`\`\`

## Monitoring

Track AI usage and costs:

\`\`\`typescript
import { monitoring } from '@/lib/monitoring'

// Track AI operations
monitoring.trackEvent('ai_operation', {
  operation: 'parse_resume',
  provider: 'openai',
  model: 'gpt-4',
  tokens: 1500,
  cost: 0.03
})
\`\`\`

## Security

### 1. API Key Management

- Store API keys in environment variables
- Never commit keys to version control
- Rotate keys regularly
- Use different keys for dev/prod

### 2. Rate Limiting

Implement rate limiting for AI endpoints:

\`\`\`typescript
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  await rateLimit(request, { max: 10, window: '1m' })
  
  // ... AI operation
}
\`\`\`

### 3. Input Validation

Always validate and sanitize inputs:

\`\`\`typescript
import { z } from 'zod'

const resumeSchema = z.object({
  text: z.string().max(50000),
  format: z.enum(['pdf', 'docx', 'txt'])
})

export async function parseResume(input: unknown) {
  const validated = resumeSchema.parse(input)
  return aiClient.parseResume(validated.text)
}
\`\`\`

## Troubleshooting

### AI responses are slow

- Use edge functions for lower latency
- Implement caching for repeated queries
- Consider smaller/faster models for simple tasks

### High API costs

- Implement aggressive caching
- Use batch processing
- Set token limits
- Monitor usage with alerts

### Inaccurate results

- Improve prompts with examples
- Use higher-quality models
- Implement result validation
- Add human review for critical operations

## Production Checklist

- [ ] Choose AI provider and set up account
- [ ] Add API keys to environment variables
- [ ] Implement actual AI routes
- [ ] Replace mock implementations
- [ ] Set up caching strategy
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Set up monitoring and alerts
- [ ] Test all AI features
- [ ] Document AI prompts and models used
\`\`\`
