"use client"

import { useState, useCallback } from "react"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeRequest = useCallback(async <T = any>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      console.error("API request failed:", err)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback(
    <T = any>(url: string, options?: RequestInit) => {
      return makeRequest<T>(url, { method: "GET", ...options })
    },
    [makeRequest],
  )

  const post = useCallback(
    <T = any>(url: string, data?: any, options?: RequestInit) => {
      return makeRequest<T>(url, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      })
    },
    [makeRequest],
  )

  const put = useCallback(
    <T = any>(url: string, data?: any, options?: RequestInit) => {
      return makeRequest<T>(url, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      })
    },
    [makeRequest],
  )

  const del = useCallback(
    <T = any>(url: string, options?: RequestInit) => {
      return makeRequest<T>(url, { method: "DELETE", ...options })
    },
    [makeRequest],
  )

  const patch = useCallback(
    <T = any>(url: string, data?: any, options?: RequestInit) => {
      return makeRequest<T>(url, {
        method: "PATCH",
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      })
    },
    [makeRequest],
  )

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    patch,
  }
}
