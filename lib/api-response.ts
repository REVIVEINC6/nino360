import { NextResponse } from "next/server"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
  [key: string]: any
}

// Backwards-compatibility: some files import `APIResponse` (all-caps)
export type APIResponse<T = any> = ApiResponse<T>

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  meta: PaginationMeta
}

export function successResponse<T>(data: T, a?: string | Partial<PaginationMeta> | number | any, b?: Partial<PaginationMeta> | number): NextResponse {
  // Supports these call patterns:
  // successResponse(data)
  // successResponse(data, message)
  // successResponse(data, meta)
  // successResponse(data, message, meta)
  // successResponse(data, message, status)
  // successResponse(data, meta, status)
  let message: string | undefined
  let meta: Partial<PaginationMeta> | undefined
  let status: number | undefined

  if (typeof a === "string") {
    message = a
    if (typeof b === "number") status = b
    else if (b && typeof b === "object") meta = b as Partial<PaginationMeta>
  } else if (typeof a === "number") {
    status = a
  } else if (a && typeof a === "object") {
    meta = a as Partial<PaginationMeta>
    if (typeof b === "number") status = b
  }

  const body: any = {
    success: true,
    data,
  }

  if (message) body.message = message
  if (meta) body.meta = meta

  return NextResponse.json(body, status ? { status } : undefined)
}

export function errorResponse(error: string, status = 400, code?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
    },
    { status },
  )
}

export function rateLimitResponse(retryAfter?: number): NextResponse {
  const headers: Record<string, string> = {}
  if (typeof retryAfter === "number") {
    headers["Retry-After"] = String(retryAfter)
  }
  return NextResponse.json(
    {
      success: false,
      error: "Rate limit exceeded. Please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: retryAfter,
    },
    { status: 429, headers },
  )
}

export function validationErrorResponse(
  messageOrErrors?: string | Record<string, string[]> | any,
  maybeErrors?: Record<string, string[]> | any,
): NextResponse {
  // Normalize inputs to { message, errors }
  let message = "Validation failed"
  let errors: Record<string, string[]> | undefined = undefined

  if (typeof messageOrErrors === "string") {
    message = messageOrErrors
    if (maybeErrors) errors = normalizeErrors(maybeErrors)
  } else if (messageOrErrors) {
    // messageOrErrors is likely the errors object or a ZodError-like
    errors = normalizeErrors(messageOrErrors)
  }

  return NextResponse.json(
    {
      success: false,
      error: message,
      code: "VALIDATION_ERROR",
      data: { errors },
    },
    { status: 422 },
  )
}

function normalizeErrors(input: any): Record<string, string[]> {
  // If it's a ZodError-like with `issues`, map to path->messages
  if (input && Array.isArray(input.issues)) {
    const out: Record<string, string[]> = {}
    for (const issue of input.issues) {
      const path = Array.isArray(issue.path) ? issue.path.join(".") : String(issue.path || "")
      if (!out[path]) out[path] = []
      out[path].push(issue.message)
    }
    return out
  }

  // If it's already a record of arrays
  if (input && typeof input === "object") return input

  return { general: [String(input)] }
}

export function internalServerErrorResponse(message = "Internal server error"): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: "INTERNAL_SERVER_ERROR",
    },
    { status: 500 },
  )
}

export function paginatedResponse<T>(data: T[], meta: Partial<PaginationMeta>, message?: string, status?: number): NextResponse {
  const page = meta.page || 1
  const limit = meta.limit || data.length || 0
  const total = typeof meta.total === "number" ? meta.total : data.length || 0
  const totalPages = meta.totalPages ?? (limit > 0 ? Math.ceil(total / limit) : 1)
  const hasNext = meta.hasNext ?? page < totalPages
  const hasPrev = meta.hasPrev ?? page > 1

  const fullMeta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  }

  return NextResponse.json({
    success: true,
    data,
    meta: fullMeta,
    message,
  }, status ? { status } : undefined)
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized access",
      code: "UNAUTHORIZED",
    },
    { status: 401 },
  )
}

export function forbiddenResponse(message?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message || "Forbidden access",
      code: "FORBIDDEN",
    },
    { status: 403 },
  )
}

export function notFoundResponse(resource = "Resource"): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} not found`,
      code: "NOT_FOUND",
    },
    { status: 404 },
  )
}
