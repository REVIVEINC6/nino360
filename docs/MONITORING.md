# Monitoring & Observability Guide

## Overview

Nino360 includes a comprehensive monitoring system for error tracking, performance monitoring, and user analytics.

## Features

- Error tracking and reporting
- Performance monitoring
- User analytics and event tracking
- Custom metrics
- Page view tracking
- User context management

## Setup

### 1. Initialize Monitoring

The monitoring system is automatically initialized in the root layout. No manual setup required.

### 2. Configure Environment Variables

\`\`\`bash
# Optional: Enable monitoring in development
NODE_ENV=production

# Optional: Set sample rate (0.0 to 1.0)
NEXT_PUBLIC_MONITORING_SAMPLE_RATE=1.0

# Optional: Sentry DSN (when ready to integrate)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# Analytics integration should be done server-side via API routes
\`\`\`

## Usage

### Track Custom Events

\`\`\`typescript
import { monitoring } from '@/lib/monitoring'

// Track a user action
monitoring.trackEvent('button_clicked', {
  buttonName: 'Sign Up',
  location: 'homepage'
})

// Track a business event
monitoring.trackEvent('invoice_created', {
  invoiceId: '123',
  amount: 1000,
  currency: 'USD'
})
\`\`\`

### Track Errors

\`\`\`typescript
import { monitoring } from '@/lib/monitoring'

try {
  await riskyOperation()
} catch (error) {
  monitoring.trackError(error as Error, {
    operation: 'riskyOperation',
    userId: user.id
  })
}
\`\`\`

### Set User Context

\`\`\`typescript
import { monitoring } from '@/lib/monitoring'

// After user signs in
monitoring.setUser(user.id, {
  email: user.email,
  tenantId: user.tenantId,
  role: user.role
})

// After user signs out
monitoring.clearUser()
\`\`\`

### Track Performance

\`\`\`typescript
import { monitoring } from '@/lib/monitoring'

// Manual measurement
monitoring.startMeasure('data-load')
await loadData()
monitoring.endMeasure('data-load')

// Or use the HOF
import { withPerformanceTracking } from '@/lib/monitoring'

const loadDataWithTracking = withPerformanceTracking(
  loadData,
  'data-load'
)
\`\`\`

### Track Custom Metrics

\`\`\`typescript
import { monitoring } from '@/lib/monitoring'

monitoring.trackMetric('active_users', 150)
monitoring.trackMetric('api_latency', 250, 'ms')
monitoring.trackMetric('memory_usage', 512, 'MB')
\`\`\`

### Track Page Views (Automatic)

Page views are automatically tracked on route changes. No manual tracking needed.

## Integration with Error Tracking Services

### Sentry Integration

1. Install Sentry:
\`\`\`bash
npm install @sentry/nextjs
\`\`\`

2. Uncomment Sentry initialization in \`lib/monitoring.ts\`:
\`\`\`typescript
if (typeof window !== 'undefined') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: this.config.environment,
    tracesSampleRate: this.config.sampleRate,
  })
}
\`\`\`

3. Add Sentry DSN to environment variables

### Analytics Integration

1. Install your analytics library (e.g., Segment, Mixpanel)

2. Uncomment analytics calls in \`lib/monitoring.ts\`

3. Add analytics credentials to environment variables (server-side only)

**Note**: Analytics write keys should be kept server-side only. Use API routes to send analytics events from the client to avoid exposing sensitive credentials.

Example API route for analytics:
\`\`\`typescript
// app/api/analytics/route.ts
export async function POST(request: Request) {
  const { event, properties } = await request.json()
  
  // Use server-side analytics key
  await analytics.track({
    event,
    properties,
    writeKey: process.env.ANALYTICS_WRITE_KEY // Server-side only
  })
  
  return Response.json({ success: true })
}
\`\`\`

## Best Practices

1. **Track meaningful events**
   - User actions (sign up, sign in, purchase)
   - Business events (invoice created, payment received)
   - Feature usage (report generated, export downloaded)

2. **Include relevant context**
   - User ID and tenant ID
   - Operation names
   - Relevant entity IDs

3. **Don't track sensitive data**
   - Never track passwords or tokens
   - Be careful with PII
   - Mask sensitive fields if necessary

4. **Use appropriate sample rates**
   - 100% for errors
   - Lower rates for high-volume events
   - Adjust based on traffic and budget

5. **Monitor performance**
   - Track slow operations
   - Monitor API latency
   - Track database query times

## Error Boundaries

Error boundaries are automatically added to:
- Root layout (catches all errors)
- Dashboard layout (catches dashboard-specific errors)
- Individual pages (optional, for granular error handling)

### Custom Error Boundaries

\`\`\`typescript
import { ErrorBoundary } from '@/components/error-boundary'

export default function MyPage() {
  return (
    <ErrorBoundary fallback={<CustomErrorUI />}>
      <MyComponent />
    </ErrorBoundary>
  )
}
\`\`\`

## Debugging

### Enable Debug Logs

\`\`\`bash
NEXT_PUBLIC_DEBUG_LOGS=true
\`\`\`

### View Monitoring Events

All monitoring events are logged to the console in development mode.

## Production Checklist

- [ ] Set up Sentry or error tracking service
- [ ] Configure analytics service
- [ ] Set appropriate sample rates
- [ ] Test error tracking
- [ ] Test performance monitoring
- [ ] Verify user context is set correctly
- [ ] Check that sensitive data is not tracked
