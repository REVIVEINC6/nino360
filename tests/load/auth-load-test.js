import http from "k6/http"
import { check, sleep, group } from "k6"
import { Rate, Trend } from "k6/metrics"
import { __ENV, __VU } from "k6/env"

// Custom metrics
const loginSuccessRate = new Rate("login_success_rate")
const loginDuration = new Trend("login_duration")
const registrationSuccessRate = new Rate("registration_success_rate")
const mfaSuccessRate = new Rate("mfa_success_rate")

export const options = {
  stages: [
    { duration: "1m", target: 50 }, // Ramp up to 50 users
    { duration: "3m", target: 50 }, // Stay at 50 users
    { duration: "1m", target: 100 }, // Ramp up to 100 users
    { duration: "3m", target: 100 }, // Stay at 100 users
    { duration: "1m", target: 200 }, // Spike to 200 users
    { duration: "2m", target: 200 }, // Stay at 200 users
    { duration: "2m", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000", "p(99)<2000"], // 95% < 1s, 99% < 2s
    http_req_failed: ["rate<0.05"], // Error rate < 5%
    login_success_rate: ["rate>0.95"], // Login success > 95%
    login_duration: ["p(95)<500"], // Login p95 < 500ms
  },
}

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000"

export default function () {
  const email = `loadtest-${__VU}-${Date.now()}@example.com`
  const password = "LoadTest123!"

  group("User Registration", () => {
    const payload = JSON.stringify({
      email,
      password,
      fullName: `Load Test User ${__VU}`,
      tenantId: "load-test-tenant",
    })

    const params = {
      headers: { "Content-Type": "application/json" },
    }

    const res = http.post(`${BASE_URL}/api/auth/register`, payload, params)

    const success = check(res, {
      "registration status is 200": (r) => r.status === 200,
      "registration has user data": (r) => {
        const body = JSON.parse(r.body)
        return body.user !== undefined
      },
    })

    registrationSuccessRate.add(success)
    sleep(1)
  })

  group("User Login", () => {
    const payload = JSON.stringify({
      email,
      password,
      deviceFingerprint: `device-${__VU}`,
    })

    const params = {
      headers: { "Content-Type": "application/json" },
    }

    const startTime = Date.now()
    const res = http.post(`${BASE_URL}/api/auth/login`, payload, params)
    const duration = Date.now() - startTime

    const success = check(res, {
      "login status is 200": (r) => r.status === 200,
      "login has session": (r) => {
        const body = JSON.parse(r.body)
        return body.session !== undefined
      },
      "login response time < 1s": () => duration < 1000,
    })

    loginSuccessRate.add(success)
    loginDuration.add(duration)
    sleep(1)
  })

  group("Session Refresh", () => {
    // Login first to get session
    const loginPayload = JSON.stringify({
      email,
      password,
      deviceFingerprint: `device-${__VU}`,
    })

    const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
      headers: { "Content-Type": "application/json" },
    })

    if (loginRes.status === 200) {
      const { session } = JSON.parse(loginRes.body)

      const refreshRes = http.post(
        `${BASE_URL}/api/auth/session/refresh`,
        JSON.stringify({ refreshToken: session.refresh_token }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      )

      check(refreshRes, {
        "refresh status is 200": (r) => r.status === 200,
        "refresh has new session": (r) => {
          const body = JSON.parse(r.body)
          return body.session !== undefined
        },
      })
    }

    sleep(1)
  })

  group("Rate Limiting", () => {
    // Test rate limiting by making multiple rapid requests
    for (let i = 0; i < 10; i++) {
      const res = http.post(
        `${BASE_URL}/api/auth/login`,
        JSON.stringify({
          email: "ratelimit@test.com",
          password: "test",
          deviceFingerprint: "test",
        }),
        { headers: { "Content-Type": "application/json" } },
      )

      if (i < 5) {
        check(res, {
          "request allowed": (r) => r.status !== 429,
        })
      } else {
        check(res, {
          "rate limit triggered": (r) => r.status === 429,
        })
      }
    }

    sleep(2)
  })
}

export function handleSummary(data) {
  return {
    "load-test-results.json": JSON.stringify(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  }
}

function textSummary(data, options) {
  const indent = options.indent || ""
  const enableColors = options.enableColors || false

  let summary = `\n${indent}Load Test Summary:\n`
  summary += `${indent}==================\n\n`

  // HTTP metrics
  summary += `${indent}HTTP Metrics:\n`
  summary += `${indent}  Requests: ${data.metrics.http_reqs.values.count}\n`
  summary += `${indent}  Failed: ${data.metrics.http_req_failed.values.rate * 100}%\n`
  summary += `${indent}  Duration (avg): ${data.metrics.http_req_duration.values.avg}ms\n`
  summary += `${indent}  Duration (p95): ${data.metrics.http_req_duration.values["p(95)"]}ms\n`
  summary += `${indent}  Duration (p99): ${data.metrics.http_req_duration.values["p(99)"]}ms\n\n`

  // Custom metrics
  summary += `${indent}Authentication Metrics:\n`
  summary += `${indent}  Login Success Rate: ${data.metrics.login_success_rate.values.rate * 100}%\n`
  summary += `${indent}  Login Duration (p95): ${data.metrics.login_duration.values["p(95)"]}ms\n`
  summary += `${indent}  Registration Success Rate: ${data.metrics.registration_success_rate.values.rate * 100}%\n\n`

  return summary
}
