/**
 * Centralized error handling utility
 *
 * Provides consistent error handling across the application
 * with proper logging and user-friendly error messages
 */

import { logger } from "./logger"

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public context?: Record<string, any>,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleError(error: unknown, context?: Record<string, any>): AppError {
  // If it's already an AppError, just log and return
  if (error instanceof AppError) {
    logger.error(error.message, error, { ...error.context, ...context })
    return error
  }

  // If it's a standard Error
  if (error instanceof Error) {
    logger.error(error.message, error, context)
    return new AppError(error.message, "UNKNOWN_ERROR", 500, context)
  }

  // If it's something else
  const message = typeof error === "string" ? error : "An unknown error occurred"
  logger.error(message, error, context)
  return new AppError(message, "UNKNOWN_ERROR", 500, context)
}

/**
 * Get user-friendly error message
 */
export function getUserErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    // Map common error messages to user-friendly ones
    if (error.message.includes("fetch failed")) {
      return "Network error. Please check your connection and try again."
    }
    if (error.message.includes("unauthorized")) {
      return "You do not have permission to perform this action."
    }
    if (error.message.includes("not found")) {
      return "The requested resource was not found."
    }
    return error.message
  }

  return "An unexpected error occurred. Please try again."
}

/**
 * Async error wrapper for server actions
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(fn: T, context?: Record<string, any>): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      const appError = handleError(error, context)
      return {
        success: false,
        error: getUserErrorMessage(appError),
      }
    }
  }) as T
}
