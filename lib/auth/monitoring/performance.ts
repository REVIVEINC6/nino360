// In-memory performance monitor; replace Redis persistence

export interface PerformanceMetric {
  operation: string
  duration: number
  timestamp: string
  userId?: string
  tenantId?: string
  success: boolean
  metadata?: Record<string, any>
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private maxInMemory = 1000 // cap to avoid unbounded growth

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  async trackOperation<T>(operation: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    const start = Date.now()
    let success = true
    let error: any

    try {
      const result = await fn()
      return result
    } catch (e) {
      success = false
      error = e
      throw e
    } finally {
      const duration = Date.now() - start

      const metric: PerformanceMetric = {
        operation,
        duration,
        timestamp: new Date().toISOString(),
        success,
        metadata: {
          ...metadata,
          error: error?.message,
        },
      }

      await this.recordMetric(metric)

      // Log slow operations
      if (duration > 1000) {
        console.log("[v0] Slow operation detected:", metric)
      }
    }
  }

  private async recordMetric(metric: PerformanceMetric): Promise<void> {
    this.metrics.push(metric)
    if (this.metrics.length > this.maxInMemory) {
      this.metrics.splice(0, this.metrics.length - this.maxInMemory)
    }
  }

  async getMetrics(operation?: string, hours = 24): Promise<PerformanceMetric[]> {
    const filtered = this.metrics.filter((m) => {
      const age = Date.now() - new Date(m.timestamp).getTime()
      return age < hours * 3600 * 1000
    })
    return operation ? filtered.filter((m) => m.operation === operation) : filtered
  }

  async getAverageResponseTime(operation: string): Promise<number> {
    const metrics = await this.getMetrics(operation)
    if (metrics.length === 0) return 0

    const total = metrics.reduce((sum, m) => sum + m.duration, 0)
    return total / metrics.length
  }

  async getSuccessRate(operation: string): Promise<number> {
    const metrics = await this.getMetrics(operation)
    if (metrics.length === 0) return 0

    const successful = metrics.filter((m) => m.success).length
    return (successful / metrics.length) * 100
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
