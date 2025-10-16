# Nino360 HRMS - Deployment Guide

## Overview

This guide covers deploying Nino360 HRMS to production on Vercel with Supabase as the database.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Vercel account
- Supabase project
- Stripe account (for billing)
- Email service account (Resend or SendGrid)

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd nino360-hrms
pnpm install
\`\`\`

### 2. Set Up Environment Variables

Create a `.env.local` file:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (auto-configured by Supabase)
POSTGRES_URL=your-postgres-url
POSTGRES_PRISMA_URL=your-postgres-prisma-url
POSTGRES_URL_NON_POOLING=your-postgres-non-pooling-url

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email (choose one provider)
EMAIL_PROVIDER=resend  # or sendgrid or mock
EMAIL_API_KEY=your-email-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Nino360

# AI (optional)
AI_PROVIDER=openai  # or anthropic, groq, etc.
AI_API_KEY=your-ai-api-key
AI_MODEL=gpt-4

# Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_MONITORING_SAMPLE_RATE=1.0

# Debug (development only)
NEXT_PUBLIC_DEBUG_LOGS=false
\`\`\`

### 3. Set Up Database

Run the database setup script:

\`\`\`bash
pnpm db:setup
\`\`\`

Or manually run the SQL scripts in order:
1. `scripts/00-complete-setup.sql` - Complete database schema
2. Or run individual scripts in numerical order

### 4. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Visit http://localhost:3000

## Production Deployment

### Deploy to Vercel

1. **Connect Repository**
   \`\`\`bash
   vercel
   \`\`\`

2. **Configure Environment Variables**
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add all environment variables from `.env.local`
   - Make sure to set `NEXT_PUBLIC_APP_URL` to your production domain

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Post-Deployment Steps

1. **Set Up Stripe Webhooks**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET` env var

2. **Configure Email DNS**
   - Add SPF, DKIM, and DMARC records for your email provider
   - Verify domain in email service dashboard

3. **Test Critical Flows**
   - Sign up / Sign in
   - Tenant creation
   - Billing checkout
   - Email sending
   - AI features (if enabled)

## Database Migrations

### Running Migrations

\`\`\`bash
# Run all migrations
pnpm db:setup

# Or run specific migration
psql $POSTGRES_URL -f scripts/01-create-tables.sql
\`\`\`

### Creating New Migrations

1. Create a new SQL file in `scripts/` with a number prefix
2. Add your schema changes
3. Test locally first
4. Run in production

## Monitoring & Observability

### Set Up Sentry (Recommended)

1. Install Sentry:
   \`\`\`bash
   pnpm add @sentry/nextjs
   \`\`\`

2. Initialize Sentry:
   \`\`\`bash
   npx @sentry/wizard@latest -i nextjs
   \`\`\`

3. Add `NEXT_PUBLIC_SENTRY_DSN` to environment variables

### Enable Debug Logs

For troubleshooting, enable debug logs:
\`\`\`bash
NEXT_PUBLIC_DEBUG_LOGS=true
\`\`\`

## Performance Optimization

### Enable Caching

The app uses SWR for client-side caching and Next.js cache for server-side. No additional configuration needed.

### Database Optimization

1. **Enable Connection Pooling**
   - Use `POSTGRES_PRISMA_URL` for pooled connections
   - Use `POSTGRES_URL_NON_POOLING` for migrations

2. **Add Indexes**
   - Indexes are included in migration scripts
   - Monitor slow queries and add indexes as needed

3. **Enable RLS**
   - Row Level Security policies are included in migrations
   - Verify RLS is enabled on all tables

## Security Checklist

- [ ] All environment variables are set
- [ ] RLS policies are enabled on all tables
- [ ] Stripe webhook secret is configured
- [ ] Email domain is verified
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled (via Vercel)
- [ ] Sensitive data is not logged
- [ ] Error tracking is set up

## Troubleshooting

### Database Connection Issues

\`\`\`bash
# Test database connection
psql $POSTGRES_URL -c "SELECT version();"
\`\`\`

### Build Failures

\`\`\`bash
# Clear cache and rebuild
rm -rf .next
pnpm build
\`\`\`

### Email Not Sending

1. Check `EMAIL_PROVIDER` is set correctly
2. Verify API key is valid
3. Check email service dashboard for errors
4. Enable debug logs to see email attempts

### Stripe Webhook Failures

1. Verify webhook secret matches Stripe dashboard
2. Check webhook endpoint is accessible
3. Review Stripe webhook logs in dashboard

## Scaling Considerations

### Database

- Supabase automatically scales with your plan
- Consider upgrading to Pro plan for production
- Enable read replicas for high traffic

### Application

- Vercel automatically scales based on traffic
- Consider upgrading to Pro plan for better performance
- Enable Edge Functions for global distribution

### Monitoring

- Set up alerts for errors and performance issues
- Monitor database query performance
- Track API response times

## Backup & Recovery

### Database Backups

Supabase provides automatic daily backups. To create manual backup:

\`\`\`bash
pg_dump $POSTGRES_URL > backup.sql
\`\`\`

### Restore from Backup

\`\`\`bash
psql $POSTGRES_URL < backup.sql
\`\`\`

## Support

For issues or questions:
- Check documentation in `/docs`
- Review error logs in Vercel dashboard
- Check Supabase logs for database issues
- Contact support at support@nino360.com
