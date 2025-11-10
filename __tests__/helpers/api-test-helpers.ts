import { NextRequest } from "next/server"

/**
 * Create a mock Next.js request for API testing
 */
export function createMockRequest(options: {
  method: string
  url: string
  headers?: Record<string, string>
  body?: any
}): NextRequest {
  const { method, url, headers = {}, body } = options

  const request = new NextRequest(url, {
    method,
    headers: new Headers(headers),
    body: body ? JSON.stringify(body) : undefined,
  })

  return request
}

/**
 * Parse API response for testing
 */
export async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type")

  if (contentType?.includes("application/json")) {
    return {
      status: response.status,
      data: await response.json(),
      headers: Object.fromEntries(response.headers.entries()),
    }
  }

  return {
    status: response.status,
    data: await response.text(),
    headers: Object.fromEntries(response.headers.entries()),
  }
}

/**
 * Assert API response matches expected structure
 */
export function assertApiResponse(
  response: any,
  expected: {
    status?: number
    hasError?: boolean
    hasData?: boolean
    dataShape?: Record<string, any>
  },
) {
  if (expected.status) {
    if (response.status !== expected.status) {
      throw new Error(`Expected status ${expected.status}, got ${response.status}`)
    }
  }

  if (expected.hasError !== undefined) {
    const hasError = !!response.data.error
    if (hasError !== expected.hasError) {
      throw new Error(`Expected hasError to be ${expected.hasError}, got ${hasError}`)
    }
  }

  if (expected.hasData !== undefined) {
    const hasData = !!response.data.data || !!response.data.success
    if (hasData !== expected.hasData) {
      throw new Error(`Expected hasData to be ${expected.hasData}, got ${hasData}`)
    }
  }

  if (expected.dataShape) {
    const data = response.data.data || response.data
    Object.keys(expected.dataShape).forEach((key) => {
      if (!(key in data)) {
        throw new Error(`Expected data to have property '${key}'`)
      }
    })
  }
}

/**
 * Retry API call with exponential backoff
 */
export async function retryApiCall<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  throw lastError!
}
