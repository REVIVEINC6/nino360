/**
 * Application monitoring and observability utilities
 *
 * Provides integration points for:
 * - Error tracking (Sentry, etc.)
 * - Performance monitoring
 * - User analytics
 * - Custom metrics
 */

import { logger } from "./logger"

interface MonitoringConfig {
  enabled: boolean
  environment: string
  sampleRate: number
}

class Monitoring {
  private config: MonitoringConfig
  private initialized = false

  constructor() {
    this.config = {
      enabled: process.env.NODE_ENV === "production",
      environment: process.env.NODE_ENV || "development",
      sampleRate: Number.parseFloat(process.env.NEXT_PUBLIC_MONITORING_SAMPLE_RATE || "1.0"),
    }
  }

  /**
   * Initialize monitoring services
   * Call this once at app startup
   */
  init() {
    if (this.initialized) return

    if (this.config.enabled) {
      logger.info("Monitoring initialized", {
        environment: this.config.environment,
        sampleRate: this.config.sampleRate,
      })

      // TODO: Initialize Sentry
      // if (typeof window !== 'undefined') {
      //   Sentry.init({
      //     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      //     environment: this.config.environment,
      //     tracesSampleRate: this.config.sampleRate,
      //   })
      // }
    }

    this.initialized = true
  }

  /**
   * Track a custom event
   */
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (!this.config.enabled) return

    logger.action(eventName, properties)

    // TODO: Send to analytics service
    // if (typeof window !== 'undefined' && window.analytics) {
    //   window.analytics.track(eventName, properties)
    // }
  }

  /**
   * Track a page view
   */
  trackPageView(pageName: string, properties?: Record<string, any>) {
    if (!this.config.enabled) return

    logger.info(`Page view: ${pageName}`, properties)

    // TODO: Send to analytics service
    // if (typeof window !== 'undefined' && window.analytics) {
    //   window.analytics.page(pageName, properties)
    // }
  }

  /**
   * Track an error
   */
  trackError(error: Error, context?: Record<string, any>) {
    logger.error("Error tracked", error, context)

    // TODO: Send to error tracking service
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, { extra: context })
    // }
  }

  /**
   * Set user context for monitoring
   */
  setUser(userId: string, properties?: Record<string, any>) {
    if (!this.config.enabled) return

    logger.info("User context set", { userId, ...properties })

    // TODO: Set user context in monitoring services
    // if (typeof window !== 'undefined') {
    //   if (window.Sentry) {
    //     window.Sentry.setUser({ id: userId, ...properties })
    //   }
    //   if (window.analytics) {
    //     window.analytics.identify(userId, properties)
    //   }
    // }
  }

  /**
   * Clear user context
   */
  clearUser() {
    if (!this.config.enabled) return

    logger.info("User context cleared")

    // TODO: Clear user context in monitoring services
    // if (typeof window !== 'undefined') {
    //   if (window.Sentry) {
    //     window.Sentry.setUser(null)
    //   }
    //   if (window.analytics) {
    //     window.analytics.reset()
    //   }
    // }
  }

  /**
   * Start a performance measurement
   */
  startMeasure(measureName: string) {
    if (typeof window !== "undefined" && window.performance) {
      window.performance.mark(`${measureName}-start`)
    }
  }

  /**
   * End a performance measurement
   */
  endMeasure(measureName: string) {
    if (typeof window !== "undefined" && window.performance) {
      window.performance.mark(`${measureName}-end`)
      window.performance.measure(measureName, `${measureName}-start`, `${measureName}-end`)

      const measure = window.performance.getEntriesByName(measureName)[0]
      if (measure) {
        logger.debug(`Performance: ${measureName}`, {
          duration: measure.duration,
        })

        // TODO: Send to monitoring service
        // if (window.Sentry) {
        //   window.Sentry.captureMessage(`Performance: ${measureName}`, {
        //     level: 'info',
        //     extra: { duration: measure.duration }
        //   })
        // }
      }
    }
  }

  /**
   * Track a custom metric
   */
  trackMetric(metricName: string, value: number, unit?: string) {
    if (!this.config.enabled) return

    logger.info(`Metric: ${metricName}`, { value, unit })

    // TODO: Send to monitoring service
    // Custom metrics implementation
  }
}

export const monitoring = new Monitoring()

/**
 * React hook for tracking page views
 */
export function usePageTracking(pageName: string) {
  if (typeof window !== "undefined") {
    monitoring.trackPageView(pageName)
  }
}

/**
 * Higher-order function to track function execution time
 */
export function withPerformanceTracking<T extends (...args: any[]) => any>(fn: T, measureName: string): T {
  return ((...args: Parameters<T>) => {
    monitoring.startMeasure(measureName)
    const result = fn(...args)

    if (result instanceof Promise) {
      return result.finally(() => monitoring.endMeasure(measureName))
    }

    monitoring.endMeasure(measureName)
    return result
  }) as T
}
