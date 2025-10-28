import type React from "react"
;("use server")

import { put } from "@vercel/blob"
import { computeFileHash } from "@/lib/ledger/notarize"

/**
 * PDF Generation Service
 * Generates PDFs from HTML content and uploads to Vercel Blob
 */

interface GeneratePDFParams {
  html: string
  filename: string
  metadata?: Record<string, any>
}

interface PDFResult {
  url: string
  sha256: string
  size: number
}

/**
 * Generate PDF from HTML content
 * Uses Puppeteer for server-side rendering
 */
export async function generatePDF(params: GeneratePDFParams): Promise<PDFResult> {
  const { html, filename, metadata } = params

  try {
    const puppeteer = await import("puppeteer")

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    })

    await browser.close()

    // Upload to Vercel Blob
    const { url } = await put(filename, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: true,
    })

    // Compute SHA256 hash
    const sha256 = await computeFileHash(pdfBuffer)

    return {
      url,
      sha256,
      size: pdfBuffer.length,
    }
  } catch (error) {
    console.error("[v0] PDF generation error:", error)
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Generate PDF from React component
 * Alternative approach using @react-pdf/renderer
 */
export async function generatePDFFromComponent(component: React.ReactElement, filename: string): Promise<PDFResult> {
  try {
    const ReactPDF = await import("@react-pdf/renderer")

    const stream = await ReactPDF.renderToStream(component)
    const chunks: Buffer[] = []

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk))
    }

    const pdfBuffer = Buffer.concat(chunks)

    // Upload to Vercel Blob
    const { url } = await put(filename, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: true,
    })

    // Compute SHA256 hash
    const sha256 = await computeFileHash(pdfBuffer)

    return {
      url,
      sha256,
      size: pdfBuffer.length,
    }
  } catch (error) {
    console.error("[v0] PDF generation error:", error)
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
