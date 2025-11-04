export function generateMFAToken(): string {
  // Generate a random 6-digit number
  const buffer = new Uint8Array(4)
  crypto.getRandomValues(buffer)
  const randomNum = new DataView(buffer.buffer).getUint32(0, false)
  return (100000 + (randomNum % 900000)).toString()
}

export function verifyMFAToken(token: string, storedToken: string): boolean {
  return token === storedToken
}

export async function generateTOTPSecret(): Promise<string> {
  const buffer = new Uint8Array(20)
  crypto.getRandomValues(buffer)
  return btoa(String.fromCharCode(...buffer))
}

export const MFAUtils = {
  generateMFAToken,
  verifyMFAToken,
  generateTOTPSecret,
}
