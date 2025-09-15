import { GET, POST } from "@/app/api/training/courses/route"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock Supabase
jest.mock("@/lib/supabase/server")

describe("/api/training/courses", () => {
  describe("GET", () => {
    it("returns courses successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/training/courses")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("courses")
    })

    it("filters courses by category", async () => {
      const request = new NextRequest("http://localhost:3000/api/training/courses?category=Technical")
      const response = await GET(request)

      expect(response.status).toBe(200)
    })
  })

  describe("POST", () => {
    it("creates a new course successfully", async () => {
      const courseData = {
        title: "Test Course",
        description: "Test Description",
        category: "Technical",
        level: "beginner",
        instructor: "Test Instructor",
      }

      const request = new NextRequest("http://localhost:3000/api/training/courses", {
        method: "POST",
        body: JSON.stringify(courseData),
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })

    it("returns validation error for missing fields", async () => {
      const request = new NextRequest("http://localhost:3000/api/training/courses", {
        method: "POST",
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })
})
