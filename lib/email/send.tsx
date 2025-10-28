"use server"

import { emailClient } from "./client"
import { logger } from "@/lib/logger"

/**
 * Email sending utilities
 * Wrapper around email client with common templates
 */

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  cc?: string[]
  bcc?: string[]
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

/**
 * Send email with attachments support
 */
export async function sendEmail(
  params: SendEmailParams,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const result = await emailClient.send(params)

    if (result.success) {
      logger.info("📧 Email sent successfully", {
        to: params.to,
        subject: params.subject,
        messageId: result.messageId,
      })
    }

    return result
  } catch (error) {
    logger.error("Failed to send email", error as Error, {
      to: params.to,
      subject: params.subject,
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send email with PDF attachment
 */
export async function sendEmailWithPDF(params: {
  to: string | string[]
  subject: string
  html: string
  pdfUrl: string
  pdfFilename: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Fetch PDF from URL
    const response = await fetch(params.pdfUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`)
    }

    const pdfBuffer = Buffer.from(await response.arrayBuffer())

    return await sendEmail({
      to: params.to,
      subject: params.subject,
      html: params.html,
      attachments: [
        {
          filename: params.pdfFilename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    })
  } catch (error) {
    logger.error("Failed to send email with PDF", error as Error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send templated email
 */
export async function sendTemplatedEmail(params: {
  to: string | string[]
  template: string
  data: Record<string, any>
  subject: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Load template
    const template = await loadEmailTemplate(params.template)

    // Render template with data
    const html = renderTemplate(template, params.data)

    return await sendEmail({
      to: params.to,
      subject: params.subject,
      html,
    })
  } catch (error) {
    logger.error("Failed to send templated email", error as Error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Load email template
 */
async function loadEmailTemplate(templateName: string): Promise<string> {
  // In production, load from database or file system
  // For now, return basic template
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4F46E5 0%, #A855F7 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>{{title}}</h1>
          </div>
          <div class="content">
            {{content}}
          </div>
          <div class="footer">
            <p>© 2025 Nino360. All rights reserved.</p>
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Render template with data
 */
function renderTemplate(template: string, data: Record<string, any>): string {
  let rendered = template

  for (const [key, value] of Object.entries(data)) {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, "g"), String(value))
  }

  return rendered
}
