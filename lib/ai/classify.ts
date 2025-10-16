"use server"

import { generateObject } from "ai"
import { z } from "zod"

const classificationSchema = z.object({
  kind: z.enum(["CONTRACT", "POLICY", "OFFER", "ID", "I9", "VISA", "BENEFIT", "OTHER"]),
  tags: z.array(z.string()).describe("Relevant tags for the document"),
  hasPII: z.boolean().describe("Whether the document contains PII (SSN, passport, etc.)"),
  retentionCategory: z.string().optional().describe("Suggested retention category"),
  confidence: z.number().min(0).max(1).describe("Confidence score for classification"),
})

export async function classifyDocument(fileData: string, filename: string, mimeType: string) {
  try {
    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4.5",
      schema: classificationSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Classify this document and extract relevant metadata. Identify the document type, suggest tags, detect PII, and recommend a retention category.",
            },
            {
              type: "file",
              data: fileData,
              mediaType: mimeType,
              filename,
            },
          ],
        },
      ],
    })

    return {
      success: true,
      classification: object,
    }
  } catch (error) {
    console.error("[v0] classifyDocument error:", error)
    return {
      success: false,
      error: "Failed to classify document",
    }
  }
}

export async function extractDocumentText(fileData: string, filename: string, mimeType: string) {
  try {
    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4.5",
      schema: z.object({
        text: z.string().describe("Extracted text from the document"),
        language: z.string().describe("Detected language"),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all text from this document using OCR.",
            },
            {
              type: "file",
              data: fileData,
              mediaType: mimeType,
              filename,
            },
          ],
        },
      ],
    })

    return {
      success: true,
      text: object.text,
      language: object.language,
    }
  } catch (error) {
    console.error("[v0] extractDocumentText error:", error)
    return {
      success: false,
      error: "Failed to extract text",
    }
  }
}
