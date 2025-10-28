# Nino360 HRMS Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- Redis instance (Upstash recommended)
- Vercel account (for deployment)

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`bash
# Database (Supabase)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Redis (Upstash)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Stripe (for billing)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Encryption
ENCRYPTION_KEY= # Generate with: openssl rand -hex 32

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

## Database Setup

1. **Run Database Migrations**

\`\`\`bash
# Execute all SQL scripts in order
npm run db:migrate
\`\`\`

2. **Seed Initial Data**

\`\`\`bash
npm run db:seed
\`\`\`

3. **Verify Tables**

\`\`\`bash
npm run db:verify
\`\`\`

## Local Development

1. **Install Dependencies**

\`\`\`bash
npm install
\`\`\`

2. **Run Development Server**

\`\`\`bash
npm run dev
\`\`\`

3. **Run Tests**

\`\`\`bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test
\`\`\`

## Production Deployment

### Vercel Deployment

1. **Install Vercel CLI**

\`\`\`bash
npm i -g vercel
\`\`\`

2. **Login to Vercel**

\`\`\`bash
vercel login
\`\`\`

3. **Deploy**

\`\`\`bash
# Preview deployment
vercel

# Production deployment
vercel --prod
\`\`\`

4. **Set Environment Variables**

\`\`\`bash
vercel env add POSTGRES_URL
vercel env add SUPABASE_URL
# ... add all environment variables
\`\`\`

### Manual Deployment

1. **Build Application**

\`\`\`bash
npm run build
\`\`\`

2. **Start Production Server**

\`\`\`bash
npm start
\`\`\`

## Post-Deployment

1. **Run Database Migrations**

\`\`\`bash
npm run db:migrate:prod
\`\`\`

2. **Verify Health**

\`\`\`bash
curl https://your-domain.com/api/health
\`\`\`

3. **Monitor Logs**

\`\`\`bash
vercel logs
\`\`\`

## Performance Optimization

1. **Enable Caching**

- Redis caching is automatically enabled
- Configure TTL values in `lib/cache/redis-cache.ts`

2. **Database Optimization**

- Materialized views are created automatically
- Run `REFRESH MATERIALIZED VIEW` periodically

3. **CDN Configuration**

- Static assets are automatically served via Vercel CDN
- Configure custom domain in Vercel dashboard

## Security Checklist

- [ ] All environment variables are set
- [ ] ENCRYPTION_KEY is generated and secure
- [ ] Rate limiting is enabled
- [ ] Audit logging is configured
- [ ] SSL/TLS is enabled
- [ ] CORS is properly configured
- [ ] CSP headers are set

## Monitoring

1. **Application Monitoring**

- Use Vercel Analytics for performance monitoring
- Configure error tracking (Sentry recommended)

2. **Database Monitoring**

- Monitor query performance in Supabase dashboard
- Set up alerts for slow queries

3. **Redis Monitoring**

- Monitor cache hit rates in Upstash dashboard
- Set up alerts for high memory usage

## Backup and Recovery

1. **Database Backups**

\`\`\`bash
# Automated backups via Supabase
# Manual backup
npm run db:backup
\`\`\`

2. **Restore from Backup**

\`\`\`bash
npm run db:restore -- --file=backup.sql
\`\`\`

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

- Verify POSTGRES_URL is correct
- Check database is accessible
- Verify connection pooling settings

2. **Redis Connection Errors**

- Verify KV_REST_API_URL and KV_REST_API_TOKEN
- Check Redis instance is running

3. **Build Errors**

- Clear `.next` directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`

## Support

For deployment support, contact: devops@nino360.com
