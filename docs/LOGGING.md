# Logging Guidelines

## Overview

Nino360 uses a structured logging system that provides:
- Environment-based log levels
- Feature flag support for debug logs
- Centralized error handling
- Integration-ready for error tracking services

## Usage

### Import the logger

\`\`\`typescript
import { logger } from '@/lib/logger'
\`\`\`

### Log levels

#### Debug (development only)
\`\`\`typescript
logger.debug('User data loaded', { userId, tenantId })
\`\`\`

#### Info (development only)
\`\`\`typescript
logger.info('API call started', { endpoint: '/api/users' })
\`\`\`

#### Warning (always logged)
\`\`\`typescript
logger.warn('Rate limit approaching', { remaining: 10 })
\`\`\`

#### Error (always logged)
\`\`\`typescript
try {
  await riskyOperation()
} catch (error) {
  logger.error('Operation failed', error, { userId, operation: 'riskyOperation' })
}
\`\`\`

#### Action (user actions, development only)
\`\`\`typescript
logger.action('User signed in', { userId, method: 'password' })
\`\`\`

## Error Handling

### Using the error handler

\`\`\`typescript
import { handleError, getUserErrorMessage } from '@/lib/error-handler'

try {
  await someOperation()
} catch (error) {
  const appError = handleError(error, { context: 'someOperation' })
  return { success: false, error: getUserErrorMessage(appError) }
}
\`\`\`

### Using the error wrapper

\`\`\`typescript
import { withErrorHandling } from '@/lib/error-handler'

export const myAction = withErrorHandling(async (data: FormData) => {
  // Your action code here
  return { success: true }
}, { action: 'myAction' })
\`\`\`

## Error Boundaries

### Component-level error boundary

\`\`\`typescript
import { ErrorBoundary } from '@/components/error-boundary'

export default function MyPage() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  )
}
\`\`\`

### Custom fallback

\`\`\`typescript
<ErrorBoundary fallback={<div>Custom error UI</div>}>
  <MyComponent />
</ErrorBoundary>
\`\`\`

## Environment Variables

### Enable debug logs in production

\`\`\`bash
NEXT_PUBLIC_DEBUG_LOGS=true
\`\`\`

## Migration from console.log

### Before
\`\`\`typescript
console.log('[v0] User loaded:', user)
console.error('[v0] Error loading user:', error)
\`\`\`

### After
\`\`\`typescript
logger.debug('User loaded', { user })
logger.error('Error loading user', error, { userId })
\`\`\`

## Integration with Error Tracking

The logger is ready to integrate with services like Sentry:

\`\`\`typescript
// In lib/logger.ts, uncomment and configure:
if (typeof window !== 'undefined' && window.Sentry) {
  window.Sentry.captureException(error, { extra: context })
}
\`\`\`

## Best Practices

1. **Use appropriate log levels**
   - Debug: Detailed information for debugging
   - Info: General information about application flow
   - Warn: Potential issues that don't stop execution
   - Error: Actual errors that need attention

2. **Include context**
   - Always include relevant IDs (userId, tenantId, etc.)
   - Include operation names
   - Include relevant data (but not sensitive information)

3. **Don't log sensitive data**
   - Never log passwords, tokens, or API keys
   - Be careful with PII (personally identifiable information)
   - Mask sensitive fields if necessary

4. **Use error boundaries**
   - Wrap major sections of your app in error boundaries
   - Provide user-friendly error messages
   - Log errors for debugging

5. **Clean up debug logs**
   - Remove temporary debug logs before committing
   - Use the logger instead of console.log
   - Gate debug logs behind feature flags if needed
\`\`\`
