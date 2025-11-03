export async function generateVerificationToken(): Promise<string> {
  const buffer = new Uint8Array(32)
  crypto.getRandomValues(buffer)
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function generateSessionToken(): Promise<string> {
  const buffer = new Uint8Array(48)
  crypto.getRandomValues(buffer)
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function generateMFASecret(): Promise<string> {
  const buffer = new Uint8Array(20)
  crypto.getRandomValues(buffer)
  return btoa(String.fromCharCode(...buffer))
}

export async function generateBackupCodes(count = 10): Promise<string[]> {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const buffer = new Uint8Array(4)
    crypto.getRandomValues(buffer)
    const code = Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
    codes.push(code)
  }
  return codes
}
