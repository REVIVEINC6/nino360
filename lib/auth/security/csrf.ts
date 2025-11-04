import { cookies, headers } from "next/headers"
import { randomBytes, createHmac } from "crypto"

const CSRF_TOKEN_NAME = "csrf-token"
const CSRF_SECRET = process.env.CSRF_SECRET || "default-csrf-secret-change-in-production"

export async function generateCsrfToken(): Promise<string> {
  const token = randomBytes(32).toString("hex")
  const signature = createHmac("sha256", CSRF_SECRET).update(token).digest("hex")

  const csrfToken = `${token}.${signature}`

  const cookieStore = await cookies()
  cookieStore.set(CSRF_TOKEN_NAME, csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return csrfToken
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  const cookieStore = await cookies()
  const storedToken = cookieStore.get(CSRF_TOKEN_NAME)?.value

  if (!storedToken || !token) {
    return false
  }

  // Verify token format
  const [tokenPart, signature] = token.split(".")
  if (!tokenPart || !signature) {
    return false
  }

  // Verify signature
  const expectedSignature = createHmac("sha256", CSRF_SECRET).update(tokenPart).digest("hex")

  if (signature !== expectedSignature) {
    return false
  }

  // Compare with stored token
  return storedToken === token
}

export async function requireCsrfToken() {
  const headersList = await headers()
  const token = headersList.get("x-csrf-token")

  if (!token) {
    throw new Error("CSRF token missing")
  }

  const isValid = await validateCsrfToken(token)

  if (!isValid) {
    throw new Error("Invalid CSRF token")
  }
}

export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_TOKEN_NAME)?.value || null
}
