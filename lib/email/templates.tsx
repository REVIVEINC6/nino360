"use server"

import { logger } from "@/lib/logger"

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface InviteEmailData {
  inviterName: string
  organizationName: string
  inviteUrl: string
  expiresIn: string
}

interface WelcomeEmailData {
  userName: string
  organizationName: string
  loginUrl: string
}

interface PasswordResetEmailData {
  userName: string
  resetUrl: string
  expiresIn: string
}

interface NotificationEmailData {
  userName: string
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}

/**
 * Generate invitation email template
 */
export async function generateInviteEmail(data: InviteEmailData): Promise<EmailTemplate> {
  const { inviterName, organizationName, inviteUrl, expiresIn } = data

  const subject = `You've been invited to join ${organizationName} on Nino360`

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6366f1; font-size: 24px; margin-bottom: 16px;">
        You've been invited!
      </h1>
      <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        ${inviterName} has invited you to join <strong>${organizationName}</strong> on Nino360.
      </p>
      <a href="${inviteUrl}" 
         style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; font-weight: 500;">
        Accept Invitation
      </a>
      <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
        This invitation expires in ${expiresIn}. If you didn't expect this invitation, you can safely ignore this email.
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="${inviteUrl}" style="color: #6366f1;">${inviteUrl}</a>
      </p>
    </div>
  `

  const text = `
You've been invited to join ${organizationName} on Nino360!

${inviterName} has invited you to join their organization.

Accept your invitation by visiting: ${inviteUrl}

This invitation expires in ${expiresIn}. If you didn't expect this invitation, you can safely ignore this email.
  `.trim()

  return { subject, html, text }
}

/**
 * Generate welcome email template
 */
export async function generateWelcomeEmail(data: WelcomeEmailData): Promise<EmailTemplate> {
  const { userName, organizationName, loginUrl } = data

  const subject = `Welcome to ${organizationName} on Nino360!`

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6366f1; font-size: 24px; margin-bottom: 16px;">
        Welcome to Nino360! 🎉
      </h1>
      <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        Hi ${userName},<br/><br/>
        Welcome to <strong>${organizationName}</strong>! Your account has been successfully created.
      </p>
      <a href="${loginUrl}" 
         style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; font-weight: 500;">
        Get Started
      </a>
      <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
        If you have any questions, feel free to reach out to your administrator.
      </p>
    </div>
  `

  const text = `
Welcome to ${organizationName} on Nino360!

Hi ${userName},

Your account has been successfully created. Get started by logging in at: ${loginUrl}

If you have any questions, feel free to reach out to your administrator.
  `.trim()

  return { subject, html, text }
}

/**
 * Generate password reset email template
 */
export async function generatePasswordResetEmail(data: PasswordResetEmailData): Promise<EmailTemplate> {
  const { userName, resetUrl, expiresIn } = data

  const subject = "Reset your Nino360 password"

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6366f1; font-size: 24px; margin-bottom: 16px;">
        Reset your password
      </h1>
      <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        Hi ${userName},<br/><br/>
        We received a request to reset your password. Click the button below to create a new password.
      </p>
      <a href="${resetUrl}" 
         style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; font-weight: 500;">
        Reset Password
      </a>
      <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
        This link expires in ${expiresIn}. If you didn't request a password reset, you can safely ignore this email.
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="${resetUrl}" style="color: #6366f1;">${resetUrl}</a>
      </p>
    </div>
  `

  const text = `
Reset your Nino360 password

Hi ${userName},

We received a request to reset your password. Reset your password by visiting: ${resetUrl}

This link expires in ${expiresIn}. If you didn't request a password reset, you can safely ignore this email.
  `.trim()

  return { subject, html, text }
}

/**
 * Generate notification email template
 */
export async function generateNotificationEmail(data: NotificationEmailData): Promise<EmailTemplate> {
  const { userName, title, message, actionUrl, actionText } = data

  const subject = title

  const actionButton = actionUrl
    ? `
      <a href="${actionUrl}" 
         style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 16px;">
        ${actionText || "View Details"}
      </a>
    `
    : ""

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6366f1; font-size: 24px; margin-bottom: 16px;">
        ${title}
      </h1>
      <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        Hi ${userName},<br/><br/>
        ${message}
      </p>
      ${actionButton}
    </div>
  `

  const text = `
${title}

Hi ${userName},

${message}

${actionUrl ? `View details: ${actionUrl}` : ""}
  `.trim()

  return { subject, html, text }
}

/**
 * Wrap email content in branded HTML wrapper
 */
export async function wrapEmailHtml(content: string): Promise<string> {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nino360</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 32px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #6366f1; font-size: 32px; font-weight: bold; margin: 0;">
          Nino360
        </h1>
        <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">
          Enterprise HRMS Platform
        </p>
      </div>
      ${content}
      <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Nino360. All rights reserved.
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
          <a href="https://nino360.com" style="color: #6366f1; text-decoration: none;">Visit our website</a> | 
          <a href="https://nino360.com/support" style="color: #6366f1; text-decoration: none;">Get support</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Log email template generation
 */
function logTemplateGeneration(templateType: string, data: any) {
  logger.info(`Generated ${templateType} email template`, {
    templateType,
    dataKeys: Object.keys(data),
  })
}
