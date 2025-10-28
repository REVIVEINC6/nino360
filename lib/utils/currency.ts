/**
 * Format a number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return Number.parseFloat(value.replace(/[^0-9.-]+/g, ""))
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}
