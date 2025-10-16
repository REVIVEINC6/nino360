/**
 * Production-ready logging utility
 *
 * Features:
 * - Environment-based log levels
 * - Feature flag support for debug logs
 * - Structured logging with context
 * - Error tracking integration ready
 */

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"
  private debugEnabled = process.env.NEXT_PUBLIC_DEBUG_LOGS === "true"

  /**
   * Debug logs - only in development or when explicitly enabled
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment || this.debugEnabled) {
      console.log(`[DEBUG] ${message}`, context || "")
    }
  }

  /**
   * Info logs - general information
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, context || "")
    }
  }

  /**
   * Warning logs - potential issues
   */
  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context || "")
  }

  /**
   * Error logs - actual errors that need attention
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    console.error(`[ERROR] ${message}`, {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
      ...context,
    })

    // TODO: Send to error tracking service (Sentry, etc.)
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, { extra: context })
    // }
  }

  /**
   * Action logs - user actions for audit trail
   */
  action(action: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`[ACTION] ${action}`, context || "")
    }

    // TODO: Send to analytics service
    // if (typeof window !== 'undefined' && window.analytics) {
    //   window.analytics.track(action, context)
    // }
  }
}

export const logger = new Logger()

/**
 * Legacy console.log replacement
 * Use this to gradually migrate from console.log to structured logging
 */
export function log(message: string, ...args: any[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(message, ...args)
  }
}
