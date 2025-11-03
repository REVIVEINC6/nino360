"use server"

/**
 * Email service client
 * Supports multiple providers: Resend, SendGrid
 */

import { logger } from "@/lib/logger"

export type EmailProvider = "resend" | "sendgrid" | "mock"

interface EmailConfig {
  provider: EmailProvider
  apiKey?: string
  from: string
  fromName: string
}

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  cc?: string[]
  bcc?: string[]
}

class EmailClient {
  private config: EmailConfig

  constructor() {
    this.config = {
      provider: (process.env.EMAIL_PROVIDER as EmailProvider) || "mock",
      apiKey: process.env.EMAIL_API_KEY,
      from: process.env.EMAIL_FROM || "noreply@nino360.com",
      fromName: process.env.EMAIL_FROM_NAME || "Nino360",
    }
  }

  /**
   * Send an email
   */
  async send(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { to, subject, html, text, replyTo, cc, bcc } = params

    // Mock mode for development
    if (this.config.provider === "mock") {
      logger.info("📧 Mock email sent", {
        to,
        subject,
        from: `${this.config.fromName} <${this.config.from}>`,
      })
      return { success: true, messageId: `mock-${Date.now()}` }
    }

    try {
      switch (this.config.provider) {
        case "resend":
          return await this.sendWithResend(params)
        case "sendgrid":
          return await this.sendWithSendGrid(params)
        default:
          throw new Error(`Unsupported email provider: ${this.config.provider}`)
      }
    } catch (error) {
      logger.error("Failed to send email", error as Error, { to, subject })
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Send email using Resend
   */
  private async sendWithResend(params: SendEmailParams) {
    if (!this.config.apiKey) {
      throw new Error("Resend API key not configured")
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${this.config.fromName} <${this.config.from}>`,
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
        reply_to: params.replyTo,
        cc: params.cc,
        bcc: params.bcc,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to send email with Resend")
    }

    const data = await response.json()
    return { success: true, messageId: data.id }
  }

  /**
   * Send email using SendGrid
   */
  private async sendWithSendGrid(params: SendEmailParams) {
    if (!this.config.apiKey) {
      throw new Error("SendGrid API key not configured")
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: Array.isArray(params.to) ? params.to.map((email) => ({ email })) : [{ email: params.to }],
            cc: params.cc?.map((email) => ({ email })),
            bcc: params.bcc?.map((email) => ({ email })),
          },
        ],
        from: {
          email: this.config.from,
          name: this.config.fromName,
        },
        reply_to: params.replyTo ? { email: params.replyTo } : undefined,
        subject: params.subject,
        content: [
          {
            type: "text/html",
            value: params.html,
          },
          ...(params.text
            ? [
                {
                  type: "text/plain",
                  value: params.text,
                },
              ]
            : []),
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.errors?.[0]?.message || "Failed to send email with SendGrid")
    }

    return { success: true, messageId: response.headers.get("x-message-id") || undefined }
  }
}

export const emailClient = new EmailClient()
