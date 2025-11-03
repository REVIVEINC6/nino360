// Utility to safely extract common error details from unknown error values
export function extractErrorDetails(error: unknown): any | null {
  if (!error || typeof error !== "object") return null
  try {
    // Zod and many validators expose an `errors` property
    if ("errors" in (error as any)) return (error as any).errors
    // Some libraries expose `details`
    if ("details" in (error as any)) return (error as any).details
    // Fallback to message if available
    if ("message" in (error as any)) return (error as any).message
  } catch (e) {
    // ignore
  }
  return null
}
