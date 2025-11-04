# Email Service Guide

## Overview

Nino360 includes a comprehensive email service for sending transactional and marketing emails.

## Features

- Multiple provider support (Resend, SendGrid)
- Template-based emails
- Bulk email sending
- Attachment support
- Mock mode for development
- HTML and plain text emails

## Setup

### 1. Choose Email Provider

Set your email provider in environment variables:

\`\`\`bash
EMAIL_PROVIDER=resend  # or sendgrid, mock
EMAIL_API_KEY=your-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME="Your Company"
\`\`\`

### 2. Configure DNS (Production)

For production, configure your domain's DNS records:

#### For Resend:
- Add SPF record
- Add DKIM record
- Verify domain in Resend dashboard

#### For SendGrid:
- Add SPF record
- Add DKIM records
- Verify domain in SendGrid dashboard

## Usage

### Send Simple Email

\`\`\`typescript
import { emailClient } from '@/lib/email/client'

await emailClient.send({
  to: 'user@example.com',
  subject: 'Welcome to Nino360',
  html: '<h1>Welcome!</h1><p>Thanks for joining.</p>',
  text: 'Welcome! Thanks for joining.'
})
\`\`\`

### Send Template Email

\`\`\`typescript
import { emailClient } from '@/lib/email/client'

await emailClient.sendTemplate(
  'user-invite',
  'user@example.com',
  {
    companyName: 'Acme Corp',
    inviteLink: 'https://app.nino360.com/accept-invite/abc123'
  }
)
\`\`\`

### Send Bulk Emails

\`\`\`typescript
import { emailClient } from '@/lib/email/client'

const emails = users.map(user => ({
  to: user.email,
  subject: 'Monthly Newsletter',
  html: generateNewsletterHTML(user)
}))

await emailClient.sendBulk(emails)
\`\`\`

### Send with Attachments

\`\`\`typescript
import { emailClient } from '@/lib/email/client'

await emailClient.send({
  to: 'user@example.com',
  subject: 'Your Invoice',
  html: '<p>Please find your invoice attached.</p>',
  attachments: [
    {
      filename: 'invoice.pdf',
      content: pdfBuffer,
      contentType: 'application/pdf'
    }
  ]
})
\`\`\`

## Email Templates

### Available Templates

- \`user-invite\` - User invitation email
- \`vendor-invite\` - Vendor portal invitation
- \`candidate-interview\` - Interview scheduled notification
- \`offer-letter\` - Job offer email
- \`password-reset\` - Password reset email

### Using Template Helpers

\`\`\`typescript
import { userInviteEmail } from '@/lib/email/templates'
import { emailClient } from '@/lib/email/client'

const email = userInviteEmail({
  companyName: 'Acme Corp',
  inviteLink: 'https://app.nino360.com/accept-invite/abc123'
})

await emailClient.send({
  to: 'user@example.com',
  ...email
})
\`\`\`

### Creating Custom Templates

\`\`\`typescript
import { wrapEmailHTML } from '@/lib/email/templates'

function customEmail(data: any) {
  const content = \`
    <h2>Custom Email</h2>
    <p>\${data.message}</p>
  \`
  
  return {
    subject: data.subject,
    html: wrapEmailHTML(content),
    text: data.message
  }
}
\`\`\`

## Integration Examples

### User Invitation

\`\`\`typescript
'use server'

import { emailClient } from '@/lib/email/client'
import { createServerClient } from '@/lib/supabase/server'

export async function inviteUser(email: string, tenantId: string) {
  const supabase = await createServerClient()
  
  // Create invitation
  const { data: invitation } = await supabase
    .from('invitations')
    .insert({ email, tenant_id: tenantId })
    .select()
    .single()
  
  // Send email
  await emailClient.sendTemplate('user-invite', email, {
    companyName: 'Your Company',
    inviteLink: \`\${process.env.NEXT_PUBLIC_APP_URL}/accept-invite/\${invitation.token}\`
  })
  
  return { success: true }
}
\`\`\`

### Interview Notification

\`\`\`typescript
'use server'

import { emailClient } from '@/lib/email/client'
import { interviewScheduledEmail } from '@/lib/email/templates'

export async function scheduleInterview(candidateEmail: string, details: any) {
  const email = interviewScheduledEmail({
    position: details.position,
    date: details.date,
    time: details.time,
    location: details.location
  })
  
  await emailClient.send({
    to: candidateEmail,
    ...email
  })
  
  return { success: true }
}
\`\`\`

### Password Reset

\`\`\`typescript
'use server'

import { emailClient } from '@/lib/email/client'
import { passwordResetEmail } from '@/lib/email/templates'

export async function sendPasswordReset(email: string) {
  const supabase = await createServerClient()
  
  // Generate reset token
  const { data } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: \`\${process.env.NEXT_PUBLIC_APP_URL}/reset-password\`
  })
  
  // Note: Supabase sends its own email, but you can customize it
  // by disabling Supabase emails and sending your own
  
  return { success: true }
}
\`\`\`

## Mock Mode

In development, emails are logged instead of sent:

\`\`\`bash
EMAIL_PROVIDER=mock
\`\`\`

Mock emails appear in the console:

\`\`\`
[INFO] Mock email sent {
  to: 'user@example.com',
  subject: 'Welcome to Nino360',
  from: { email: 'noreply@nino360.com', name: 'Nino360' }
}
\`\`\`

## Error Handling

\`\`\`typescript
import { emailClient } from '@/lib/email/client'
import { logger } from '@/lib/logger'

const result = await emailClient.send({
  to: 'user@example.com',
  subject: 'Test',
  html: '<p>Test</p>'
})

if (!result.success) {
  logger.error('Failed to send email', new Error(result.error))
  // Handle error (retry, notify admin, etc.)
}
\`\`\`

## Rate Limiting

Implement rate limiting for email endpoints:

\`\`\`typescript
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  // Limit to 10 emails per minute per user
  await rateLimit(request, { max: 10, window: '1m' })
  
  // Send email
  await emailClient.send(...)
}
\`\`\`

## Monitoring

Track email delivery:

\`\`\`typescript
import { monitoring } from '@/lib/monitoring'

const result = await emailClient.send(...)

monitoring.trackEvent('email_sent', {
  success: result.success,
  provider: 'resend',
  template: 'user-invite',
  messageId: result.messageId
})
\`\`\`

## Best Practices

1. **Always provide plain text alternative**
   - Not all email clients support HTML
   - Better for accessibility

2. **Use templates for consistency**
   - Maintain brand consistency
   - Easier to update
   - Better testing

3. **Handle failures gracefully**
   - Implement retry logic
   - Log failures
   - Notify admins of critical failures

4. **Respect user preferences**
   - Check notification settings
   - Provide unsubscribe links
   - Honor opt-outs

5. **Test thoroughly**
   - Test in multiple email clients
   - Check spam scores
   - Verify links work

6. **Monitor deliverability**
   - Track bounce rates
   - Monitor spam complaints
   - Check sender reputation

## Troubleshooting

### Emails not being delivered

- Check spam folder
- Verify DNS records
- Check sender reputation
- Verify API key is correct

### Emails marked as spam

- Add SPF/DKIM records
- Avoid spam trigger words
- Include unsubscribe link
- Warm up new domains gradually

### High bounce rate

- Validate email addresses before sending
- Remove invalid addresses
- Check for typos
- Verify domain exists

## Production Checklist

- [ ] Choose email provider
- [ ] Set up account and get API key
- [ ] Configure DNS records (SPF, DKIM)
- [ ] Verify domain
- [ ] Add environment variables
- [ ] Test email delivery
- [ ] Set up monitoring
- [ ] Implement rate limiting
- [ ] Create email templates
- [ ] Test in multiple email clients
- [ ] Set up bounce handling
- [ ] Configure unsubscribe handling
\`\`\`
