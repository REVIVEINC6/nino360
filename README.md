# nino360-contacts-v0

Bootstrap of the CRM Contacts service for Nino360. This scaffolding includes DB migrations, Next.js app skeleton, worker scaffolding, and utilities for Field-Level Access Control (FLAC).

See `db/migrations/0001_initial.sql` for the initial schema and RLS examples.

Local dev quick start (requires Docker Postgres or local Postgres):

1. Copy .env.example to .env and fill values.
2. Run migrations: npm run migrate
3. Start dev: npm run dev
4. Start worker: npm run worker
# Nino360 HRMS - Enterprise HR Management System

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/pratap-reddys-projects/v0-nino360-hrms-blueprint)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/H65tqDuVJgx)

## Overview

Nino360 is a comprehensive, multi-tenant SaaS platform for enterprise HR management, combining HRMS, ATS, CRM, Finance, VMS, Project Management, Bench Management, and AI-powered analytics into a single unified system.

### Key Features

- **Multi-Tenant Architecture** - Secure tenant isolation with RLS
- **HRMS** - Employee management, attendance, leave, payroll
- **ATS** - Applicant tracking, job postings, interviews, offers
- **CRM** - Client management, opportunities, pipeline tracking
- **Finance** - Invoicing, expenses, payments, timesheets
- **VMS** - Vendor management, contracts, compliance
- **Projects** - Project tracking, tasks, time management
- **Bench** - Consultant management, marketing, placements
- **Reports** - Advanced analytics with AI copilot
- **Automation** - Workflow automation, webhooks, alerts

### Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS v4
- **Backend**: Next.js Server Actions, API Routes
- **Database**: PostgreSQL (Supabase) with Row Level Security
- **Auth**: Supabase Auth with RBAC/FBAC
- **Payments**: Stripe integration
- **Email**: Resend/SendGrid support
- **AI**: OpenAI/Anthropic integration ready
- **Monitoring**: Sentry-ready error tracking
- **Caching**: SWR + Next.js cache

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase account
- Stripe account (for billing)

### Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd nino360-hrms

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
pnpm db:setup

# Run development server
pnpm dev
\`\`\`

Visit http://localhost:3000

### Environment Variables

See `.env.example` for all required environment variables. Key variables:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key

# Email
EMAIL_PROVIDER=resend
EMAIL_API_KEY=your-email-api-key
EMAIL_FROM=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- [Architecture Overview](docs/ARCHITECTURE.md) - System architecture and design
- [Database Setup](docs/DATABASE_SETUP.md) - Database schema and migrations
- [Supabase Clients](docs/SUPABASE_CLIENTS.md) - Centralized client usage
- [Logging](docs/LOGGING.md) - Logging system and best practices
- [Monitoring](docs/MONITORING.md) - Error tracking and observability
- [Caching](docs/CACHING.md) - Caching strategy and implementation
- [Email Service](docs/EMAIL_SERVICE.md) - Email integration guide
- [AI Integrations](docs/AI_INTEGRATIONS.md) - AI features and setup

## Project Structure

\`\`\`
nino360-hrms/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Main dashboard routes
│   │   ├── admin/          # Admin module
│   │   ├── hrms/           # HRMS module
│   │   ├── talent/         # ATS module
│   │   ├── crm/            # CRM module
│   │   ├── finance/        # Finance module
│   │   ├── vms/            # VMS module
│   │   ├── projects/       # Projects module
│   │   ├── bench/          # Bench module
│   │   ├── reports/        # Reports & analytics
│   │   └── automation/     # Automation module
│   ├── (app)/              # App-level routes
│   │   ├── settings/       # Global settings
│   │   └── profile/        # User profile
│   ├── api/                # API routes
│   └── page.tsx            # Landing page
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components
│   └── [module]/           # Module-specific components
├── lib/                     # Utility libraries
│   ├── supabase/           # Supabase clients
│   ├── email/              # Email service
│   ├── ai/                 # AI integrations
│   ├── logger.ts           # Logging utility
│   ├── monitoring.ts       # Monitoring utility
│   └── cache.ts            # Caching utilities
├── scripts/                 # Database migration scripts
├── docs/                    # Documentation
└── public/                  # Static assets
\`\`\`

## Development

### Available Scripts

\`\`\`bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:setup         # Run all database migrations
pnpm db:migrate       # Run specific migration

# Testing (coming soon)
pnpm test             # Run tests
pnpm test:e2e         # Run E2E tests
\`\`\`

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)
- Zod for runtime validation
- Server-only enforcement for sensitive code

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

### Production Checklist

- [ ] Set up Supabase project and run migrations
- [ ] Configure all environment variables
- [ ] Set up Stripe webhooks
- [ ] Configure email service
- [ ] Set up error monitoring (Sentry)
- [ ] Test critical user flows
- [ ] Enable production logging
- [ ] Configure custom domain
- [ ] Set up SSL certificates (automatic on Vercel)
- [ ] Review security settings

## Security

- Row Level Security (RLS) on all database tables
- RBAC/FBAC for fine-grained access control
- Hash-chained audit logs for compliance
- Input validation with Zod
- HTTPS enforced
- HTTP-only cookies for sessions
- CSRF protection
- Rate limiting via Vercel

## Contributing

This project is built and maintained using [v0.app](https://v0.app). To contribute:

1. Continue building on [v0.app](https://v0.app/chat/projects/H65tqDuVJgx)
2. Changes are automatically synced to this repository
3. Vercel deploys the latest version automatically

## License

Proprietary - All rights reserved

## Support

For issues or questions:
- Check [documentation](docs/)
- Review error logs in Vercel dashboard
- Check Supabase logs for database issues
- Contact support at support@nino360.com

## Deployment

Your project is live at:

**[https://vercel.com/pratap-reddys-projects/v0-nino360-hrms-blueprint](https://vercel.com/pratap-reddys-projects/v0-nino360-hrms-blueprint)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/H65tqDuVJgx](https://v0.app/chat/projects/H65tqDuVJgx)**
