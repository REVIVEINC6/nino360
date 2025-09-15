import { NextResponse } from "next/server"
import { ZodError } from "zod"

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export function handleError(error: unknown): NextResponse {
  console.error("API Error:", error)

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    // In zod v4, use `issues` which contains the validation issues
    const errorMessages = (error.issues || []).map((issue) => {
      const path = Array.isArray(issue.path) ? issue.path.join(".") : String(issue.path)
      return `${path}: ${issue.message}`
    })
    return NextResponse.json(
      {
        error: "Validation failed",
        details: errorMessages,
      },
      { status: 400 },
    )
  }

  // Handle custom app errors
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode })
  }

  // Handle Supabase errors
  if (error && typeof error === "object" && "code" in error) {
    const supabaseError = error as any

    switch (supabaseError.code) {
      case "23505": // Unique violation
        return NextResponse.json({ error: "Resource already exists" }, { status: 409 })
      case "23503": // Foreign key violation
        return NextResponse.json({ error: "Referenced resource not found" }, { status: 400 })
      case "42501": // Insufficient privilege
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      default:
        return NextResponse.json({ error: "Database operation failed" }, { status: 500 })
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Fallback for unknown errors
  return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
}

export function withErrorHandler<T extends any[], R>(handler: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleError(error)
    }
  }
}
