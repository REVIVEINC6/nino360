import { describe, it, expect } from "vitest"

describe("API Integration Tests", () => {
  describe("CRM Leads API", () => {
    it("should create a lead", async () => {
      const response = await fetch("/api/crm/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Lead",
          email: "test@example.com",
          company: "Test Company",
        }),
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data).toHaveProperty("id")
    })

    it("should list leads with pagination", async () => {
      const response = await fetch("/api/crm/leads?page=1&limit=10")

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty("data")
      expect(data).toHaveProperty("total")
      expect(Array.isArray(data.data)).toBe(true)
    })

    it("should handle rate limiting", async () => {
      // Make multiple requests to trigger rate limit
      const requests = Array(150)
        .fill(null)
        .map(() => fetch("/api/crm/leads"))

      const responses = await Promise.all(requests)
      const rateLimited = responses.some((r) => r.status === 429)

      expect(rateLimited).toBe(true)
    })
  })
})
