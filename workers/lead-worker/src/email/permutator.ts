export function generatePermutations(first: string, last: string, domain: string) {
  const f = (first || '').toLowerCase()
  const l = (last || '').toLowerCase()
  const d = (domain || '').toLowerCase().replace(/^https?:\/\//, '')
  const parts = [
    `${f}.${l}@${d}`,
    `${f}${l}@${d}`,
    `${f}_${l}@${d}`,
    `${f[0]}${l}@${d}`,
    `${f}${l[0]}@${d}`,
    `${l}.${f}@${d}`,
  ]
  return Array.from(new Set(parts.filter(Boolean)))
}
