"use server"

import { generateText } from "ai"

export async function draftPolicy(prompt: string, context?: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are an HR policy assistant. Draft a professional policy document based on the following request:

${prompt}

${context ? `Additional context: ${context}` : ""}

Format the policy in markdown with clear sections, bullet points, and professional language.`,
    })

    return {
      success: true,
      markdown: text,
    }
  } catch (error) {
    console.error("[v0] draftPolicy error:", error)
    return {
      success: false,
      error: "Failed to draft policy",
    }
  }
}

export async function summarizeDocument(text: string) {
  try {
    const { text: summary } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `Summarize the following document in 2-3 concise paragraphs, highlighting key points and important clauses:

${text}`,
    })

    return {
      success: true,
      summary,
    }
  } catch (error) {
    console.error("[v0] summarizeDocument error:", error)
    return {
      success: false,
      error: "Failed to summarize document",
    }
  }
}

export async function answerDocumentQuestion(question: string, documentText: string) {
  try {
    const { text: answer } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are an HR document assistant. Answer the following question based on the document content:

Question: ${question}

Document:
${documentText}

Provide a clear, accurate answer based only on the information in the document.`,
    })

    return {
      success: true,
      answer,
    }
  } catch (error) {
    console.error("[v0] answerDocumentQuestion error:", error)
    return {
      success: false,
      error: "Failed to answer question",
    }
  }
}
