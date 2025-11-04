import { parsePhoneNumberFromString } from 'libphonenumber-js'

export function normalizePhone(raw?: string) {
  if (!raw) return { e164: null, valid: false }
  try {
    const p = parsePhoneNumberFromString(raw)
    if (!p) return { e164: null, valid: false }
    return { e164: p.number, valid: p.isValid() }
  } catch {
    return { e164: null, valid: false }
  }
}
