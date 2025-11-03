import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

/**
 * Get encryption key from environment
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set")
  }
  return Buffer.from(key, "hex")
}

/**
 * Encryption utilities for sensitive data
 */
export const encryption = {
  /**
   * Encrypt data
   */
  encrypt(data: string): string {
    try {
  const keyBuf = getEncryptionKey()
  // Convert Buffer to a Uint8Array copy so it satisfies ArrayBufferView typings
  const keyArr = Uint8Array.from(keyBuf)
  // Create a KeyObject acceptable to Node crypto typings
  const keyObj = crypto.createSecretKey(keyArr)
  const ivBuf = crypto.randomBytes(IV_LENGTH)
  const ivArr = Uint8Array.from(ivBuf)
  const cipher = crypto.createCipheriv(ALGORITHM, keyObj, ivArr)

      let encrypted = cipher.update(data, "utf8", "hex")
      encrypted += cipher.final("hex")

      const authTag = cipher.getAuthTag()

  // Combine iv + authTag + encrypted data
  return ivBuf.toString("hex") + authTag.toString("hex") + encrypted
    } catch (error) {
      console.error("[Encryption] Encrypt error:", error)
      throw new Error("Encryption failed")
    }
  },

  /**
   * Decrypt data
   */
  decrypt(encryptedData: string): string {
    try {
  const keyBuf = getEncryptionKey()
  const keyArr = Uint8Array.from(keyBuf)
  const keyObj = crypto.createSecretKey(keyArr)

    // Extract iv, authTag, and encrypted data
  const ivBuf = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), "hex")
  const authTagBuf = Buffer.from(encryptedData.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2), "hex")
  const encrypted = encryptedData.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2)

  const ivArr = Uint8Array.from(ivBuf)
  const authTagArr = Uint8Array.from(authTagBuf)

  const decipher = crypto.createDecipheriv(ALGORITHM, keyObj, ivArr)
  // setAuthTag expects an ArrayBufferView — Uint8Array works
  decipher.setAuthTag(authTagArr)

      let decrypted = decipher.update(encrypted, "hex", "utf8")
      decrypted += decipher.final("utf8")

      return decrypted
    } catch (error) {
      console.error("[Encryption] Decrypt error:", error)
      throw new Error("Decryption failed")
    }
  },

  /**
   * Hash data (one-way)
   */
  hash(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex")
  },

  /**
   * Generate random token
   */
  generateToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  },
}

/**
 * Mask sensitive data for display
 */
export function maskSensitiveData(data: string, visibleChars = 4): string {
  if (data.length <= visibleChars) {
    return "*".repeat(data.length)
  }
  return data.slice(0, visibleChars) + "*".repeat(data.length - visibleChars)
}
