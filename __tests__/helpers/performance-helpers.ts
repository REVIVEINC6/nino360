/**
 * Measure execution time of a function
 */
export async function measureExecutionTime<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<{ result: T; duration: number }> {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start

  console.log(`[PERF] ${name}: ${duration.toFixed(2)}ms`)

  return { result, duration }
}

/**
 * Assert performance benchmark
 */
export function assertPerformance(duration: number, maxDuration: number, operationName: string) {
  if (duration > maxDuration) {
    throw new Error(
      `Performance benchmark failed: ${operationName} took ${duration.toFixed(2)}ms, expected < ${maxDuration}ms`,
    )
  }
}

/**
 * Run concurrent requests and measure performance
 */
export async function loadTest<T>(
  fn: () => Promise<T>,
  concurrency: number,
  iterations: number,
): Promise<{
  totalDuration: number
  avgDuration: number
  minDuration: number
  maxDuration: number
  successRate: number
}> {
  const results: number[] = []
  let successes = 0
  const start = performance.now()

  const batches = Math.ceil(iterations / concurrency)

  for (let batch = 0; batch < batches; batch++) {
    const promises = Array.from({ length: concurrency }, async () => {
      const fnStart = performance.now()
      try {
        await fn()
        successes++
        return performance.now() - fnStart
      } catch (error) {
        return performance.now() - fnStart
      }
    })

    const batchResults = await Promise.all(promises)
    results.push(...batchResults)
  }

  const totalDuration = performance.now() - start

  return {
    totalDuration,
    avgDuration: results.reduce((a, b) => a + b, 0) / results.length,
    minDuration: Math.min(...results),
    maxDuration: Math.max(...results),
    successRate: successes / iterations,
  }
}
