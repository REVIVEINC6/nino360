# Authentication System Testing Guide

## Overview

This guide covers testing strategies for the Nino360 authentication system.

## Test Structure

\`\`\`
__tests__/
├── auth/
│   ├── registration.test.ts
│   ├── login.test.ts
│   ├── mfa.test.ts
│   ├── password-reset.test.ts
│   └── oauth.test.ts
├── security/
│   ├── rate-limiter.test.ts
│   ├── csrf.test.ts
│   ├── audit-logger.test.ts
│   └── ai-anomaly-detection.test.ts
└── authorization/
    ├── rbac.test.ts
    ├── flac.test.ts
    └── policy-engine.test.ts
\`\`\`

## Running Tests

### Unit Tests
\`\`\`bash
npm run test
\`\`\`

### Integration Tests
\`\`\`bash
npm run test:integration
\`\`\`

### Coverage Report
\`\`\`bash
npm run test:coverage
\`\`\`

### Watch Mode
\`\`\`bash
npm run test:watch
\`\`\`

## Performance Testing

### Load Testing with k6

\`\`\`javascript
// load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be below 1%
  },
}

export default function () {
  const payload = JSON.stringify({
    email: `test${__VU}@example.com`,
    password: 'SecurePass123!',
  })

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const res = http.post('https://your-domain.com/api/auth/login', payload, params)
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })

  sleep(1)
}
\`\`\`

Run load test:
\`\`\`bash
k6 run load-test.js
\`\`\`

## Security Testing

### OWASP ZAP Scan
\`\`\`bash
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://your-domain.com \
  -r zap-report.html
\`\`\`

### SQL Injection Testing
\`\`\`bash
sqlmap -u "https://your-domain.com/api/auth/login" \
  --data="email=test@example.com&password=test" \
  --level=5 --risk=3
\`\`\`

## Monitoring & Metrics

### Health Check
\`\`\`bash
curl https://your-domain.com/api/auth/health
\`\`\`

### Performance Metrics
\`\`\`bash
curl https://your-domain.com/api/auth/metrics?operation=login&hours=24
\`\`\`

## Best Practices

1. **Test Coverage**: Maintain >80% code coverage
2. **Mock External Services**: Use vi.mock() for Supabase, Redis, etc.
3. **Test Edge Cases**: Invalid inputs, expired tokens, rate limits
4. **Security Tests**: SQL injection, XSS, CSRF, brute force
5. **Performance Tests**: Load testing, stress testing, spike testing
6. **Integration Tests**: Test full authentication flows
7. **Continuous Testing**: Run tests in CI/CD pipeline

## CI/CD Integration

### GitHub Actions
\`\`\`yaml
name: Auth Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
