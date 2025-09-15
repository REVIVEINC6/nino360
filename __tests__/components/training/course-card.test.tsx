import { render, screen, fireEvent } from "@/lib/test-utils"
import { CourseCard } from "@/components/training/course-card"
import { jest } from "@jest/globals"

const mockCourse = {
  id: "1",
  title: "Advanced React Development",
  description: "Learn advanced React concepts",
  category: "Technical",
  level: "advanced" as const,
  durationHours: 40,
  format: "online" as const,
  instructor: "John Doe",
  maxParticipants: 20,
  currentEnrollments: 15,
  cost: 1200,
  currency: "USD",
  status: "active" as const,
  rating: 4.8,
  totalReviews: 24,
  certificationAvailable: true,
  prerequisites: ["JavaScript", "React Basics"],
  learningObjectives: ["Master React Hooks", "Build scalable apps"],
  createdAt: "2024-01-01",
  updatedAt: "2024-01-15",
}

describe("CourseCard", () => {
  it("renders course information correctly", () => {
    render(<CourseCard course={mockCourse} />)

    expect(screen.getByText("Advanced React Development")).toBeInTheDocument()
    expect(screen.getByText("Learn advanced React concepts")).toBeInTheDocument()
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("$1,200")).toBeInTheDocument()
    expect(screen.getByText("15/20")).toBeInTheDocument()
  })

  it("displays correct badges", () => {
    render(<CourseCard course={mockCourse} />)

    expect(screen.getByText("Advanced")).toBeInTheDocument()
    expect(screen.getByText("Online")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
    expect(screen.getByText("Certificate")).toBeInTheDocument()
  })

  it("shows prerequisites when available", () => {
    render(<CourseCard course={mockCourse} />)

    expect(screen.getByText("JavaScript")).toBeInTheDocument()
    expect(screen.getByText("React Basics")).toBeInTheDocument()
  })

  it("handles enrollment button click", () => {
    const onEnroll = jest.fn()
    render(<CourseCard course={mockCourse} onEnroll={onEnroll} />)

    const enrollButton = screen.getByText("Enroll")
    fireEvent.click(enrollButton)

    expect(onEnroll).toHaveBeenCalledWith(mockCourse.id)
  })
})
